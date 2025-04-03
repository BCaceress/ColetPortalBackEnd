import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService) { }

    async findAll(userId: number) {
        console.log(`Finding all clients for user ${userId}`);

        try {
            // First, check if there are any RATs associated with this user
            const ratCount = await this.prisma.rAT.count({
                where: {
                    id_usuario: userId
                }
            });

            console.log(`Found ${ratCount} RATs for user ${userId}`);

            // If the user has no RATs, they might be an admin or new user
            // In that case, we'll return all clients
            if (ratCount === 0) {
                console.log('No RATs found, checking if user is an admin');

                // Check if the user is an admin
                const user = await this.prisma.usuario.findUnique({
                    where: { id_usuario: userId }
                });

                if (user && user.funcao.toLowerCase() === 'admin') {
                    console.log('User is admin, returning all clients');
                    return this.prisma.cliente.findMany({
                        include: {
                            clientesContatos: {
                                include: {
                                    contato: true
                                }
                            },
                            emails: true,
                        },
                        orderBy: {
                            ds_nome: 'asc',
                        },
                    });
                }

                console.log('User has no RATs and is not admin, returning empty array');
                return [];
            }

            // Get all client IDs that this user has access to through RATs
            const clientsWithRats = await this.prisma.rAT.findMany({
                where: {
                    id_usuario: userId
                },
                select: {
                    id_cliente: true
                },
                distinct: ['id_cliente']
            });

            const clientIds = clientsWithRats.map(item => item.id_cliente);
            console.log(`Found ${clientIds.length} distinct client IDs: ${clientIds.join(', ')}`);

            // Return clients with these IDs
            const clients = await this.prisma.cliente.findMany({
                where: {
                    id_cliente: {
                        in: clientIds
                    }
                },
                orderBy: {
                    ds_nome: 'asc',
                },
                include: {
                    clientesContatos: {
                        include: {
                            contato: true
                        }
                    },
                    emails: true,
                },
            });

            console.log(`Returning ${clients.length} clients`);
            return clients;
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    }

    async findOne(id: number, userId: number) {
        // First fetch the client
        const client = await this.prisma.cliente.findUnique({
            where: {
                id_cliente: id,
            },
            include: {
                clientesContatos: {
                    include: {
                        contato: true
                    }
                },
                emails: true,
            },
        });

        if (!client) {
            throw new NotFoundException(`Client with ID ${id} not found`);
        }

        // Check if the user has any RATs for this client
        const hasAccess = await this.prisma.rAT.findFirst({
            where: {
                id_cliente: id,
                id_usuario: userId
            }
        });

        if (!hasAccess) {
            throw new NotFoundException(`Client with ID ${id} not found or does not belong to you`);
        }

        return client;
    }

    async create(createClientDto: CreateClientDto, userId: number) {
        const {
            tm_minimo_horas,
            ...otherData
        } = createClientDto;

        // Since there's no direct user relationship in the schema,
        // we'll need to create the client first
        const client = await this.prisma.cliente.create({
            data: {
                ...otherData,
                tm_minimo_horas: tm_minimo_horas,
                // Remove id_usuario as it doesn't exist in the schema
            },
        });

        // To establish a relationship between the user and client,
        // we'll create a placeholder RAT
        await this.prisma.rAT.create({
            data: {
                ds_status: 'Criação',
                fl_deslocamento: 'N',
                dt_data_hora_entrada: new Date(),
                dt_data_hora_saida: new Date(),
                tm_duracao: '00:00:00',
                tx_comentario_interno: 'Cliente criado pelo sistema',
                ds_originada: 'Sistema',
                ds_observacao: 'Criação automática do cliente',
                tx_atividades: 'Criação do cliente',
                tx_tarefas: 'N/A',
                tx_pendencias: 'N/A',
                id_usuario: userId,
                id_cliente: client.id_cliente,
                id_contato: 0, // This will need to be fixed - perhaps create a system contact first
            }
        });

        return this.prisma.cliente.findUnique({
            where: { id_cliente: client.id_cliente },
            include: {
                clientesContatos: {
                    include: {
                        contato: true
                    }
                },
                emails: true,
            },
        });
    }

    async update(id: number, updateClientDto: UpdateClientDto, userId: number) {
        // Check if client exists
        await this.findOne(id, userId);

        return this.prisma.cliente.update({
            where: {
                id_cliente: id,
            },
            data: updateClientDto,
            include: {
                clientesContatos: {
                    include: {
                        contato: true
                    }
                },
                emails: true,
            },
        });
    }

    async remove(id: number, userId: number) {
        // Check if client exists
        await this.findOne(id, userId);

        // Delete related client contact relationships
        await this.prisma.clienteContato.deleteMany({
            where: {
                id_cliente: id,
            },
        });

        // Delete related emails
        await this.prisma.emailCliente.deleteMany({
            where: {
                id_cliente: id,
            },
        });

        // Delete related RATs if they exist
        await this.prisma.rAT.deleteMany({
            where: {
                id_cliente: id,
            },
        });

        return this.prisma.cliente.delete({
            where: {
                id_cliente: id,
            },
        });
    }

    // New method to add a contact to a client
    async addContactToClient(clientId: number, contactId: number, userId: number) {
        // Verify client belongs to user
        await this.findOne(clientId, userId);

        // Check if contact exists
        const contact = await this.prisma.contato.findUnique({
            where: { id_contato: contactId }
        });

        if (!contact) {
            throw new NotFoundException(`Contact with ID ${contactId} not found`);
        }

        // Check if the relationship already exists
        const existingRelation = await this.prisma.clienteContato.findUnique({
            where: {
                id_cliente_id_contato: {
                    id_cliente: clientId,
                    id_contato: contactId
                }
            }
        });

        if (existingRelation) {
            return existingRelation;
        }

        // Create the relationship
        return this.prisma.clienteContato.create({
            data: {
                id_cliente: clientId,
                id_contato: contactId
            },
            include: {
                cliente: true,
                contato: true
            }
        });
    }

    // New method to remove a contact from a client
    async removeContactFromClient(clientId: number, contactId: number, userId: number) {
        // Verify client belongs to user
        await this.findOne(clientId, userId);

        // Check if the relationship exists
        const relation = await this.prisma.clienteContato.findUnique({
            where: {
                id_cliente_id_contato: {
                    id_cliente: clientId,
                    id_contato: contactId
                }
            }
        });

        if (!relation) {
            throw new NotFoundException(`Contact with ID ${contactId} is not associated with client ${clientId}`);
        }

        // Delete the relationship
        return this.prisma.clienteContato.delete({
            where: {
                id_cliente_id_contato: {
                    id_cliente: clientId,
                    id_contato: contactId
                }
            }
        });
    }

    // New method to get all contacts for a client
    async getClientContacts(clientId: number, userId: number) {
        // Verify client belongs to user
        await this.findOne(clientId, userId);

        // Get all contacts for this client through the junction table
        const clientContacts = await this.prisma.clienteContato.findMany({
            where: {
                id_cliente: clientId
            },
            include: {
                contato: true
            }
        });

        return clientContacts.map(cc => cc.contato);
    }
}

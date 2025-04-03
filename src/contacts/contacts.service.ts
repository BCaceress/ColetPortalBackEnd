import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dtos/create-contact.dto';
import { UpdateContactDto } from './dtos/update-contact.dto';

@Injectable()
export class ContactsService {
    constructor(private prisma: PrismaService) { }

    async findAll(clientId: number, userId: number) {
        // Verify client belongs to user
        await this.verifyClientBelongsToUser(clientId, userId);

        // Find all contacts associated with this client via the junction table
        const clientContacts = await this.prisma.clienteContato.findMany({
            where: {
                id_cliente: clientId,
            },
            include: {
                contato: true,
            },
        });

        return clientContacts.map(cc => cc.contato);
    }

    async findOne(id: number, clientId: number, userId: number) {
        // Verify client belongs to user
        await this.verifyClientBelongsToUser(clientId, userId);

        // Check if the contact is associated with this client
        const clientContact = await this.prisma.clienteContato.findUnique({
            where: {
                id_cliente_id_contato: {
                    id_cliente: clientId,
                    id_contato: id
                }
            },
            include: {
                contato: true,
            },
        });

        if (!clientContact) {
            throw new NotFoundException(`Contact with ID ${id} not found for client ${clientId}`);
        }

        return clientContact.contato;
    }

    async create(createContactDto: CreateContactDto, userId: number) {
        if (!createContactDto.id_cliente) {
            throw new BadRequestException('Client ID is required');
        }

        // Verify client belongs to user
        await this.verifyClientBelongsToUser(createContactDto.id_cliente, userId);

        // Create the contact
        const contact = await this.prisma.contato.create({
            data: {
                ds_nome: createContactDto.ds_nome,
                ds_cargo: createContactDto.ds_cargo,
                fl_ativo: createContactDto.fl_ativo,
                tx_observacoes: createContactDto.tx_observacoes || null,
                ds_email: createContactDto.ds_email,
                ds_telefone: createContactDto.ds_telefone,
                fl_whatsapp: createContactDto.fl_whatsapp,
            },
        });

        // Create the relationship with the client
        await this.prisma.clienteContato.create({
            data: {
                id_cliente: createContactDto.id_cliente,
                id_contato: contact.id_contato
            }
        });

        return contact;
    }

    async update(id: number, clientId: number, updateContactDto: UpdateContactDto, userId: number) {
        // Verify client belongs to user and contact exists for this client
        await this.findOne(id, clientId, userId);

        return this.prisma.contato.update({
            where: {
                id_contato: id,
            },
            data: updateContactDto,
        });
    }

    async remove(id: number, clientId: number, userId: number) {
        // Verify client belongs to user and contact exists for this client
        await this.findOne(id, clientId, userId);

        // Remove the client-contact relationship first
        await this.prisma.clienteContato.delete({
            where: {
                id_cliente_id_contato: {
                    id_cliente: clientId,
                    id_contato: id
                }
            }
        });

        // Check if this contact is associated with any other clients
        const otherAssociations = await this.prisma.clienteContato.findFirst({
            where: {
                id_contato: id
            }
        });

        // Only delete the contact if it's not associated with any other clients
        if (!otherAssociations) {
            await this.prisma.contato.delete({
                where: {
                    id_contato: id,
                },
            });
        }

        return { message: `Contact with ID ${id} removed from client ${clientId}` };
    }

    /**
     * Find a specific contact by its ID without requiring the client ID
     * Used for the legacy API endpoints
     */
    async findOneById(id: number, userId: number) {
        // First find the contact
        const contact = await this.prisma.contato.findUnique({
            where: {
                id_contato: id,
            },
        });

        if (!contact) {
            throw new NotFoundException(`Contact with ID ${id} not found`);
        }

        // Find any clients associated with this contact
        const clientContacts = await this.prisma.clienteContato.findMany({
            where: {
                id_contato: id
            },
            include: {
                cliente: true
            }
        });

        if (clientContacts.length === 0) {
            throw new NotFoundException(`Contact with ID ${id} is not associated with any client`);
        }

        // Check if user has access to any of these clients
        for (const cc of clientContacts) {
            try {
                await this.verifyClientBelongsToUser(cc.id_cliente, userId);
                return {
                    ...contact,
                    cliente: cc.cliente
                };
            } catch (error) {
                // Continue trying other clients
                continue;
            }
        }

        throw new NotFoundException(`Contact with ID ${id} not accessible by user ${userId}`);
    }

    /**
     * Update a contact by ID without requiring the client ID
     * Used for the legacy API endpoints
     */
    async updateById(id: number, updateContactDto: UpdateContactDto, userId: number) {
        const contactWithClient = await this.findOneById(id, userId);

        return this.prisma.contato.update({
            where: {
                id_contato: id,
            },
            data: updateContactDto,
        });
    }

    /**
     * Remove a contact by ID without requiring the client ID
     * Used for the legacy API endpoints
     */
    async removeById(id: number, userId: number) {
        const contactWithClient = await this.findOneById(id, userId);

        // Remove all client-contact relationships
        await this.prisma.clienteContato.deleteMany({
            where: {
                id_contato: id
            }
        });

        return this.prisma.contato.delete({
            where: {
                id_contato: id,
            },
        });
    }

    /**
     * Find all contacts for the authenticated user, across all clients
     */
    async findAllForUser(userId: number) {
        console.log(`Finding all contacts for user ID: ${userId}`);

        try {
            // Get all client IDs that this user has access to
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
            console.log(`Found ${clientIds.length} client IDs for user ${userId}: ${clientIds.join(', ') || 'none'}`);

            // If no clients found, try to check if user is admin
            if (clientIds.length === 0) {
                console.log(`No clients found for user ${userId}, checking if admin...`);
                const user = await this.prisma.usuario.findUnique({
                    where: { id_usuario: userId }
                });

                if (user && user.funcao.toLowerCase() === 'admin') {
                    console.log(`User ${userId} is admin, fetching all contacts`);
                    const allContacts = await this.prisma.contato.findMany({
                        orderBy: {
                            ds_nome: 'asc'
                        }
                    });

                    // For each contact, find its associated clients
                    const contactsWithClients = await Promise.all(
                        allContacts.map(async contact => {
                            const clientContacts = await this.prisma.clienteContato.findMany({
                                where: { id_contato: contact.id_contato },
                                include: { cliente: true }
                            });

                            return {
                                ...contact,
                                clientes: clientContacts.map(cc => cc.cliente)
                            };
                        })
                    );

                    console.log(`Found ${allContacts.length} contacts for admin`);
                    return contactsWithClients;
                }
            }

            // Find all client-contact relationships for these clients
            if (clientIds.length > 0) {
                const clientContacts = await this.prisma.clienteContato.findMany({
                    where: {
                        id_cliente: {
                            in: clientIds
                        }
                    },
                    include: {
                        contato: true,
                        cliente: true
                    }
                });

                // Group by contact ID to avoid duplicates
                const contactMap = new Map();
                clientContacts.forEach(cc => {
                    if (!contactMap.has(cc.id_contato)) {
                        contactMap.set(cc.id_contato, {
                            ...cc.contato,
                            clientes: [cc.cliente]
                        });
                    } else {
                        const existingContact = contactMap.get(cc.id_contato);
                        existingContact.clientes.push(cc.cliente);
                    }
                });

                const contacts = Array.from(contactMap.values());
                console.log(`Found ${contacts.length} contacts for user ${userId}`);
                return contacts;
            }

            console.log(`No clients or contacts found for user ${userId}`);
            return [];
        } catch (error) {
            console.error(`Error fetching contacts for user ${userId}:`, error);
            throw error;
        }
    }

    private async verifyClientBelongsToUser(clientId: number, userId: number) {
        // Since there appears to be no direct relationship to usuarios in the schema,
        // we need to adapt our query
        const client = await this.prisma.cliente.findUnique({
            where: {
                id_cliente: clientId
            },
        });

        if (!client) {
            throw new NotFoundException(`Client with ID ${clientId} not found`);
        }

        // Check if the user is an admin
        const user = await this.prisma.usuario.findUnique({
            where: { id_usuario: userId }
        });

        if (user && user.funcao.toLowerCase() === 'admin') {
            return client;
        }

        // Check if the client has any RATs created by this user
        const hasPermission = await this.prisma.rAT.findFirst({
            where: {
                id_cliente: clientId,
                id_usuario: userId
            }
        });

        if (!hasPermission) {
            throw new NotFoundException(`Client with ID ${clientId} not found or does not belong to you`);
        }

        return client;
    }
}

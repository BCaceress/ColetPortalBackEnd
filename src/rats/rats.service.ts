import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatDto } from './dtos/create-rat.dto';
import { UpdateRatDto } from './dtos/update-rat.dto';

@Injectable()
export class RatsService {
    constructor(private prisma: PrismaService) { }

    async findAll(userId: number) {
        try {
            // Check if the user exists
            const user = await this.prisma.usuario.findUnique({
                where: { id_usuario: userId }
            });

            if (!user) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }

            // Get all RATs for this user
            const rats = await this.prisma.rAT.findMany({
                where: {
                    id_usuario: userId
                },
                include: {
                    cliente: true,
                    contato: true,
                },
                orderBy: {
                    dt_data_hora_entrada: 'desc'
                }
            });

            console.log(`Found ${rats.length} RATs for user ${userId}`);
            return rats;
        } catch (error) {
            console.error('Error fetching RATs:', error);
            throw error;
        }
    }

    async findAllForClient(clientId: number, userId: number) {
        try {
            // Verify client belongs to user
            await this.verifyClientBelongsToUser(clientId, userId);

            // Get all RATs for this client
            const rats = await this.prisma.rAT.findMany({
                where: {
                    id_cliente: clientId,
                },
                include: {
                    cliente: true,
                    contato: true,
                    usuario: {
                        select: {
                            id_usuario: true,
                            nome: true,
                            email: true,
                            funcao: true,
                        }
                    }
                },
                orderBy: {
                    dt_data_hora_entrada: 'desc'
                }
            });

            console.log(`Found ${rats.length} RATs for client ${clientId}`);
            return rats;
        } catch (error) {
            console.error('Error fetching RATs for client:', error);
            throw error;
        }
    }

    async findOne(id: number, userId: number) {
        const rat = await this.prisma.rAT.findFirst({
            where: {
                id_rat: id,
                id_usuario: userId,
            },
            include: {
                cliente: true,
                contato: true,
            },
        });

        if (!rat) {
            throw new NotFoundException(`RAT with ID ${id} not found or does not belong to the user`);
        }

        return rat;
    }

    async findOneByClient(id: number, clientId: number, userId: number) {
        // Verify client belongs to user
        await this.verifyClientBelongsToUser(clientId, userId);

        const rat = await this.prisma.rAT.findFirst({
            where: {
                id_rat: id,
                id_cliente: clientId,
            },
            include: {
                cliente: true,
                contato: true,
                usuario: {
                    select: {
                        id_usuario: true,
                        nome: true,
                        email: true,
                        funcao: true,
                    }
                }
            },
        });

        if (!rat) {
            throw new NotFoundException(`RAT with ID ${id} not found for client ${clientId}`);
        }

        return rat;
    }

    async create(createRatDto: CreateRatDto, userId: number) {
        if (!createRatDto.id_cliente) {
            throw new BadRequestException('Client ID is required');
        }

        if (!createRatDto.id_contato) {
            throw new BadRequestException('Contact ID is required');
        }

        // Verify client belongs to user
        await this.verifyClientBelongsToUser(createRatDto.id_cliente, userId);

        // Verify contact belongs to client
        await this.verifyContactBelongsToClient(createRatDto.id_contato, createRatDto.id_cliente);

        // Calculate duration if not provided
        if (!createRatDto.tm_duracao) {
            const entryTime = new Date(createRatDto.dt_data_hora_entrada);
            const exitTime = new Date(createRatDto.dt_data_hora_saida);

            if (exitTime <= entryTime) {
                throw new BadRequestException('Exit time must be after entry time');
            }

            const durationMs = exitTime.getTime() - entryTime.getTime();
            const durationHours = Math.floor(durationMs / 3600000);
            const durationMinutes = Math.floor((durationMs % 3600000) / 60000);
            const durationSeconds = Math.floor((durationMs % 60000) / 1000);

            createRatDto.tm_duracao = `${durationHours.toString().padStart(2, '0')}:${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;
        }

        return this.prisma.rAT.create({
            data: {
                ds_status: createRatDto.ds_status,
                fl_deslocamento: createRatDto.fl_deslocamento,
                dt_data_hora_entrada: createRatDto.dt_data_hora_entrada,
                dt_data_hora_saida: createRatDto.dt_data_hora_saida,
                tm_duracao: createRatDto.tm_duracao,
                tx_comentario_interno: createRatDto.tx_comentario_interno,
                ds_originada: createRatDto.ds_originada,
                ds_observacao: createRatDto.ds_observacao,
                nr_km_ida: createRatDto.nr_km_ida || null,
                nr_km_volta: createRatDto.nr_km_volta || null,
                nr_valor_pedagio: createRatDto.nr_valor_pedagio || null,
                tx_atividades: createRatDto.tx_atividades,
                tx_tarefas: createRatDto.tx_tarefas,
                tx_pendencias: createRatDto.tx_pendencias,
                id_usuario: userId,
                id_cliente: createRatDto.id_cliente,
                id_contato: createRatDto.id_contato
            },
            include: {
                cliente: true,
                contato: true,
            },
        });
    }

    async update(id: number, updateRatDto: UpdateRatDto, userId: number) {
        // Check if RAT exists and belongs to the user
        const rat = await this.findOne(id, userId);

        // If contact is being updated, verify it belongs to the client
        if (updateRatDto.id_contato) {
            await this.verifyContactBelongsToClient(updateRatDto.id_contato, rat.id_cliente);
        }

        // Recalculate duration if entry or exit time is updated
        if (updateRatDto.dt_data_hora_entrada || updateRatDto.dt_data_hora_saida) {
            const entryTime = updateRatDto.dt_data_hora_entrada
                ? new Date(updateRatDto.dt_data_hora_entrada)
                : new Date(rat.dt_data_hora_entrada);

            const exitTime = updateRatDto.dt_data_hora_saida
                ? new Date(updateRatDto.dt_data_hora_saida)
                : new Date(rat.dt_data_hora_saida);

            if (exitTime <= entryTime) {
                throw new BadRequestException('Exit time must be after entry time');
            }

            const durationMs = exitTime.getTime() - entryTime.getTime();
            const durationHours = Math.floor(durationMs / 3600000);
            const durationMinutes = Math.floor((durationMs % 3600000) / 60000);
            const durationSeconds = Math.floor((durationMs % 60000) / 1000);

            updateRatDto.tm_duracao = `${durationHours.toString().padStart(2, '0')}:${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;
        }

        return this.prisma.rAT.update({
            where: {
                id_rat: id,
            },
            data: updateRatDto,
            include: {
                cliente: true,
                contato: true,
            },
        });
    }

    async updateForClient(id: number, clientId: number, updateRatDto: UpdateRatDto, userId: number) {
        // Verify client belongs to user and RAT exists
        const rat = await this.findOneByClient(id, clientId, userId);

        // If contact is being updated, verify it belongs to the client
        if (updateRatDto.id_contato) {
            await this.verifyContactBelongsToClient(updateRatDto.id_contato, clientId);
        }

        // Recalculate duration if entry or exit time is updated
        if (updateRatDto.dt_data_hora_entrada || updateRatDto.dt_data_hora_saida) {
            const entryTime = updateRatDto.dt_data_hora_entrada
                ? new Date(updateRatDto.dt_data_hora_entrada)
                : new Date(rat.dt_data_hora_entrada);

            const exitTime = updateRatDto.dt_data_hora_saida
                ? new Date(updateRatDto.dt_data_hora_saida)
                : new Date(rat.dt_data_hora_saida);

            if (exitTime <= entryTime) {
                throw new BadRequestException('Exit time must be after entry time');
            }

            const durationMs = exitTime.getTime() - entryTime.getTime();
            const durationHours = Math.floor(durationMs / 3600000);
            const durationMinutes = Math.floor((durationMs % 3600000) / 60000);
            const durationSeconds = Math.floor((durationMs % 60000) / 1000);

            updateRatDto.tm_duracao = `${durationHours.toString().padStart(2, '0')}:${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;
        }

        return this.prisma.rAT.update({
            where: {
                id_rat: id,
            },
            data: updateRatDto,
            include: {
                cliente: true,
                contato: true,
                usuario: {
                    select: {
                        id_usuario: true,
                        nome: true,
                        email: true,
                        funcao: true,
                    }
                }
            },
        });
    }

    async remove(id: number, userId: number) {
        // Check if RAT exists and belongs to the user
        await this.findOne(id, userId);

        return this.prisma.rAT.delete({
            where: {
                id_rat: id,
            },
        });
    }

    async removeForClient(id: number, clientId: number, userId: number) {
        // Verify client belongs to user and RAT exists
        await this.findOneByClient(id, clientId, userId);

        return this.prisma.rAT.delete({
            where: {
                id_rat: id,
            },
        });
    }

    private async verifyClientBelongsToUser(clientId: number, userId: number) {
        const client = await this.prisma.cliente.findUnique({
            where: {
                id_cliente: clientId,
            },
        });

        if (!client) {
            throw new NotFoundException(`Client with ID ${clientId} not found`);
        }

        // Check if the user is admin - admins have access to all clients
        const user = await this.prisma.usuario.findUnique({
            where: { id_usuario: userId }
        });

        if (user && user.funcao.toLowerCase() === 'admin') {
            return client;
        }

        // For non-admins, check if the user has any RATs for this client
        const hasAccess = await this.prisma.rAT.findFirst({
            where: {
                id_cliente: clientId,
                id_usuario: userId
            }
        });

        if (!hasAccess) {
            throw new NotFoundException(`Client with ID ${clientId} not found or does not belong to you`);
        }

        return client;
    }

    private async verifyContactBelongsToClient(contactId: number, clientId: number) {
        const clientContact = await this.prisma.clienteContato.findUnique({
            where: {
                id_cliente_id_contato: {
                    id_cliente: clientId,
                    id_contato: contactId
                }
            }
        });

        if (!clientContact) {
            throw new NotFoundException(
                `Contact with ID ${contactId} not found for client ${clientId}`
            );
        }

        const contact = await this.prisma.contato.findUnique({
            where: {
                id_contato: contactId
            }
        });

        return contact;
    }
}

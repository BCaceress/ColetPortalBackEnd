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

        return this.prisma.contato.findMany({
            where: {
                id_cliente: clientId,
            },
            include: {
                cliente: true,
            },
        });
    }

    async findOne(id: number, clientId: number, userId: number) {
        // Verify client belongs to user
        await this.verifyClientBelongsToUser(clientId, userId);

        const contact = await this.prisma.contato.findFirst({
            where: {
                id_contato: id,
                id_cliente: clientId,
            },
            include: {
                cliente: true,
            },
        });

        if (!contact) {
            throw new NotFoundException(`Contact with ID ${id} not found`);
        }

        return contact;
    }

    async create(createContactDto: CreateContactDto, userId: number) {
        if (!createContactDto.id_cliente) {
            throw new BadRequestException('Client ID is required');
        }

        // Verify client belongs to user
        await this.verifyClientBelongsToUser(createContactDto.id_cliente, userId);

        return this.prisma.contato.create({
            data: {
                ds_nome: createContactDto.ds_nome,
                ds_cargo: createContactDto.ds_cargo,
                fl_ativo: createContactDto.fl_ativo,
                tx_observacoes: createContactDto.tx_observacoes || null,
                ds_email: createContactDto.ds_email,
                ds_telefone: createContactDto.ds_telefone,
                fl_whatsapp: createContactDto.fl_whatsapp,
                id_cliente: createContactDto.id_cliente
            },
            include: {
                cliente: true,
            },
        });
    }

    async update(id: number, clientId: number, updateContactDto: UpdateContactDto, userId: number) {
        // Verify client belongs to user and contact exists
        await this.findOne(id, clientId, userId);

        return this.prisma.contato.update({
            where: {
                id_contato: id,
            },
            data: updateContactDto,
            include: {
                cliente: true,
            },
        });
    }

    async remove(id: number, clientId: number, userId: number) {
        // Verify client belongs to user and contact exists
        await this.findOne(id, clientId, userId);

        return this.prisma.contato.delete({
            where: {
                id_contato: id,
            },
        });
    }

    /**
     * Find a specific contact by its ID without requiring the client ID
     * Used for the legacy API endpoints
     */
    async findOneById(id: number, userId: number) {
        const contact = await this.prisma.contato.findFirst({
            where: {
                id_contato: id,
                cliente: {
                    id_usuario: userId
                }
            },
            include: {
                cliente: true,
            },
        });

        if (!contact) {
            throw new NotFoundException(`Contact with ID ${id} not found`);
        }

        return contact;
    }

    /**
     * Update a contact by ID without requiring the client ID
     * Used for the legacy API endpoints
     */
    async updateById(id: number, updateContactDto: UpdateContactDto, userId: number) {
        const contact = await this.findOneById(id, userId);

        return this.prisma.contato.update({
            where: {
                id_contato: id,
            },
            data: updateContactDto,
            include: {
                cliente: true,
            },
        });
    }

    /**
     * Remove a contact by ID without requiring the client ID
     * Used for the legacy API endpoints
     */
    async removeById(id: number, userId: number) {
        const contact = await this.findOneById(id, userId);

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
        return this.prisma.contato.findMany({
            where: {
                cliente: {
                    id_usuario: userId
                }
            },
            include: {
                cliente: true
            }
        });
    }

    private async verifyClientBelongsToUser(clientId: number, userId: number) {
        const client = await this.prisma.cliente.findFirst({
            where: {
                id_cliente: clientId,
                id_usuario: userId
            },
        });

        if (!client) {
            throw new NotFoundException(`Client with ID ${clientId} not found or does not belong to you`);
        }

        return client;
    }
}

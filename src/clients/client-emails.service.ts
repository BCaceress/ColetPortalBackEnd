import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientEmailDto } from './dtos/client-email.dto';

@Injectable()
export class ClientEmailsService {
    constructor(private prisma: PrismaService) { }

    async findAll(clientId: number, userId: number) {
        // Verify client belongs to user
        await this.verifyClientBelongsToUser(clientId, userId);

        return this.prisma.emailCliente.findMany({
            where: {
                id_cliente: clientId,
            },
        });
    }

    async findOne(id: number, clientId: number, userId: number) {
        // Verify client belongs to user
        await this.verifyClientBelongsToUser(clientId, userId);

        const email = await this.prisma.emailCliente.findFirst({
            where: {
                id: id,
                id_cliente: clientId,
            },
        });

        if (!email) {
            throw new NotFoundException(`Email with ID ${id} not found`);
        }

        return email;
    }

    async create(clientEmailDto: ClientEmailDto, clientId: number, userId: number) {
        // Verify client belongs to user
        await this.verifyClientBelongsToUser(clientId, userId);

        return this.prisma.emailCliente.create({
            data: {
                ds_email: clientEmailDto.ds_email,
                id_cliente: clientId,
            },
        });
    }

    async update(id: number, clientEmailDto: ClientEmailDto, clientId: number, userId: number) {
        // Verify email exists and belongs to the client
        await this.findOne(id, clientId, userId);

        return this.prisma.emailCliente.update({
            where: {
                id: id,
            },
            data: {
                ds_email: clientEmailDto.ds_email,
            },
        });
    }

    async remove(id: number, clientId: number, userId: number) {
        // Verify email exists and belongs to the client
        await this.findOne(id, clientId, userId);

        return this.prisma.emailCliente.delete({
            where: {
                id: id,
            },
        });
    }

    private async verifyClientBelongsToUser(clientId: number, userId: number) {
        // Check if the client exists
        const client = await this.prisma.cliente.findUnique({
            where: {
                id_cliente: clientId,
            },
        });

        if (!client) {
            throw new NotFoundException(`Client with ID ${clientId} not found`);
        }

        // Check if the user has any RATs for this client
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
}

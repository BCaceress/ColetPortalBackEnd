import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService) { }

    async findAll(userId: number) {
        return this.prisma.cliente.findMany({
            where: {
                id_usuario: userId
            },
            orderBy: {
                dt_data: 'desc',
            },
            include: {
                contatos: true,
            },
        });
    }

    async findOne(id: number, userId: number) {
        const client = await this.prisma.cliente.findFirst({
            where: {
                id_cliente: id,
                id_usuario: userId
            },
            include: {
                contatos: true,
            },
        });

        if (!client) {
            throw new NotFoundException(`Client with ID ${id} not found`);
        }

        return client;
    }

    async create(createClientDto: CreateClientDto, userId: number) {
        return this.prisma.cliente.create({
            data: {
                ...createClientDto,
                id_usuario: userId
            },
            include: {
                contatos: true,
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
                contatos: true,
            },
        });
    }

    async remove(id: number, userId: number) {
        // Check if client exists
        await this.findOne(id, userId);

        // Delete related contacts first
        await this.prisma.contato.deleteMany({
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
}

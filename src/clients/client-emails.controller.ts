import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ClientEmailsService } from './client-emails.service';
import { ClientEmailDto } from './dtos/client-email.dto';

@UseGuards(AuthGuard)
@Controller('clientes/:id_cliente/emails')
export class ClientEmailsController {
    constructor(private readonly clientEmailsService: ClientEmailsService) { }

    @Get()
    findAll(
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Request() req
    ) {
        return this.clientEmailsService.findAll(id_cliente, req.user.id);
    }

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Request() req
    ) {
        return this.clientEmailsService.findOne(id, id_cliente, req.user.id);
    }

    @Post()
    create(
        @Body() clientEmailDto: ClientEmailDto,
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Request() req
    ) {
        return this.clientEmailsService.create(clientEmailDto, id_cliente, req.user.id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() clientEmailDto: ClientEmailDto,
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Request() req
    ) {
        return this.clientEmailsService.update(id, clientEmailDto, id_cliente, req.user.id);
    }

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Request() req
    ) {
        return this.clientEmailsService.remove(id, id_cliente, req.user.id);
    }
}

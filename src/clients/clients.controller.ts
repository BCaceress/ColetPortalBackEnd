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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';

@Controller(['clients', 'clientes'])  // Support both endpoints for consistency
@UseGuards(AuthGuard)
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    @Get()
    async findAll(@Request() req) {
        console.log('GET /clients or /clientes endpoint hit');
        console.log('User in request:', req.user);
        const clients = await this.clientsService.findAll(req.user.id);
        console.log(`Returning ${clients.length} clients from controller`);
        return clients;
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.clientsService.findOne(id, req.user.id);
    }

    @Post()
    create(@Body() createClientDto: CreateClientDto, @Request() req) {
        return this.clientsService.create(createClientDto, req.user.id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateClientDto: UpdateClientDto,
        @Request() req,
    ) {
        return this.clientsService.update(id, updateClientDto, req.user.id);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.clientsService.remove(id, req.user.id);
    }

    @Get(':id/contacts')
    getClientContacts(
        @Param('id', ParseIntPipe) id: number,
        @Request() req
    ) {
        return this.clientsService.getClientContacts(id, req.user.id);
    }

    @Post(':id/contacts/:contactId')
    addContactToClient(
        @Param('id', ParseIntPipe) id: number,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Request() req
    ) {
        return this.clientsService.addContactToClient(id, contactId, req.user.id);
    }

    @Delete(':id/contacts/:contactId')
    removeContactFromClient(
        @Param('id', ParseIntPipe) id: number,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Request() req
    ) {
        return this.clientsService.removeContactFromClient(id, contactId, req.user.id);
    }
}

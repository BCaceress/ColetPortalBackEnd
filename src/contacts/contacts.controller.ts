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
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dtos/create-contact.dto';
import { UpdateContactDto } from './dtos/update-contact.dto';

@UseGuards(AuthGuard)
@Controller()
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) { }

    // Legacy routes for backward compatibility
    @Get('contacts')
    async findAllContactsLegacy(@Request() req) {
        console.log('Hit findAllContactsLegacy route');
        console.log('User in request:', req.user);

        if (!req.user || !req.user.id) {
            console.error('User ID is missing in request');
            return [];
        }

        const contacts = await this.contactsService.findAllForUser(req.user.id);
        console.log(`Returning ${contacts.length} contacts from controller`);
        return contacts;
    }

    @Get('contacts/:id')
    findOneLegacy(
        @Param('id', ParseIntPipe) id: number,
        @Request() req
    ) {
        return this.contactsService.findOneById(id, req.user.id);
    }

    @Post('contacts')
    createLegacy(
        @Body() createContactDto: CreateContactDto,
        @Request() req
    ) {
        return this.contactsService.create(createContactDto, req.user.id);
    }

    @Patch('contacts/:id')
    updateLegacy(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateContactDto: UpdateContactDto,
        @Request() req
    ) {
        return this.contactsService.updateById(id, updateContactDto, req.user.id);
    }

    @Delete('contacts/:id')
    removeLegacy(
        @Param('id', ParseIntPipe) id: number,
        @Request() req
    ) {
        return this.contactsService.removeById(id, req.user.id);
    }

    // Add a global route to get all contacts for the user
    @Get('contatos')
    async findAllContacts(@Request() req) {
        console.log('Hit findAllContacts route');
        console.log('User in request:', req.user);

        if (!req.user || !req.user.id) {
            console.error('User ID is missing in request');
            return [];
        }

        const contacts = await this.contactsService.findAllForUser(req.user.id);
        console.log(`Returning ${contacts.length} contacts from controller`);
        return contacts;
    }

    // Nested routes for specific client's contacts
    @Get('clientes/:id_cliente/contatos')
    findAll(
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Request() req
    ) {
        return this.contactsService.findAll(id_cliente, req.user.id);
    }

    @Get('clientes/:id_cliente/contatos/:id_contato')
    findOne(
        @Param('id_contato', ParseIntPipe) id_contato: number,
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Request() req
    ) {
        return this.contactsService.findOne(id_contato, id_cliente, req.user.id);
    }

    @Post('clientes/:id_cliente/contatos')
    create(
        @Body() createContactDto: CreateContactDto,
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Request() req
    ) {
        // Ensure the client ID from the route is used
        createContactDto.id_cliente = id_cliente;
        return this.contactsService.create(createContactDto, req.user.id);
    }

    @Patch('clientes/:id_cliente/contatos/:id_contato')
    update(
        @Param('id_contato', ParseIntPipe) id_contato: number,
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Body() updateContactDto: UpdateContactDto,
        @Request() req
    ) {
        return this.contactsService.update(id_contato, id_cliente, updateContactDto, req.user.id);
    }

    @Delete('clientes/:id_cliente/contatos/:id_contato')
    remove(
        @Param('id_contato', ParseIntPipe) id_contato: number,
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Request() req
    ) {
        return this.contactsService.remove(id_contato, id_cliente, req.user.id);
    }
}

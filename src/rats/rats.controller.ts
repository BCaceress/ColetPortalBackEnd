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
import { CreateRatDto } from './dtos/create-rat.dto';
import { UpdateRatDto } from './dtos/update-rat.dto';
import { RatsService } from './rats.service';

@UseGuards(AuthGuard)
@Controller()
export class RatsController {
    constructor(private readonly ratsService: RatsService) { }

    // Legacy route for backward compatibility
    @Get('rats')
    findAllRats(@Request() req) {
        console.log('Hit findAllRats route');
        return this.ratsService.findAll(req.user.id);
    }

    @Get('rats/:id')
    findOneRat(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.ratsService.findOne(id, req.user.id);
    }

    @Post('rats')
    createRat(@Body() createRatDto: CreateRatDto, @Request() req) {
        return this.ratsService.create(createRatDto, req.user.id);
    }

    @Patch('rats/:id')
    updateRat(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateRatDto: UpdateRatDto,
        @Request() req
    ) {
        return this.ratsService.update(id, updateRatDto, req.user.id);
    }

    @Delete('rats/:id')
    removeRat(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.ratsService.remove(id, req.user.id);
    }

    // Global route to get all RATs for the current user
    @Get('atendimentos')
    findAll(@Request() req) {
        console.log('Hit findAll route');
        return this.ratsService.findAll(req.user.id);
    }

    // Nested routes for specific client's RATs
    @Get('clientes/:id_cliente/atendimentos')
    findAllForClient(
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Request() req
    ) {
        return this.ratsService.findAllForClient(id_cliente, req.user.id);
    }

    @Get('clientes/:id_cliente/atendimentos/:id')
    findOneForClient(
        @Param('id', ParseIntPipe) id: number,
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Request() req
    ) {
        return this.ratsService.findOneByClient(id, id_cliente, req.user.id);
    }

    @Post('clientes/:id_cliente/atendimentos')
    createForClient(
        @Body() createRatDto: CreateRatDto,
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Request() req
    ) {
        // Ensure the client ID from the route is used
        createRatDto.id_cliente = id_cliente;
        return this.ratsService.create(createRatDto, req.user.id);
    }

    @Patch('clientes/:id_cliente/atendimentos/:id')
    updateForClient(
        @Param('id', ParseIntPipe) id: number,
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Body() updateRatDto: UpdateRatDto,
        @Request() req
    ) {
        return this.ratsService.updateForClient(id, id_cliente, updateRatDto, req.user.id);
    }

    @Delete('clientes/:id_cliente/atendimentos/:id')
    removeForClient(
        @Param('id', ParseIntPipe) id: number,
        @Param('id_cliente', ParseIntPipe) id_cliente: number,
        @Request() req
    ) {
        return this.ratsService.removeForClient(id, id_cliente, req.user.id);
    }
}

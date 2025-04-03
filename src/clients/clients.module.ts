import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientEmailsController } from './client-emails.controller';
import { ClientEmailsService } from './client-emails.service';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';

@Module({
    imports: [PrismaModule],
    controllers: [ClientsController, ClientEmailsController],
    providers: [ClientsService, ClientEmailsService],
})
export class ClientsModule { }

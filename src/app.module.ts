import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ContactsModule } from './contacts/contacts.module';
import { PrismaModule } from './prisma/prisma.module';
import { RatsModule } from './rats/rats.module';

@Module({
  imports: [AuthModule, PrismaModule, ClientsModule, ContactsModule, RatsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }

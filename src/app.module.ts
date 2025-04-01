import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ContactsModule } from './contacts/contacts.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule, ClientsModule, ContactsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RatsController } from './rats.controller';
import { RatsService } from './rats.service';

@Module({
    imports: [PrismaModule],
    controllers: [RatsController],
    providers: [RatsService],
})
export class RatsModule { }

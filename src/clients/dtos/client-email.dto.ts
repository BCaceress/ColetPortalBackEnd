import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ClientEmailDto {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id?: number;

    @IsNotEmpty()
    @IsEmail()
    ds_email: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id_cliente?: number;
}

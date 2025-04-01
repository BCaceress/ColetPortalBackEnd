import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
    @IsNotEmpty()
    @IsString()
    ds_nome: string;

    @IsNotEmpty()
    @IsString()
    ds_cargo: string;

    @IsBoolean()
    fl_ativo: boolean;

    @IsOptional()
    @IsString()
    tx_observacoes?: string;

    @IsNotEmpty()
    @IsEmail()
    ds_email: string;

    @IsNotEmpty()
    @IsString()
    ds_telefone: string;

    @IsBoolean()
    fl_whatsapp: boolean;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : value)
    id_cliente?: number;
}

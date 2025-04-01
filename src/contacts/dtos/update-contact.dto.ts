import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateContactDto {
    @IsOptional()
    @IsString()
    ds_nome?: string;

    @IsOptional()
    @IsString()
    ds_cargo?: string;

    @IsOptional()
    @IsBoolean()
    fl_ativo?: boolean;

    @IsOptional()
    @IsString()
    tx_observacoes?: string;

    @IsOptional()
    @IsEmail()
    ds_email?: string;

    @IsOptional()
    @IsString()
    ds_telefone?: string;

    @IsOptional()
    @IsBoolean()
    fl_whatsapp?: boolean;
}

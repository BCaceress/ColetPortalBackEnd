import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateClientDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    ds_nome?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    ds_razao_social?: string;

    @IsOptional()
    @IsString()
    @MaxLength(18)
    nr_cnpj?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    nr_inscricao_estadual?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    ds_site?: string;

    @IsOptional()
    @IsString()
    tx_observacoes?: string;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    ds_endereco?: string;

    @IsOptional()
    @IsString()
    @MaxLength(9)
    ds_cep?: string;

    @IsOptional()
    @IsString()
    @MaxLength(2)
    ds_uf?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    ds_cidade?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    ds_bairro?: string;

    @IsOptional()
    @IsString()
    @MaxLength(10)
    nr_numero?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    ds_complemento?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    nr_codigo_ibge?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_latitude?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_longitude?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_distancia_km?: number;

    @IsOptional()
    @IsBoolean()
    fl_ativo?: boolean;
}

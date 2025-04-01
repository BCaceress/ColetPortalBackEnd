import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClientDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    ds_nome: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    ds_razao_social: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(18)
    nr_cnpj: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    nr_inscricao_estadual: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    ds_site?: string;

    @IsOptional()
    @IsString()
    tx_observacoes?: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(150)
    ds_endereco: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(9)
    ds_cep: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(2)
    ds_uf: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    ds_cidade: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    ds_bairro: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(10)
    nr_numero: string;

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

    @IsNotEmpty()
    @IsBoolean()
    fl_ativo: boolean = true;
}

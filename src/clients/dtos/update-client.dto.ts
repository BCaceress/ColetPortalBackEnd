import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

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
    tx_observacao_ident?: string;

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

    @IsOptional()
    @IsBoolean()
    fl_matriz?: boolean;

    @IsOptional()
    @IsString()
    ds_situacao?: string;

    @IsOptional()
    @IsString()
    ds_sistema?: string;

    @IsOptional()
    @IsString()
    ds_contrato?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_nomeados?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_simultaneos?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_tecnica_remoto?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_tecnica_presencial?: number;

    @IsOptional()
    @IsString()
    tm_minimo_horas?: string; // Format as HH:MM:SS

    @IsOptional()
    @IsString()
    ds_diario_viagem?: string;

    @IsOptional()
    @IsString()
    ds_regiao?: string;

    @IsOptional()
    @IsString()
    tx_observacao_contrato?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_codigo_zz?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_franquia_nf?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_qtde_documentos?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_valor_franqia?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_valor_excendente?: number;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dt_data_contrato?: Date;
}

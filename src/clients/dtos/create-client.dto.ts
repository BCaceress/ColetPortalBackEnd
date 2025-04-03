import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

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
    tx_observacao_ident?: string;

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

    @IsNotEmpty()
    @IsBoolean()
    fl_matriz: boolean;

    @IsNotEmpty()
    @IsString()
    ds_situacao: string;

    @IsNotEmpty()
    @IsString()
    ds_sistema: string;

    @IsNotEmpty()
    @IsString()
    ds_contrato: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    nr_nomeados: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    nr_simultaneos: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_tecnica_remoto?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_tecnica_presencial?: number;

    @IsNotEmpty()
    @IsString()
    tm_minimo_horas: string; // Format as HH:MM:SS

    @IsNotEmpty()
    @IsString()
    ds_diario_viagem: string;

    @IsNotEmpty()
    @IsString()
    ds_regiao: string;

    @IsNotEmpty()
    @IsString()
    tx_observacao_contrato: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    nr_codigo_zz: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    nr_franquia_nf: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    nr_qtde_documentos: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    nr_valor_franqia: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    nr_valor_excendente: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => new Date(value))
    dt_data_contrato: Date;
}

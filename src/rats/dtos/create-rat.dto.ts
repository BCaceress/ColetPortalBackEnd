import { Transform, Type } from 'class-transformer';
import { IsDate, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRatDto {
    @IsNotEmpty()
    @IsString()
    ds_status: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['S', 'N'])
    fl_deslocamento: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => new Date(value))
    dt_data_hora_entrada: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => new Date(value))
    dt_data_hora_saida: Date;

    @IsNotEmpty()
    @IsString()
    tm_duracao: string; // Format as HH:MM:SS

    @IsNotEmpty()
    @IsString()
    tx_comentario_interno: string;

    @IsNotEmpty()
    @IsString()
    ds_originada: string;

    @IsNotEmpty()
    @IsString()
    ds_observacao: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_km_ida?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_km_volta?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    nr_valor_pedagio?: number;

    @IsNotEmpty()
    @IsString()
    tx_atividades: string;

    @IsNotEmpty()
    @IsString()
    tx_tarefas: string;

    @IsNotEmpty()
    @IsString()
    tx_pendencias: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id_cliente?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id_contato?: number;
}

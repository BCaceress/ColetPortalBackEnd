import { Transform, Type } from 'class-transformer';
import { IsDate, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRatDto {
    @IsOptional()
    @IsString()
    ds_status?: string;

    @IsOptional()
    @IsString()
    @IsIn(['S', 'N'])
    fl_deslocamento?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => new Date(value))
    dt_data_hora_entrada?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => new Date(value))
    dt_data_hora_saida?: Date;

    @IsOptional()
    @IsString()
    tm_duracao?: string; // Format as HH:MM:SS

    @IsOptional()
    @IsString()
    tx_comentario_interno?: string;

    @IsOptional()
    @IsString()
    ds_originada?: string;

    @IsOptional()
    @IsString()
    ds_observacao?: string;

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

    @IsOptional()
    @IsString()
    tx_atividades?: string;

    @IsOptional()
    @IsString()
    tx_tarefas?: string;

    @IsOptional()
    @IsString()
    tx_pendencias?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id_contato?: number;
}

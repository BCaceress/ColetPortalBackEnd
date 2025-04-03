/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id_cliente" SERIAL NOT NULL,
    "fl_ativo" BOOLEAN NOT NULL,
    "ds_nome" TEXT NOT NULL,
    "ds_razao_social" TEXT NOT NULL,
    "nr_cnpj" TEXT NOT NULL,
    "nr_inscricao_estadual" TEXT NOT NULL,
    "ds_site" TEXT,
    "ds_endereco" TEXT NOT NULL,
    "ds_cep" TEXT NOT NULL,
    "ds_uf" TEXT NOT NULL,
    "ds_cidade" TEXT NOT NULL,
    "ds_bairro" TEXT NOT NULL,
    "nr_numero" TEXT NOT NULL,
    "ds_complemento" TEXT,
    "nr_codigo_ibge" TEXT,
    "nr_latitude" DOUBLE PRECISION,
    "nr_longitude" DOUBLE PRECISION,
    "nr_distancia_km" DOUBLE PRECISION,
    "tx_observacao_ident" TEXT,
    "fl_matriz" BOOLEAN NOT NULL,
    "ds_situacao" TEXT NOT NULL,
    "ds_sistema" TEXT NOT NULL,
    "ds_contrato" TEXT NOT NULL,
    "nr_nomeados" INTEGER NOT NULL,
    "nr_simultaneos" INTEGER NOT NULL,
    "nr_tecnica_remoto" DOUBLE PRECISION,
    "nr_tecnica_presencial" DOUBLE PRECISION,
    "tm_minimo_horas" TIME NOT NULL,
    "ds_diario_viagem" TEXT NOT NULL,
    "ds_regiao" TEXT NOT NULL,
    "tx_observacao_contrato" TEXT NOT NULL,
    "nr_codigo_zz" INTEGER NOT NULL,
    "nr_franquia_nf" DOUBLE PRECISION NOT NULL,
    "nr_qtde_documentos" INTEGER NOT NULL,
    "nr_valor_franqia" DOUBLE PRECISION NOT NULL,
    "nr_valor_excendente" DOUBLE PRECISION NOT NULL,
    "dt_data_contrato" DATE NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "contatos" (
    "id_contato" SERIAL NOT NULL,
    "ds_nome" TEXT NOT NULL,
    "ds_cargo" TEXT NOT NULL,
    "fl_ativo" BOOLEAN NOT NULL,
    "tx_observacoes" TEXT,
    "ds_email" TEXT NOT NULL,
    "ds_telefone" TEXT NOT NULL,
    "fl_whatsapp" BOOLEAN NOT NULL,
    "id_cliente" INTEGER NOT NULL,

    CONSTRAINT "contatos_pkey" PRIMARY KEY ("id_contato")
);

-- CreateTable
CREATE TABLE "emails_cliente" (
    "id" SERIAL NOT NULL,
    "ds_email" TEXT NOT NULL,
    "id_cliente" INTEGER NOT NULL,

    CONSTRAINT "emails_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rats" (
    "id_rat" SERIAL NOT NULL,
    "ds_status" TEXT NOT NULL,
    "fl_deslocamento" TEXT NOT NULL,
    "dt_data_hora_entrada" TIMESTAMP(3) NOT NULL,
    "dt_data_hora_saida" TIMESTAMP(3) NOT NULL,
    "tm_duracao" TIME NOT NULL,
    "tx_comentario_interno" TEXT NOT NULL,
    "ds_originada" TEXT NOT NULL,
    "ds_observacao" TEXT NOT NULL,
    "nr_km_ida" INTEGER,
    "nr_km_volta" INTEGER,
    "nr_valor_pedagio" DOUBLE PRECISION,
    "tx_atividades" TEXT NOT NULL,
    "tx_tarefas" TEXT NOT NULL,
    "tx_pendencias" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_contato" INTEGER NOT NULL,

    CONSTRAINT "rats_pkey" PRIMARY KEY ("id_rat")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "contatos_id_cliente_idx" ON "contatos"("id_cliente");

-- CreateIndex
CREATE INDEX "emails_cliente_id_cliente_idx" ON "emails_cliente"("id_cliente");

-- CreateIndex
CREATE INDEX "rats_id_usuario_idx" ON "rats"("id_usuario");

-- CreateIndex
CREATE INDEX "rats_id_cliente_idx" ON "rats"("id_cliente");

-- CreateIndex
CREATE INDEX "rats_id_contato_idx" ON "rats"("id_contato");

-- AddForeignKey
ALTER TABLE "contatos" ADD CONSTRAINT "contatos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails_cliente" ADD CONSTRAINT "emails_cliente_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rats" ADD CONSTRAINT "rats_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rats" ADD CONSTRAINT "rats_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rats" ADD CONSTRAINT "rats_id_contato_fkey" FOREIGN KEY ("id_contato") REFERENCES "contatos"("id_contato") ON DELETE RESTRICT ON UPDATE CASCADE;

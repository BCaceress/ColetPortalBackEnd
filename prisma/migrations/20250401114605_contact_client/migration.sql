/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
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
    "dt_data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tx_observacoes" TEXT,
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

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "contatos_id_cliente_idx" ON "contatos"("id_cliente");

-- AddForeignKey
ALTER TABLE "contatos" ADD CONSTRAINT "contatos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

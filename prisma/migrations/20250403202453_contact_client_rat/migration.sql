/*
  Warnings:

  - You are about to drop the column `id_cliente` on the `contatos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "contatos" DROP CONSTRAINT "contatos_id_cliente_fkey";

-- DropIndex
DROP INDEX "contatos_id_cliente_idx";

-- AlterTable
ALTER TABLE "contatos" DROP COLUMN "id_cliente";

-- CreateTable
CREATE TABLE "clientes_contatos" (
    "id" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_contato" INTEGER NOT NULL,

    CONSTRAINT "clientes_contatos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clientes_contatos_id_cliente_idx" ON "clientes_contatos"("id_cliente");

-- CreateIndex
CREATE INDEX "clientes_contatos_id_contato_idx" ON "clientes_contatos"("id_contato");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_contatos_id_cliente_id_contato_key" ON "clientes_contatos"("id_cliente", "id_contato");

-- AddForeignKey
ALTER TABLE "clientes_contatos" ADD CONSTRAINT "clientes_contatos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes_contatos" ADD CONSTRAINT "clientes_contatos_id_contato_fkey" FOREIGN KEY ("id_contato") REFERENCES "contatos"("id_contato") ON DELETE RESTRICT ON UPDATE CASCADE;

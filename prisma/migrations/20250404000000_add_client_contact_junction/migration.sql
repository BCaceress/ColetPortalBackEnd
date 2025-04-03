-- CreateTable
CREATE TABLE "clientes_contatos" (
    "id" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_contato" INTEGER NOT NULL,

    CONSTRAINT "clientes_contatos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_contatos_id_cliente_id_contato_key" ON "clientes_contatos"("id_cliente", "id_contato");

-- CreateIndex
CREATE INDEX "clientes_contatos_id_cliente_idx" ON "clientes_contatos"("id_cliente");

-- CreateIndex
CREATE INDEX "clientes_contatos_id_contato_idx" ON "clientes_contatos"("id_contato");

-- AddForeignKey
ALTER TABLE "clientes_contatos" ADD CONSTRAINT "clientes_contatos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes_contatos" ADD CONSTRAINT "clientes_contatos_id_contato_fkey" FOREIGN KEY ("id_contato") REFERENCES "contatos"("id_contato") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Migrate existing relationships
-- For each contact, create a relationship to its associated client
INSERT INTO "clientes_contatos" ("id_cliente", "id_contato")
SELECT "id_cliente", "id_contato" FROM "contatos";

-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "id_usuario" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

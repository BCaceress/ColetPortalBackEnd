-- First add the column with a default value (use the first user's ID or a specific ID)
ALTER TABLE "clientes" ADD COLUMN "id_usuario" INTEGER NOT NULL DEFAULT 1;

-- Create the foreign key relationship
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Remove the default constraint after all existing rows have been updated
-- You may want to update specific clients to different users before this step
-- ALTER TABLE "clientes" ALTER COLUMN "id_usuario" DROP DEFAULT;

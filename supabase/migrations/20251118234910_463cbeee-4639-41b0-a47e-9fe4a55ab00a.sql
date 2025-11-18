-- Mudar o tipo da coluna imagem de BYTEA para TEXT
-- Isso é melhor para armazenar URLs de imagens
ALTER TABLE produto ALTER COLUMN imagem TYPE text USING imagem::text;
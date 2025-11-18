-- Criar policy de INSERT para permitir upload de imagens
-- Primeiro dropar se já existir
DROP POLICY IF EXISTS "Vendedores podem fazer upload de produtos" ON storage.objects;

-- Criar a policy de upload
CREATE POLICY "Vendedores podem fazer upload de produtos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'produtos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
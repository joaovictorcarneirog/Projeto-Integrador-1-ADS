-- Corrigir a policy de upload - o índice estava errado!
-- Arrays no PostgreSQL começam em 1, então:
-- Index [1] = "produtos" (nome do bucket na pasta)
-- Index [2] = user_id (ID do usuário na subpasta)

DROP POLICY IF EXISTS "Vendedores podem fazer upload de produtos" ON storage.objects;

CREATE POLICY "Vendedores podem fazer upload de produtos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'produtos' 
  AND auth.uid()::text = (storage.foldername(name))[2]
);
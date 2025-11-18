-- Criar bucket de storage público para imagens de produtos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'produtos',
  'produtos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Políticas RLS para o bucket de produtos
CREATE POLICY "Qualquer um pode ver imagens de produtos"
ON storage.objects FOR SELECT
USING (bucket_id = 'produtos');

CREATE POLICY "Vendedores podem fazer upload de imagens"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'produtos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Vendedores podem atualizar suas imagens"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'produtos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Vendedores podem deletar suas imagens"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'produtos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
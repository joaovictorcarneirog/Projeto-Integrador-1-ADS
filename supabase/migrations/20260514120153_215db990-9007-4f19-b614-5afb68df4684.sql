-- 1. Add validation columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS validation_status TEXT NOT NULL DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS validated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS validated_by UUID,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 2. Documents table
CREATE TABLE IF NOT EXISTS public.vendor_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('rg_cnh','comprovante_endereco','selfie')),
  file_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID
);

ALTER TABLE public.vendor_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doadores veem seus documentos"
  ON public.vendor_documents FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Doadores enviam seus documentos"
  ON public.vendor_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doadores atualizam seus documentos pendentes"
  ON public.vendor_documents FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pendente');

CREATE POLICY "Admins atualizam qualquer documento"
  ON public.vendor_documents FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Doadores deletam seus pendentes"
  ON public.vendor_documents FOR DELETE
  USING (auth.uid() = user_id AND status = 'pendente');

-- 3. Admin can view & update all profiles
CREATE POLICY "Admins veem todos os perfis"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins atualizam validação de perfis"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Storage bucket for documents (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos', 'documentos', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Doador acessa seus documentos no storage"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documentos'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Doador envia documentos para sua pasta"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documentos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Doador atualiza arquivos na sua pasta"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'documentos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Doador deleta arquivos na sua pasta"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documentos'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'))
  );
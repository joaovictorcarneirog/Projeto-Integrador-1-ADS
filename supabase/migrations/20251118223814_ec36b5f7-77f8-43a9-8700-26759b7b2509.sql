-- Habilitar RLS nas tabelas de lookup que faltaram
ALTER TABLE public.unidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipo_produto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forma_de_pagamento ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de leitura para tabelas de lookup
CREATE POLICY "Unidades são visíveis para todos"
  ON public.unidade FOR SELECT
  USING (true);

CREATE POLICY "Tipos de produto são visíveis para todos"
  ON public.tipo_produto FOR SELECT
  USING (true);

CREATE POLICY "Formas de pagamento são visíveis para todos"
  ON public.forma_de_pagamento FOR SELECT
  USING (true);

-- Adicionar políticas faltantes de INSERT para favoritos
CREATE POLICY "Usuários podem criar sua lista de favoritos"
  ON public.favoritos FOR INSERT
  WITH CHECK (auth.uid() = fk_cliente_id);
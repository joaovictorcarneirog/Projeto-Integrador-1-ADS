-- Criar tipos de produtos, unidades e formas de pagamento
CREATE TABLE IF NOT EXISTS public.unidade (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tipo_produto (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS public.forma_de_pagamento (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR NOT NULL
);

-- Criar tabela de perfis (profiles) vinculada ao auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR NOT NULL,
  tipo_usuario VARCHAR(10) NOT NULL CHECK (tipo_usuario IN ('comprador','vendedor')),
  data_nasc DATE,
  cpf BIGINT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tabela de endereços
CREATE TABLE IF NOT EXISTS public.endereco (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  fk_cliente_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  fk_unidade_id INT REFERENCES public.unidade(id) ON DELETE CASCADE,
  rua VARCHAR,
  cep BIGINT
);

ALTER TABLE public.endereco ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios endereços"
  ON public.endereco FOR SELECT
  USING (auth.uid() = fk_cliente_id);

CREATE POLICY "Usuários podem inserir seus próprios endereços"
  ON public.endereco FOR INSERT
  WITH CHECK (auth.uid() = fk_cliente_id);

-- Tabela de telefones
CREATE TABLE IF NOT EXISTS public.telefone (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  fk_cliente_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  fk_vendedor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  numero BIGINT,
  principal BOOLEAN DEFAULT TRUE
);

ALTER TABLE public.telefone ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios telefones"
  ON public.telefone FOR SELECT
  USING (auth.uid() = fk_cliente_id OR auth.uid() = fk_vendedor_id);

CREATE POLICY "Usuários podem inserir seus próprios telefones"
  ON public.telefone FOR INSERT
  WITH CHECK (auth.uid() = fk_cliente_id OR auth.uid() = fk_vendedor_id);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS public.produto (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR NOT NULL,
  preco NUMERIC(10,2) NOT NULL,
  data_vencimento DATE,
  descricao VARCHAR,
  quantidade INT,
  imagem BYTEA,
  mime TEXT,
  fk_tipo_produto_id INT REFERENCES public.tipo_produto(id),
  fk_vendedor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.produto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Produtos são visíveis para todos"
  ON public.produto FOR SELECT
  USING (true);

CREATE POLICY "Vendedores podem inserir produtos"
  ON public.produto FOR INSERT
  WITH CHECK (auth.uid() = fk_vendedor_id);

CREATE POLICY "Vendedores podem atualizar seus produtos"
  ON public.produto FOR UPDATE
  USING (auth.uid() = fk_vendedor_id);

CREATE POLICY "Vendedores podem deletar seus produtos"
  ON public.produto FOR DELETE
  USING (auth.uid() = fk_vendedor_id);

-- Tabela de favoritos
CREATE TABLE IF NOT EXISTS public.favoritos (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  fk_cliente_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE
);

ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus favoritos"
  ON public.favoritos FOR SELECT
  USING (auth.uid() = fk_cliente_id);

-- Tabela de produtos favoritos
CREATE TABLE IF NOT EXISTS public.produto_favorito (
  fk_produto_id INT REFERENCES public.produto(id) ON DELETE CASCADE,
  fk_favoritos_id INT REFERENCES public.favoritos(id) ON DELETE CASCADE,
  PRIMARY KEY (fk_produto_id, fk_favoritos_id)
);

ALTER TABLE public.produto_favorito ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar seus produtos favoritos"
  ON public.produto_favorito FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.favoritos
      WHERE favoritos.id = produto_favorito.fk_favoritos_id
      AND favoritos.fk_cliente_id = auth.uid()
    )
  );

-- Tabela de carrinho
CREATE TABLE IF NOT EXISTS public.carrinho_produto (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  fk_produto_id INT REFERENCES public.produto(id) ON DELETE CASCADE,
  fk_cliente_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  quantidade INT NOT NULL DEFAULT 1,
  valor_total_item NUMERIC(10,2) NOT NULL,
  CONSTRAINT carrinho_unico UNIQUE (fk_produto_id, fk_cliente_id)
);

ALTER TABLE public.carrinho_produto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu carrinho"
  ON public.carrinho_produto FOR SELECT
  USING (auth.uid() = fk_cliente_id);

CREATE POLICY "Usuários podem adicionar ao carrinho"
  ON public.carrinho_produto FOR INSERT
  WITH CHECK (auth.uid() = fk_cliente_id);

CREATE POLICY "Usuários podem atualizar seu carrinho"
  ON public.carrinho_produto FOR UPDATE
  USING (auth.uid() = fk_cliente_id);

CREATE POLICY "Usuários podem remover do carrinho"
  ON public.carrinho_produto FOR DELETE
  USING (auth.uid() = fk_cliente_id);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS public.pedido (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  valor_total NUMERIC(10,2),
  fk_cliente_id UUID REFERENCES public.profiles(id),
  fk_unidade_id INT REFERENCES public.unidade(id),
  data_pedido DATE DEFAULT CURRENT_DATE
);

ALTER TABLE public.pedido ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus pedidos"
  ON public.pedido FOR SELECT
  USING (auth.uid() = fk_cliente_id);

-- Inserir dados iniciais
INSERT INTO public.unidade (nome) VALUES
('Unid. Norte'),('Unid. Sul'),('Unid. Leste'),('Unid. Oeste'),('Unid. Centro'),
('Unid. A'),('Unid. B'),('Unid. C'),('Unid. D'),('Unid. E')
ON CONFLICT DO NOTHING;

INSERT INTO public.tipo_produto (nome) VALUES
('Hortaliça'),('Fruta'),('Grão'),('Laticínio'),('Panificado'),
('Carne'),('Bebida'),('Doce'),('Cereal'),('Leguminosa')
ON CONFLICT DO NOTHING;

INSERT INTO public.forma_de_pagamento (nome) VALUES
('PIX'),('Dinheiro'),('Cartão Crédito')
ON CONFLICT DO NOTHING;

-- Trigger para criar perfil automaticamente ao registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, tipo_usuario, data_nasc, cpf)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', ''),
    COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'comprador'),
    (NEW.raw_user_meta_data->>'data_nasc')::DATE,
    (NEW.raw_user_meta_data->>'cpf')::BIGINT
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
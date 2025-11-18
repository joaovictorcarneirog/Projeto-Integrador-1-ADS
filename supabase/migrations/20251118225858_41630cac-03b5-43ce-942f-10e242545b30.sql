-- Criar política RLS para permitir que todos vejam nomes de vendedores
CREATE POLICY "Nomes de vendedores são públicos"
ON profiles FOR SELECT
USING (tipo_usuario = 'vendedor');
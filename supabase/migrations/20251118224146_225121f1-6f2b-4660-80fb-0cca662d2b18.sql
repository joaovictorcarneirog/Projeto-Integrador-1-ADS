-- Adicionar campos para suportar PF e PJ
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cnpj bigint;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS celular varchar;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS endereco text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferencias_alimentares text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS horario_funcionamento varchar;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS imagem_perfil text;

-- Adicionar comentários para documentação
COMMENT ON COLUMN profiles.cpf IS 'CPF para Pessoa Física (comprador)';
COMMENT ON COLUMN profiles.cnpj IS 'CNPJ para Pessoa Jurídica (vendedor)';
COMMENT ON COLUMN profiles.celular IS 'Número de celular do usuário';
COMMENT ON COLUMN profiles.endereco IS 'Endereço completo do usuário';
COMMENT ON COLUMN profiles.preferencias_alimentares IS 'Preferências alimentares do comprador';
COMMENT ON COLUMN profiles.horario_funcionamento IS 'Horário de funcionamento para vendedores PJ';
COMMENT ON COLUMN profiles.imagem_perfil IS 'URL da imagem de perfil do usuário';
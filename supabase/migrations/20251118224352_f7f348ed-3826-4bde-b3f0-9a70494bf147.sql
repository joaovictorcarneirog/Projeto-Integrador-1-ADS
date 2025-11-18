-- Atualizar a função handle_new_user para incluir os novos campos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    nome, 
    tipo_usuario, 
    data_nasc, 
    cpf,
    cnpj,
    celular,
    endereco,
    preferencias_alimentares,
    horario_funcionamento
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', ''),
    COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'comprador'),
    (NEW.raw_user_meta_data->>'data_nasc')::DATE,
    (NEW.raw_user_meta_data->>'cpf')::BIGINT,
    (NEW.raw_user_meta_data->>'cnpj')::BIGINT,
    NEW.raw_user_meta_data->>'celular',
    NEW.raw_user_meta_data->>'endereco',
    NEW.raw_user_meta_data->>'preferencias_alimentares',
    NEW.raw_user_meta_data->>'horario_funcionamento'
  );
  RETURN NEW;
END;
$$;
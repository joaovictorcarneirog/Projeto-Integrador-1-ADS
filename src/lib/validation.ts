import { z } from "zod";

// Validação de CPF - simplificada para aceitar 11 dígitos
export const validarCPF = (cpf: string): boolean => {
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false; // Todos dígitos iguais
  
  return true;
};

// Validação de CNPJ - simplificada para aceitar 14 dígitos
export const validarCNPJ = (cnpj: string): boolean => {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  
  if (cnpjLimpo.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false; // Todos dígitos iguais
  
  return true;
};

// Schema para cadastro de Pessoa Física
export const cadastroPFSchema = z.object({
  nome: z.string()
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z.string()
    .trim()
    .email("Email inválido")
    .max(255, "Email muito longo"),
  senha: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(100, "Senha muito longa"),
  confirmarSenha: z.string(),
  cpf: z.string()
    .refine((val) => validarCPF(val), "CPF inválido"),
  celular: z.string()
    .trim()
    .min(10, "Celular inválido")
    .max(20, "Celular muito longo"),
  endereco: z.string()
    .trim()
    .min(5, "Endereço muito curto")
    .max(500, "Endereço muito longo"),
  data_nasc: z.string()
    .refine((val) => {
      const data = new Date(val);
      const hoje = new Date();
      return data < hoje;
    }, "Data de nascimento inválida"),
  preferencias_alimentares: z.string()
    .max(1000, "Preferências muito longas")
    .optional(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

// Schema para cadastro de Pessoa Jurídica
export const cadastroPJSchema = z.object({
  nomeEmpresa: z.string()
    .trim()
    .min(3, "Nome da empresa deve ter no mínimo 3 caracteres")
    .max(100, "Nome da empresa deve ter no máximo 100 caracteres"),
  email: z.string()
    .trim()
    .email("Email inválido")
    .max(255, "Email muito longo"),
  senha: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(100, "Senha muito longa"),
  confirmarSenha: z.string(),
  cpf: z.string(),
  cnpj: z.string(),
  celular: z.string()
    .trim()
    .min(10, "Celular inválido")
    .max(20, "Celular muito longo"),
  endereco: z.string()
    .trim()
    .min(5, "Endereço muito curto")
    .max(500, "Endereço muito longo"),
  horario_funcionamento: z.string()
    .trim()
    .max(100, "Horário muito longo")
    .optional(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
}).refine((data) => {
  // Pelo menos um dos documentos deve ser preenchido
  const cpfPreenchido = data.cpf && data.cpf.trim().length > 0;
  const cnpjPreenchido = data.cnpj && data.cnpj.trim().length > 0;
  return cpfPreenchido || cnpjPreenchido;
}, {
  message: "Preencha CPF ou CNPJ",
  path: ["cnpj"],
}).refine((data) => {
  // Se CPF foi preenchido, validar
  if (data.cpf && data.cpf.trim().length > 0) {
    return validarCPF(data.cpf);
  }
  return true;
}, {
  message: "CPF inválido",
  path: ["cpf"],
}).refine((data) => {
  // Se CNPJ foi preenchido, validar
  if (data.cnpj && data.cnpj.trim().length > 0) {
    return validarCNPJ(data.cnpj);
  }
  return true;
}, {
  message: "CNPJ inválido",
  path: ["cnpj"],
});

export type CadastroPFData = z.infer<typeof cadastroPFSchema>;
export type CadastroPJData = z.infer<typeof cadastroPJSchema>;

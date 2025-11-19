import { z } from "zod";

// Validação de CPF com algoritmo de checksum
export const validarCPF = (cpf: string): boolean => {
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false; // Todos dígitos iguais
  
  let soma = 0;
  let resto;
  
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;
  
  return true;
};

// Validação de CNPJ com algoritmo de checksum
export const validarCNPJ = (cnpj: string): boolean => {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  
  if (cnpjLimpo.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false; // Todos dígitos iguais
  
  let tamanho = cnpjLimpo.length - 2;
  let numeros = cnpjLimpo.substring(0, tamanho);
  const digitos = cnpjLimpo.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpjLimpo.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  
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
  cpf: z.string()
    .optional()
    .refine((val) => !val || validarCPF(val), "CPF inválido"),
  cnpj: z.string()
    .optional()
    .refine((val) => !val || validarCNPJ(val), "CNPJ inválido"),
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
}).refine((data) => data.cpf || data.cnpj, {
  message: "Preencha CPF ou CNPJ",
  path: ["cnpj"],
});

export type CadastroPFData = z.infer<typeof cadastroPFSchema>;
export type CadastroPJData = z.infer<typeof cadastroPJSchema>;

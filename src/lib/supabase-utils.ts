import { supabase } from "@/integrations/supabase/client";

// Converter imagem BYTEA para URL Data
export function byteaToDataUrl(bytea: any, mime: string): string {
  if (!bytea) return "";
  
  // Se já é uma string base64 ou data URL
  if (typeof bytea === "string") {
    if (bytea.startsWith("data:")) return bytea;
    if (bytea.startsWith("http")) return bytea;
    return `data:${mime || "image/jpeg"};base64,${bytea}`;
  }
  
  // Se é um array de bytes
  const base64 = btoa(
    Array.from(new Uint8Array(bytea))
      .map(byte => String.fromCharCode(byte))
      .join("")
  );
  
  return `data:${mime || "image/jpeg"};base64,${base64}`;
}

// Upload de imagem para storage (opcional, para substituir BYTEA)
export async function uploadProductImage(file: File, productId: number) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${productId}_${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return publicUrl;
}

// Função auxiliar para adicionar metadata ao signup
export async function signUpWithMetadata(
  email: string,
  password: string,
  metadata: {
    nome: string;
    tipo_usuario: "comprador" | "vendedor";
    data_nasc: string;
    cpf?: string;
  }
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/`,
    },
  });

  return { data, error };
}

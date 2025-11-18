import paoArtesanal from "@/assets/pao-artesanal.jpg";
import croissants from "@/assets/croissants.jpg";
import paoQueijo from "@/assets/pao-queijo.jpg";
import boloChocolate from "@/assets/bolo-chocolate.jpg";
import tortaFrutas from "@/assets/torta-frutas.jpg";
import sanduiches from "@/assets/sanduiches.jpg";

// Mapeamento de nomes de arquivo para as imagens importadas
export const productImages: Record<string, string> = {
  "pao-artesanal.jpg": paoArtesanal,
  "croissants.jpg": croissants,
  "pao-queijo.jpg": paoQueijo,
  "bolo-chocolate.jpg": boloChocolate,
  "torta-frutas.jpg": tortaFrutas,
  "sanduiches.jpg": sanduiches,
};

// Função auxiliar para obter a URL da imagem
export const getProductImageUrl = (imageName: string | null): string => {
  console.log("getProductImageUrl recebeu:", imageName);
  
  if (!imageName) {
    return "https://images.unsplash.com/photo-1506617564039-2f3b650b7b66?w=400";
  }
  
  const url = productImages[imageName] || "https://images.unsplash.com/photo-1506617564039-2f3b650b7b66?w=400";
  console.log("Retornando URL:", url);
  
  return url;
};

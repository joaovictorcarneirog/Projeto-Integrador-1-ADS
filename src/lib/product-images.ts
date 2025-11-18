import paoArtesanal from "@/assets/pao-artesanal.jpg";
import croissants from "@/assets/croissants.jpg";
import paoQueijo from "@/assets/pao-queijo.jpg";
import boloChocolate from "@/assets/bolo-chocolate.jpg";
import tortaFrutas from "@/assets/torta-frutas.jpg";
import sanduiches from "@/assets/sanduiches.jpg";
import paoForma from "@/assets/pao-forma.jpg";

// Mapeamento de nomes de arquivo para as imagens importadas
export const productImages: Record<string, string> = {
  "pao-artesanal.jpg": paoArtesanal,
  "croissants.jpg": croissants,
  "pao-queijo.jpg": paoQueijo,
  "bolo-chocolate.jpg": boloChocolate,
  "torta-frutas.jpg": tortaFrutas,
  "sanduiches.jpg": sanduiches,
  "pao-forma.jpg": paoForma,
};

// Função auxiliar para obter a URL da imagem
export const getProductImageUrl = (imageName: string | null): string => {
  console.log("getProductImageUrl - entrada:", imageName);
  console.log("productImages disponíveis:", Object.keys(productImages));
  
  if (!imageName) {
    console.log("Sem nome de imagem, usando fallback");
    return "https://images.unsplash.com/photo-1506617564039-2f3b650b7b66?w=400";
  }
  
  const url = productImages[imageName];
  if (url) {
    console.log(`Imagem encontrada: ${imageName} -> ${url}`);
    return url;
  } else {
    console.log(`Imagem NÃO encontrada: ${imageName}, usando fallback`);
    return "https://images.unsplash.com/photo-1506617564039-2f3b650b7b66?w=400";
  }
};

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Criar usuários vendedores (padarias de Brasília)
    const padarias = [
      {
        email: "contato@panificadorabrasileira.com",
        password: "senha123",
        nome: "Panificadora Brasileira",
        cnpj: "12345678000190",
        endereco: "SCLN 204, Bloco A - Asa Norte, Brasília - DF",
        celular: "(61) 3325-4567",
        horario_funcionamento: "Seg-Sáb 6h-20h, Dom 7h-13h",
      },
      {
        email: "contato@paodeacucar.com",
        password: "senha123",
        nome: "Pão de Açúcar Artesanal",
        cnpj: "23456789000191",
        endereco: "CLN 208, Bloco C - Asa Norte, Brasília - DF",
        celular: "(61) 3274-8900",
        horario_funcionamento: "Seg-Sex 6h-21h, Sáb-Dom 7h-18h",
      },
      {
        email: "contato@padariadomercado.com",
        password: "senha123",
        nome: "Padaria do Mercado",
        cnpj: "34567890000192",
        endereco: "Feira do Guará - Guará II, Brasília - DF",
        celular: "(61) 3381-5432",
        horario_funcionamento: "Seg-Sáb 5h-19h, Dom 6h-14h",
      },
    ];

    const vendedorIds: string[] = [];

    for (const padaria of padarias) {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: padaria.email,
        password: padaria.password,
        email_confirm: true,
        user_metadata: {
          nome: padaria.nome,
          tipo_usuario: "vendedor",
          cnpj: padaria.cnpj,
          celular: padaria.celular,
          endereco: padaria.endereco,
          horario_funcionamento: padaria.horario_funcionamento,
        },
      });

      if (authError) {
        console.error(`Erro ao criar ${padaria.nome}:`, authError);
      } else if (authData.user) {
        vendedorIds.push(authData.user.id);
        console.log(`${padaria.nome} criada com sucesso!`);
      }
    }

    // Criar usuários compradores
    const compradores = [
      {
        email: "joaovictor@email.com",
        password: "senha123",
        nome: "João Victor",
        cpf: "12345678901",
        data_nasc: "1995-05-15",
        celular: "(61) 99999-1111",
        endereco: "SQS 308, Bloco A - Asa Sul, Brasília - DF",
        preferencias_alimentares: "Sem restrições",
      },
      {
        email: "maria.silva@email.com",
        password: "senha123",
        nome: "Maria Silva",
        cpf: "23456789012",
        data_nasc: "1990-08-20",
        celular: "(61) 99999-2222",
        endereco: "SQSW 104, Bloco B - Sudoeste, Brasília - DF",
        preferencias_alimentares: "Vegetariana",
      },
      {
        email: "carlos.santos@email.com",
        password: "senha123",
        nome: "Carlos Santos",
        cpf: "34567890123",
        data_nasc: "1988-03-10",
        celular: "(61) 99999-3333",
        endereco: "Rua 15, Casa 20 - Águas Claras, Brasília - DF",
        preferencias_alimentares: "Sem glúten",
      },
    ];

    for (const comprador of compradores) {
      const { error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: comprador.email,
        password: comprador.password,
        email_confirm: true,
        user_metadata: {
          nome: comprador.nome,
          tipo_usuario: "comprador",
          cpf: comprador.cpf,
          data_nasc: comprador.data_nasc,
          celular: comprador.celular,
          endereco: comprador.endereco,
          preferencias_alimentares: comprador.preferencias_alimentares,
        },
      });

      if (authError) {
        console.error(`Erro ao criar ${comprador.nome}:`, authError);
      } else {
        console.log(`${comprador.nome} criado com sucesso!`);
      }
    }

    // Aguardar um pouco para garantir que os profiles foram criados pelo trigger
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Criar produtos
    const produtos = [
      {
        nome: "Pão Artesanal de Fermentação Natural",
        descricao: "Pão de fermentação natural com casca crocante e miolo macio. Perfeito para o café da manhã!",
        preco: 8.90,
        quantidade: 15,
        data_vencimento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fk_tipo_produto_id: 1,
        imagem_url: "pao-artesanal.jpg",
      },
      {
        nome: "Croissants Franceses",
        descricao: "Croissants folhados artesanais, crocantes por fora e macios por dentro. Ideal para acompanhar café.",
        preco: 6.50,
        quantidade: 20,
        data_vencimento: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fk_tipo_produto_id: 1,
        imagem_url: "croissants.jpg",
      },
      {
        nome: "Pão de Queijo Mineiro",
        descricao: "Tradicional pão de queijo mineiro, quentinho e sequinho. Perfeito para qualquer hora!",
        preco: 12.00,
        quantidade: 25,
        data_vencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fk_tipo_produto_id: 1,
        imagem_url: "pao-queijo.jpg",
      },
      {
        nome: "Bolo de Chocolate Premium",
        descricao: "Bolo de chocolate com cobertura cremosa. Uma delícia para os amantes de chocolate!",
        preco: 25.00,
        quantidade: 8,
        data_vencimento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fk_tipo_produto_id: 1,
        imagem_url: "bolo-chocolate.jpg",
      },
      {
        nome: "Torta de Frutas Frescas",
        descricao: "Torta artesanal com frutas frescas da estação. Sobremesa leve e saborosa!",
        preco: 35.00,
        quantidade: 5,
        data_vencimento: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fk_tipo_produto_id: 1,
        imagem_url: "torta-frutas.jpg",
      },
      {
        nome: "Sanduíches Naturais",
        descricao: "Sanduíches com ingredientes frescos e pão artesanal. Opção saudável para o lanche!",
        preco: 15.00,
        quantidade: 12,
        data_vencimento: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fk_tipo_produto_id: 1,
        imagem_url: "sanduiches.jpg",
      },
    ];

    // Distribuir produtos entre os vendedores
    for (let i = 0; i < produtos.length; i++) {
      const vendedorId = vendedorIds[i % vendedorIds.length];
      const produto = produtos[i];

      const { error: produtoError } = await supabaseAdmin.from("produto").insert({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        quantidade: produto.quantidade,
        data_vencimento: produto.data_vencimento,
        fk_tipo_produto_id: produto.fk_tipo_produto_id,
        fk_vendedor_id: vendedorId,
        mime: "image/jpeg",
        imagem: produto.imagem_url,
      });

      if (produtoError) {
        console.error(`Erro ao criar produto ${produto.nome}:`, produtoError);
      } else {
        console.log(`Produto ${produto.nome} criado com sucesso!`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Dados de exemplo criados com sucesso!",
        details: {
          vendedores: vendedorIds.length,
          compradores: compradores.length,
          produtos: produtos.length,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

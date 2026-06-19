// Interfaces TypeScript centralizadas para a aplicação

export interface CategoriaData {
  id_categoria: number;
  dc_categoria: string;
}

export interface ProdutoData {
  id_produto: number;
  dc_produto: string;
  vl_produto: number;
  id_categoria: number;
}

// Rotas do Stack Navigator
export type RootStackParamList = {
  Home: undefined;
  Produtos: undefined;
  Categorias: undefined;
};

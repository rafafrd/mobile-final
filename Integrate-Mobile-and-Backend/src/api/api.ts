// Cliente HTTP para a API backend
// O servidor usa a mesma estrutura de campos do banco local (id_categoria, dc_categoria, etc.)
import { Categoria } from '../models/CategoriaModel';
import { Produto } from '../models/ProdutoModel';

// Endereço do servidor backend na rede local
// Altere para o IP da máquina que hospeda a API (ex: 'http://192.168.x.x' ou 'http://10.0.2.2' no emulador Android)
const BASE_URL = 'http://10.87.169.91:3000';

// Formato padrão de resposta da API: { recurso: T }
interface ApiResponse<T> {
  recurso: T;
}

interface CategoriaRow {
  id_categoria: number;
  dc_categoria: string;
}

interface ProdutoRow {
  id_produto: number;
  dc_produto: string;
  vl_produto: number;
  id_categoria: number;
}

// Requisição genérica com tratamento de status HTTP
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    const texto = await response.text();
    throw new Error(`Erro ${response.status}: ${texto}`);
  }

  return response.json() as Promise<T>;
}

export const categoriaApi = {
  // Retorna todas as categorias
  async getAll(): Promise<Categoria[]> {
    try {
      const data = await request<ApiResponse<CategoriaRow[]>>('/categoria');
      return data.recurso.map(Categoria.fromJSON);
    } catch (error) {
      throw new Error('Erro ao buscar categorias.');
    }
  },

  // Retorna uma categoria pelo ID
  async getById(id: number): Promise<Categoria> {
    try {
      const data = await request<ApiResponse<CategoriaRow>>(`/categoria/${id}`);
      return Categoria.fromJSON(data.recurso);
    } catch (error) {
      throw new Error('Erro ao buscar categoria.');
    }
  },

  // Cria uma nova categoria
  async create(categoria: Categoria): Promise<void> {
    try {
      await request('/categoria', {
        method: 'POST',
        body: JSON.stringify({ dc_categoria: categoria.dc_categoria }),
      });
    } catch (error) {
      throw new Error('Erro ao criar categoria.');
    }
  },

  // Atualiza uma categoria existente
  async update(categoria: Categoria): Promise<void> {
    try {
      await request(`/categoria/${categoria.id_categoria}`, {
        method: 'PUT',
        body: JSON.stringify({ dc_categoria: categoria.dc_categoria }),
      });
    } catch (error) {
      throw new Error('Erro ao atualizar categoria.');
    }
  },

  // Remove uma categoria pelo ID
  async remove(id: number): Promise<void> {
    try {
      await request(`/categoria/${id}`, { method: 'DELETE' });
    } catch (error) {
      throw new Error('Erro ao excluir categoria.');
    }
  },
};

export const produtoApi = {
  // Retorna todos os produtos
  async getAll(): Promise<Produto[]> {
    try {
      const data = await request<ApiResponse<ProdutoRow[]>>('/produto');
      return data.recurso.map(Produto.fromJSON);
    } catch (error) {
      throw new Error('Erro ao buscar produtos.');
    }
  },

  // Retorna um produto pelo ID
  async getById(id: number): Promise<Produto> {
    try {
      const data = await request<ApiResponse<ProdutoRow>>(`/produto/${id}`);
      return Produto.fromJSON(data.recurso);
    } catch (error) {
      throw new Error('Erro ao buscar produto.');
    }
  },

  // Cria um novo produto
  async create(produto: Produto): Promise<void> {
    try {
      await request('/produto', {
        method: 'POST',
        body: JSON.stringify({
          dc_produto: produto.dc_produto,
          vl_produto: produto.vl_produto,
          id_categoria: produto.id_categoria,
        }),
      });
    } catch (error) {
      throw new Error('Erro ao criar produto.');
    }
  },

  // Atualiza um produto existente
  async update(produto: Produto): Promise<void> {
    try {
      await request(`/produto/${produto.id_produto}`, {
        method: 'PUT',
        body: JSON.stringify({
          dc_produto: produto.dc_produto,
          vl_produto: produto.vl_produto,
          id_categoria: produto.id_categoria,
        }),
      });
    } catch (error) {
      throw new Error('Erro ao atualizar produto.');
    }
  },

  // Remove um produto pelo ID
  async remove(id: number): Promise<void> {
    try {
      await request(`/produto/${id}`, { method: 'DELETE' });
    } catch (error) {
      throw new Error('Erro ao excluir produto.');
    }
  },
};

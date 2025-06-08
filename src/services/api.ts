import axios from 'axios';

// Interfaces (não mudam)
export interface Filme {
  _id: string;
  titulo: string;
  disponivel: boolean;
  imagem?: string;
}
export interface Sessao {
  _id: string;
  filmeId: string;
  dataHora: string;
  sala: string;
  preco: number;
  assentosDisponiveis: number;
  filme?: Filme;
}
export interface SessaoPayload {
  filmeId: string;
  dataHora: string;
  sala: string;
  preco: number;
  assentosDisponiveis: number;
}

// MUDANÇA AQUI: A baseURL agora é apenas o domínio principal de cada serviço
const sessaoApi = axios.create({
  baseURL: import.meta.env.VITE_SESSAO_API_URL 
});
const filmeApi = axios.create({
  baseURL: import.meta.env.VITE_FILME_API_URL 
});

// Funções para interagir com as APIs
export const api = {
  // MUDANÇA AQUI: Especificamos o caminho completo '/filmes'
  getFilmes: async (): Promise<Filme[]> => {
    try {
      const response = await filmeApi.get<Filme[]>('/filmes');
      return response.data;
    } catch (error) {
        console.error("Erro ao buscar a lista de filmes.", error);
        throw error;
    }
  },
  
  // MUDANÇA AQUI: Especificamos o caminho completo '/sessoes'
  getSessoes: async (): Promise<Sessao[]> => {
    const response = await sessaoApi.get<Sessao[]>('/sessoes');
    return response.data;
  },

  createSessao: async (data: SessaoPayload): Promise<Sessao> => {
    const response = await sessaoApi.post<Sessao>('/sessoes', data);
    return response.data;
  },

  deleteSessao: async (id: string): Promise<void> => {
    await sessaoApi.delete(`/sessoes/${id}`);
  }
};
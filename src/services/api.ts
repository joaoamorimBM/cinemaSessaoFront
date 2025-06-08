import axios from 'axios';

// Interfaces para os dados
export interface Filme {
  _id: string;
  titulo: string;
  disponivel: boolean;
  imagem?: string;
}

export interface Sessao {
  _id:string;
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

// Instâncias do Axios
const sessaoApi = axios.create({
  baseURL: import.meta.env.VITE_SESSAO_API_URL
});

const filmeApi = axios.create({
  baseURL: import.meta.env.VITE_FILME_API_URL
});

// Funções para interagir com as APIs
export const api = {
  // CORREÇÃO AQUI: Usando a rota correta para buscar os filmes disponíveis
  getFilmes: async (): Promise<Filme[]> => {
    try {
      const response = await filmeApi.get<Filme[]>('/filmes/disponiveis');
      return response.data;
    } catch (error) {
        console.error("Erro ao buscar a lista de filmes disponíveis.", error);
        throw error;
    }
  },
  
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
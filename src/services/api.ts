import axios from 'axios';

// CORREÇÃO AQUI: Trocamos _id por id na interface do Filme
export interface Filme {
  id: string; // Antes era _id
  titulo: string;
  disponivel: boolean;
  imagem?: string;
}

// A interface da Sessão continua usando _id, pois é assim que seu backend de sessões a retorna.
export interface Sessao {
  _id: string;
  filmeId: string;
  dataHora: string;
  sala: string;
  preco: number;
  assentosDisponiveis: number;
  filme?: Filme;
  createdAt: string; // <-- Propriedade adicionada
  updatedAt: string; // <-- Propriedade adicionada
}

export interface SessaoPayload {
  filmeId: string;
  dataHora: string;
  sala: string;
  preco: number;
  assentosDisponiveis: number;
}

const sessaoApi = axios.create({
  baseURL: import.meta.env.VITE_SESSAO_API_URL
});
const filmeApi = axios.create({
  baseURL: import.meta.env.VITE_FILME_API_URL
});

export const api = {
  getFilmes: async (): Promise<Filme[]> => {
    const response = await filmeApi.get<Filme[]>('/filmes/disponiveis');
    return response.data;
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
import axios from 'axios';

// --- Interfaces (Tipos de Dados) ---
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

// --- Configuração das APIs ---
// A baseURL deve ser APENAS o endereço principal do serviço.
const sessaoApi = axios.create({
  baseURL: import.meta.env.VITE_SESSAO_API_URL 
});

const filmeApi = axios.create({
  baseURL: import.meta.env.VITE_FILME_API_URL 
});

// --- Funções de API ---
export const api = {
  // --- Funções da API de Filmes ---
  getFilmes: async (): Promise<Filme[]> => {
    try {
      // O caminho completo da rota é especificado aqui.
      const response = await filmeApi.get<Filme[]>('/filmes/disponiveis');
      return response.data;
    } catch (error) {
        console.error("Erro ao buscar a lista de filmes disponíveis.", error);
        throw error;
    }
  },
  
  // --- Funções da API de Sessões (CORRIGIDAS) ---
  getSessoes: async (): Promise<Sessao[]> => {
    // A rota completa é /sessoes
    const response = await sessaoApi.get<Sessao[]>('/sessoes');
    return response.data;
  },

  createSessao: async (data: SessaoPayload): Promise<Sessao> => {
    // A rota completa é /sessoes
    const response = await sessaoApi.post<Sessao>('/sessoes', data);
    return response.data;
  },

  deleteSessao: async (id: string): Promise<void> => {
    // A rota completa é /sessoes/:id
    await sessaoApi.delete(`/sessoes/${id}`);
  }
};
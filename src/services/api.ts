import axios from 'axios';

// Interface do Filme (como esperado pela API de Filmes)
export interface Filme {
  _id: string;
  titulo: string;
  disponivel: boolean;
  imagem?: string; // imagem do poster, etc.
}

// Interface da Sessão ATUALIZADA
export interface Sessao {
  _id: string;
  filmeId: string;
  dataHora: string;
  sala: string;
  preco: number;
  assentosDisponiveis: number;
  filme?: Filme; // <-- A MUDANÇA ESTÁ AQUI! O filme agora pode vir junto.
}

// DTO para criar uma nova sessão (não muda)
export interface SessaoPayload {
  filmeId: string;
  dataHora: string;
  sala: string;
  preco: number;
  assentosDisponiveis: number;
}

// Configuração das instâncias do Axios (não muda)
const sessaoApi = axios.create({
  baseURL: `${import.meta.env.VITE_SESSAO_API_URL}/sessoes`
});

const filmeApi = axios.create({
  baseURL: `${import.meta.env.VITE_FILME_API_URL}/filmes`
});

// Funções para interagir com as APIs
export const api = {
  getFilmes: async (): Promise<Filme[]> => {
    try {
      // A baseURL da filmeApi já é ".../filmes".
      // A rota para listar todos é simplesmente a raiz dessa baseURL.
      const response = await filmeApi.get<Filme[]>('/'); 
      return response.data;
    } catch (error) {
        console.error("Erro ao buscar a lista de filmes.", error);
        throw error;
    }
  },
  
  // A chamada não muda, mas o TIPO de retorno agora é a nossa nova interface Sessao
  getSessoes: async (): Promise<Sessao[]> => {
    const response = await sessaoApi.get<Sessao[]>('/');
    return response.data;
  },

  createSessao: async (data: SessaoPayload): Promise<Sessao> => {
    const response = await sessaoApi.post<Sessao>('/', data);
    return response.data;
  },

  deleteSessao: async (id: string): Promise<void> => {
    await sessaoApi.delete(`/${id}`);
  }
};
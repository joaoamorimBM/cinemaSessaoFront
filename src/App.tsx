import { useState, useEffect, useCallback } from 'react';
import { api, type Filme, type Sessao, type SessaoPayload } from './services/api';
import './App.css'; // Vamos usar App.css em vez de index.css para o estilo

function App() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<SessaoPayload, 'filmeId'>>({
    dataHora: '',
    sala: '',
    preco: 0,
    assentosDisponiveis: 0,
  });
  const [selectedFilmeId, setSelectedFilmeId] = useState<string>('');

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [filmesData, sessoesData] = await Promise.all([
        api.getFilmes(),
        api.getSessoes(),
      ]);
      
      const filmesDisponiveis = filmesData.filter(filme => filme.disponivel);
      setFilmes(filmesDisponiveis);
      setSessoes(sessoesData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())); // Ordena as sessões mais novas primeiro
      
      if (filmesDisponiveis.length > 0) {
        setSelectedFilmeId(filmesDisponiveis[0].id);
      }
    } catch (err) {
      setError('Falha ao carregar dados. Verifique se as APIs estão no ar.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'selectedFilmeId') {
      setSelectedFilmeId(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFilmeId) {
      setError('Por favor, selecione um filme.');
      return;
    }
    setLoading(true);
    setError(null);
    const payload: SessaoPayload = { ...formData, filmeId: selectedFilmeId };
    try {
      await api.createSessao(payload);
      alert('Sessão criada com sucesso!');
      loadInitialData();
    } catch (err) {
      setError('Falha ao criar sessão.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta sessão?')) return;
    setLoading(true);
    try {
      await api.deleteSessao(id);
      alert('Sessão deletada com sucesso!');
      loadInitialData();
    } catch (err) {
      setError('Falha ao deletar sessão.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Gerenciador de Sessões de Cinema</h1>
      </header>
      
      {error && <p className="error-message">{error}</p>}
      
      <main>
        <div className="form-container card">
          <h2>Criar Nova Sessão</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="selectedFilmeId">Filme</label>
              <select name="selectedFilmeId" id="selectedFilmeId" value={selectedFilmeId} onChange={handleFormChange} required>
                <option value="" disabled>Selecione um filme</option>
                {filmes.map(filme => (
                  <option key={filme.id} value={filme.id}>{filme.titulo}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="dataHora">Data e Hora</label>
              <input type="datetime-local" id="dataHora" name="dataHora" value={formData.dataHora} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="sala">Sala</label>
              <input type="text" id="sala" name="sala" value={formData.sala} onChange={handleFormChange} required placeholder="Ex: Sala 5 IMAX" />
            </div>
            <div className="form-group">
              <label htmlFor="preco">Preço</label>
              <input type="number" id="preco" name="preco" step="0.50" value={formData.preco} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="assentosDisponiveis">Assentos Disponíveis</label>
              {/* CORREÇÃO DO BUG: Adicionando o atributo value que faltava */}
              <input type="number" id="assentosDisponiveis" name="assentosDisponiveis" value={formData.assentosDisponiveis} onChange={handleFormChange} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Criando...' : 'Criar Sessão'}
            </button>
          </form>
        </div>

        <div className="list-container">
          <h2>Sessões Agendadas</h2>
          {loading && sessoes.length === 0 && <p>Carregando...</p>}
          <div className="session-list">
            {sessoes.map(sessao => (
              <div key={sessao._id} className="session-card card">
                {/* ESTRUTURA MELHORADA: Exibindo os dados de forma mais clara */}
                <div className="session-card-info">
                  <p className="filme-titulo">{sessao.filme?.titulo || `Filme (ID: ${sessao.filmeId})`}</p>
                  <p className="sala-info">Sala: {sessao.sala}</p>
                  <p className="horario-info">{new Date(sessao.dataHora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                </div>
                <button className="btn-delete" onClick={() => handleDelete(sessao._id)} disabled={loading}>Deletar</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
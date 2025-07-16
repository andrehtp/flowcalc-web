import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ResumoHidrologico } from '../components/dados/ResumoHidrologico';
import { CurvaPermanencia } from '../components/dados/CurvaPermanencia';
import { Mapa } from '../components/dados/Mapa';

// Componente principal da página de dados
export const DadosPage = () => {
  // Hooks do React Router para navegação e acesso ao estado da rota
  const location = useLocation();
  const navigate = useNavigate();

  // Estado principal dos dados recebidos via navegação
  const [dados, setDados] = useState<any>(location.state?.dados ?? null);

  // Estado para controlar qual aba está ativa no painel principal
  const [abaAtiva, setAbaAtiva] = useState<'resumo' | 'curva' | 'minima'>('resumo');
  // Estado para armazenar o nível de consistência selecionado
  const [nivelConsistencia, setNivelConsistencia] = useState<string | null>(null);
  // Estados para armazenar o intervalo de datas fixado (após filtro)
  const [dataInicioFixada, setDataInicioFixada] = useState<string | null>(null);
  const [dataFimFixada, setDataFimFixada] = useState<string | null>(null);

  // Estados para inputs controlados dos filtros
  const [nivelConsistenciaInput, setNivelConsistenciaInput] = useState<string | null>(null);
  const [dataInicioInput, setDataInicioInput] = useState<string | null>(null);
  const [dataFimInput, setDataFimInput] = useState<string | null>(null);

  // Desestruturação dos dados recebidos
  const cabecalho = dados?.cabecalho ?? {};
  const resumosMensais = dados?.resumosMensais ?? [];

  // Dados filtrados (pode ser expandido para aplicar filtros)
  const dadosFiltrados = resumosMensais;

  // Se não houver dados no estado da navegação, redireciona para a página inicial
  useEffect(() => {
    if (!location.state?.dados) {
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  // Inicializa os filtros de data e consistência ao carregar os dados
  useEffect(() => {
    if (resumosMensais.length > 0 && !dataInicioFixada && !dataFimFixada) {
      // Ordena os resumos pela data inicial
      const ordenadas = [...resumosMensais].sort((a, b) =>
        new Date(a.dataInicial).getTime() - new Date(b.dataInicial).getTime()
      );
      // Define o menor e maior dataInicial como limites do filtro
      const min = ordenadas[0].dataInicial.split('T')[0];
      const max = ordenadas[ordenadas.length - 1].dataInicial.split('T')[0];

      setDataInicioFixada(min);
      setDataFimFixada(max);

      setDataInicioInput(min);
      setDataFimInput(max);
      setNivelConsistenciaInput(nivelConsistencia);
    }
  }, [resumosMensais]);

  // Função para aplicar os filtros e buscar novos dados da API
  const handleFiltrar = () => {
    if (!cabecalho?.codigoEstacao || !dataInicioInput || !dataFimInput) return;

    const body = {
      codEstacao: cabecalho.codigoEstacao,
      dataInicio: dataInicioInput,
      dataFim: dataFimInput,
      nivelConsistencia: nivelConsistenciaInput
    };

    fetch('http://localhost:8080/api/resumo-hidrologico/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        setDados(data);
        setNivelConsistencia(nivelConsistenciaInput);
        setDataInicioFixada(dataInicioInput);
        setDataFimFixada(dataFimInput);
      })
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-2 pl-4 pr-4 pb-11">
      <div className="flex gap-6">
        {/* Coluna esquerda: filtros e informações da estação */}
        <div className="flex flex-col gap-6 w-[350px]">

          {/* Filtros */}
          <div className="bg-[#e7eaf6] rounded-lg shadow-md p-6">
            <h1 className="text-lg font-semibold mb-4">Filtros</h1>

            {/* Filtro de nível de consistência */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nível de consistência</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={nivelConsistenciaInput || ''}
                onChange={(e) => setNivelConsistenciaInput(e.target.value || null)}
              >
                <option value="">Todos</option>
                <option value="1">1 - Bruto</option>
                <option value="2">2 - Consistido</option>
              </select>
            </div>

            {/* Filtro de datas */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">De</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={dataInicioInput || ''}
                  onChange={(e) => setDataInicioInput(e.target.value)}
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Até</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={dataFimInput || ''}
                  onChange={(e) => setDataFimInput(e.target.value)}
                />
              </div>
            </div>

            {/* Botão para aplicar filtros */}
            <button
              onClick={handleFiltrar}
              className="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition"
            >
              Filtrar
            </button>
          </div>

          {/* Informações da estação */}
          <div className="bg-[#e7eaf6] rounded-lg shadow-md p-6">
            <h1 className="text-lg font-semibold mb-4">Informações da estação</h1>
            <ul className="space-y-3 text-sm text-gray-800 break-words">
              <li>Código da estação: {mostrarOuIndisponivel(cabecalho.codigoEstacao)}</li>
              <li>Nome da estação: {mostrarOuIndisponivel(cabecalho.nomeEstacao)}</li>
              <li>Estado: {mostrarOuIndisponivel(cabecalho.nomeEstado)}</li>
              <li>Cidade: {mostrarOuIndisponivel(cabecalho.nomeCidade)}</li>
              <li>Rio: {mostrarOuIndisponivel(cabecalho.nomeRio)}</li>
              <li>Bacia: {mostrarOuIndisponivel(cabecalho.codigoBacia)}</li>
              <li>Sub-bacia: {mostrarOuIndisponivel(cabecalho.codigoSubBacia)}</li>
              <li>Latitude: {mostrarOuIndisponivel(cabecalho.latitudeEstacao)}</li>
              <li>Longitude: {mostrarOuIndisponivel(cabecalho.longitudeEstacao)}</li>
              <li>Altitude: {mostrarOuIndisponivel(cabecalho.altitudeEstacao)}</li>
            </ul>
            {/* Exibe o mapa se latitude e longitude estiverem disponíveis */}
            {cabecalho.latitudeEstacao && cabecalho.longitudeEstacao &&
              <Mapa latitude={cabecalho.latitudeEstacao} longitude={cabecalho.longitudeEstacao} />}
          </div>
        </div>

        {/* Painel principal: abas de dados */}
        <div className="bg-white rounded-lg shadow-md p-6 flex-1">
          {/* Navegação entre abas */}
          <div className="flex items-center gap-6 mb-6 border-b border-gray-300">
            <button
              onClick={() => setAbaAtiva('resumo')}
              className={`text-lg font-semibold pb-2 ${abaAtiva === 'resumo' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Dados
            </button>
            <button
              onClick={() => setAbaAtiva('curva')}
              className={`text-lg font-semibold pb-2 ${abaAtiva === 'curva' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Curva de Permanência
            </button>
          </div>

          {/* Renderização condicional das abas */}
          {abaAtiva === 'resumo' && <ResumoHidrologico dados={dadosFiltrados} />}
          {abaAtiva === 'curva' && (
            <CurvaPermanencia
              codigoEstacao={cabecalho.codigoEstacao}
              dataInicio={dataInicioFixada!}
              dataFim={dataFimFixada!}
              nivelConsistencia={nivelConsistencia}
            />
          )}

        </div>
      </div>
    </div>
  );
};

// Função utilitária para exibir valor ou "Não disponível"
const mostrarOuIndisponivel = (valor?: string | number) =>
  valor !== null && valor !== undefined && String(valor).trim() !== ''
    ? valor
    : 'Não disponível';

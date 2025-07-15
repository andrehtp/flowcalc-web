import { useState, useMemo } from 'react';

// Define o tipo dos dados de cada linha do resumo hidrológico
type LinhaResumo = {
  dataInicial: string;
  resumoMensalId: number;
  vazaoMedia: number;
  vazaoMaxima: number;
  vazaoMinima: number;
  vazaoMediaReal: number;
  vazaoMaximaReal: number;
  vazaoMinimaReal: number;
  nivelConsistencia: number;
  metodoObtencao: number;
};

type ResumoHidrologicoProps = {
  dados: LinhaResumo[];
};

/**
 * Componente principal que exibe o resumo hidrológico.
 * Mostra estatísticas, tabela de dados e controles de paginação.
 */
export const ResumoHidrologico = ({ dados }: ResumoHidrologicoProps) => {
  // Estado para controlar a página atual da tabela
  const [paginaAtual, setPaginaAtual] = useState(1);

  // Quantidade de linhas por página
  const porPagina = 15;

  // Calcula o total de páginas com base na quantidade de dados
  const totalPaginas = Math.ceil(dados.length / porPagina);

  // Índice inicial dos dados da página atual
  const inicio = (paginaAtual - 1) * porPagina;

  // Seleciona apenas os dados da página atual
  const dadosPagina = dados.slice(inicio, inicio + porPagina);

  /**
   * Calcula as datas mínima e máxima do período dos dados.
   * Usa useMemo para evitar cálculos desnecessários.
   */
  const [dataMinima, dataMaxima] = useMemo(() => {
    if (!dados.length) return [null, null];

    // Ordena os dados pela data inicial
    const ordenadas = [...dados].sort(
      (a, b) =>
        new Date(a.dataInicial).getTime() - new Date(b.dataInicial).getTime()
    );

    // Retorna a primeira e a última data
    return [
      ordenadas[0].dataInicial,
      ordenadas[ordenadas.length - 1].dataInicial,
    ];
  }, [dados]);

  return (
    <div className="bg-white p-4 rounded shadow">
      {/* Título principal com o período dos dados */}
      <h2 className="text-lg font-semibold mb-4">
        Cálculos totais no período de{' '}
        <span className="font-normal">
          {formatarDataBR(dataMinima)} até {formatarDataBR(dataMaxima)}
        </span>
      </h2>

      {/* Cards estatísticos com informações resumidas */}
      <div className="grid grid-cols-2 md:grid-cols-10 gap-4 mb-6">
        <div className="bg-blue-50 rounded-md p-2 text-center shadow-sm border border-blue-100">
          <p className="text-[10px] text-gray-600">Resumos Mensais</p>
          <p className="text-base font-semibold">{dados.length > 0 ? dados.length : '-'}</p>
        </div>

        <div className="bg-blue-50 rounded-md p-2 text-center shadow-sm border border-blue-100">
          <p className="text-[10px] text-gray-600">Vazão Máxima</p>
          <p className="text-base font-semibold">
            {dados.length > 0
              ? Math.max(...dados.map((d) => d.vazaoMaxima ?? -Infinity)) !== -Infinity
                ? Math.max(...dados.map((d) => d.vazaoMaxima ?? -Infinity)).toFixed(2)
                : '-'
              : '-'}
          </p>
        </div>

        <div className="bg-blue-50 rounded-md p-2 text-center shadow-sm border border-blue-100">
          <p className="text-[10px] text-gray-600">Vazão Média</p>
          <p className="text-base font-semibold">
            {dados.length > 0
              ? (
                  dados.reduce((acc, d) => acc + (d.vazaoMedia ?? 0), 0) /
                  dados.filter((d) => d.vazaoMedia !== undefined && d.vazaoMedia !== null).length
                ).toFixed(2)
              : '-'}
          </p>
        </div>

        <div className="bg-blue-50 rounded-md p-2 text-center shadow-sm border border-blue-100">
          <p className="text-[10px] text-gray-600">Vazão Mínima</p>
          <p className="text-base font-semibold">
            {dados.length > 0
              ? Math.min(...dados.map((d) => d.vazaoMinima ?? Infinity)) !== Infinity
                ? Math.min(...dados.map((d) => d.vazaoMinima ?? Infinity)).toFixed(2)
                : '-'
              : '-'}
          </p>
        </div>

        <div className="bg-blue-50 rounded-md p-2 text-center shadow-sm border border-blue-100">
          <p className="text-[10px] text-gray-600">Relatórios</p>
          <p className="text-base font-semibold">{dados.length > 0 ? dados.length : '-'}</p>
        </div>
      </div>
      
      {/* Tabela com os dados das vazões mensais */}
      <h2 className="text-lg font-semibold mb-4">Vazões mensais</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse border">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border px-2 py-1">Data</th>
              <th className="border px-2 py-1">Média</th>
              <th className="border px-2 py-1">Máxima</th>
              <th className="border px-2 py-1">Mínima</th>
              <th className="border px-2 py-1">Média Real</th>
              <th className="border px-2 py-1">Máxima Real</th>
              <th className="border px-2 py-1">Mínima Real</th>
              <th className="border px-2 py-1">Consistência</th>
            </tr>
          </thead>
          <tbody>
            {dadosPagina.map((linha, index) => (
              <tr key={index} className="text-center">
                <td className="border px-2 py-1">
                  {formatarDataBR(linha.dataInicial)}
                </td>
                <td className="border px-2 py-1">
                  {linha.vazaoMedia !== undefined && linha.vazaoMedia !== null
                    ? linha.vazaoMedia.toFixed(2)
                    : '-'}
                </td>
                <td className="border px-2 py-1">
                  {linha.vazaoMaxima !== undefined && linha.vazaoMaxima !== null
                    ? linha.vazaoMaxima.toFixed(2)
                    : '-'}
                </td>
                <td className="border px-2 py-1">
                  {linha.vazaoMinima !== undefined && linha.vazaoMinima !== null
                    ? linha.vazaoMinima.toFixed(2)
                    : '-'}
                </td>
                <td className="border px-2 py-1">
                  {linha.vazaoMediaReal !== undefined && linha.vazaoMediaReal !== null
                    ? linha.vazaoMediaReal.toFixed(2)
                    : '-'}
                </td>
                <td className="border px-2 py-1">
                  {linha.vazaoMaximaReal !== undefined && linha.vazaoMaximaReal !== null
                    ? linha.vazaoMaximaReal.toFixed(2)
                    : '-'}
                </td>
                <td className="border px-2 py-1">
                  {linha.vazaoMinimaReal !== undefined && linha.vazaoMinimaReal !== null
                    ? linha.vazaoMinimaReal.toFixed(2)
                    : '-'}
                </td>
                <td className="border px-2 py-1">
                  {linha.nivelConsistencia ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginação para navegar entre as páginas da tabela */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <button
          onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
          disabled={paginaAtual === 1}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {paginaAtual} de {totalPaginas} ({dados?.length})
        </span>
        <button
          onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
          disabled={paginaAtual === totalPaginas}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

/**
 * Função utilitária para formatar datas ISO no padrão brasileiro (dd/mm/yyyy).
 * Retorna '-' caso a data seja nula ou inválida.
 */
const formatarDataBR = (iso: string | null) => {
  if (!iso) return '-';
  return new Intl.DateTimeFormat('pt-BR').format(new Date(iso));
};

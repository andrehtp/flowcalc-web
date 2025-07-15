import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

import { useState, useEffect, useMemo } from 'react';

export const CurvaPermanencia = ({ codigoEstacao, dataInicio, dataFim, nivelConsistencia }: {
  codigoEstacao: number,
  dataInicio: string,
  dataFim: string,
  nivelConsistencia?: string | null
}) => {
  const [tipoCurva, setTipoCurva] = useState<'empirica' | 'logaritmica'>('empirica');
  const [qPersonalizado, setQPersonalizado] = useState<string>('');
  const [vazaoPersonalizada, setVazaoPersonalizada] = useState<number | null>(null);
  const [origemDados, setOrigemDados] = useState<'mensal' | 'diaria'>('mensal');
  const [resultado, setResultado] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/curva-permanencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigoEstacao,
        dataInicio,
        dataFim,
        nivelConsistencia
      })
    })
      .then(res => res.json())
      .then(setResultado)
      .catch(console.error);
  }, [codigoEstacao, dataInicio, dataFim, nivelConsistencia]);

  const dados = origemDados === 'mensal' ? resultado?.resumoMensal : resultado?.vazaoDiaria;
  const chartData = dados?.curva ?? [];
  const qmap = useMemo(() => dados?.qmap ?? {}, [dados]);
  const classes = dados?.classes ?? [];

  useEffect(() => {
  if (resultado) {
    console.log('Resultado completo:', resultado);
    console.log('Dados usados (resumoMensal ou vazaoDiaria):', dados);
    console.log('ChartData (curva):', chartData);
    console.log('Qmap:', qmap);
    console.log('Classes logarítmicas:', classes);
  }
}, [resultado, dados, chartData, qmap, classes]);

  const q50 = dados?.q50 ?? 0;
  const q90 = dados?.q90 ?? 0;
  const q95 = dados?.q95 ?? 0;
  const q98 = dados?.q98 ?? 0;

  useEffect(() => {
    const num = Number(qPersonalizado);
    if (!isNaN(num) && num >= 1 && num <= 99) {
      setVazaoPersonalizada(qmap[num] ?? null);
    } else {
      setVazaoPersonalizada(null);
    }
  }, [qPersonalizado, qmap]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Curva de Permanência</h2>

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setTipoCurva('empirica')}
            className={`px-4 py-2 rounded ${tipoCurva === 'empirica' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Empírica
          </button>
          <button
            onClick={() => setTipoCurva('logaritmica')}
            className={`px-4 py-2 rounded ${tipoCurva === 'logaritmica' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Logarítmica
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="origemDados" className="text-sm font-medium text-gray-700">Tipo de vazão:</label>
          <select
            id="origemDados"
            value={origemDados}
            onChange={(e) => setOrigemDados(e.target.value as 'mensal' | 'diaria')}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="mensal">Resumo Mensal</option>
            <option value="diaria">Vazão Diária</option>
          </select>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-700 flex flex-wrap items-center gap-4">
        <div>
          <span className="mr-4"><strong>Q50</strong>: {q50.toFixed(2)} m³/s</span>
          <span className="mr-4"><strong>Q90</strong>: {q90.toFixed(2)} m³/s</span>
          <span className="mr-4"><strong>Q95</strong>: {q95.toFixed(2)} m³/s</span>
          <span className="mr-4"><strong>Q98</strong>: {q98.toFixed(2)} m³/s</span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="qPersonalizado" className="text-sm">QD:</label>
          <input
            id="qCustom"
            type="number"
            min={1}
            max={99}
            value={qPersonalizado}
            onChange={(e) => setQPersonalizado(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-16 text-sm"
          />
          {vazaoPersonalizada !== null && (
            <span className="text-sm text-blue-700 font-medium">
              Q{qPersonalizado}: {vazaoPersonalizada.toFixed(2)} m³/s
            </span>
          )}
        </div>
      </div>

<div className="flex gap-4">
  {/* Gráfico com largura reduzida */}
  <div className="w-3/5">
    <ResponsiveContainer width="100%" height={440}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="permanencia"
          type="number"
          domain={[0, 100]}
          label={{ value: 'Probabilidade de Permanência (%)', position: 'insideBottomRight', offset: -5 }}
        />
        <YAxis
          scale={tipoCurva === 'logaritmica' ? 'log' : 'linear'}
          domain={['auto', 'auto']}
          label={{ value: 'Vazão (m³/s)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          formatter={(value: any) => `${Number(value).toFixed(2)} m³/s`}
          labelFormatter={(label: any) => `Permanência: ${label.toFixed(1)}%`}
        />
        <Line
          type="monotone"
          dataKey="vazao"
          stroke="#3182ce"
          name="Vazão"
          dot={false}
        />
        <ReferenceLine y={q50} label="Q50" stroke="#4299e1" strokeDasharray="3 3" />
        <ReferenceLine y={q90} label="Q90" stroke="#4299e1" strokeDasharray="3 3" />
        <ReferenceLine y={q95} label="Q95" stroke="#4299e1" strokeDasharray="3 3" />
        <ReferenceLine y={q98} label="Q98" stroke="#4299e1" strokeDasharray="3 3" />
        {vazaoPersonalizada !== null && (
          <ReferenceLine
            y={vazaoPersonalizada}
            label={`Q${qPersonalizado}`}
            stroke="#e53e3e"
            strokeDasharray="4 2"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Tabela com largura maior e rolagem vertical */}
  <div className="w-2/5 max-h-[440px] overflow-y-auto border rounded-md text-xs self-start">
    <table className="min-w-full text-center">
      <thead className="bg-gray-100 sticky top-0 z-10">
        <tr>
          <th className="px-2 py-1">Classe</th>
          <th className="px-2 py-1">LI (m³/s)</th>
          <th className="px-2 py-1">LS (m³/s)</th>
          <th className="px-2 py-1">Fi</th>
          <th className="px-2 py-1">Fac</th>
        </tr>
      </thead>
      <tbody>
        {classes.map((linha: any) => (
          <tr key={linha.classe} className="border-t">
            <td className="px-2 py-1 font-medium">{linha.classe}</td>
            <td className="px-2 py-1">{linha.li.toFixed(2)}</td>
            <td className="px-2 py-1">{linha.ls.toFixed(2)}</td>
            <td className="px-2 py-1">{linha.fi}</td>
            <td className="px-2 py-1">{linha.fac}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
};

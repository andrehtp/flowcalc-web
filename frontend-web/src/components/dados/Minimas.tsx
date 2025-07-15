import { useState } from "react";

// Exemplo de meses (1 a 12)
const meses = [
  "Jan.", "Fev.", "Mar.", "Abr.", "Mai.", "Jun.",
  "Jul.", "Ago.", "Set.", "Out.", "Nov.", "Dez."
];

export const CalculoVazaoMinima = () => {
  const [mesInicio, setMesInicio] = useState(1);
  const [numDias, setNumDias] = useState(7);

  // Dados fake para tabelas (depois conectar ao backend)
  const anos = [2020, 2021, 2022];
  const tabelaSuperior = anos.map(ano => ({
    ano,
    meses: Array(12).fill(""),
    anual: "",
    minAnual: ""
  }));

  const estatisticas = [
    "Média", "Desv. padrão", "CV(%)", "Assimetria",
    "Curtose", "N", "Maior", "Menor"
  ];

  // Handlers dos botões
  const handleCalcular = () => {
    // Adicione a lógica de cálculo real aqui
    alert("Cálculo realizado (exemplo).");
  };

  const handleRecalcular = () => {
    alert("Estatística recalculada (exemplo).");
  };

  const handleRelatorio = () => {
    alert("Relatório gerado (exemplo).");
  };

  const handleAdotar = () => {
    alert("Valores adotados (exemplo).");
  };

  return (
    <div className="flex gap-6">
      {/* Coluna de opções */}
      <div className="w-[260px] flex flex-col gap-8">
        <div className="bg-[#f4f6fa] rounded-lg shadow p-4">
          <h2 className="text-base font-semibold mb-2">Opções</h2>
          <div className="mb-4">
            <label className="block text-xs mb-1 font-medium">Início do ano hidrológico</label>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs">Mês</span>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-xs"
                value={mesInicio}
                onChange={e => setMesInicio(Number(e.target.value))}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">Nº de dias</span>
              <input
                type="number"
                min={1}
                max={31}
                className="border border-gray-300 rounded px-2 py-1 text-xs w-14"
                value={numDias}
                onChange={e => setNumDias(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCalcular}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 text-sm transition"
          >
            <span className="material-icons">calculate</span>
            Calcular
          </button>
          <button
            onClick={handleRecalcular}
            className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded px-4 py-2 text-sm transition"
          >
            <span className="material-icons">analytics</span>
            Recalcular estatística
          </button>
          <button
            onClick={handleRelatorio}
            className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded px-4 py-2 text-sm transition"
          >
            <span className="material-icons">description</span>
            Relatório *.txt
          </button>
          <button
            onClick={handleAdotar}
            className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded px-4 py-2 text-sm transition"
          >
            <span className="material-icons">waves</span>
            Adotar
          </button>
        </div>
      </div>

      {/* Painel de tabelas */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Tabela principal (superior) */}
        <div className="overflow-auto">
          <table className="min-w-full bg-white border rounded text-xs shadow">
            <thead>
              <tr>
                <th className="border px-2 py-1 font-semibold">Ano</th>
                {meses.map(mes => (
                  <th key={mes} className="border px-2 py-1 font-semibold">{mes}</th>
                ))}
                <th className="border px-2 py-1 font-semibold">Anual</th>
                <th className="border px-2 py-1 font-semibold">Min Anual</th>
              </tr>
            </thead>
            <tbody>
              {tabelaSuperior.map(linha => (
                <tr key={linha.ano}>
                  <td className="border px-2 py-1 text-center">{linha.ano}</td>
                  {linha.meses.map((valor, i) => (
                    <td key={i} className="border px-2 py-1"></td>
                  ))}
                  <td className="border px-2 py-1"></td>
                  <td className="border px-2 py-1"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabela estatística (inferior) */}
        <div className="overflow-auto">
          <table className="min-w-full bg-white border rounded text-xs shadow">
            <thead>
              <tr>
                <th className="border px-2 py-1 font-semibold">Ano</th>
                {meses.map(mes => (
                  <th key={mes} className="border px-2 py-1 font-semibold">{mes}</th>
                ))}
                <th className="border px-2 py-1 font-semibold">Ano civ</th>
                <th className="border px-2 py-1 font-semibold">Ano hid</th>
              </tr>
            </thead>
            <tbody>
              {estatisticas.map(label => (
                <tr key={label}>
                  <td className="border px-2 py-1 font-semibold">{label}</td>
                  {Array(12 + 2).fill("").map((_, i) => (
                    <td key={i} className="border px-2 py-1"></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
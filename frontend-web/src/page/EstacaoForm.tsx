import React, { useState, useRef } from 'react';
import { validateCodigo, validateData } from '../components/Validation';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';


const DISABLE_CAPTCHA = false; // Desabilita o reCAPTCHA para desenvolvimento



// Componente principal do formulário de consulta de estação
export const EstacaoForm = () => {
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Estados para os campos do formulário
  const [codigo, setCodigo] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');

  // Estados para mensagens de erro
  const [codigoError, setCodigoError] = useState('');
  const [inicioError, setInicioError] = useState('');
  const [fimError, setFimError] = useState('');
  const [codigoServerError, setCodigoServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // Função chamada ao submeter o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setCodigoServerError('');
    setLoading(true);

    // Validação dos campos
    const codigoMsg = validateCodigo(codigo);
    const inicioMsg = validateData(inicio);
    const fimMsg = validateData(fim);

    setCodigoError(codigoMsg);
    setInicioError(inicioMsg);
    setFimError(fimMsg);

    // Se houver erro de validação ou captcha não preenchido, interrompe
    if (codigoMsg || inicioMsg || fimMsg || (!DISABLE_CAPTCHA && !captchaToken)) {
      setLoading(false);
      return;
    }

    // Monta o corpo da requisição
    const body = {
      codEstacao: codigo.trim(),
      captchaToken,
      ...(inicio ? { dataInicio: inicio } : {}),
      ...(fim ? { dataFim: fim } : {}),
    };

    try {
      // Faz a requisição para o backend
      const response = await fetch('http://localhost:8080/api/consulta-estacao/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const responseText = await response.text();

      // Trata erros de resposta
      if (!response.ok) {
        setCodigoServerError(responseText || `Erro ${response.status}`);
        return;
      }

      if (!responseText) {
        setCodigoServerError('Resposta vazia do servidor.');
        return;
      }

      // Converte resposta em JSON e navega para a página de dados
      const data = JSON.parse(responseText);
      navigate('/dados-estacao', { state: { dados: data } });

    } catch (error) {
      // Trata erro de conexão
      console.error('Erro ao consultar estação:', error);
      setCodigoServerError('Erro na conexão com o servidor.');
    } finally {
      setLoading(false);
      setCaptchaToken(null);
      recaptchaRef.current?.reset(); // Reseta o CAPTCHA para renovar o token
    }
  };

  return (
    // Formulário principal
    <form
      onSubmit={handleSubmit}
      className="bg-[#e7eaf6] px-10 py-12 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-6"
    >
      {/* Campo de código da estação */}
      <div className="w-full">
        <label className="block font-medium mb-1">Código da Estação</label>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="w-full p-2 rounded border focus:outline-none"
          placeholder="Digite o código da estação"
        />
        {/* Mensagem de erro de validação do código */}
        {codigoError && <p className="text-red-600 text-sm mt-1">{codigoError}</p>}
        {/* Mensagem de erro do servidor */}
        {codigoServerError && <p className="text-red-600 text-sm mt-1">{codigoServerError}</p>}
      </div>

      {/* Campos de data de início e fim */}
      <div className="w-full flex gap-2">
        {/* Campo de data de início */}
        <div className="flex flex-col w-full">
          <label className="mb-1">De</label>
          <input
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className="p-2 rounded border focus:outline-none"
          />
          {/* Mensagem de erro de validação da data de início */}
          {inicioError && <p className="text-red-600 text-sm mt-1">{inicioError}</p>}
        </div>
        {/* Campo de data de fim */}
        <div className="flex flex-col w-full">
          <label className="mb-1">Até</label>
          <input
            type="date"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            className="p-2 rounded border focus:outline-none"
          />
          {/* Mensagem de erro de validação da data de fim */}
          {fimError && <p className="text-red-600 text-sm mt-1">{fimError}</p>}
        </div>
      </div>

      {/* Componente do reCAPTCHA */}
      <div className="w-full flex justify-center">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6LecjlErAAAAAKlGETnss4t4EVWpORF5TxE_u5S7"
          onChange={(token) => setCaptchaToken(token)}
          onExpired={() => setCaptchaToken(null)}
          size="normal"
        />
      </div>

      {/* Botão de submit, mostra loading se estiver carregando */}
      <button
        type="submit"
        disabled={loading || (!DISABLE_CAPTCHA && !captchaToken)}
        className={`flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded ${
          loading || (!DISABLE_CAPTCHA && !captchaToken) ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {/* Ícone de loading animado */}
        {loading ? (
          <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z" />
          </svg>
        ) : null}
        {/* Texto do botão muda conforme loading */}
        {loading ? 'Consultando...' : 'Consultar'}
      </button>
    </form>
  );
};

export const validateCodigo = (codigo: string) => {
  const cleaned = codigo.trim();
  const regex = /^\d{8}$/;
  if (!regex.test(cleaned)) {
    return 'O código deve conter exatamente 8 dígitos numéricos.';
  }
  return '';
};

export const validateData = (data: string) => {
  if (!data || data.trim() === '') return '';
  const regex = /^\d{4}-\d{2}-\d{2}$/; // formato yyyy-MM-dd
  if (!regex.test(data)) {
    return 'Data inválida. Use o formato válido de data.';
  }
  return '';
};
export const normalizeText = (text: string) => {
  if (!text) return '';
  return text
    .normalize('NFD') // Descompone los acentos
    .replace(/[\u0300-\u036f]/g, '') // Elimina los diacríticos
    .toLowerCase(); // Pasa todo a minúsculas
};

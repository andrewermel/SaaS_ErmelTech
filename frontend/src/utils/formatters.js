/**
 * Formata valor para moeda brasileira (BRL)
 * @param {string|number} value - Valor a ser formatado
 * @param {number} decimals - Número de casas decimais (padrão: 2)
 * @returns {string} - Valor formatado (ex: "1.234,56")
 */
export const formatCurrency = (value, decimals = 2) => {
  const num =
    typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0,00';

  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Formata peso em gramas, convertendo para kg quando >= 1000g
 * @param {number} weightG - Peso em gramas
 * @returns {string} - Peso formatado (ex: "150g" ou "1,5kg")
 */
export const formatWeight = weightG => {
  if (weightG >= 1000) {
    const kg = weightG / 1000;
    return `${kg.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}kg`;
  }
  return `${weightG}g`;
};

/**
 * Formata custo por grama
 * @param {number} cost - Custo total
 * @param {number} weightG - Peso em gramas
 * @returns {string} - Custo por grama formatado
 */
export const formatCostPerGram = (cost, weightG) => {
  if (weightG === 0) return '0,0000';
  const costPerG = cost / weightG;
  return formatCurrency(costPerG, 4);
};

export function formatCurrency(value) {
  return Number(value || 0).toLocaleString('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 });
}
export function formatPercent(value) {
  return `${(Number(value || 0) * 100).toFixed(2)}%`;
}
export function formatNumber(value) {
  const num = Number(value || 0);
  return Number.isInteger(num) ? `${num}` : num.toFixed(2);
}

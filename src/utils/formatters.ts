export function formatKRW(amount: number, showSign: boolean = false): string {
  const absFormatted = Math.abs(amount).toLocaleString('ko-KR') + '원';
  if (showSign) {
    if (amount > 0) return `+${absFormatted}`;
    if (amount < 0) return `-${absFormatted}`;
    return `0원`;
  }
  return amount < 0 ? `-${absFormatted}` : absFormatted;
}

export function formatPercent(val: number): string {
  return `${val.toFixed(1).replace(/\.0$/, '')}%`;
}

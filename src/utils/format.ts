export function formatScore(score: number): string {
    if(score >= 1000000) return (score / 1000000).toFixed(2) + 'M';
    if(score >= 1000) return (score / 1000).toFixed(0) + 'K';
    return score.toString();
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
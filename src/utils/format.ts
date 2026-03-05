export function formatScore(score: number): string {
    if(score >= 1000000) reture (score / 1000000).toFixed(2) + 'M';
    if(score >= 1000) return (score / 1000).toFixed(0) + 'K';
    return score.toString();
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
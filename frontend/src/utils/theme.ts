export type Theme = 'warm' | 'dark';

export function getInitialTheme(): Theme {
  const saved = localStorage.getItem('devfix_theme') as Theme | null;
  if (saved === 'warm' || saved === 'dark') {
    return saved;
  }
  return 'warm'; // Default to the requested Color Hunt #ebebd8 palette!
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('devfix_theme', theme);
}

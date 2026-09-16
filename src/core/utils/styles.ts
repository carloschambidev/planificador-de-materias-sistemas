export function getProgressColor(percentage: number): { 
  bgClass: string; 
  textClass: string; 
  borderClass: string; 
} {
  if (percentage <= 0) {
    return {
      bgClass: 'bg-transparent',
      textClass: 'text-slate-400',
      borderClass: 'border-slate-300 dark:border-slate-700'
    };
  }
  if (percentage <= 15) {
    return {
      bgClass: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]',
      textClass: 'text-red-500',
      borderClass: 'border-red-500'
    };
  }
  if (percentage <= 25) {
    return {
      bgClass: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]',
      textClass: 'text-orange-500',
      borderClass: 'border-orange-500'
    };
  }
  if (percentage <= 50) {
    return {
      bgClass: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
      textClass: 'text-amber-400',
      borderClass: 'border-amber-400'
    };
  }
  if (percentage <= 75) {
    return {
      bgClass: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]',
      textClass: 'text-cyan-400',
      borderClass: 'border-cyan-400'
    };
  }
  if (percentage <= 99) {
    return {
      bgClass: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]',
      textClass: 'text-blue-500',
      borderClass: 'border-blue-500'
    };
  }
  
  return {
    bgClass: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]',
    textClass: 'text-emerald-500',
    borderClass: 'border-emerald-500'
  };
}

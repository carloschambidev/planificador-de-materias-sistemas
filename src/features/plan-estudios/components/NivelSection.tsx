// ============================================================
// COMPONENTE: NivelSection
// Sección con el título del nivel y grid de tarjetas
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { MateriaCompleta } from '../../../core/types';
import { NIVELES_NOMBRES } from '../../../core/types';
import { MateriaCard } from './MateriaCard';
import { getProgressColor } from '../../../core/utils/styles';

interface Props {
  nivel: number;
  materias: MateriaCompleta[];
  onClickMateria: (materia: MateriaCompleta) => void;
}

const getBorderColor = (nivel: number) => {
  switch (nivel) {
    case 1: return 'border-t-blue-500 dark:border-t-blue-400';
    case 2: return 'border-t-emerald-500 dark:border-t-emerald-400';
    case 3: return 'border-t-amber-500 dark:border-t-amber-400';
    case 4: return 'border-t-fuchsia-500 dark:border-t-fuchsia-400';
    case 5: return 'border-t-rose-500 dark:border-t-rose-500';
    default: return 'border-t-slate-500 dark:border-t-slate-400';
  }
};

const getPillHoverColor = (nivel: number) => {
  switch (nivel) {
    case 1: return 'group-hover:bg-blue-500 dark:group-hover:bg-blue-400';
    case 2: return 'group-hover:bg-emerald-500 dark:group-hover:bg-emerald-400';
    case 3: return 'group-hover:bg-amber-500 dark:group-hover:bg-amber-400';
    case 4: return 'group-hover:bg-fuchsia-500 dark:group-hover:bg-fuchsia-400';
    case 5: return 'group-hover:bg-rose-500 dark:group-hover:bg-rose-500';
    default: return 'group-hover:bg-slate-500 dark:group-hover:bg-slate-400';
  }
};

export function NivelSection({ nivel, materias, onClickMateria }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const aprobadas = materias.filter(
    (m) => m.estadoDinamico.estado === 'aprobada' || m.estadoDinamico.estado === 'promocionada'
  ).length;
  const total = materias.length;
  const porcentaje = total > 0 ? (aprobadas / total) * 100 : 0;

  const { bgClass } = getProgressColor(porcentaje);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl border border-border bg-surface p-5 shadow-sm border-t-2 overflow-hidden ${getBorderColor(nivel)}`}
    >
      {/* Encabezado del nivel */}
      <div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 cursor-pointer select-none group focus:outline-none w-full"
        onClick={() => setIsExpanded(!isExpanded)}
        tabIndex={0}
      >
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-8 rounded-full bg-border-sutil transition-colors ${getPillHoverColor(nivel)}`} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-primary">
                  {NIVELES_NOMBRES[nivel]}
                </h2>
                <ChevronDown 
                  size={18} 
                  className={`text-muted transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                />
              </div>
              <p className="text-xs text-muted">
                {aprobadas}/{total} completadas
              </p>
            </div>
          </div>
        </div>

        {/* Mini barra de progreso del nivel */}
        <div className="flex items-center gap-3 w-full sm:w-auto pl-4 sm:pl-0 mt-1 sm:mt-0">
          <div className="flex-1 sm:flex-none sm:w-24 h-2 bg-slate-200 dark:bg-[#1a1a24] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${porcentaje}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${bgClass}`}
            />
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 w-8 text-right">
            {Math.round(porcentaje)}%
          </span>
        </div>
      </div>

      {/* Grid de materias */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[5000px] opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {materias.map((materia, i) => (
            <motion.div
              key={materia.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <MateriaCard
                materia={materia}
                onClick={() => onClickMateria(materia)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ============================================================
// COMPONENTE: NivelSection
// Sección con el título del nivel y grid de tarjetas
// ============================================================

import { motion } from 'framer-motion';
import { MateriaCard } from './MateriaCard';
import type { MateriaCompleta } from '../types';
import { NIVELES_NOMBRES } from '../types';

interface Props {
  nivel: number;
  materias: MateriaCompleta[];
  onClickMateria: (materia: MateriaCompleta) => void;
}

const NIVEL_COLORS: Record<number, { bg: string; border: string; text: string; accent: string }> = {
  1: { bg: 'from-violet-900/20 to-transparent', border: 'border-violet-800/30', text: 'text-violet-300', accent: 'bg-violet-500' },
  2: { bg: 'from-blue-900/20 to-transparent', border: 'border-blue-800/30', text: 'text-blue-300', accent: 'bg-blue-500' },
  3: { bg: 'from-cyan-900/20 to-transparent', border: 'border-cyan-800/30', text: 'text-cyan-300', accent: 'bg-cyan-500' },
  4: { bg: 'from-emerald-900/20 to-transparent', border: 'border-emerald-800/30', text: 'text-emerald-300', accent: 'bg-emerald-500' },
  5: { bg: 'from-amber-900/20 to-transparent', border: 'border-amber-800/30', text: 'text-amber-300', accent: 'bg-amber-500' },
};

export function NivelSection({ nivel, materias, onClickMateria }: Props) {
  const colors = NIVEL_COLORS[nivel] ?? NIVEL_COLORS[1];
  const aprobadas = materias.filter(
    (m) => m.estadoDinamico.estado === 'aprobada' || m.estadoDinamico.estado === 'promocionada'
  ).length;
  const total = materias.length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl border ${colors.border} bg-gradient-to-b ${colors.bg} p-5`}
    >
      {/* Encabezado del nivel */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-8 rounded-full ${colors.accent}`} />
          <div>
            <h2 className={`text-lg font-bold ${colors.text}`}>
              {NIVELES_NOMBRES[nivel]}
            </h2>
            <p className="text-xs text-gray-500">
              {aprobadas}/{total} completadas
            </p>
          </div>
        </div>

        {/* Mini barra de progreso del nivel */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(aprobadas / total) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${colors.accent}`}
            />
          </div>
          <span className={`text-xs font-mono font-semibold ${colors.text}`}>
            {Math.round((aprobadas / total) * 100)}%
          </span>
        </div>
      </div>

      {/* Grid de materias */}
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
    </motion.section>
  );
}

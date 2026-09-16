// ============================================================
// COMPONENTE: MateriaCard
// Tarjeta individual para cada materia del plan de estudios
// ============================================================

import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Clock, Star, Check, Diamond, CircleDot, Circle, Lock } from 'lucide-react';
import type { MateriaCompleta } from "../../../core/types";
import { ESTADO_CONFIG, BLOQUEADA_CONFIG } from "../../../core/types";
import { getMateriaById } from "../../../core/data/materias";

function formatCorrelativasLista(ids: string[], maxVisible = 3): string {
  if (!ids || ids.length === 0) return '';
  const codigos = ids.map((id) => getMateriaById(id)?.codigo ?? id.toUpperCase());
  if (codigos.length <= maxVisible) {
    return codigos.join(', ');
  }
  const visibles = codigos.slice(0, maxVisible).join(', ');
  const restantes = codigos.length - maxVisible;
  const textoMaterias = restantes === 1 ? 'materia' : 'materias';
  return `${visibles}... (+${restantes} ${textoMaterias})`;
}

interface Props {
  materia: MateriaCompleta;
  onClick: () => void;
}

export function MateriaCard({ materia, onClick }: Props) {
  const { estadoDinamico, estaBloqueada, motivoBloqueo } = materia;
  const estado = estadoDinamico.estado;
  const cfg = estaBloqueada ? BLOQUEADA_CONFIG : ESTADO_CONFIG[estado];

  let iconElement = <Circle size={18} className="text-slate-500" />;
  let badgeColorClass = '';
  let hoverClass = estaBloqueada ? 'opacity-60 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-white/[0.05] cursor-pointer';

  if (estaBloqueada) {
    iconElement = <Lock size={18} className="text-amber-600 drop-shadow-none dark:text-amber-500/80" />;
    badgeColorClass = 'bg-zinc-100 border border-zinc-300 text-zinc-500 dark:bg-zinc-900/50 dark:border-zinc-700/50 dark:text-zinc-500';
  } else {
    switch (estado) {
      case 'promocionada':
        iconElement = <Star size={18} className="text-fuchsia-500 fill-fuchsia-500 drop-shadow-none dark:text-fuchsia-400 dark:fill-fuchsia-400 dark:drop-shadow-[0_0_10px_rgba(232,121,249,0.8)]" />;
        badgeColorClass = 'bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-700 drop-shadow-none dark:bg-fuchsia-500/10 dark:border-fuchsia-500/50 dark:text-fuchsia-400 dark:drop-shadow-[0_0_8px_rgba(232,121,249,0.3)]';
        break;
      case 'aprobada':
        iconElement = <Check size={18} strokeWidth={3} className="text-emerald-500 drop-shadow-none dark:text-emerald-400 dark:drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />;
        badgeColorClass = 'bg-emerald-50 border border-emerald-200 text-emerald-700 drop-shadow-none dark:bg-emerald-500/10 dark:border-emerald-500/50 dark:text-emerald-400 dark:drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]';
        break;
      case 'regularizada':
        iconElement = <Diamond size={18} className="text-amber-500 fill-amber-500 drop-shadow-none dark:text-amber-400 dark:fill-amber-400 dark:drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />;
        badgeColorClass = 'bg-amber-50 border border-amber-200 text-amber-700 drop-shadow-none dark:bg-amber-500/10 dark:border-amber-500/50 dark:text-amber-400 dark:drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]';
        break;
      case 'cursando':
        iconElement = <CircleDot size={18} className="text-cyan-500 drop-shadow-none dark:text-cyan-400 dark:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />;
        badgeColorClass = 'bg-cyan-50 border border-cyan-200 text-cyan-700 drop-shadow-none dark:bg-cyan-500/10 dark:border-cyan-500/50 dark:text-cyan-400 dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]';
        break;
      case 'no-iniciada':
      default:
        iconElement = <Circle size={18} className="text-slate-400 drop-shadow-none dark:text-slate-500" />;
        badgeColorClass = 'bg-slate-50 border border-slate-200 text-slate-600 dark:bg-slate-400/10 dark:border-slate-500/30 dark:text-slate-400';
        break;
    }
  }
  return (
    <motion.div
      whileHover={estaBloqueada ? {} : { y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative h-full flex flex-col gap-2 p-4 bg-white dark:bg-white/[0.03] dark:backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-sm dark:shadow-none transition-colors duration-200 ${hoverClass}`}
    >
      <div className="absolute top-4 right-4">
        {iconElement}
      </div>
      {/* Bloque Superior (Header e Info) */}
      <div className="flex-grow flex flex-col gap-2">
        {/* Indicador de estado */}
        <div className="flex items-start justify-between gap-2">
          <span
            className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-700 text-white dark:bg-slate-400 dark:text-slate-900 dark:font-semibold"
          >
            {materia.codigo}
          </span>
        </div>

        {/* Nombre */}
        <div className="flex items-center gap-2">
          <h3
            className={`text-sm leading-tight font-semibold pr-4 ${
              estaBloqueada ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {materia.nombre}
          </h3>
        </div>

        {/* Correlatividades requeridas (con truncado a 3 elementos) y requisitos adicionales */}
        {(materia.regularizadasRequeridas.length > 0 || materia.aprobadasRequeridas.length > 0 || materia.requisitoAdicional) && (
          <div className="text-[11px] space-y-0.5 border-t border-slate-100 dark:border-white/5 pt-1.5 my-0.5">
            {materia.regularizadasRequeridas.length > 0 && (
              <p
                className="leading-tight truncate text-slate-500 dark:text-slate-400"
                title={`Regularizadas: ${materia.regularizadasRequeridas
                  .map((id) => getMateriaById(id)?.codigo ?? id)
                  .join(', ')}`}
              >
                <span className="font-semibold text-status-regularized">Reg:</span>{' '}
                {formatCorrelativasLista(materia.regularizadasRequeridas, 3)}
              </p>
            )}
            {materia.aprobadasRequeridas.length > 0 && (
              <p
                className="leading-tight truncate text-slate-500 dark:text-slate-400"
                title={`Aprobadas: ${materia.aprobadasRequeridas
                  .map((id) => getMateriaById(id)?.codigo ?? id)
                  .join(', ')}`}
              >
                <span className="font-semibold text-status-approved">Apr:</span>{' '}
                {formatCorrelativasLista(materia.aprobadasRequeridas, 3)}
              </p>
            )}
            {materia.requisitoAdicional && (
              <p
                className="leading-tight text-status-promoted font-medium italic line-clamp-2 mt-0.5"
                title={materia.requisitoAdicional}
              >
                <span className="font-semibold text-status-promoted">★ Para aprobar:</span> Todas las materias del plan (sin electivas)
              </p>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Clock size={11} />
            {(materia.estadoDinamico.duracionPersonalizada ?? materia.duracion) === 'anual'
              ? 'Anual'
              : 'Cuatrimestral'}
          </span>
          {materia.esElectiva && (
            <span className="flex items-center gap-1 text-xs text-indigo-500 dark:text-indigo-400">
              <BookOpen size={11} />
              Electiva
            </span>
          )}
        </div>
      </div>

      {/* Bloque Inferior (Footer de Estado) */}
      <div className="mt-auto flex flex-col gap-1">
        {/* Badge de estado */}
        <div className="flex items-center justify-between mt-1">
          <span
            className={`uppercase text-xs font-bold tracking-wider px-3 py-1.5 rounded-md ${badgeColorClass}`}
          >
            {estaBloqueada ? 'Bloqueada' : cfg.label}
          </span>
          <ChevronRight
            size={14}
            className="text-slate-400 dark:text-slate-500"
          />
        </div>

        {/* Tooltip de bloqueo */}
        {estaBloqueada && motivoBloqueo.length > 0 && (
          <div className="mt-1 text-xs text-gray-600 italic line-clamp-2">
            {motivoBloqueo[0]}
            {motivoBloqueo.length > 1 && ` +${motivoBloqueo.length - 1} más`}
          </div>
        )}
      </div>

    </motion.div>
  );
}

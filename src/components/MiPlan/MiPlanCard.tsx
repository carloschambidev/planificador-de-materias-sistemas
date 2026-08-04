// ============================================================
// COMPONENTE: MiPlanCard
// Tarjeta arrastrable para el Catálogo Horizontal y el Tablero de Mi Plan (con distintivo Anual/Cuatrim.)
// ============================================================

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Clock, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import type { MateriaCompleta } from '../../types';
import type { AlertaCorrelativa } from '../../hooks/usePlanificador';

interface Props {
  materia: MateriaCompleta;
  enTablero?: boolean;
  alertaCorrelativa?: AlertaCorrelativa;
  onRemove?: () => void;
}

export function MiPlanCard({
  materia,
  enTablero = false,
  alertaCorrelativa,
  onRemove,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: materia.id,
    data: {
      materia,
      fromBoard: enTablero,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const estaBloqueadaHoy = materia.estaBloqueada;
  const tieneAlertaFutura = alertaCorrelativa?.faltaCorrelativa;
  const duracionEfectiva =
    materia.estadoDinamico.duracionPersonalizada ?? materia.duracion;

  // Estética contrastante: Catálogo superior oscuro vs Tablero global con tono más claro
  let borderClass = 'border-gray-800 hover:border-gray-700';
  let bgClass = 'bg-gray-900/90';
  let containerWidthClass = enTablero ? 'w-full' : 'w-64 shrink-0 min-h-[115px] flex flex-col justify-between';

  if (!enTablero) {
    // Estilo en Catálogo Superior (Oscuro, destacado con esmeralda o pizarra)
    if (!estaBloqueadaHoy) {
      borderClass = 'border-emerald-500/40 hover:border-emerald-400/80';
      bgClass = 'bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950/30';
    } else {
      borderClass = 'border-gray-800/80 hover:border-gray-700/80';
      bgClass = 'bg-gray-950/80 opacity-85';
    }
  } else {
    // Estilo en Tablero Global (Más claro y diferenciable - Slate 800)
    if (tieneAlertaFutura) {
      borderClass = 'border-amber-500/70 hover:border-amber-400';
      bgClass = 'bg-gradient-to-r from-slate-800 via-slate-800 to-amber-950/40';
    } else {
      borderClass = 'border-slate-600/80 hover:border-indigo-400/80';
      bgClass = 'bg-slate-800/95 hover:bg-slate-800';
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative group rounded-xl border ${borderClass} ${bgClass} ${containerWidthClass} p-3 shadow-md hover:shadow-xl transition-all cursor-grab active:cursor-grabbing select-none`}
    >
      <div>
        {/* Cabecera de la tarjeta */}
        <div className="flex items-center justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-gray-950 text-gray-200 border border-gray-700/60">
              {materia.codigo}
            </span>
            {!enTablero && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/40">
                Niv. {materia.nivel}
              </span>
            )}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                duracionEfectiva === 'anual'
                  ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                  : 'bg-sky-950/60 text-sky-300 border-sky-500/40'
              }`}
              title={
                duracionEfectiva === 'anual'
                  ? 'Materia Anual · Solo puede ubicarse en "Materias Anuales"'
                  : 'Materia Cuatrimestral · Solo puede ubicarse en 1º o 2º Cuatrimestre'
              }
            >
              {duracionEfectiva === 'anual' ? 'Anual' : 'Cuatrim.'}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 px-1.5 py-0.5 rounded bg-gray-950/60 border border-gray-800/60">
              <Clock size={10} />
              {materia.horas}
            </span>
          </div>

          {/* Botón para quitar del tablero */}
          {enTablero && onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1 rounded-lg bg-slate-900/80 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
              title="Quitar materia de Mi Plan"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Nombre de la Materia */}
        <h4 className="text-xs sm:text-sm font-semibold text-white leading-snug group-hover:text-indigo-200 transition-colors">
          {materia.nombre}
        </h4>
      </div>

      {/* Pie en Catálogo: Insignia Disponible / Pendiente */}
      {!enTablero && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800/70">
          {!estaBloqueadaHoy ? (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
              title="Correlatividades actuales cumplidas · Disponible"
            >
              <CheckCircle2 size={11} />
              Disponible
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-900 text-gray-400 border border-gray-800"
              title={`Bloqueada (${materia.motivoBloqueo.length} requisitos pendientes)`}
            >
              Pendiente
            </span>
          )}
          <span className="text-[10px] text-gray-500 italic">
            Arrastrar ↓
          </span>
        </div>
      )}

      {/* Insignia de correlatividad predictiva en Tablero */}
      {enTablero && alertaCorrelativa && alertaCorrelativa.faltaCorrelativa && (
        <div className="mt-2.5 pt-2 border-t border-amber-500/20 flex items-start gap-1.5 text-[10px] sm:text-[11px] font-medium text-amber-300">
          <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-400" />
          <span className="leading-tight">
            {alertaCorrelativa.motivos.join(' · ')}
          </span>
        </div>
      )}
    </div>
  );
}

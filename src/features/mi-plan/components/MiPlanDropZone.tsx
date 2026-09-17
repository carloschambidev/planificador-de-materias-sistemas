// ============================================================
// COMPONENTE: MiPlanDropZone
// Zona de asignación por período (Anual, 1C, 2C) minimalista
// ============================================================

import { X, ChevronDown } from 'lucide-react';
import type { MateriaCompleta, PeriodoPlan } from "../../../core/types";
import type { AlertaCorrelativa, TermometroConfig } from "../../../features/mi-plan/hooks/usePlanificador";

interface Props {
  anio: number;
  periodo: PeriodoPlan;
  items: MateriaCompleta[];
  termometro: TermometroConfig;
  materiaSeleccionada: MateriaCompleta | null;
  getAlertaCorrelativas: (idMateria: string, anio: number, periodo: PeriodoPlan) => AlertaCorrelativa;
  onSelectMateria: (materia: MateriaCompleta) => void;
  onAsignarMateria: (idMateria: string, anio: number, periodo: PeriodoPlan) => void;
  onRemoveMateria: (idMateria: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const PERIODO_LABEL: Record<PeriodoPlan, string> = {
  Anual: 'Materias Anuales',
  '1C': '1º Cuatrimestre',
  '2C': '2º Cuatrimestre',
};

export function MiPlanDropZone({
  anio,
  periodo,
  items,
  materiaSeleccionada,
  getAlertaCorrelativas,
  onSelectMateria,
  onAsignarMateria,
  onRemoveMateria,
  isCollapsed,
  onToggle,
}: Props) {
  const duracionEfectiva = materiaSeleccionada
    ? (materiaSeleccionada.estadoDinamico.duracionPersonalizada ?? materiaSeleccionada.duracion)
    : undefined;

  const esInvalido =
    Boolean(materiaSeleccionada) &&
    ((periodo === 'Anual' && duracionEfectiva === 'cuatrimestral') ||
     (periodo !== 'Anual' && duracionEfectiva === 'anual'));

  const esCompatible = Boolean(materiaSeleccionada) && !esInvalido;

  let actionStateContent = '+ Asignar a este período';
  let actionStateClasses = 'border-slate-800/80 hover:border-slate-700 text-slate-400';

  if (esCompatible) {
    actionStateContent = '+ Soltar aquí';
    actionStateClasses = 'border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer animate-pulse';
  } else if (esInvalido) {
    actionStateContent = '🚫 No compatible';
    actionStateClasses = 'border-rose-900/50 bg-rose-950/20 text-rose-500/70 font-semibold cursor-not-allowed';
  }

  return (
    <div className="flex flex-col">
      {/* Encabezado Colapsable Compacto */}
      <div 
        onClick={onToggle}
        className="flex items-center justify-between py-1.5 px-2.5 rounded-md bg-blue-600/20 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30 text-[10px] font-bold uppercase tracking-widest cursor-pointer select-none transition-colors"
      >
        <span>{PERIODO_LABEL[periodo]}</span>
        <div className="flex items-center gap-1.5 opacity-90">
          <span className="font-mono">({items.length})</span>
          <ChevronDown size={13} className={`transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
        </div>
      </div>

      {/* Contenido (Lista de Materias y Drop Target) */}
      {!isCollapsed && (
        <div className="flex flex-col gap-1.5 mt-2">
          {items.map((materia) => {
            const alerta = getAlertaCorrelativas(materia.id, anio, periodo);
            const tieneAlerta = alerta.faltaCorrelativa;
            
            return (
              <div 
                key={materia.id}
                className={`group relative p-2 rounded-xl flex items-center justify-between gap-2 transition-all border shadow-sm cursor-pointer ${
                  materiaSeleccionada?.id === materia.id 
                    ? 'bg-blue-600/30 border-blue-400 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                    : tieneAlerta 
                      ? 'bg-amber-50 dark:bg-slate-900/60 hover:bg-amber-100 dark:hover:bg-slate-800/80 border-amber-300 dark:border-amber-500/50 text-amber-800 dark:text-slate-200' 
                      : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                }`}
                onClick={() => onSelectMateria(materia)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`font-mono font-black text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                    tieneAlerta ? 'bg-amber-200 text-amber-900 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-slate-600 text-white dark:bg-slate-700/80 dark:text-slate-100'
                  }`}>
                    {materia.codigo}
                  </span>
                  <span className="text-xs font-semibold truncate" title={tieneAlerta ? alerta.motivos.join(', ') : materia.nombre}>
                    {materia.nombre}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-mono text-slate-400">{materia.horas}</span>
                  {/* Botón quitar en hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveMateria(materia.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-all ml-1"
                    title="Quitar de este período"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Empty State / Drop Target */}
          {(items.length === 0 || Boolean(materiaSeleccionada)) && (
            <div
              onClick={() => {
                if (esCompatible && materiaSeleccionada) {
                  onAsignarMateria(materiaSeleccionada.id, anio, periodo);
                }
              }}
              className={
                items.length === 0 && !materiaSeleccionada
                  ? "w-full py-2 px-3 rounded-xl border border-dashed border-slate-800/80 hover:border-blue-500/40 text-center text-[11px] text-slate-500 hover:text-blue-300 transition-all cursor-pointer"
                  : `w-full py-2 px-3 rounded-xl border border-dashed text-center text-[11px] transition-all ${actionStateClasses}`
              }
            >
              <span>{items.length === 0 && !materiaSeleccionada ? "+ Asignar materia aquí" : actionStateContent}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ============================================================
// COMPONENTE: MiPlanDropZone
// Zona de asignación por período (Anual, 1C, 2C) con indicador de carga horaria y validación visual por selección
// ============================================================

import { Clock } from 'lucide-react';
import { MiPlanCard } from './MiPlanCard';
import type { MateriaCompleta, PeriodoPlan } from '../../types';
import type { AlertaCorrelativa, TermometroConfig } from '../../hooks/usePlanificador';

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
  termometro,
  materiaSeleccionada,
  getAlertaCorrelativas,
  onSelectMateria,
  onAsignarMateria,
  onRemoveMateria,
}: Props) {
  const duracionEfectiva = materiaSeleccionada
    ? (materiaSeleccionada.estadoDinamico.duracionPersonalizada ?? materiaSeleccionada.duracion)
    : undefined;

  // Validación en tiempo real cuando hay una materia seleccionada
  const esInvalido =
    Boolean(materiaSeleccionada) &&
    ((periodo === 'Anual' && duracionEfectiva === 'cuatrimestral') ||
     (periodo !== 'Anual' && duracionEfectiva === 'anual'));

  const esCompatible = Boolean(materiaSeleccionada) && !esInvalido;

  return (
    <div
      onClick={() => {
        if (materiaSeleccionada && items.length === 0) {
          onAsignarMateria(materiaSeleccionada.id, anio, periodo);
        }
      }}
      className={`rounded-2xl border transition-all p-3.5 flex flex-col min-h-[160px] ${
        esInvalido
          ? 'border-rose-500/80 bg-rose-950/40 opacity-75 shadow-lg shadow-rose-500/10 cursor-not-allowed'
          : esCompatible
          ? 'border-2 border-dashed border-indigo-400 bg-indigo-950/40 shadow-lg shadow-indigo-500/20 hover:bg-indigo-900/40 scale-[1.01] cursor-pointer'
          : 'border-slate-700/70 bg-slate-900/60 hover:border-slate-600/80'
      }`}
    >
      {/* Encabezado del Período */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-700/70">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
          {PERIODO_LABEL[periodo]}
        </span>

        {esInvalido && (
          <span className="text-[10px] font-bold text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-500/40">
            {periodo === 'Anual' ? 'Solo Anuales' : 'Solo Cuatrim.'}
          </span>
        )}

        {/* Termómetro de carga horaria en 1C y 2C */}
        {periodo !== 'Anual' && !esInvalido && (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${termometro.bg} ${termometro.border} ${termometro.text}`}
            title="Carga horaria semanal (suma de materias del cuatrimestre y materias anuales del año)"
          >
            <Clock size={11} />
            {termometro.label}
          </span>
        )}
        {periodo === 'Anual' && items.length > 0 && !esInvalido && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-700">
            {items.length} {items.length === 1 ? 'materia' : 'materias'}
          </span>
        )}
      </div>

      {/* Botón de acción rápido si hay materia compatible seleccionada */}
      {esCompatible && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (materiaSeleccionada) {
              onAsignarMateria(materiaSeleccionada.id, anio, periodo);
            }
          }}
          className="w-full py-2 px-3 mb-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] border border-indigo-400/40 animate-pulse"
        >
          ➕ Ubicar "{materiaSeleccionada?.codigo}" aquí
        </button>
      )}

      {/* Botón informativo si hay materia seleccionada no compatible */}
      {esInvalido && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (materiaSeleccionada) {
              onAsignarMateria(materiaSeleccionada.id, anio, periodo);
            }
          }}
          className="w-full py-1.5 px-2.5 mb-2 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-[11px] font-medium text-center cursor-pointer hover:bg-rose-900/60 transition-colors"
        >
          🚫 No compatible ({materiaSeleccionada?.duracion === 'anual' ? 'es Anual' : 'es Cuatrim.'})
        </div>
      )}

      {/* Tarjetas dentro de la zona */}
      <div className="space-y-2 flex-1 flex flex-col justify-center">
        {items.length === 0 ? (
          <div
            onClick={() => {
              if (materiaSeleccionada) {
                onAsignarMateria(materiaSeleccionada.id, anio, periodo);
              }
            }}
            className={`h-full min-h-[85px] flex items-center justify-center rounded-xl border border-dashed transition-colors text-xs font-medium ${
              esCompatible
                ? 'border-indigo-400/80 bg-indigo-950/40 text-indigo-200 cursor-pointer hover:bg-indigo-900/40 font-bold'
                : 'border-slate-700/70 bg-slate-950/30 text-slate-400'
            }`}
          >
            {esCompatible ? '👆 Clic para ubicar aquí' : 'Haz clic en una materia para seleccionarla'}
          </div>
        ) : (
          items.map((materia) => (
            <MiPlanCard
              key={materia.id}
              materia={materia}
              enTablero={true}
              isSelected={materiaSeleccionada?.id === materia.id}
              alertaCorrelativa={getAlertaCorrelativas(materia.id, anio, periodo)}
              onSelect={() => onSelectMateria(materia)}
              onRemove={() => onRemoveMateria(materia.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}


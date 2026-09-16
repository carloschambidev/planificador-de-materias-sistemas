// ============================================================
// COMPONENTE: MiPlanDropZone
// Zona de asignación por período (Anual, 1C, 2C) con indicador de carga horaria y validación visual por selección
// ============================================================

import { EyeOff } from 'lucide-react';
import { MiPlanCard } from "../../../features/mi-plan/components/MiPlanCard";
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
  onHide?: () => void;
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
  onHide,
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
      className={`rounded-2xl transition-all p-3.5 flex flex-col min-h-[160px] ${
        esInvalido
          ? 'border-2 border-dashed border-red-900/50 bg-red-950/10 text-red-500/70 cursor-not-allowed'
          : esCompatible
          ? 'border-2 border-dashed border-emerald-500/50 bg-emerald-950/20 text-emerald-400 scale-[1.01] cursor-pointer'
          : 'border border-dashed border-[var(--color-border-sutil)] bg-background hover:border-[var(--color-border-main)]'
      }`}
    >
      {/* Encabezado del Período */}
      <div className="flex justify-between items-center w-full mb-3 pb-2 border-b border-sutil">
        <span className="text-[11px] font-bold uppercase tracking-wider text-secondary/70">
          {PERIODO_LABEL[periodo]}
        </span>
        
        <div className="flex items-center gap-2">
          {esInvalido && (
            <span className="text-[10px] font-bold text-red-400 bg-red-950/30 px-2 py-0.5 rounded border border-red-900/50">
              {periodo === 'Anual' ? 'Solo Anuales' : 'Solo Cuatrim.'}
            </span>
          )}

          {periodo === 'Anual' && items.length > 0 && !esInvalido && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface text-secondary/60 border border-sutil">
              {items.length} {items.length === 1 ? 'materia' : 'materias'}
            </span>
          )}

          {onHide && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onHide();
              }}
              title="Ocultar cuatrimestre (solo si está vacío)"
              className="text-secondary/40 hover:text-primary transition-colors ml-1"
            >
              <EyeOff size={14} />
            </button>
          )}
        </div>
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
          className="w-full py-2 px-3 mb-2 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] border border animate-pulse"
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
          className="w-full py-1.5 px-2.5 mb-2 rounded-lg bg-[#2a0505] border border-rose-700 text-rose-300 text-[11px] font-medium text-center cursor-pointer hover:bg-[#3a0808] transition-colors"
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
                ? 'border-[#951615] bg-surface-hover text-secondary cursor-pointer hover:bg-background font-bold'
                : 'border bg-background text-secondary/50'
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


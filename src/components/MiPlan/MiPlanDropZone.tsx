// ============================================================
// COMPONENTE: MiPlanDropZone
// Zona de soltado por período (Anual, 1C, 2C) con indicador de carga horaria y validación visual de régimen
// ============================================================

import { useDroppable, useDndContext } from '@dnd-kit/core';
import { Clock } from 'lucide-react';
import { MiPlanCard } from './MiPlanCard';
import type { MateriaCompleta, PeriodoPlan } from '../../types';
import type { AlertaCorrelativa, TermometroConfig } from '../../hooks/usePlanificador';

interface Props {
  anio: number;
  periodo: PeriodoPlan;
  items: MateriaCompleta[];
  termometro: TermometroConfig;
  getAlertaCorrelativas: (idMateria: string, anio: number, periodo: PeriodoPlan) => AlertaCorrelativa;
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
  getAlertaCorrelativas,
  onRemoveMateria,
}: Props) {
  const dropId = `${anio}-${periodo}`;
  const { isOver, setNodeRef } = useDroppable({
    id: dropId,
    data: {
      anio,
      periodo,
    },
  });

  const { active } = useDndContext();
  const materiaArrastrada = active?.data.current?.materia as MateriaCompleta | undefined;
  const duracionEfectiva = materiaArrastrada
    ? (materiaArrastrada.estadoDinamico.duracionPersonalizada ?? materiaArrastrada.duracion)
    : undefined;

  // Validación visual en tiempo real durante el arrastre
  const esInvalido =
    Boolean(materiaArrastrada) &&
    ((periodo === 'Anual' && duracionEfectiva === 'cuatrimestral') ||
     (periodo !== 'Anual' && duracionEfectiva === 'anual'));

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border transition-all p-3.5 flex flex-col min-h-[160px] ${
        isOver && esInvalido
          ? 'border-rose-500/90 bg-rose-950/50 shadow-lg shadow-rose-500/20 scale-[1.01] cursor-not-allowed'
          : isOver
          ? 'border-indigo-400 bg-indigo-950/50 shadow-lg shadow-indigo-500/20 scale-[1.01]'
          : 'border-slate-700/70 bg-slate-900/60 hover:border-slate-600/80'
      }`}
    >
      {/* Encabezado del Período */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-700/70">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
          {PERIODO_LABEL[periodo]}
        </span>

        {isOver && esInvalido && (
          <span className="text-[10px] font-bold text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-500/40">
            {periodo === 'Anual' ? 'Solo Anuales' : 'Solo Cuatrim.'}
          </span>
        )}

        {/* Termómetro de carga horaria en 1C y 2C */}
        {periodo !== 'Anual' && !(isOver && esInvalido) && (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${termometro.bg} ${termometro.border} ${termometro.text}`}
            title="Carga horaria semanal (suma de materias del cuatrimestre y materias anuales del año)"
          >
            <Clock size={11} />
            {termometro.label}
          </span>
        )}
        {periodo === 'Anual' && items.length > 0 && !(isOver && esInvalido) && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-700">
            {items.length} {items.length === 1 ? 'materia' : 'materias'}
          </span>
        )}
      </div>

      {/* Tarjetas dentro de la zona */}
      <div className="space-y-2 flex-1 flex flex-col justify-center">
        {items.length === 0 ? (
          <div className="h-full min-h-[85px] flex items-center justify-center rounded-xl border border-dashed border-slate-700/70 bg-slate-950/30 text-slate-400 text-xs font-medium transition-colors">
            Soltar materias aquí
          </div>
        ) : (
          items.map((materia) => (
            <MiPlanCard
              key={materia.id}
              materia={materia}
              enTablero={true}
              alertaCorrelativa={getAlertaCorrelativas(materia.id, anio, periodo)}
              onRemove={() => onRemoveMateria(materia.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

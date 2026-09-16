// ============================================================
// COMPONENTE: MiPlanCard
// Tarjeta seleccionable para el Catálogo Horizontal y el Tablero de Mi Plan (con distintivo Anual/Cuatrim.)
// ============================================================

import { Clock, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import type { MateriaCompleta } from "../../../core/types";
import type { AlertaCorrelativa } from "../../../features/mi-plan/hooks/usePlanificador";

interface Props {
  materia: MateriaCompleta;
  enTablero?: boolean;
  isSelected?: boolean;
  alertaCorrelativa?: AlertaCorrelativa;
  onSelect?: () => void;
  onRemove?: () => void;
}

export function MiPlanCard({
  materia,
  enTablero = false,
  isSelected = false,
  alertaCorrelativa,
  onSelect,
  onRemove,
}: Props) {
  const estaBloqueadaHoy = materia.estaBloqueada;
  const tieneAlertaFutura = alertaCorrelativa?.faltaCorrelativa;
  const duracionEfectiva =
    materia.estadoDinamico.duracionPersonalizada ?? materia.duracion;

  let borderClass = 'border border-border hover:border-border-sutil';
  let bgClass = 'bg-surface hover:bg-surface-hover';
  let containerWidthClass = enTablero
    ? 'w-full'
    : 'w-64 shrink-0 min-h-[115px] flex flex-col justify-between';

  if (!enTablero) {
    // Estilo en Catálogo Superior
    if (isSelected) {
      borderClass = 'border border-brand';
      bgClass = 'bg-surface-elevated';
    } else if (!estaBloqueadaHoy) {
      borderClass = 'border border-border hover:border-border-sutil';
      bgClass = 'bg-surface hover:bg-surface-hover';
    } else {
      borderClass = 'border border-border';
      bgClass = 'bg-bg-secondary opacity-85';
    }
  } else {
    // Estilo en Tablero Global
    if (isSelected) {
      borderClass = 'border border-brand';
      bgClass = 'bg-surface-elevated';
    } else if (tieneAlertaFutura) {
      borderClass = 'border border-status-regularized hover:border-status-regularized';
      bgClass = 'bg-status-regularized-soft';
    } else {
      borderClass = 'border border-border';
      bgClass = 'bg-surface hover:bg-surface-hover';
    }
  }

  return (
    <div
      onClick={onSelect}
      className={`relative group rounded-xl ${borderClass} ${bgClass} backdrop-blur-md ${containerWidthClass} ${enTablero ? 'p-2' : 'p-3'} transition-all duration-200 cursor-pointer select-none`}
    >
      <div>
        {/* Cabecera de la tarjeta */}
        <div className={`flex items-start justify-between gap-1.5 ${!enTablero ? 'mb-1.5' : ''}`}>
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            {enTablero ? (
              <>
                <span className="text-sm font-bold text-white leading-none mt-0.5">
                  {materia.codigo}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-gray-300 px-1.5 py-0.5 rounded bg-surface border border">
                  <Clock size={10} />
                  {duracionEfectiva === 'anual' ? 'Anual' : 'Cuatrim.'} · {materia.horas}Hs
                </span>
                {isSelected && (
                  <span className="flex h-2 w-2 relative ml-0.5" title="Materia seleccionada">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4a0a0] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4a0a0]"></span>
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface text-gray-300 border border">
                  {materia.codigo}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface text-gray-300 border border">
                  Niv. {materia.nivel}
                </span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-surface text-gray-300 border"
                  title={
                    duracionEfectiva === 'anual'
                      ? 'Materia Anual · Solo puede ubicarse en "Materias Anuales"'
                      : 'Materia Cuatrimestral · Solo puede ubicarse en 1º o 2º Cuatrimestre'
                  }
                >
                  {duracionEfectiva === 'anual' ? 'Anual' : 'Cuatrim.'}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-300 px-1.5 py-0.5 rounded bg-surface border border">
                  <Clock size={10} />
                  {materia.horas}
                </span>
                {isSelected && (
                  <span className="flex h-2 w-2 relative ml-0.5" title="Materia seleccionada">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4a0a0] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4a0a0]"></span>
                  </span>
                )}
              </>
            )}
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
              className="p-1 rounded-md bg-surface hover:bg-red-950/50 text-gray-400 hover:text-red-400 transition-colors shrink-0"
              title="Quitar materia de Mi Plan"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Nombre de la Materia (Solo en el catálogo) */}
        {!enTablero && (
          <h4 className="text-xs sm:text-sm font-semibold text-primary leading-snug group-hover:text-secondary transition-colors">
            {materia.nombre}
          </h4>
        )}
      </div>

      {/* Pie en Catálogo: Insignia Disponible / Pendiente y Estado de Selección */}
      {!enTablero && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border">
          {!estaBloqueadaHoy ? (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface text-gray-300 border border"
              title="Correlatividades actuales cumplidas · Disponible"
            >
              <CheckCircle2 size={11} />
              Disponible
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-background text-gray-500 border border"
              title={`Bloqueada (${materia.motivoBloqueo.length} requisitos pendientes)`}
            >
              Pendiente
            </span>
          )}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all ${
              isSelected
                ? 'bg-[#4a0f0f] text-white shadow-sm border border'
                : 'text-secondary bg-background border border group-hover:bg-surface group-hover:text-white'
            }`}
          >
            {isSelected ? '✓ Seleccionada' : '+ Seleccionar'}
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

      {/* Pie en Tablero si está seleccionada para mover */}
      {enTablero && isSelected && (
        <div className="mt-2 pt-1.5 border-t border flex items-center justify-between text-[10px] font-bold text-secondary">
          <span>✓ Seleccionada para mover</span>
          <span>Elige destino ↓</span>
        </div>
      )}
    </div>
  );
}


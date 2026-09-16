import { useEffect } from 'react';
import { Check, Lock, X } from 'lucide-react';
import { useCarreraStore } from '../../../core/store/useCarreraStore';
import { getMateriaById } from '../../../core/data/materias';
import { cuentaComoRegularizada, cuentaComoAprobada, type ElectivaDefinicion } from '../../../core/types';

interface ElectivaDetailModalProps {
  electiva: ElectivaDefinicion;
  onClose: () => void;
  onAsignar: (electiva: ElectivaDefinicion) => void;
  estadoStyle: string;
  estadoTexto: string;
}

export function ElectivaDetailModal({
  electiva,
  onClose,
  onAsignar,
  estadoStyle,
  estadoTexto,
}: ElectivaDetailModalProps) {
  const estadoMaterias = useCarreraStore((s) => s.estadoMaterias);

  // Scroll Lock and Escape Key
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Si no hay reqs especificos de cursar definidos, usamos los generales para mantener compatibilidad
  const requisitosCursarReg = electiva?.requisitos?.paraCursar?.regularizadas ?? electiva?.regularizadasRequeridas ?? [];
  const requisitosCursarApr = electiva?.requisitos?.paraCursar?.aprobadas ?? electiva?.aprobadasRequeridas ?? [];
  
  const requisitosAprobarApr = electiva?.requisitos?.paraAprobar?.aprobadas ?? [];

  const puedeCursar = (() => {
    const regOk = requisitosCursarReg.every(id => cuentaComoRegularizada(estadoMaterias[id]?.estado ?? 'no-iniciada'));
    const aprOk = requisitosCursarApr.every(id => cuentaComoAprobada(estadoMaterias[id]?.estado ?? 'no-iniciada'));
    return regOk && aprOk;
  })();

  const puedeRendirFinal = (() => {
    return requisitosAprobarApr.every(id => cuentaComoAprobada(estadoMaterias[id]?.estado ?? 'no-iniciada'));
  })();

  return (
    // Overlay y contenedor
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto no-scrollbar relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar X arriba a la derecha */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Cabecera */}
        <div className="flex flex-col gap-1.5 pr-8">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[10px] md:text-[11px] font-mono font-black tracking-tight px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 dark:bg-slate-200 dark:text-slate-950 shadow-sm leading-none">
              {electiva.codigo}
            </span>
            {/* Badge de estado (Disponible, Bloqueada o Asignada) */}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${estadoStyle}`}>
              {estadoTexto}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {electiva.nombre}
          </h3>
        </div>

        {/* Descripción completa */}
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200 dark:border-white/5">
          {electiva.descripcionCompleta || electiva.descripcion}
        </div>

        {/* Bloque 1: Condición para Cursar */}
        <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] hidden dark:block" />
              <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)] block dark:hidden" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Requisitos para Cursar
              </h4>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
              puedeCursar 
                ? 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-500/30' 
                : 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-500/30'
            }`}>
              {puedeCursar ? 'Habilitado para cursar' : 'Correlativas pendientes'}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 mt-1">
            {requisitosCursarReg.map((reqId) => {
              const reqDef = getMateriaById(reqId);
              const cumplida = cuentaComoRegularizada(estadoMaterias[reqId]?.estado ?? 'no-iniciada');
              return (
                <div key={reqId} className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">Exige Regularizada</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{reqDef?.nombre ?? reqId}</span>
                  </div>
                  {cumplida ? (
                    <span className="text-emerald-500 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[11px] shrink-0"><Check size={12}/> Cumplida</span>
                  ) : (
                    <span className="text-amber-500 dark:text-amber-400 font-medium flex items-center gap-1 text-[11px] shrink-0"><Lock size={12}/> Pendiente</span>
                  )}
                </div>
              );
            })}
            {requisitosCursarApr.map((reqId) => {
              const reqDef = getMateriaById(reqId);
              const cumplida = cuentaComoAprobada(estadoMaterias[reqId]?.estado ?? 'no-iniciada');
              return (
                <div key={`apr-${reqId}`} className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500">Exige Aprobada</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{reqDef?.nombre ?? reqId}</span>
                  </div>
                  {cumplida ? (
                    <span className="text-emerald-500 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[11px] shrink-0"><Check size={12}/> Cumplida</span>
                  ) : (
                    <span className="text-rose-500 dark:text-rose-400 font-medium flex items-center gap-1 text-[11px] shrink-0"><Lock size={12}/> Pendiente</span>
                  )}
                </div>
              );
            })}
            
            {requisitosCursarReg.length === 0 && requisitosCursarApr.length === 0 && (
              <div className="text-xs text-slate-500 italic py-1">Ninguno</div>
            )}
          </div>
        </div>

        {/* Bloque 2: Condición para Aprobar / Rendir Final (Si aplica) */}
        {requisitosAprobarApr.length > 0 && (
          <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] block dark:hidden" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] hidden dark:block" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Requisitos para Aprobar
                </h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                puedeRendirFinal 
                  ? 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-500/30' 
                  : 'text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950/40 dark:border-rose-500/30'
              }`}>
                {puedeRendirFinal ? 'Final habilitado' : 'Requiere finales previos'}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 mt-1">
              {requisitosAprobarApr.map(reqId => {
                const reqDef = getMateriaById(reqId);
                const cumplida = cuentaComoAprobada(estadoMaterias[reqId]?.estado ?? 'no-iniciada');
                return (
                  <div key={reqId} className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{reqDef?.nombre ?? reqId}</span>
                    {cumplida ? (
                      <span className="text-emerald-500 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[11px]"><Check size={12}/> Aprobada</span>
                    ) : (
                      <span className="text-rose-500 dark:text-rose-400 font-medium flex items-center gap-1 text-[11px]"><Lock size={12}/> Falta Final</span>
                    )}
                  </div>
                );
              })}
            </div>

            {electiva.requisitos?.observacion && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1 border-t border-slate-200 dark:border-slate-800/60 pt-2">
                ℹ️ {electiva.requisitos.observacion}
              </p>
            )}
          </div>
        )}

        {/* Footer con acción directa de asignación */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <button onClick={onClose} className="h-8 px-3 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            Cerrar
          </button>
          {!puedeCursar ? (
            <button
              disabled
              className="h-8 px-3 rounded-lg text-xs font-semibold bg-slate-800/50 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60"
              title="Correlativas pendientes"
            >
              Bloqueada para Asignar
            </button>
          ) : (
            <button 
              onClick={() => {
                onAsignar(electiva);
                onClose();
              }}
              className="h-8 px-3 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
            >
              Asignar a mi Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

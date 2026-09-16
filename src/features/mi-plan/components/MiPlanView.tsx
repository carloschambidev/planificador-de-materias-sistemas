// ============================================================
// COMPONENTE CONTENEDOR: MiPlanView
// Vista principal de "Mi Plan" estructurada con Catálogo Superior Horizontal y Tablero Global en Grilla mediante selección por Clic/Toque
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, LayoutDashboard, AlertTriangle } from 'lucide-react';
import { useCarreraStore } from "../../../core/store/useCarreraStore";
import { usePlanificador } from "../../../features/mi-plan/hooks/usePlanificador";
import { useCorrelatividades } from "../../../core/hooks/useCorrelatividades";
import { MiPlanSidebar } from "./MiPlanSidebar";
import { MiPlanBoard } from './MiPlanBoard';
import { MiPlanWarningModal } from "./MiPlanWarningModal";
import { exportarMiPlanPDF } from "../utils/miPlanPdfExport";
import type { PeriodoPlan, MateriaCompleta } from "../../../core/types";

interface PendingDrop {
  idMateria: string;
  nombreMateria: string;
  anio: number;
  periodo: PeriodoPlan;
  horasResultantes: number;
}

export function MiPlanView() {
  const {
    planPersonalizado,
    totalAniosPlan,
    moverEnPlan,
    removerDelPlan,
    agregarAnioPlan,
    removerAnioPlan,
    limpiarPlanPersonalizado,
  } = useCarreraStore();

  const {
    materiasDisponibles,
    getAlertaCorrelativas,
    getHorasCuatrimestre,
    getNivelTermometro,
  } = usePlanificador();

  const { getMateriaCompleta } = useCorrelatividades();

  const [pendingDrop, setPendingDrop] = useState<PendingDrop | null>(null);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<MateriaCompleta | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  // Permitir cancelar la selección pulsando la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMateriaSeleccionada(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectMateria = (materia: MateriaCompleta) => {
    if (materiaSeleccionada?.id === materia.id) {
      setMateriaSeleccionada(null);
    } else {
      setMateriaSeleccionada(materia);
    }
  };

  const handleAsignarMateria = (
    idMateria: string,
    anio: number,
    periodo: PeriodoPlan
  ) => {
    const materia = getMateriaCompleta(idMateria);
    if (!materia) return;

    // Restricción lógica de régimen de cursada (anual vs cuatrimestral)
    const duracionEfectiva =
      materia.estadoDinamico.duracionPersonalizada ?? materia.duracion;

    if ((periodo === '1C' || periodo === '2C') && duracionEfectiva === 'anual') {
      alert(
        `"${materia.nombre}" es una materia ANUAL.\n\n` +
          `Las materias anuales solo pueden agregarse a la sección "Materias Anuales" (no a 1º o 2º Cuatrimestre).\n\n` +
          `💡 Si deseas cursarla de forma cuatrimestral, puedes cambiar su duración editando la información de la materia en el Plan de Estudios.`
      );
      return;
    }

    if (periodo === 'Anual' && duracionEfectiva === 'cuatrimestral') {
      alert(
        `"${materia.nombre}" es una materia CUATRIMESTRAL.\n\n` +
          `Las materias cuatrimestrales deben agregarse a las secciones "1º Cuatrimestre" o "2º Cuatrimestre".\n\n` +
          `💡 Si deseas cursarla en formato anual, puedes cambiar su duración editando la información de la materia en el Plan de Estudios.`
      );
      return;
    }

    // Si ya está en ese mismo año y período, solo cancelar la selección
    const actualItem = planPersonalizado.find((item) => item.idMateria === idMateria);
    if (actualItem && actualItem.anio === anio && actualItem.periodo === periodo) {
      setMateriaSeleccionada(null);
      return;
    }

    // Evaluar nueva carga horaria en el o los cuatrimestres afectados
    let horasMaximas = 0;
    if (periodo === 'Anual') {
      const horas1C = getHorasCuatrimestre(anio, '1C', idMateria, idMateria);
      const horas2C = getHorasCuatrimestre(anio, '2C', idMateria, idMateria);
      horasMaximas = Math.max(horas1C, horas2C);
    } else {
      horasMaximas = getHorasCuatrimestre(anio, periodo, idMateria, idMateria);
    }

    // Interceptar con el Modal si supera 16hs semanales
    if (horasMaximas > 16) {
      setPendingDrop({
        idMateria,
        nombreMateria: materia.nombre,
        anio,
        periodo,
        horasResultantes: horasMaximas,
      });
      return;
    }

    // Mover directamente si no supera 16hs
    moverEnPlan(idMateria, anio, periodo);
    setMateriaSeleccionada(null);
  };

  const handleConfirmarDrop = () => {
    if (pendingDrop) {
      moverEnPlan(pendingDrop.idMateria, pendingDrop.anio, pendingDrop.periodo);
      setPendingDrop(null);
      setMateriaSeleccionada(null);
    }
  };

  const handleCancelarDrop = () => {
    setPendingDrop(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 px-5 rounded-2xl border border bg-surface shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-background text-secondary border border shadow-inner">
            <LayoutDashboard size={26} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Mi Plan · Personalizado
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
              Diseña tu trayectoria universitaria seleccionando tus materias y ubicándolas en cada año y cuatrimestre
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              if (planPersonalizado.length === 0) {
                alert('Agrega materias al tablero antes de descargar el reporte PDF.');
                return;
              }
              exportarMiPlanPDF(planPersonalizado, totalAniosPlan, getMateriaCompleta);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4a0f0f] hover:bg-background text-white text-xs font-bold shadow-lg border border transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileText size={16} />
            Descargar Plan (PDF)
          </button>

          {planPersonalizado.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/40 bg-red-950/30 hover:bg-red-900/40 text-red-300 hover:text-red-200 text-xs font-semibold transition-all"
              title="Limpiar tablero"
            >
              <Trash2 size={16} />
              Limpiar Plan
            </button>
          )}
        </div>
      </div>

      {/* 1. Catálogo Horizontal Superior Deslizante */}
      <MiPlanSidebar
        materiasDisponibles={materiasDisponibles}
        materiaSeleccionada={materiaSeleccionada}
        onSelectMateria={handleSelectMateria}
      />

      {/* 2. Tablero Global de Años en Grilla de 5 Columnas (Sin scroll horizontal) */}
      <MiPlanBoard
        totalAniosPlan={totalAniosPlan}
        itemsPlan={planPersonalizado}
        materiaSeleccionada={materiaSeleccionada}
        getMateriaCompleta={getMateriaCompleta}
        getAlertaCorrelativas={getAlertaCorrelativas}
        getHorasCuatrimestre={getHorasCuatrimestre}
        getNivelTermometro={getNivelTermometro}
        onSelectMateria={handleSelectMateria}
        onAsignarMateria={handleAsignarMateria}
        onRemoveMateria={removerDelPlan}
        onAgregarAnio={agregarAnioPlan}
        onRemoverAnio={removerAnioPlan}
      />

      {/* Banner Flotante / Sticky Inferior al Seleccionar una Materia */}
      {materiaSeleccionada && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl bg-zinc-800/95 border border-zinc-700 rounded-2xl p-4 shadow-2xl shadow-black/50 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-status-current-soft text-status-current border border-status-current shrink-0">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-current opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-status-current"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-active text-secondary border border-sutil">
                  {materiaSeleccionada.codigo}
                </span>
                <h4 className="text-sm font-bold text-primary">
                  {materiaSeleccionada.nombre}
                </h4>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-status-promoted-soft text-status-promoted border border-status-promoted">
                  {materiaSeleccionada.estadoDinamico.duracionPersonalizada ?? materiaSeleccionada.duracion}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5 font-medium">
                👉 Elige la celda de Año / Cuatrimestre en la tabla para ubicarla (o pulsa Esc para cancelar)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMateriaSeleccionada(null)}
            className="shrink-0 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 text-xs font-bold transition-colors"
          >
            Cancelar selección
          </button>
        </div>
      )}

      {/* Interceptor de carga horaria semanal intensa */}
      <MiPlanWarningModal
        isOpen={Boolean(pendingDrop)}
        nombreMateria={pendingDrop?.nombreMateria ?? ''}
        horasResultantes={pendingDrop?.horasResultantes ?? 0}
        anio={pendingDrop?.anio ?? 1}
        periodo={
          pendingDrop?.periodo === 'Anual'
            ? 'Anual'
            : pendingDrop?.periodo === '1C'
            ? '1º Cuatrimestre'
            : '2º Cuatrimestre'
        }
        onConfirmar={handleConfirmarDrop}
        onCancelar={handleCancelarDrop}
      />

      {/* Modal de confirmación para Limpiar Tablero */}
      <AnimatePresence>
        {showClearModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900/95 border border-zinc-700/50 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4 text-center"
            >
              <div className="flex justify-center mb-4">
                <AlertTriangle size={48} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Limpiar Tablero</h3>
              <p className="text-sm text-zinc-400 mb-6">
                ¿Estás seguro de que deseas quitar todas las materias de tu plan personalizado? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowClearModal(false)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    limpiarPlanPersonalizado();
                    setMateriaSeleccionada(null);
                    setShowClearModal(false);
                  }}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg transition-colors font-semibold"
                >
                  Limpiar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


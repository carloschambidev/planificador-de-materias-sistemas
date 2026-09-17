// ============================================================
// COMPONENTE CONTENEDOR: MiPlanView
// Vista principal de "Mi Plan" estructurada con Catálogo Superior Horizontal y Tablero Global en Grilla mediante selección por Clic/Toque
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {Download, Trash2, AlertTriangle } from 'lucide-react';
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

    // Interceptar con el Modal si supera 26hs semanales
    if (horasMaximas > 26) {
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
      <div className="flex flex-col md:flex-row items-center justify-between w-full mb-1 relative">
        {/* Título Centrado (Absoluto en Desktop) */}
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
          <h2 className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wider text-center hidden md:block">
            TU PROPIO PLAN
          </h2>
        </div>

        {/* Botones de Acción */}
        <div className="flex w-full items-center justify-between gap-3 md:w-auto mb-2 md:mb-0 mt-0 z-10 md:ml-auto md:justify-end">
          <button
            type="button"
            onClick={() => {
              if (planPersonalizado.length === 0) {
                alert('Agrega materias al tablero antes de descargar el reporte PDF.');
                return;
              }
              exportarMiPlanPDF(planPersonalizado, totalAniosPlan, getMateriaCompleta);
            }}
            className="flex-1 md:flex-none h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-white text-purple-600 border border-slate-200 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 dark:bg-slate-900/50 dark:text-purple-400 dark:border-slate-700 dark:hover:bg-purple-500/10 dark:hover:border-purple-500 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Download size={16} className="text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Descargar Mi Plan</span>
            <span className="sm:hidden">Mi Plan</span>
          </button>

          {planPersonalizado.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="flex-1 md:flex-none h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-white text-rose-600 border border-slate-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 dark:bg-slate-900/50 dark:text-rose-400 dark:border-slate-700 dark:hover:bg-rose-500/10 dark:hover:border-rose-500 transition-all flex items-center justify-center gap-2 shadow-sm"
              title="Limpiar tablero"
            >
              <Trash2 size={16} className="text-rose-600 dark:text-rose-400" />
              <span>Limpiar Plan</span>
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 py-3 px-5 rounded-full shadow-2xl shadow-blue-900/20 bg-blue-600 dark:bg-blue-600 text-white border border-blue-400 dark:border-blue-500 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-blue-800 text-blue-100">{materiaSeleccionada.codigo}</span>
            <span className="text-sm font-semibold">{materiaSeleccionada.nombre}</span>
          </div>
          <span className="hidden sm:inline text-xs text-blue-200">👉 Elige dónde ubicarla</span>
          <button onClick={() => setMateriaSeleccionada(null)} className="ml-2 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-full transition-colors shadow-sm">
            Cancelar
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


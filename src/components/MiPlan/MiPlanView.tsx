// ============================================================
// COMPONENTE CONTENEDOR: MiPlanView
// Vista principal de "Mi Plan" estructurada con Catálogo Superior Horizontal y Tablero Global en Grilla
// ============================================================

import { useState } from 'react';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
} from '@dnd-kit/core';
import { FileText, Trash2, LayoutDashboard } from 'lucide-react';
import { useCarreraStore } from '../../store/useCarreraStore';
import { usePlanificador } from '../../hooks/usePlanificador';
import { useCorrelatividades } from '../../hooks/useCorrelatividades';
import { MiPlanSidebar } from './MiPlanSidebar';
import { MiPlanBoard } from './MiPlanBoard';
import { MiPlanWarningModal } from './MiPlanWarningModal';
import { exportarMiPlanPDF } from './MiPlanPDFExport';
import type { PeriodoPlan } from '../../types';

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6, // Requiere arrastrar 6px para evitar clicks accidentales
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !over.data.current) return;

    const idMateria = String(active.id);
    const materia = getMateriaCompleta(idMateria);
    if (!materia) return;

    const { anio, periodo } = over.data.current as {
      anio: number;
      periodo: PeriodoPlan;
    };

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

    // Si ya está en ese mismo año y período, no hacer nada
    const actualItem = planPersonalizado.find((item) => item.idMateria === idMateria);
    if (actualItem && actualItem.anio === anio && actualItem.periodo === periodo) {
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
  };

  const handleConfirmarDrop = () => {
    if (pendingDrop) {
      moverEnPlan(pendingDrop.idMateria, pendingDrop.anio, pendingDrop.periodo);
      setPendingDrop(null);
    }
  };

  const handleCancelarDrop = () => {
    setPendingDrop(null);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Barra superior de Mi Plan */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-gray-950 via-gray-900 to-indigo-950/40 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-inner">
              <LayoutDashboard size={26} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Mi Plan · Roadmap Académico Personalizado
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
                Diseña tu trayectoria universitaria combinando tus materias aprobadas con tu proyección a futuro
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
                exportarMiPlanPDF(planPersonalizado, totalAniosPlan);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 border border-indigo-400/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText size={16} />
              Descargar Plan (PDF)
            </button>

            {planPersonalizado.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Estás seguro de quitar todas las materias del tablero Mi Plan?')) {
                    limpiarPlanPersonalizado();
                  }
                }}
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
        <MiPlanSidebar materiasDisponibles={materiasDisponibles} />

        {/* 2. Tablero Global de Años en Grilla de 5 Columnas (Sin scroll horizontal) */}
        <MiPlanBoard
          totalAniosPlan={totalAniosPlan}
          itemsPlan={planPersonalizado}
          getMateriaCompleta={getMateriaCompleta}
          getAlertaCorrelativas={getAlertaCorrelativas}
          getHorasCuatrimestre={getHorasCuatrimestre}
          getNivelTermometro={getNivelTermometro}
          onRemoveMateria={removerDelPlan}
          onAgregarAnio={agregarAnioPlan}
        />
      </div>

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
    </DndContext>
  );
}

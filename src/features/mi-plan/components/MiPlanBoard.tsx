// ============================================================
// COMPONENTE: MiPlanBoard
// Tablero Global de Años Académicos en Grilla Responsiva de 5 Columnas (Sin Scroll Horizontal)
// ============================================================

import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, ChevronLeft } from 'lucide-react';
import { MiPlanYearColumn } from "./MiPlanYearColumn";
import type { MateriaCompleta, PeriodoPlan, ItemPlanPersonalizado } from "../../../core/types";
import type { AlertaCorrelativa, TermometroConfig } from "../../../features/mi-plan/hooks/usePlanificador";

interface Props {
  totalAniosPlan: number;
  itemsPlan: ItemPlanPersonalizado[];
  materiaSeleccionada: MateriaCompleta | null;
  getMateriaCompleta: (id: string) => MateriaCompleta | undefined;
  getAlertaCorrelativas: (idMateria: string, anio: number, periodo: PeriodoPlan) => AlertaCorrelativa;
  getHorasCuatrimestre: (anio: number, cuatrimestre: '1C' | '2C') => number;
  getNivelTermometro: (horas: number) => TermometroConfig;
  onSelectMateria: (materia: MateriaCompleta) => void;
  onAsignarMateria: (idMateria: string, anio: number, periodo: PeriodoPlan) => void;
  onRemoveMateria: (idMateria: string) => void;
  onAgregarAnio: () => void;
  onRemoverAnio: () => void;
}

export function MiPlanBoard({
  totalAniosPlan,
  itemsPlan,
  materiaSeleccionada,
  getMateriaCompleta,
  getAlertaCorrelativas,
  getHorasCuatrimestre,
  getNivelTermometro,
  onSelectMateria,
  onAsignarMateria,
  onRemoveMateria,
  onAgregarAnio,
  onRemoverAnio,
}: Props) {
  const [activeYear, setActiveYear] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [yearToDelete, setYearToDelete] = useState<number | null>(null);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const anios = Array.from({ length: totalAniosPlan }, (_, i) => i + 1);

  const handlePrevYear = () => {
    setActiveYear((prev) => Math.max(1, prev - 1));
  };

  const handleNextYear = () => {
    // Permitir avanzar un espacio extra para mostrar el botón de "+ Agregar Año"
    setActiveYear((prev) => Math.min(totalAniosPlan + 1, prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Umbral de 50px para considerar que es un swipe intencional
    if (diff > 50 && activeYear <= totalAniosPlan) {
      handleNextYear();
    } else if (diff < -50 && activeYear > 1) {
      handlePrevYear();
    }
    setTouchStart(null);
  };

  const confirmarEliminarAno = () => {
    onRemoverAnio();
    if (activeYear > totalAniosPlan - 1) {
      setActiveYear(totalAniosPlan - 1);
    }
  };

  return (
    <div className="w-full overflow-hidden lg:overflow-visible pb-2">
      {/* Grilla de 5 columnas para que los primeros 5 años queden en una fila sin scroll horizontal. 
          A partir del 6º año salta a la fila inferior y se scrollea hacia abajo. */}
      <div 
        className="flex lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-4 items-stretch transition-transform duration-300 ease-out"
        style={isMobile ? { transform: `translateX(calc(-${activeYear - 1} * (100% + 1rem)))` } : {}}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {anios.map((anio) => (
          <MiPlanYearColumn
            key={anio}
            anio={anio}
            itemsPlan={itemsPlan}
            materiaSeleccionada={materiaSeleccionada}
            getMateriaCompleta={getMateriaCompleta}
            getAlertaCorrelativas={getAlertaCorrelativas}
            getHorasCuatrimestre={getHorasCuatrimestre}
            getNivelTermometro={getNivelTermometro}
            onSelectMateria={onSelectMateria}
            onAsignarMateria={onAsignarMateria}
            onRemoveMateria={onRemoveMateria}
            onPrevYear={handlePrevYear}
            onNextYear={handleNextYear}
            canGoPrev={anio > 1}
            canGoNext={true} // Siempre se puede avanzar porque al final está la vista de "Agregar Año"
          />
        ))}

        {/* Columna para Agregar / Eliminar un Año Académico */}
        <div className="w-full shrink-0 lg:w-auto flex flex-col gap-4 h-full">
          {/* Header Mobile para poder volver atrás en caso de no usar Swipe */}
          <div className="lg:hidden flex items-center px-1 mb-1">
            <button 
              onClick={handlePrevYear} 
              className="p-1 flex items-center gap-1 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="text-sm font-medium">Volver al Año {totalAniosPlan}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onAgregarAnio}
            className="group flex-1 min-h-[300px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800/80 hover:border-indigo-500/80 bg-white/40 dark:bg-slate-900/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-200 shadow-sm cursor-pointer flex flex-col items-center justify-center gap-3.5 p-6 backdrop-blur-md"
          >
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800/80 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-600/20 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
              <PlusCircle size={36} className="group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div className="text-center">
              <span className="block text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-white transition-colors">
                + Agregar Año Académico {totalAniosPlan + 1}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-500 mt-1">
                Suma una nueva columna hacia abajo en el roadmap
              </span>
            </div>
          </button>

          {totalAniosPlan > 5 && (
            <button
              type="button"
              onClick={() => setYearToDelete(totalAniosPlan)}
              className="flex items-center justify-center gap-2 w-full p-4 rounded-xl border border-red-500/40 bg-red-950/30 hover:bg-red-900/40 text-red-300 hover:text-red-200 text-sm font-semibold transition-all shadow-sm"
            >
              <Trash2 size={18} />
              Eliminar Año {totalAniosPlan}
            </button>
          )}
        </div>
      </div>

      {yearToDelete !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full flex flex-col gap-4 text-center">
            <div className="mx-auto w-12 h-12 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mb-2">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">¿Eliminar Año {yearToDelete}?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Se eliminará esta columna del plan. Las materias asignadas volverán al Stack de pendientes.
            </p>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setYearToDelete(null)} className="flex-1 py-2 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Cancelar
              </button>
              <button onClick={() => { confirmarEliminarAno(); setYearToDelete(null); }} className="flex-1 py-2 rounded-xl font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-md shadow-rose-600/20">
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMPONENTE: MiPlanYearColumn
// Columna del Tablero Global por Año Académico (en Grilla de 5 Columnas)
// ============================================================

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { MiPlanDropZone } from "./MiPlanDropZone";
import type { MateriaCompleta, PeriodoPlan, ItemPlanPersonalizado } from "../../../core/types";
import { parsearHoras, type AlertaCorrelativa, type TermometroConfig } from "../../../features/mi-plan/hooks/usePlanificador";

interface Props {
  anio: number;
  itemsPlan: ItemPlanPersonalizado[];
  materiaSeleccionada: MateriaCompleta | null;
  getMateriaCompleta: (id: string) => MateriaCompleta | undefined;
  getAlertaCorrelativas: (idMateria: string, anio: number, periodo: PeriodoPlan) => AlertaCorrelativa;
  getHorasCuatrimestre: (anio: number, cuatrimestre: '1C' | '2C') => number;
  getNivelTermometro: (horas: number) => TermometroConfig;
  onSelectMateria: (materia: MateriaCompleta) => void;
  onAsignarMateria: (idMateria: string, anio: number, periodo: PeriodoPlan) => void;
  onRemoveMateria: (idMateria: string) => void;
  onPrevYear?: () => void;
  onNextYear?: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
}

export function MiPlanYearColumn({
  anio,
  itemsPlan,
  materiaSeleccionada,
  getMateriaCompleta,
  getAlertaCorrelativas,
  getHorasCuatrimestre,
  getNivelTermometro,
  onSelectMateria,
  onAsignarMateria,
  onRemoveMateria,
  onPrevYear,
  onNextYear,
  canGoPrev,
  canGoNext,
}: Props) {
  const [collapsedPeriods, setCollapsedPeriods] = useState<Record<string, boolean>>({});

  const togglePeriod = (periodId: string) => {
    setCollapsedPeriods(prev => ({
      ...prev,
      [periodId]: !prev[periodId]
    }));
  };

  // Obtener las materias asignadas a este año para cada uno de los 3 períodos
  const getMateriasPorPeriodo = (periodo: PeriodoPlan): MateriaCompleta[] => {
    return itemsPlan
      .filter((item) => item.anio === anio && item.periodo === periodo)
      .map((item) => getMateriaCompleta(item.idMateria))
      .filter((m): m is MateriaCompleta => Boolean(m));
  };

  const materiasAnuales = getMateriasPorPeriodo('Anual');
  const materias1C = getMateriasPorPeriodo('1C');
  const materias2C = getMateriasPorPeriodo('2C');

  // Calcular termómetros para 1C y 2C
  const horas1C = getHorasCuatrimestre(anio, '1C');
  const horas2C = getHorasCuatrimestre(anio, '2C');
  const termometro1C = getNivelTermometro(horas1C);
  const termometro2C = getNivelTermometro(horas2C);
  const horasAnuales = materiasAnuales.reduce((acc, m) => acc + parsearHoras(m.horas), 0);
  const horasSolo1C = materias1C.reduce((acc, m) => acc + parsearHoras(m.horas), 0);
  const horasSolo2C = materias2C.reduce((acc, m) => acc + parsearHoras(m.horas), 0);
  
  const carga1C = horasAnuales + horasSolo1C;
  const carga2C = horasAnuales + horasSolo2C;
  const totalHorasSemanales = Math.max(carga1C, carga2C);

  const ANIO_THEME = {
    1: { topBar: 'bg-sky-500 dark:bg-sky-400', iconColor: 'text-sky-400' },
    2: { topBar: 'bg-emerald-500 dark:bg-emerald-400', iconColor: 'text-emerald-400' },
    3: { topBar: 'bg-amber-500 dark:bg-amber-400', iconColor: 'text-amber-400' },
    4: { topBar: 'bg-purple-500 dark:bg-purple-400', iconColor: 'text-purple-400' },
    5: { topBar: 'bg-rose-500 dark:bg-rose-400', iconColor: 'text-rose-400' },
  } as Record<number, {topBar: string, iconColor: string}>;
  
  const defaultTheme = { topBar: 'bg-slate-500 dark:bg-slate-400', iconColor: 'text-slate-400' };
  const theme = ANIO_THEME[anio] || defaultTheme;

  let semaforoStyle = 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700';
  if (totalHorasSemanales > 0 && totalHorasSemanales <= 25) {
    semaforoStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30';
  } else if (totalHorasSemanales >= 26 && totalHorasSemanales <= 35) {
    semaforoStyle = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30';
  } else if (totalHorasSemanales >= 36) {
    semaforoStyle = 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30';
  }

  const semaforoText = totalHorasSemanales === 0 ? '0 hs/sem' : `${totalHorasSemanales} hs/sem`;

  return (
    <div className="relative overflow-hidden w-full shrink-0 lg:w-auto rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-3.5 backdrop-blur-md flex flex-col gap-3 shadow-lg">
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${theme.topBar}`} />
      {/* Cabecera de la Columna del Año */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/70">
        {/* Flecha Izquierda (Solo Móvil) */}
        <button 
          onClick={onPrevYear} 
          disabled={!canGoPrev}
          className={`p-1 lg:hidden transition-colors ${canGoPrev ? 'text-slate-400 hover:text-slate-800 dark:hover:text-white' : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'}`}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Título y Semáforo Centrados */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="flex items-center gap-1.5">
            <Calendar className={theme.iconColor} size={16} />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Año {anio}</h3>
          </div>
          {/* Semáforo de Horas debajo del título */}
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border mt-1.5 ${semaforoStyle}`}>
            {semaforoText}
          </span>
        </div>

        {/* Flecha Derecha (Solo Móvil) */}
        <button 
          onClick={onNextYear} 
          disabled={!canGoNext}
          className={`p-1 lg:hidden transition-colors ${canGoNext ? 'text-slate-400 hover:text-slate-800 dark:hover:text-white' : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Las 3 Zonas de Asignación por Período: Anual, 1C y 2C */}
      <div className="space-y-3.5 flex-1 flex flex-col justify-between">
        <MiPlanDropZone
          anio={anio}
          periodo="Anual"
          items={materiasAnuales}
          termometro={termometro1C}
          materiaSeleccionada={materiaSeleccionada}
          getAlertaCorrelativas={getAlertaCorrelativas}
          onSelectMateria={onSelectMateria}
          onAsignarMateria={onAsignarMateria}
          onRemoveMateria={onRemoveMateria}
          isCollapsed={collapsedPeriods['Anual'] || false}
          onToggle={() => togglePeriod('Anual')}
        />

        <MiPlanDropZone
          anio={anio}
          periodo="1C"
          items={materias1C}
          termometro={termometro1C}
          materiaSeleccionada={materiaSeleccionada}
          getAlertaCorrelativas={getAlertaCorrelativas}
          onSelectMateria={onSelectMateria}
          onAsignarMateria={onAsignarMateria}
          onRemoveMateria={onRemoveMateria}
          isCollapsed={collapsedPeriods['1C'] || false}
          onToggle={() => togglePeriod('1C')}
        />

        <MiPlanDropZone
          anio={anio}
          periodo="2C"
          items={materias2C}
          termometro={termometro2C}
          materiaSeleccionada={materiaSeleccionada}
          getAlertaCorrelativas={getAlertaCorrelativas}
          onSelectMateria={onSelectMateria}
          onAsignarMateria={onAsignarMateria}
          onRemoveMateria={onRemoveMateria}
          isCollapsed={collapsedPeriods['2C'] || false}
          onToggle={() => togglePeriod('2C')}
        />
      </div>
    </div>
  );
}

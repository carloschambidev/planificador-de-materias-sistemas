// ============================================================
// COMPONENTE: MiPlanYearColumn
// Columna del Tablero Global por Año Académico (en Grilla de 5 Columnas)
// ============================================================

import { Calendar } from 'lucide-react';
import { MiPlanDropZone } from './MiPlanDropZone';
import type { MateriaCompleta, PeriodoPlan, ItemPlanPersonalizado } from '../../types';
import type { AlertaCorrelativa, TermometroConfig } from '../../hooks/usePlanificador';

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
}: Props) {
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

  const materiasTotalAnio =
    materiasAnuales.length + materias1C.length + materias2C.length;

  return (
    <div className="w-full rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-800/95 via-slate-800/90 to-slate-900/90 p-4 flex flex-col gap-4 shadow-xl hover:border-slate-600 transition-all">
      {/* Cabecera de la Columna del Año */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Calendar size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Año Académico {anio}
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              {materiasTotalAnio} {materiasTotalAnio === 1 ? 'materia' : 'materias'}
            </p>
          </div>
        </div>
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
        />
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE: MiPlanYearColumn
// Columna del Tablero Global por Año Académico (en Grilla de 5 Columnas)
// ============================================================

import { useState } from 'react';
import { Calendar, Plus, Clock } from 'lucide-react';
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
  const [visibleSemesters, setVisibleSemesters] = useState({ c1: true, c2: true });

  const handleHideSemester = (periodo: '1C' | '2C', cantidadMaterias: number) => {
    if (cantidadMaterias > 0) {
      alert(`No puedes ocultar el cuatrimestre porque tiene ${cantidadMaterias} materias asignadas. Quítalas primero.`);
      return;
    }
    setVisibleSemesters(prev => ({ ...prev, [periodo === '1C' ? 'c1' : 'c2']: false }));
  };

  const handleRestoreSemester = () => {
    if (!visibleSemesters.c1) {
      setVisibleSemesters(prev => ({ ...prev, c1: true }));
    } else if (!visibleSemesters.c2) {
      setVisibleSemesters(prev => ({ ...prev, c2: true }));
    }
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

  const materiasTotalAnio =
    materiasAnuales.length + materias1C.length + materias2C.length;

  const horasTotalesAnio =
    materiasAnuales.reduce((acc, m) => acc + parsearHoras(m.horas), 0) +
    materias1C.reduce((acc, m) => acc + parsearHoras(m.horas), 0) +
    materias2C.reduce((acc, m) => acc + parsearHoras(m.horas), 0);
    
  const termometroAnual = getNivelTermometro(horasTotalesAnio);

  return (
    <div className="w-full rounded-2xl border border bg-surface p-4 flex flex-col gap-4 transition-all">
      {/* Cabecera de la Columna del Año */}
      <div className="flex items-center justify-between pb-3 border-b border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-background text-secondary border border">
            <Calendar size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary tracking-tight flex items-center gap-2">
              Año Académico {anio}
              {horasTotalesAnio > 0 && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${termometroAnual.bg} ${termometroAnual.border} ${termometroAnual.text}`}
                  title="Carga horaria anual total"
                >
                  <Clock size={11} />
                  {termometroAnual.label}
                </span>
              )}
            </h3>
            <p className="text-xs text-secondary/60 font-medium">
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

        {visibleSemesters.c1 && (
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
            onHide={() => handleHideSemester('1C', materias1C.length)}
          />
        )}

        {visibleSemesters.c2 && (
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
            onHide={() => handleHideSemester('2C', materias2C.length)}
          />
        )}

        {(!visibleSemesters.c1 || !visibleSemesters.c2) && (
          <div className="flex justify-center mt-1 pb-1">
            <button
              onClick={handleRestoreSemester}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border bg-background text-[11px] font-medium text-secondary/70 hover:bg-surface-hover hover:text-primary transition-colors"
            >
              <Plus size={13} />
              Añadir {(!visibleSemesters.c1 && !visibleSemesters.c2) ? 'Cuatrimestre' : (!visibleSemesters.c1 ? '1º Cuatrimestre' : '2º Cuatrimestre')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

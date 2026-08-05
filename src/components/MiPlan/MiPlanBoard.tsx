// ============================================================
// COMPONENTE: MiPlanBoard
// Tablero Global de Años Académicos en Grilla Responsiva de 5 Columnas (Sin Scroll Horizontal)
// ============================================================

import { PlusCircle, Trash2 } from 'lucide-react';
import { MiPlanYearColumn } from './MiPlanYearColumn';
import type { MateriaCompleta, PeriodoPlan, ItemPlanPersonalizado } from '../../types';
import type { AlertaCorrelativa, TermometroConfig } from '../../hooks/usePlanificador';

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
  const anios = Array.from({ length: totalAniosPlan }, (_, i) => i + 1);

  return (
    <div className="w-full">
      {/* Grilla de 5 columnas para que los primeros 5 años queden en una fila sin scroll horizontal. 
          A partir del 6º año salta a la fila inferior y se scrollea hacia abajo. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-stretch">
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
          />
        ))}

        {/* Columna para Agregar / Eliminar un Año Académico */}
        <div className="flex flex-col gap-4 w-full h-full">
          <button
            type="button"
            onClick={onAgregarAnio}
            className="group flex-1 min-h-[300px] rounded-2xl border-2 border-dashed border-slate-700/80 hover:border-indigo-500/80 bg-slate-900/40 hover:bg-indigo-950/20 transition-all text-slate-400 hover:text-indigo-200 shadow-md hover:shadow-indigo-500/10 cursor-pointer flex flex-col items-center justify-center gap-3.5 p-6"
          >
            <div className="p-4 rounded-full bg-slate-800/80 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 transition-colors">
              <PlusCircle size={36} className="group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div className="text-center">
              <span className="block text-sm font-bold text-slate-200 group-hover:text-white">
                + Agregar Año Académico {totalAniosPlan + 1}
              </span>
              <span className="block text-xs text-slate-400 mt-1">
                Suma una nueva columna hacia abajo en el roadmap
              </span>
            </div>
          </button>

          {totalAniosPlan > 5 && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`¿Estás seguro de que quieres eliminar el Año Académico ${totalAniosPlan}?`)) {
                  onRemoverAnio();
                }
              }}
              className="flex items-center justify-center gap-2 w-full p-4 rounded-xl border border-red-500/40 bg-red-950/30 hover:bg-red-900/40 text-red-300 hover:text-red-200 text-sm font-semibold transition-all"
            >
              <Trash2 size={18} />
              Eliminar Año {totalAniosPlan}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

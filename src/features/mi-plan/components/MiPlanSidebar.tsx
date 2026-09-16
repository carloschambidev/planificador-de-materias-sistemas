// ============================================================
// COMPONENTE: MiPlanSidebar (Catálogo de Materias Horizontal Superior)
// Lista horizontal deslizante con asignaturas pendientes para arrastrar
// ============================================================

import { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { MiPlanCard } from "../../../features/mi-plan/components/MiPlanCard";
import type { MateriaCompleta } from "../../../core/types";

interface Props {
  materiasDisponibles: MateriaCompleta[];
  materiaSeleccionada: MateriaCompleta | null;
  onSelectMateria: (materia: MateriaCompleta) => void;
}

export function MiPlanSidebar({
  materiasDisponibles,
  materiaSeleccionada,
  onSelectMateria,
}: Props) {
  const [busqueda, setBusqueda] = useState('');
  const [nivelFiltro, setNivelFiltro] = useState<number | 'todos'>('todos');

  const materiasFiltradas = materiasDisponibles.filter((m) => {
    const query = busqueda.toLowerCase().trim();
    const coincideTexto =
      query === '' ||
      m.nombre.toLowerCase().includes(query) ||
      m.codigo.toLowerCase().includes(query);

    const coincideNivel = nivelFiltro === 'todos' || m.nivel === nivelFiltro;
    return coincideTexto && coincideNivel;
  });

  return (
    <div className="w-full rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4 backdrop-blur-md">
      {/* Cabecera y Controles del Catálogo Horizontal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-background text-secondary border border-border">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-primary tracking-tight">
                Catálogo de Materias Pendientes
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-background text-secondary border border-border">
                {materiasDisponibles.length} disponibles
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Haz clic en una materia para seleccionarla y luego elige el año/cuatrimestre en la tabla.
            </p>
          </div>
        </div>

        {/* Buscador y Botones de Filtro por Nivel */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Buscador */}
          <div className="relative w-full sm:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-primary placeholder-muted focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          {/* Botones de Nivel (sin que se corten) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setNivelFiltro('todos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                nivelFiltro === 'todos'
                  ? 'bg-brand border-brand text-white font-bold'
                  : 'bg-background hover:bg-surface-hover border-border text-muted hover:text-primary'
              }`}
            >
              Todos ({materiasDisponibles.length})
            </button>
            {[1, 2, 3, 4, 5].map((niv) => {
              const conteo = materiasDisponibles.filter((m) => m.nivel === niv).length;
              if (conteo === 0 && nivelFiltro !== niv) return null;
              return (
                <button
                  key={niv}
                  type="button"
                  onClick={() => setNivelFiltro(niv)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    nivelFiltro === niv
                      ? 'bg-brand border-brand text-white font-bold'
                      : 'bg-background hover:bg-surface-hover border-border text-muted hover:text-primary'
                  }`}
                >
                  Nivel {niv} ({conteo})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Carrusel Horizontal Deslizante */}
      <div className="overflow-x-auto py-3 px-2 -mx-1 scrollbar-thin">
        {materiasFiltradas.length === 0 ? (
          <div className="py-8 text-center text-secondary/50 text-xs font-medium border border-dashed border rounded-xl">
            No se encontraron materias pendientes con tu filtro.
          </div>
        ) : (
          <div className="flex items-stretch gap-3.5">
            {materiasFiltradas.map((materia) => (
              <MiPlanCard
                key={materia.id}
                materia={materia}
                enTablero={false}
                isSelected={materiaSeleccionada?.id === materia.id}
                onSelect={() => onSelectMateria(materia)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

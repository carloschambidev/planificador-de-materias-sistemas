// ============================================================
// COMPONENTE: MiPlanSidebar (Catálogo de Materias Horizontal Superior)
// Lista horizontal deslizante con asignaturas pendientes para arrastrar
// ============================================================

import { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { MiPlanCard } from './MiPlanCard';
import type { MateriaCompleta } from '../../types';

interface Props {
  materiasDisponibles: MateriaCompleta[];
}

export function MiPlanSidebar({ materiasDisponibles }: Props) {
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
    <div className="w-full rounded-2xl border border-gray-800/90 bg-gradient-to-r from-gray-950 via-gray-900/95 to-gray-950 p-5 shadow-2xl flex flex-col gap-4">
      {/* Cabecera y Controles del Catálogo Horizontal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-gray-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Catálogo de Materias Pendientes
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                {materiasDisponibles.length} disponibles
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Desliza horizontalmente y arrastra las materias hacia tu tabla académica inferior
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
              className="w-full bg-gray-900/95 border border-gray-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Botones de Nivel (sin que se corten) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setNivelFiltro('todos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                nivelFiltro === 'todos'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'bg-gray-900/80 hover:bg-gray-800 border-gray-800 text-gray-400 hover:text-white'
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
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30 font-bold'
                      : 'bg-gray-900/80 hover:bg-gray-800 border-gray-800 text-gray-400 hover:text-white'
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
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        {materiasFiltradas.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-xs font-medium border border-dashed border-gray-800 rounded-xl">
            No se encontraron materias pendientes con tu filtro.
          </div>
        ) : (
          <div className="flex items-stretch gap-3">
            {materiasFiltradas.map((materia) => (
              <MiPlanCard
                key={materia.id}
                materia={materia}
                enTablero={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

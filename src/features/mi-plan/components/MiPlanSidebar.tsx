// ============================================================
// COMPONENTE: MiPlanSidebar (Pool de Materias Pendientes)
// Bandeja colapsable multilínea con asignaturas pendientes
// ============================================================

import { useState } from 'react';
import { Search, Book, ChevronDown, ChevronUp } from 'lucide-react';
import type { MateriaCompleta } from "../../../core/types";
import { normalizeText } from "../../../core/utils/strings";

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
  const [isExpanded, setIsExpanded] = useState(true);

  const materiasFiltradas = materiasDisponibles.filter((m) => {
    const query = normalizeText(busqueda).trim();
    const coincideTexto =
      query === '' ||
      normalizeText(m.nombre).includes(query) ||
      normalizeText(m.codigo).includes(query);

    const coincideNivel = nivelFiltro === 'todos' || m.nivel === nivelFiltro;
    return coincideTexto && coincideNivel;
  });

  return (
    <div className="w-full rounded-2xl border border-border bg-surface flex flex-col backdrop-blur-md">
      {/* Cabecera y Controles del Catálogo */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-2.5 px-4 border-b border-border">
        <div className="flex items-center justify-between lg:justify-start gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-3">
            {/* Oculto en móvil, visible en escritorio */}
            <div className="hidden sm:flex items-center gap-2 text-primary font-bold">
              <Book className="text-amber-400" size={18} />
              <span>Stack de Materias</span>
              <span className="text-slate-500 font-normal">|</span>
              <span className="text-slate-400 text-sm font-medium">{materiasDisponibles.length} pendientes</span>
            </div>

            {/* Vista Móvil */}
            <div className="flex sm:hidden items-center gap-2">
              <Book className="text-amber-400 shrink-0" size={16} />
              <span className="font-bold text-sm text-slate-100">Stack</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs font-medium text-slate-400">{materiasDisponibles.length} pendientes</span>
            </div>
          </div>
          {/* Botón para expandir/colapsar en móvil */}
          <button 
            type="button" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-2 rounded-lg bg-background border border-border text-secondary hover:text-primary transition-colors"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Buscador y Botones de Filtro por Nivel */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Buscador */}
          <div className="relative w-full sm:w-56">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Buscar materia..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full h-9 sm:h-10 bg-background border border-border rounded-xl pl-9 pr-3 text-sm text-primary placeholder-muted focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          {/* Botones de Nivel */}
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5 w-full">
            <button
              type="button"
              onClick={() => setNivelFiltro('todos')}
              className={
                nivelFiltro === 'todos'
                  ? "h-8 md:h-9 px-3 md:px-4 rounded-lg text-[10px] md:text-xs font-bold transition-all border bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40 shadow-sm truncate"
                  : "h-8 md:h-9 px-3 md:px-4 rounded-lg text-[10px] md:text-xs font-medium transition-all border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 truncate"
              }
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
                  className={
                    nivelFiltro === niv
                      ? "h-8 md:h-9 px-3 md:px-4 rounded-lg text-[10px] md:text-xs font-bold transition-all border bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40 shadow-sm truncate"
                      : "h-8 md:h-9 px-3 md:px-4 rounded-lg text-[10px] md:text-xs font-medium transition-all border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 truncate"
                  }
                >
                  Nivel {niv} ({conteo})
                </button>
              );
            })}
          </div>
          
          {/* Botón para expandir/colapsar en desktop */}
          <button 
            type="button" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:flex p-2 rounded-lg bg-background border border-border text-secondary hover:text-primary transition-colors ml-1"
            title={isExpanded ? "Minimizar panel" : "Expandir panel"}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Bandeja Colapsable Multilínea */}
      {isExpanded && (
        <div className="py-3 px-4">
          {materiasFiltradas.length === 0 ? (
            <div className="py-6 text-center text-secondary/50 text-xs font-medium border border-dashed border-border rounded-xl">
              No se encontraron materias pendientes con tu filtro.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 max-h-[116px] overflow-y-auto custom-scrollbar pr-1">
              {materiasFiltradas.map((materia) => {
                const isSelected = materiaSeleccionada?.id === materia.id;
                
                return (
                  <button
                    key={materia.id}
                    onClick={() => onSelectMateria(materia)}
                    className={`h-8 px-2.5 rounded-xl border flex items-center gap-2 text-xs transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                        : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {/* Badge de Sigla de Alto Contraste */}
                    <span className="font-mono font-black text-[10px] px-1.5 py-0.5 rounded bg-slate-600 text-white dark:bg-slate-700/80 dark:text-slate-100 shrink-0">
                      {materia.codigo}
                    </span>
                    <span className="font-semibold truncate text-left w-full">{materia.nombre}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{materia.horas}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

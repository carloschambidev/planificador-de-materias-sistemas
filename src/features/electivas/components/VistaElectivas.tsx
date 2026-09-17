import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Search, ChevronDown, Check, Lock, Code2, Brain, ShieldCheck, Briefcase, Palette, History } from 'lucide-react';
import { ELECTIVAS } from "../../../core/data/electivas";
import { useCorrelatividades } from "../../../core/hooks/useCorrelatividades";
import { useCarreraStore } from "../../../core/store/useCarreraStore";
import { cuentaComoRegularizada, cuentaComoAprobada, type ElectivaDefinicion } from "../../../core/types";
import { ElectivaDetailModal } from './ElectivaDetailModal';
import { normalizeText } from "../../../core/utils/strings";

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  align?: 'left' | 'right';
}

function CustomDropdown({ value, onChange, options, placeholder, align = 'left' }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full md:w-auto" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between gap-2 shadow-sm transition-all cursor-pointer min-w-[140px]"
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown size={14} className={`text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-1.5 ${align === 'right' ? 'right-0' : 'left-0'} min-w-full w-[260px] max-w-[calc(100vw-2rem)] sm:w-max sm:max-w-xs bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-xl dark:shadow-2xl backdrop-blur-xl z-50 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150`}>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center justify-between gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 font-semibold border-blue-200 dark:border-blue-500/30'
                    : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function VistaElectivas() {
  const { materias, getMateriaCompleta } = useCorrelatividades();
  const estadoMaterias = useCarreraStore((s) => s.estadoMaterias);
  const asignarElectiva = useCarreraStore((s) => s.asignarElectiva);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<'Todas' | 'Habilitadas'>('Todas');
  const [filterArea, setFilterArea] = useState<string>('Todas');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileCards, setExpandedMobileCards] = useState<Record<string, boolean>>({});
  const [selectedElectiva, setSelectedElectiva] = useState<ElectivaDefinicion | null>(null);

  const handleOpenAsignar = (electiva: ElectivaDefinicion) => {
    setSelectedElectiva(null);
    setActiveDropdown(electiva.id);
  };

  // Obtener slots de electivas del plan (ej. EL3, EL4, EL5)
  const slotsElectivas = materias.filter((m) => m.esElectiva);

  // Función para verificar si una electiva específica cumple sus requisitos
  const verificarRequisitos = (electivaId: string) => {
    const def = ELECTIVAS.find(e => e.id === electivaId);
    if (!def) return {
      habilitada: false,
      motivos: [],
      regularizadas: [],
      aprobadas: [],
    };

    const reqsReg = def.requisitos?.paraCursar?.regularizadas ?? def.regularizadasRequeridas ?? [];
    const reqsApr = def.requisitos?.paraCursar?.aprobadas ?? def.aprobadasRequeridas ?? [];

    const motivos: string[] = [];
    const regularizadas = reqsReg.map((id) => getMateriaCompleta(id)?.nombre ?? id);
    const aprobadas = reqsApr.map((id) => getMateriaCompleta(id)?.nombre ?? id);

    for (const reqId of reqsReg) {
      const reqEstado = estadoMaterias[reqId]?.estado ?? 'no-iniciada';
      if (!cuentaComoRegularizada(reqEstado)) {
        motivos.push(`Requiere regularizar: ${getMateriaCompleta(reqId)?.nombre ?? reqId}`);
      }
    }
    for (const reqId of reqsApr) {
      const reqEstado = estadoMaterias[reqId]?.estado ?? 'no-iniciada';
      if (!cuentaComoAprobada(reqEstado)) {
        motivos.push(`Requiere aprobar: ${getMateriaCompleta(reqId)?.nombre ?? reqId}`);
      }
    }

    const habilitada = motivos.length === 0;

    return {
      habilitada,
      motivos,
      regularizadas,
      aprobadas,
    };
  };

  // Obtener todas las electivas activas del sistema (Plan 2023 y Plan 2008 vigentes)
  const electivasActivas = ELECTIVAS;

  // Agrupar electivas en las 6 categorías ordenadas
  const ordenCategorias = [
    'Desarrollo y Arquitectura de Software',
    'Inteligencia Artificial y Datos',
    'Ciberseguridad e Infraestructura',
    'Gestión, Producto y Negocios Digitales',
    'Diseño, UX y Multimedia',
    'Electivas Históricas (Plan 2008)',
  ];
  const areas = Array.from(new Set(electivasActivas.map(e => e.area)))
    .sort((a, b) => {
      const idxA = ordenCategorias.indexOf(a);
      const idxB = ordenCategorias.indexOf(b);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 md:space-y-8 pb-4"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-6">
        <div className="hidden md:block">
          <h2 className="text-xl sm:text-2xl font-bold text-primary uppercase tracking-wider">
            Materias Electivas
          </h2>
          <p className="text-sm text-secondary mt-1">
            Explora las materias optativas y asígnalas a los bloques de tu plan de estudios.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 w-full xl:w-auto">
          <div className="relative w-full md:w-auto">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar materia o código..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-[42px] sm:h-11 pl-10 pr-3.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:border-blue-500 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all shadow-sm md:w-80 md:h-10 md:px-3.5 md:pl-9 md:text-sm md:rounded-xl"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2 w-full md:flex md:w-auto">
            <CustomDropdown
              value={filterState}
              onChange={(val) => setFilterState(val as 'Todas' | 'Habilitadas')}
              options={[
                { value: 'Todas', label: 'Todas' },
                { value: 'Habilitadas', label: 'Habilitadas' }
              ]}
              placeholder="Estado"
            />
            
            <CustomDropdown
              value={filterArea}
              onChange={(val) => setFilterArea(val)}
              options={[
                { value: 'Todas', label: 'Todos los grupos' },
                { value: 'Desarrollo y Arquitectura de Software', label: 'Desarrollo y Arquitectura' },
                { value: 'Inteligencia Artificial y Datos', label: 'IA y Datos' },
                { value: 'Ciberseguridad e Infraestructura', label: 'Ciberseguridad e Infr.' },
                { value: 'Gestión, Producto y Negocios Digitales', label: 'Gestión y Negocios' },
                { value: 'Diseño, UX y Multimedia', label: 'Diseño y Multimedia' },
                { value: 'Electivas Históricas (Plan 2008)', label: 'Electivas Históricas' }
              ]}
              placeholder="Grupo"
              align="right"
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-3 mt-4 md:mt-6">
        {areas.map((area) => {
          const isCollapsed = collapsedGroups[area] ?? true;
          
          const filteredMaterias = electivasActivas.filter(e => {
            if (e.area !== area) return false;
            if (searchQuery) {
               const query = normalizeText(searchQuery);
               const matchesName = normalizeText(e.nombre).includes(query);
               const matchesCode = normalizeText(e.codigo || '').includes(query);
               if (!matchesName && !matchesCode) return false;
            }
            if (filterState === 'Habilitadas') {
               const reqs = verificarRequisitos(e.id);
               if (!reqs.habilitada) return false;
            }
            return true;
          });
          
          if (filteredMaterias.length === 0) return null;
          if (filterArea !== 'Todas' && area !== filterArea) return null;

          const disponiblesCount = filteredMaterias.filter(m => verificarRequisitos(m.id).habilitada).length;

          let grupoIcon = null;
          let customBg = 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900/80';
          let customBorder = 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80';
          let customOpacity = '';

          if (area.includes('Desarrollo y Arquitectura')) {
             grupoIcon = <Code2 className="text-sky-500 dark:text-sky-400 shrink-0" size={17} />;
          } else if (area.includes('Inteligencia Artificial')) {
             grupoIcon = <Brain className="text-purple-500 dark:text-purple-400 shrink-0" size={17} />;
          } else if (area.includes('Ciberseguridad')) {
             grupoIcon = <ShieldCheck className="text-emerald-500 dark:text-emerald-400 shrink-0" size={17} />;
          } else if (area.includes('Gestión, Producto')) {
             grupoIcon = <Briefcase className="text-amber-500 dark:text-amber-400 shrink-0" size={17} />;
          } else if (area.includes('Diseño, UX')) {
             grupoIcon = <Palette className="text-pink-500 dark:text-pink-400 shrink-0" size={17} />;
          } else if (area.includes('Plan 2008')) {
             grupoIcon = <History className="text-slate-500 dark:text-slate-400 shrink-0" size={17} />;
             customBg = 'bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900/60';
             customBorder = 'border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700/60';
             customOpacity = 'opacity-85 hover:opacity-100 transition-opacity';
          }

          return (
            <div key={area} className="space-y-4">
              {area.includes('Plan 2008') && filterArea === 'Todas' && !searchQuery && (
                <div className="my-4 pt-2 flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                    Plan Anterior Vigente
                  </span>
                  <div className="flex-1 border-t border-slate-200 dark:border-slate-800/50" />
                </div>
              )}
              <div 
                onClick={() => setCollapsedGroups(prev => ({ ...prev, [area]: !prev[area] }))}
                className={`w-full py-3.5 px-4 rounded-xl ${customBg} border ${customBorder} ${customOpacity} flex items-center justify-between gap-4 transition-all select-none cursor-pointer shadow-sm md:shadow-md mb-2.5`}
              >
                {/* Lado Izquierdo: Ícono y Nombre del Grupo */}
                <div className="flex items-center gap-2.5 min-w-0">
                  {grupoIcon}
                  <h3 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 truncate">
                    {area}
                  </h3>
                </div>

                {/* Lado Derecho: Resumen Rápido + Barra de Progreso + Badge + Chevron */}
                <div className="flex items-center gap-4 shrink-0">
                  {/* Texto y Mini Barra de Progreso (visible en tablet/desktop) */}
                  <div className="hidden sm:flex items-center gap-3 text-xs">
                    <span className={disponiblesCount > 0 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-500 font-medium"}>
                      {disponiblesCount > 0 ? (
                         <><strong className="text-emerald-600 dark:text-emerald-400 font-bold">{disponiblesCount}</strong> de {filteredMaterias.length} habilitadas</>
                      ) : (
                         <>{disponiblesCount} de {filteredMaterias.length} habilitadas</>
                      )}
                    </span>
                    {/* Barrita de progreso de materias habilitadas */}
                    <div className="w-20 lg:w-28 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${disponiblesCount > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400 dark:bg-slate-800'}`}
                        style={{ width: `${(disponiblesCount / filteredMaterias.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Badge con total de materias */}
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.15)] leading-none">
                    {filteredMaterias.length} materias
                  </span>

                  {/* Flecha indicadora */}
                  <ChevronDown 
                    size={17} 
                    className={`text-slate-400 transition-transform duration-200 ${!isCollapsed ? 'rotate-180' : ''}`} 
                  />
                </div>
              </div>

              {!isCollapsed && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMaterias.map((electiva) => {
                const requisitos = verificarRequisitos(electiva.id);
                const { habilitada } = requisitos;
                const slotAsignado = slotsElectivas.find(s => s.estadoDinamico.electivaAsignadaId === electiva.id);

                const isMobileExpanded = expandedMobileCards[electiva.id] ?? false;

                return (
                  <div 
                    key={electiva.id} 
                    onClick={() => setSelectedElectiva(electiva)}
                    className={`flex flex-col bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700/80 rounded-2xl shadow-sm md:shadow-lg transition-all duration-200 cursor-pointer md:hover:border-slate-600/80 ${activeDropdown === electiva.id ? 'relative z-50' : 'relative z-10'}`}
                  >
                    {/* Fila Compacta Mobile */}
                    <div 
                      className="md:hidden h-10 min-h-[42px] flex items-center justify-between px-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors"
                      onClick={(e) => { e.stopPropagation(); setExpandedMobileCards(prev => ({ ...prev, [electiva.id]: !prev[electiva.id] })); }}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                        <span className="shrink-0 text-[10px] font-mono font-black tracking-tight px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 dark:bg-slate-200 dark:text-slate-950 shadow-sm leading-none">
                          {electiva.codigo || 'ELEC'}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {electiva.nombre}
                        </h4>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {slotAsignado ? (
                          <span className="text-blue-600 bg-blue-50 border border-blue-200 dark:text-blue-300 dark:bg-blue-950/40 dark:border-blue-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Asignada
                          </span>
                        ) : habilitada ? (
                          <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Disponible
                          </span>
                        ) : (
                          <span className="shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 flex items-center gap-1">
                            <Lock size={9} className="text-amber-500 dark:text-amber-400" />
                            <span>Bloqueada</span>
                          </span>
                        )}
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isMobileExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Contenido Completo (Siempre visible en Desktop, desplegable en Mobile) */}
                    {/* Contenido Completo (Siempre visible en Desktop, desplegable en Mobile) */}
                    <div className={`flex-col justify-between p-4 md:flex ${isMobileExpanded ? 'flex border-t border-slate-200 dark:border-slate-800/70' : 'hidden'} backdrop-blur-md gap-3`}>
                      <div>
                        {/* Cabecera interna */}
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="shrink-0 text-[10px] md:text-[11px] font-mono font-black tracking-tight px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 dark:bg-slate-200 dark:text-slate-950 shadow-sm leading-none">
                                {electiva.codigo || 'ELEC'}
                              </span>
                              {electiva.esPlan2008 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                  [Plan 2008]
                                </span>
                              )}
                              {/* Badges de Estado Dinámicos (Desktop) */}
                              {slotAsignado ? (
                                <span className="text-blue-600 bg-blue-50 border border-blue-200 dark:text-blue-300 dark:bg-blue-950/40 dark:border-blue-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  Asignada a Nivel {slotAsignado.nivel}
                                </span>
                              ) : habilitada ? (
                                <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  Disponible
                                </span>
                              ) : (
                                <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 flex items-center gap-1">
                                  <Lock size={10} className="text-amber-500 dark:text-amber-400" />
                                  <span>Bloqueada</span>
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-slate-900 dark:hover:text-white mt-1 leading-snug">{electiva.nombre}</h4>
                          </div>

                          <div className="relative shrink-0">
                            {slotAsignado ? (
                               <button 
                                 onClick={(e) => { e.stopPropagation(); asignarElectiva(slotAsignado.id, ''); }}
                                 className="h-7 px-2.5 rounded-lg text-[11px] font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20 flex items-center gap-1.5 transition-all shadow-sm"
                               >
                                 <Trash2 size={13} />
                               </button>
                            ) : (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!habilitada) return;
                                  setActiveDropdown(activeDropdown === electiva.id ? null : electiva.id);
                                }}
                                disabled={!habilitada}
                                title={!habilitada ? "Debes cumplir todas las correlativas para cursar antes de asignarla al plan" : undefined}
                                className={!habilitada
                                  ? "shrink-0 h-7 px-2.5 rounded-lg text-[11px] font-semibold bg-slate-800/30 text-slate-500 border border-slate-800/50 cursor-not-allowed opacity-50 flex items-center gap-1.5 select-none"
                                  : "shrink-0 h-7 px-2.5 rounded-lg text-[11px] font-semibold bg-blue-50 dark:bg-blue-600/15 hover:bg-blue-100 dark:hover:bg-blue-600/25 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 dark:hover:border-blue-400/50 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"}
                              >
                                <span>Asignar</span>
                                <ChevronDown size={13} className={!habilitada ? "text-slate-500" : "text-blue-500 dark:text-blue-400"} />
                              </button>
                            )}

                            {activeDropdown === electiva.id && !slotAsignado && (
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                                {slotsElectivas.map(slot => {
                                  const asignadaAOtro = slot.estadoDinamico.electivaAsignadaId && slot.estadoDinamico.electivaAsignadaId !== electiva.id;
                                  const nombreOcupante = asignadaAOtro ? getMateriaCompleta(slot.estadoDinamico.electivaAsignadaId!)?.nombre : null;

                                  return (
                                    <button
                                      key={slot.id}
                                      disabled={!!asignadaAOtro}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!habilitada && !slotAsignado) return;
                                        asignarElectiva(slot.id, electiva.id);
                                        setActiveDropdown(null);
                                      }}
                                      className={`w-full text-left px-3 py-2 transition-colors flex flex-col gap-0.5 ${
                                        asignadaAOtro 
                                          ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900' 
                                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                      }`}
                                    >
                                      <span className={`text-xs font-semibold ${asignadaAOtro ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>Nivel {slot.nivel}</span>
                                      {asignadaAOtro && <span className="text-[9px] text-slate-500 truncate">{nombreOcupante}</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1 mb-2">
                          {electiva.descripcion ?? 'Materia optativa del plan de estudios.'}
                        </p>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] text-slate-600 dark:text-slate-500 font-medium mr-1.5">Correlativas:</span>
                          {(electiva.regularizadasRequeridas?.length > 0 || electiva.aprobadasRequeridas?.length > 0) ? (
                            <>
                              {(electiva.regularizadasRequeridas ?? []).map(id => {
                                 const m = getMateriaCompleta(id);
                                 return (
                                    <span key={`reg-${id}`} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5" title={`${m?.nombre} (Regularizada)`}>
                                      {m?.codigo || id}
                                    </span>
                                 );
                              })}
                              {(electiva.aprobadasRequeridas ?? []).map(id => {
                                 const m = getMateriaCompleta(id);
                                 return (
                                    <span key={`apr-${id}`} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5" title={`${m?.nombre} (Aprobada)`}>
                                      {m?.codigo || id}
                                    </span>
                                 );
                              })}
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-500">Ninguna</span>
                          )}
                        </div>
                        
                        <div className="md:hidden mt-3 border-t border-slate-200 dark:border-slate-800/70 pt-2">
                           <button 
                             onClick={(e) => { e.stopPropagation(); setSelectedElectiva(electiva); }}
                             className="w-full text-center text-xs font-semibold text-blue-600 dark:text-blue-400 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                           >
                             Ver detalles
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedElectiva && (
        <ElectivaDetailModal 
          electiva={selectedElectiva}
          onClose={() => setSelectedElectiva(null)}
          onAsignar={handleOpenAsignar}
          estadoStyle={
            slotsElectivas.find(s => s.estadoDinamico.electivaAsignadaId === selectedElectiva.id) 
              ? 'text-blue-600 border-blue-200 dark:text-blue-300 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-950/40' 
              : verificarRequisitos(selectedElectiva.id).habilitada 
                ? 'text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30'
                : 'text-amber-600 border-amber-200 dark:text-amber-400 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/40'
          }
          estadoTexto={
            slotsElectivas.find(s => s.estadoDinamico.electivaAsignadaId === selectedElectiva.id) 
              ? 'Asignada' 
              : verificarRequisitos(selectedElectiva.id).habilitada 
                ? 'Disponible' 
                : 'Bloqueada'
          }
        />
      )}
    </motion.div>
  );
}

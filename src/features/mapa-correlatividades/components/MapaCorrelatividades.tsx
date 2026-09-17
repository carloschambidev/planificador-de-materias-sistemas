// ============================================================
// COMPONENTE: MapaCorrelatividades
// Vista tabla estilo plan oficial UTN — tema claro
// Sin flechas ni grafo, solo cards por nivel con estado
// ============================================================

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Clock, BookOpen, Star, Check, Diamond, CircleDot, Circle, ChevronDown, Download, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import type { MateriaCompleta } from "../../../core/types";
import { ESTADO_CONFIG, BLOQUEADA_CONFIG, NIVELES_NOMBRES } from "../../../core/types";
import { getMateriaById } from "../../../core/data/materias";
import { getProgressColor } from "../../../core/utils/styles";

interface Props {
  materias: MateriaCompleta[];
}


function MiniCard({ materia, onClick }: { materia: MateriaCompleta; onClick: () => void }) {
  const estado = materia.estadoDinamico.estado;
  let iconElement: React.ReactNode = null;

  if (materia.estaBloqueada) {
    iconElement = <Lock className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />;
  } else {
    switch (estado) {
      case 'promocionada':
        iconElement = <Star className="w-3 h-3 md:w-4 md:h-4 text-fuchsia-600 dark:text-fuchsia-400 fill-current drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]" />;
        break;
      case 'aprobada':
        iconElement = <Check strokeWidth={3} className="w-3 h-3 md:w-4 md:h-4 text-emerald-600 dark:text-emerald-400" />;
        break;
      case 'regularizada':
        iconElement = <Diamond className="w-3 h-3 md:w-4 md:h-4 text-amber-500 dark:text-amber-400 fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />;
        break;
      case 'cursando':
        iconElement = <CircleDot className="w-3 h-3 md:w-4 md:h-4 text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />;
        break;
      case 'no-iniciada':
      default:
        break;
    }
  }

  const regularizadas = materia.regularizadasRequeridas.length > 0
    ? `Reg: ${materia.regularizadasRequeridas.map(id => getMateriaById(id)?.codigo ?? id).join(', ')}`
    : '';
  const aprobadas = materia.aprobadasRequeridas.length > 0
    ? `Apr: ${materia.aprobadasRequeridas.map(id => getMateriaById(id)?.codigo ?? id).join(', ')}`
    : '';
  
  const reqsText = [regularizadas, aprobadas].filter(Boolean).join(' | ');

  let codigoMostrar = materia.codigo;
  if (codigoMostrar === 'PROYECTO FINAL' || materia.id === 'pf') {
    codigoMostrar = 'PF';
  } else if (codigoMostrar.includes('ELECTIVA') || materia.id.startsWith('electiva')) {
    codigoMostrar = 'ELEC';
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      title={reqsText || 'Sin requisitos previos'}
      className={`w-full flex items-center justify-between h-7 md:h-10 px-2 md:px-3 rounded-md bg-slate-50/80 hover:bg-slate-100/90 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-white/5 transition-all cursor-pointer min-w-0 group relative ${materia.estaBloqueada ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center gap-1.5 md:gap-2.5 min-w-0 flex-1 pr-1.5">
        <span className="font-mono font-black text-[10px] px-1.5 py-0.5 rounded bg-slate-600 text-white dark:bg-slate-700/80 dark:text-slate-100 shrink-0">
          {codigoMostrar}
        </span>
        <span className="text-[10.5px] md:text-[13px] font-medium md:font-semibold text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white truncate">
          {materia.nombre}
        </span>
      </div>
      <div className="shrink-0 flex items-center justify-center">
        {iconElement}
      </div>
    </motion.button>
  );
}

// ── Modal de detalle al hacer click ────────────────────────
function DetalleModal({ materia, onClose }: { materia: MateriaCompleta; onClose: () => void }) {
  const cfgEstado = materia.estaBloqueada ? BLOQUEADA_CONFIG : ESTADO_CONFIG[materia.estadoDinamico.estado];

  const muchosRequisitos =
    materia.motivoBloqueo.length > 5 ||
    materia.regularizadasRequeridas.length > 5 ||
    materia.aprobadasRequeridas.length > 5;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className={`relative w-full ${muchosRequisitos ? 'max-w-3xl md:max-w-4xl' : 'max-w-sm'} rounded-2xl bg-surface-elevated border border-border shadow-elevated overflow-y-auto max-h-[90vh] z-10 backdrop-blur-md`}
          style={{
            borderLeftWidth: '2px',
            borderLeftColor: cfgEstado.color,
          }}
        >
          {/* Header */}
          <div
            className="px-5 pt-5 pb-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-sutil bg-surface-active text-secondary"
                  >
                    {materia.codigo}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfgEstado.bgColor} ${cfgEstado.textColor} ${cfgEstado.borderColor}`}
                  >
                    {materia.estaBloqueada ? '🔒 Bloqueada' : `${cfgEstado.icon} ${cfgEstado.label}`}
                  </span>
                </div>
                <h3 className="text-base font-bold leading-snug text-primary">
                  {materia.nombre}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-black/5 transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            {/* Meta */}
            <div className="flex gap-3 mt-2 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {(materia.estadoDinamico.duracionPersonalizada ?? materia.duracion) === 'anual' ? 'Anual' : 'Cuatrimestral'}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={11} />
                Nivel {materia.nivel}
              </span>
              {materia.esElectiva && (
                <span className="text-status-promoted font-medium">Electiva</span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-5 pb-5">
            <div className={`${muchosRequisitos ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}`}>
              {/* Correlativas para Cursar */}
              {(materia.regularizadasRequeridas.length > 0 || materia.aprobadasRequeridas.length > 0) && (
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Lock size={16} className="text-rose-500 dark:text-rose-400" /> 
                    Para habilitar la cursada necesitas:
                  </h4>
                  <div className="flex flex-col gap-2 mt-1">
                    {materia.regularizadasRequeridas.map(id => {
                      const materiaRequerida = getMateriaById(id);
                      return (
                        <div key={`reg-${id}`} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{materiaRequerida?.nombre ?? id}</span>
                          <span className="text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                            Regularizada
                          </span>
                        </div>
                      );
                    })}
                    {materia.aprobadasRequeridas.map(id => {
                      const materiaRequerida = getMateriaById(id);
                      return (
                        <div key={`apr-${id}`} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{materiaRequerida?.nombre ?? id}</span>
                          <span className="text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                            Aprobada
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Banner Unificado de Información */}
              {(materia.regularizadasRequeridas.length > 0 || materia.aprobadasRequeridas.length > 0 || materia.requisitoAdicional) && (
                <div className="mt-1 flex items-start gap-3 p-3.5 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50">
                  <Info size={18} className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1.5 text-xs text-blue-800 dark:text-blue-200/80 leading-relaxed">
                    {(materia.regularizadasRequeridas.length > 0 || materia.aprobadasRequeridas.length > 0) && (
                      <p>
                        <strong className="text-blue-900 dark:text-blue-300">Para cursar:</strong> Debes cumplir con todas las correlativas listadas arriba.
                      </p>
                    )}
                    {materia.requisitoAdicional && (
                      <p>
                        <strong className="text-blue-900 dark:text-blue-300">Para aprobar la materia:</strong> {materia.requisitoAdicional}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notas */}
            {materia.estadoDinamico.notasPersonales && (
              <div className="p-2.5 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-700">
                📝 {materia.estadoDinamico.notasPersonales}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Panel de estadísticas superior ─────────────────────────
function StatsBar({ materias }: { materias: MateriaCompleta[] }) {
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const total = materias.length;
  const aprobadas = materias.filter(m => m.estadoDinamico.estado === 'aprobada').length;
  const promocionadas = materias.filter(m => m.estadoDinamico.estado === 'promocionada').length;
  const cursando = materias.filter(m => m.estadoDinamico.estado === 'cursando').length;
  const regularizadas = materias.filter(m => m.estadoDinamico.estado === 'regularizada').length;

  const restantes = total - (aprobadas + promocionadas);

  const LeyendaContent = () => (
    <>
      <div className="flex items-center justify-center md:justify-start gap-1 md:gap-1.5">
        <Lock className="text-amber-500" size={14} />
        <span>Bloqueada</span>
      </div>
      <div className="flex items-center justify-center md:justify-start gap-1 md:gap-1.5">
        <Circle className="text-slate-400" size={14} />
        <span>No iniciada</span>
      </div>
      <div className="flex items-center justify-center md:justify-start gap-1 md:gap-1.5">
        <CircleDot className="text-cyan-400" size={14} />
        <span>Cursando</span>
      </div>
      <div className="flex items-center justify-center md:justify-start gap-1 md:gap-1.5">
        <Diamond className="text-amber-400 fill-amber-400" size={14} />
        <span>Regularizada</span>
      </div>
      <div className="flex items-center justify-center md:justify-start gap-1 md:gap-1.5">
        <Check className="text-emerald-400" size={14} strokeWidth={3} />
        <span>Aprobada</span>
      </div>
      <div className="flex items-center justify-center md:justify-start gap-1 md:gap-1.5">
        <Star className="text-fuchsia-400 fill-fuchsia-400" size={14} />
        <span>Promocionada</span>
      </div>
    </>
  );

  return (
    <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 mb-6 flex flex-col shadow-sm">
      {/* Fila Superior */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 w-full">
        
        {/* Mobile: Botón Contadores */}
        <button 
          className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
          onClick={() => setIsStatsOpen(!isStatsOpen)}
        >
          Contador
          <ChevronDown size={14} className={`transition-transform duration-200 ${isStatsOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Desktop: Contadores Inline */}
        <div className="hidden md:flex flex-wrap items-center gap-4 text-sm shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Total</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 leading-none mt-0.5">{total}</span>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700/50" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Aprob.</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 leading-none mt-0.5">{aprobadas}</span>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700/50" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Prom.</span>
            <span className="font-bold text-purple-600 dark:text-purple-400 leading-none mt-0.5">{promocionadas}</span>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700/50" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Reg.</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 leading-none mt-0.5">{regularizadas}</span>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700/50" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Curs.</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 leading-none mt-0.5">{cursando}</span>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700/50" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Rest.</span>
            <span className="font-bold text-slate-500 dark:text-slate-400 leading-none mt-0.5">{restantes}</span>
          </div>
        </div>

        {/* Desktop: Leyenda */}
        <div className="hidden xl:flex items-center xl:ml-auto xl:mr-6 shrink-0">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <LeyendaContent />
          </div>
        </div>

        {/* Botón Descargar PDF */}
        <a
          href={`${import.meta.env.BASE_URL}plan-estudio-oficial.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl text-xs font-semibold tracking-wide bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 dark:bg-slate-900/60 dark:hover:bg-purple-950/30 dark:border-slate-800 dark:hover:border-purple-500/40 dark:text-slate-200 dark:hover:text-purple-300 shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-200 backdrop-blur-md cursor-pointer shrink-0 md:ml-auto xl:ml-0"
        >
          <Download size={16} className="text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Descargar Plan de Estudio 2023</span>
          <span className="sm:hidden">Plan 2023</span>
        </a>
      </div>

      {/* Mobile: Panel Desplegable */}
      <AnimatePresence>
        {isStatsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
          >
            {/* Contadores Mobile */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl mt-3 mb-2">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Total</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{total}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Aprob.</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">{aprobadas}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Prom.</span>
                <span className="font-bold text-purple-600 dark:text-purple-400 text-sm mt-0.5">{promocionadas}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Reg.</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm mt-0.5">{regularizadas}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Curs.</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm mt-0.5">{cursando}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Rest.</span>
                <span className="font-bold text-slate-500 dark:text-slate-400 text-sm mt-0.5">{restantes}</span>
              </div>
            </div>

            {/* Leyenda Mobile */}
            <div className="grid grid-cols-3 gap-x-2 gap-y-2 text-[10px] text-slate-300 dark:text-slate-400 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/60">
              <LeyendaContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Componente principal ────────────────────────────────────
export function MapaCorrelatividades({ materias }: Props) {
  const [seleccionada, setSeleccionada] = useState<MateriaCompleta | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Agrupar por nivel
  const porNivel = new Map<number, MateriaCompleta[]>();
  for (const m of materias) {
    if (!porNivel.has(m.nivel)) porNivel.set(m.nivel, []);
    porNivel.get(m.nivel)!.push(m);
  }

  const getTopBarColor = (nivel: number) => {
    switch (nivel) {
      case 1: return 'bg-blue-500';
      case 2: return 'bg-emerald-400';
      case 3: return 'bg-amber-400';
      case 4: return 'bg-fuchsia-500';
      case 5: return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  const scrollToNivel = (index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cards = container.children;
    
    if (index >= 0 && index < cards.length) {
      const card = cards[index] as HTMLElement;
      // Calcula el scroll exacto para centrar la tarjeta en la pantalla
      const scrollLeft = card.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-transparent rounded-2xl border border-gray-200 dark:border-transparent p-5">
      {/* Stats bar */}
      <StatsBar materias={materias} />

      {/* Tabla de niveles — Scroll horizontal en mobile, ajuste completo en PC */}
      <div className="w-full">
        <div 
          ref={carouselRef}
          className="w-full flex md:grid md:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth px-8 md:px-0 py-2 no-scrollbar pb-6"
        >
          {[1, 2, 3, 4, 5].map(nivel => {
            const cols = porNivel.get(nivel) ?? [];
            const aprobadas = cols.filter(m =>
              m.estadoDinamico.estado === 'aprobada' || m.estadoDinamico.estado === 'promocionada'
            ).length;

            const porcentaje = cols.length > 0 ? (aprobadas / cols.length) * 100 : 0;

            return (
              <div key={nivel} className="relative overflow-hidden w-[78vw] max-w-[285px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink flex flex-col bg-white/90 dark:bg-slate-900/40 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-2.5 md:p-3.5 gap-2 backdrop-blur-md shadow-sm shadow-slate-200/50 dark:shadow-none transition-colors">
                <div className={`absolute top-0 left-0 right-0 h-[2px] ${getTopBarColor(nivel)}`} />
                {/* Encabezado nivel */}
                <div className="flex items-center justify-between w-full px-1 mb-1 text-center">
                  {nivel > 1 ? (
                    <button 
                      onClick={() => scrollToNivel(nivel - 2)}
                      className="md:hidden p-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 transition-all"
                    >
                      <ChevronLeft size={14} />
                    </button>
                  ) : (
                    <div className="w-6 md:hidden" />
                  )}
                  
                  <div className="flex-1 text-center">
                    <h3 className="text-slate-900 dark:text-slate-100 font-bold md:font-extrabold uppercase tracking-wider text-xs md:text-sm">
                      {NIVELES_NOMBRES[nivel]}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-[9.5px] md:text-xs mt-0.5">
                      {aprobadas}/{cols.length} completadas
                    </p>
                  </div>
                  
                  {nivel < 5 ? (
                    <button 
                      onClick={() => scrollToNivel(nivel)}
                      className="md:hidden p-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-90 transition-all"
                    >
                      <ChevronRight size={14} />
                    </button>
                  ) : (
                    <div className="w-6 md:hidden" />
                  )}
                </div>
                {/* Mini progress */}
                <div className="mt-1.5 h-1 md:h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getProgressColor(porcentaje).bgClass}`}
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-1.5 md:gap-2">
                  {cols.map((materia, i) => (
                    <motion.div
                      key={materia.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <MiniCard
                        materia={materia}
                        onClick={() => setSeleccionada(materia)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal detalle */}
      <AnimatePresence>
        {seleccionada && (
          <DetalleModal
            materia={seleccionada}
            onClose={() => setSeleccionada(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

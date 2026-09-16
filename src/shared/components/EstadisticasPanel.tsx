// ============================================================
// COMPONENTE: EstadisticasPanel
// Panel superior con contadores, barra de progreso y stats
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ChevronDown, Lock, Circle, CircleDot, Diamond, Check, Star } from 'lucide-react';

interface Props {
  stats: {
    total: number;
    aprobadas: number;
    promocionadas: number;
    cursando: number;
    regularizadas: number;
    completadas: number;
    porcentaje: number;
    restantes: number;
  };
}


import { getProgressColor } from '../../core/utils/styles';

export function EstadisticasPanel({ stats }: Props) {
  const { total, aprobadas, promocionadas, cursando, restantes, porcentaje } = stats;
  const [isProgresoStatsOpen, setIsProgresoStatsOpen] = useState(false);

  const { textClass, bgClass } = getProgressColor(porcentaje);

  return (
    <div className="space-y-4">
      {/* Barra de progreso principal */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-2xl p-3 md:p-4 mb-3 bg-white border border-slate-200 shadow-sm dark:bg-slate-900/40 dark:border-slate-800/80 dark:backdrop-blur-md dark:shadow-none"
      >
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-200">
              <TrendingUp size={14} className={textClass} />
              <span>Progreso de la carrera</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              {stats.completadas} de {total} materias completadas
            </p>
          </div>
          <span className="text-xl md:text-3xl font-black text-slate-900 dark:text-white">
            {porcentaje}%
          </span>
        </div>

        {/* Progress bar con gradiente colorido */}
        <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${porcentaje}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            className={`h-full rounded-full relative ${bgClass}`}
          >
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Stats Toggle */}
      <div className="flex justify-center mb-3 md:hidden">
        <button
          onClick={() => setIsProgresoStatsOpen(!isProgresoStatsOpen)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
        >
          <span>Métricas y Leyenda</span>
          <ChevronDown size={14} className={`transition-transform duration-200 ${isProgresoStatsOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Mobile Stats Grid */}
      <AnimatePresence>
        {isProgresoStatsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-3 p-3 bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl mb-4 shadow-sm dark:backdrop-blur-md">
              {/* Grilla 3x2 de contadores */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-start justify-center p-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 border-l-2 border-l-blue-500 dark:border-l-blue-500 pl-2.5">
                  <span className="text-[9px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Total</span>
                  <span className="text-base font-black text-slate-800 dark:text-white mt-0.5">{total}</span>
                </div>
                <div className="flex flex-col items-start justify-center p-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 border-l-2 border-l-cyan-400 dark:border-l-cyan-400 pl-2.5">
                  <span className="text-[9px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Curs.</span>
                  <span className="text-base font-black text-slate-800 dark:text-white mt-0.5">{cursando}</span>
                </div>
                <div className="flex flex-col items-start justify-center p-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 border-l-2 border-l-slate-400 dark:border-l-slate-400 pl-2.5">
                  <span className="text-[9px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Rest.</span>
                  <span className="text-base font-black text-slate-800 dark:text-white mt-0.5">{restantes}</span>
                </div>
                <div className="flex flex-col items-start justify-center p-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 border-l-2 border-l-amber-500 dark:border-l-amber-500 pl-2.5">
                  <span className="text-[9px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Reg.</span>
                  <span className="text-base font-black text-slate-800 dark:text-white mt-0.5">{stats.regularizadas}</span>
                </div>
                <div className="flex flex-col items-start justify-center p-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 border-l-2 border-l-emerald-500 dark:border-l-emerald-500 pl-2.5">
                  <span className="text-[9px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Aprob.</span>
                  <span className="text-base font-black text-slate-800 dark:text-white mt-0.5">{aprobadas}</span>
                </div>
                <div className="flex flex-col items-start justify-center p-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 border-l-2 border-l-fuchsia-500 dark:border-l-fuchsia-500 pl-2.5">
                  <span className="text-[9px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Prom.</span>
                  <span className="text-base font-black text-slate-800 dark:text-white mt-0.5">{promocionadas}</span>
                </div>
              </div>

              {/* Separador sutil */}
              <div className="border-t border-slate-200 dark:border-slate-800/70" />

              {/* Leyenda simétrica 3x2 compacta */}
              <div>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center mb-2">Leyenda de estados</p>
                <div className="grid grid-cols-3 gap-x-2 gap-y-2 text-[10px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-center gap-1.5"><Lock size={12} className="text-amber-500" /><span>Bloqueada</span></div>
                  <div className="flex items-center justify-center gap-1.5"><Circle size={12} className="text-slate-400" /><span>No iniciada</span></div>
                  <div className="flex items-center justify-center gap-1.5"><CircleDot size={12} className="text-cyan-500 dark:text-cyan-400" /><span>Cursando</span></div>
                  <div className="flex items-center justify-center gap-1.5"><Diamond size={12} className="text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" /><span>Regularizada</span></div>
                  <div className="flex items-center justify-center gap-1.5"><Check size={12} className="text-emerald-500 dark:text-emerald-400" strokeWidth={3} /><span>Aprobada</span></div>
                  <div className="flex items-center justify-center gap-1.5"><Star size={12} className="text-fuchsia-500 dark:text-fuchsia-400 fill-fuchsia-500 dark:fill-fuchsia-400" /><span>Promocionada</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contadores y Leyenda Unificados - Escritorio */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 items-stretch">
        {/* Lado Izquierdo: Contadores */}
        <div className="md:col-span-7 lg:col-span-8 grid grid-cols-3 gap-2.5">
          <div className="relative overflow-hidden flex flex-col justify-center py-2 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-sm h-14 transition-all hover:bg-slate-100 dark:hover:bg-slate-900/70">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
            <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase leading-none pl-1">Total Materias</span>
            <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mt-1 leading-none pl-1">{total}</span>
          </div>
          <div className="relative overflow-hidden flex flex-col justify-center py-2 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-sm h-14 transition-all hover:bg-slate-100 dark:hover:bg-slate-900/70">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-400" />
            <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase leading-none pl-1">Cursando</span>
            <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mt-1 leading-none pl-1">{cursando}</span>
          </div>
          <div className="relative overflow-hidden flex flex-col justify-center py-2 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-sm h-14 transition-all hover:bg-slate-100 dark:hover:bg-slate-900/70">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-400" />
            <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase leading-none pl-1">Restantes</span>
            <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mt-1 leading-none pl-1">{restantes}</span>
          </div>
          <div className="relative overflow-hidden flex flex-col justify-center py-2 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-sm h-14 transition-all hover:bg-slate-100 dark:hover:bg-slate-900/70">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400" />
            <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase leading-none pl-1">Regularizadas</span>
            <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mt-1 leading-none pl-1">{stats.regularizadas}</span>
          </div>
          <div className="relative overflow-hidden flex flex-col justify-center py-2 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-sm h-14 transition-all hover:bg-slate-100 dark:hover:bg-slate-900/70">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-400" />
            <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase leading-none pl-1">Aprobadas</span>
            <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mt-1 leading-none pl-1">{aprobadas}</span>
          </div>
          <div className="relative overflow-hidden flex flex-col justify-center py-2 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 shadow-sm h-14 transition-all hover:bg-slate-100 dark:hover:bg-slate-900/70">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-fuchsia-400" />
            <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase leading-none pl-1">Promocionadas</span>
            <span className="text-lg lg:text-xl font-black text-slate-900 dark:text-white mt-1 leading-none pl-1">{promocionadas}</span>
          </div>
        </div>

        {/* Lado Derecho: Leyenda de Estados */}
        <div className="md:col-span-5 lg:col-span-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl py-2.5 px-4 backdrop-blur-md flex flex-col justify-center shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Leyenda de estados
          </span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5"><Lock size={12} className="text-amber-500 shrink-0" /><span>Bloqueada</span></div>
            <div className="flex items-center gap-1.5"><Circle size={12} className="text-slate-400 shrink-0" /><span>No iniciada</span></div>
            <div className="flex items-center gap-1.5"><CircleDot size={12} className="text-cyan-500 dark:text-cyan-400 shrink-0" /><span>Cursando</span></div>
            <div className="flex items-center gap-1.5"><Diamond size={12} className="text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 shrink-0" /><span>Regularizada</span></div>
            <div className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500 dark:text-emerald-400 shrink-0" strokeWidth={2.5} /><span>Aprobada</span></div>
            <div className="flex items-center gap-1.5"><Star size={12} className="text-fuchsia-500 dark:text-fuchsia-400 fill-fuchsia-500 dark:fill-fuchsia-400 shrink-0" /><span>Promocionada</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

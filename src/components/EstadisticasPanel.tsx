// ============================================================
// COMPONENTE: EstadisticasPanel
// Panel superior con contadores, barra de progreso y stats
// ============================================================

import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Star, PlayCircle, Clock, TrendingUp } from 'lucide-react';

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

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  delay?: number;
}

function StatCard({ label, value, icon, color, bgColor, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3 p-4 rounded-xl bg-gray-800/60 border border-gray-700/50 backdrop-blur-sm"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: bgColor }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <div className="text-2xl font-bold text-white leading-none">{value}</div>
        <div className="text-xs text-gray-400 mt-0.5">{label}</div>
      </div>
    </motion.div>
  );
}

export function EstadisticasPanel({ stats }: Props) {
  const { total, aprobadas, promocionadas, cursando, restantes, porcentaje } = stats;

  // Color del progreso según porcentaje
  const progressColor =
    porcentaje >= 80
      ? '#10B981'
      : porcentaje >= 50
      ? '#3B82F6'
      : porcentaje >= 25
      ? '#F59E0B'
      : '#6B7280';

  return (
    <div className="space-y-4">
      {/* Barra de progreso principal */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-gray-800/60 border border-gray-700/50 backdrop-blur-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} style={{ color: progressColor }} />
              <span className="text-sm font-semibold text-gray-200">Progreso de la carrera</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {stats.completadas} de {total} materias completadas
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span
              className="text-4xl font-black"
              style={{ color: progressColor }}
            >
              {porcentaje}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${porcentaje}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            className="h-full rounded-full relative"
            style={{ backgroundColor: progressColor }}
          >
            <div className="absolute inset-0 bg-white/10 rounded-full" />
            <div
              className="absolute right-0 top-0 bottom-0 w-4 rounded-full blur-sm"
              style={{ backgroundColor: progressColor }}
            />
          </motion.div>
        </div>

        {/* Sub-stats */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mt-3 text-xs text-gray-500">
          <span>
            <span className="text-emerald-400 font-semibold">{aprobadas}</span> aprobadas
          </span>
          <span>
            <span className="text-green-400 font-semibold">{promocionadas}</span> promocionadas
          </span>
          <span>
            <span className="text-blue-400 font-semibold">{cursando}</span> cursando
          </span>
          <span className="ml-auto">
            <span className="text-gray-400 font-semibold">{restantes}</span> restantes
          </span>
        </div>
      </motion.div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label="Total materias"
          value={total}
          icon={<BookOpen size={18} />}
          color="#94A3B8"
          bgColor="#94A3B822"
          delay={0}
        />
        <StatCard
          label="Aprobadas"
          value={aprobadas}
          icon={<CheckCircle size={18} />}
          color="#22C55E"
          bgColor="#22C55E22"
          delay={0.05}
        />
        <StatCard
          label="Promocionadas"
          value={promocionadas}
          icon={<Star size={18} />}
          color="#10B981"
          bgColor="#10B98122"
          delay={0.1}
        />
        <StatCard
          label="Cursando"
          value={cursando}
          icon={<PlayCircle size={18} />}
          color="#3B82F6"
          bgColor="#3B82F622"
          delay={0.15}
        />
        <StatCard
          label="Regularizadas"
          value={stats.regularizadas}
          icon={<Clock size={18} />}
          color="#F59E0B"
          bgColor="#F59E0B22"
          delay={0.2}
        />
        <StatCard
          label="Restantes"
          value={restantes}
          icon={<BookOpen size={18} />}
          color="#9CA3AF"
          bgColor="#9CA3AF22"
          delay={0.25}
        />
      </div>
    </div>
  );
}

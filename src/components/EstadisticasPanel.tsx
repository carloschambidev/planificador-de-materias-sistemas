// ============================================================
// COMPONENTE: EstadisticasPanel
// Panel superior con contadores, barra de progreso y stats
// ============================================================

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

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

function StatCard({ label, value, color, bgColor, delay = 0 }: Omit<StatCardProps, 'icon'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="group flex flex-col justify-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-br from-gray-800/40 to-gray-900/30 border backdrop-blur-sm hover:shadow-lg transition-all duration-300"
      style={{
        borderColor: color + '40',
        background: `linear-gradient(135deg, ${bgColor} 0%, transparent 100%)`,
      }}
    >
      <div className="text-left">
        <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</div>
        <div className="text-2xl font-bold text-white leading-none mt-1">{value}</div>
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
      : '#eceff3';

  return (
    <div className="space-y-4">
      {/* Barra de progreso principal */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} style={{ color: progressColor }} />
              <span className="text-sm font-semibold text-gray-100">Progreso de la carrera</span>
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

        {/* Progress bar con gradiente colorido */}
        <div className="h-4 bg-gray-700/60 rounded-full overflow-hidden border border-gray-600/40 shadow-lg">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${porcentaje}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            className="h-full rounded-full relative shadow-lg"
            style={{
              background: 'linear-gradient(90deg, #10B981 0%, #06B6D4 25%, #3B82F6 50%, #8B5CF6 75%, #EC4899 100%)',
              boxShadow: `0 0 20px ${progressColor}80`,
            }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full" />
            <div
              className="absolute right-0 top-0 bottom-0 w-6 rounded-full blur-md"
              style={{
                background: 'linear-gradient(90deg, #EC4899, #8B5CF6)',
                boxShadow: '0 0 15px rgba(236, 72, 153, 0.6)',
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Cards de estadísticas - Primera fila */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Total materias"
          value={total}
          color="#6366F1"
          bgColor="#6366F122"
          delay={0}
        />
        <StatCard
          label="Cursando"
          value={cursando}
          color="#2563EB"
          bgColor="#2563EB22"
          delay={0.05}
        />
        <StatCard
          label="Restantes"
          value={restantes}
          color="#64748B"
          bgColor="#64748B22"
          delay={0.1}
        />
      </div>

      {/* Cards de estadísticas - Segunda fila */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Regularizadas"
          value={stats.regularizadas}
          color="#F97316"
          bgColor="#F9731622"
          delay={0.15}
        />
        <StatCard
          label="Aprobadas"
          value={aprobadas}
          color="#16A34A"
          bgColor="#16A34A22"
          delay={0.2}
        />
        <StatCard
          label="Promocionadas"
          value={promocionadas}
          color="#8B5CF6"
          bgColor="#8B5CF622"
          delay={0.25}
        />
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE: MateriaCard
// Tarjeta individual para cada materia del plan de estudios
// ============================================================

import { motion } from 'framer-motion';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';
import type { MateriaCompleta } from '../types';
import { ESTADO_CONFIG, BLOQUEADA_CONFIG } from '../types';
import { getMateriaById } from '../data/materias';

function formatCorrelativasLista(ids: string[], maxVisible = 3): string {
  if (!ids || ids.length === 0) return '';
  const codigos = ids.map((id) => getMateriaById(id)?.codigo ?? id.toUpperCase());
  if (codigos.length <= maxVisible) {
    return codigos.join(', ');
  }
  const visibles = codigos.slice(0, maxVisible).join(', ');
  const restantes = codigos.length - maxVisible;
  const textoMaterias = restantes === 1 ? 'materia' : 'materias';
  return `${visibles}... (+${restantes} ${textoMaterias})`;
}

interface Props {
  materia: MateriaCompleta;
  onClick: () => void;
}

export function MateriaCard({ materia, onClick }: Props) {
  const { estadoDinamico, estaBloqueada, motivoBloqueo } = materia;
  const estado = estadoDinamico.estado;
  const cfg = estaBloqueada ? BLOQUEADA_CONFIG : ESTADO_CONFIG[estado];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        estaBloqueada
          ? {}
          : {
              y: -4,
              boxShadow: `0 8px 32px ${cfg.glowColor}`,
            }
      }
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative flex flex-col gap-2 p-4 rounded-xl border cursor-pointer
        transition-colors duration-200
        ${cfg.bgColor} ${cfg.borderColor}
        ${estaBloqueada ? 'opacity-60 cursor-not-allowed' : 'hover:border-opacity-100'}
      `}
      style={{
        boxShadow: estaBloqueada ? 'none' : `0 2px 12px ${cfg.glowColor}`,
      }}
    >
      {/* Indicador de estado */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full border ${cfg.borderColor} ${cfg.textColor} bg-black/20`}
        >
          {materia.codigo}
        </span>
        <span className={`text-lg leading-none ${estaBloqueada ? 'text-gray-600' : cfg.textColor}`}>
          {estaBloqueada ? '🔒' : cfg.icon}
        </span>
      </div>

      {/* Nombre */}
      <h3
        className={`text-sm font-semibold leading-tight ${
          estaBloqueada ? 'text-gray-500' : 'text-white'
        }`}
      >
        {materia.nombre}
      </h3>

      {/* Correlatividades requeridas (con truncado a 3 elementos) y requisitos adicionales */}
      {(materia.regularizadasRequeridas.length > 0 || materia.aprobadasRequeridas.length > 0 || materia.requisitoAdicional) && (
        <div className="text-[11px] space-y-0.5 border-t border-gray-800/60 pt-1.5 my-0.5">
          {materia.regularizadasRequeridas.length > 0 && (
            <p
              className="leading-tight truncate text-gray-300"
              title={`Regularizadas: ${materia.regularizadasRequeridas
                .map((id) => getMateriaById(id)?.codigo ?? id)
                .join(', ')}`}
            >
              <span className="font-semibold text-amber-400">Reg:</span>{' '}
              {formatCorrelativasLista(materia.regularizadasRequeridas, 3)}
            </p>
          )}
          {materia.aprobadasRequeridas.length > 0 && (
            <p
              className="leading-tight truncate text-gray-300"
              title={`Aprobadas: ${materia.aprobadasRequeridas
                .map((id) => getMateriaById(id)?.codigo ?? id)
                .join(', ')}`}
            >
              <span className="font-semibold text-emerald-400">Apr:</span>{' '}
              {formatCorrelativasLista(materia.aprobadasRequeridas, 3)}
            </p>
          )}
          {materia.requisitoAdicional && (
            <p
              className="leading-tight text-purple-300 font-medium italic line-clamp-2 mt-0.5"
              title={materia.requisitoAdicional}
            >
              <span className="font-semibold text-purple-400">★ Para aprobar:</span> Todas las materias del plan (sin electivas)
            </p>
          )}
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-3 mt-auto">
        <span className={`flex items-center gap-1 text-xs ${cfg.textColor}`}>
          <Clock size={11} />
          {(materia.estadoDinamico.duracionPersonalizada ?? materia.duracion) === 'anual'
            ? 'Anual'
            : 'Cuatrimestral'}
        </span>
        {materia.esElectiva && (
          <span className="flex items-center gap-1 text-xs text-purple-400">
            <BookOpen size={11} />
            Electiva
          </span>
        )}
      </div>

      {/* Badge de estado */}
      <div className="flex items-center justify-between mt-1">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-md ${
            estaBloqueada
              ? 'bg-gray-800 text-gray-500'
              : `text-white`
          }`}
          style={
            estaBloqueada
              ? {}
              : { backgroundColor: cfg.color + '99' }
          }
        >
          {estaBloqueada ? 'Bloqueada' : cfg.label}
        </span>
        <ChevronRight
          size={14}
          className={estaBloqueada ? 'text-gray-700' : 'text-gray-500'}
        />
      </div>

      {/* Tooltip de bloqueo */}
      {estaBloqueada && motivoBloqueo.length > 0 && (
        <div className="mt-1 text-xs text-gray-600 italic line-clamp-2">
          {motivoBloqueo[0]}
          {motivoBloqueo.length > 1 && ` +${motivoBloqueo.length - 1} más`}
        </div>
      )}

      {/* Glow effect overlay */}
      {!estaBloqueada && estado !== 'no-iniciada' && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top right, ${cfg.glowColor} 0%, transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  );
}

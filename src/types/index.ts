// ============================================================
// TIPOS PRINCIPALES DEL PLANIFICADOR DE MATERIAS UTN FRBA
// ============================================================

/**
 * Estados posibles de una materia.
 * El orden importa para la lógica de progresión.
 */
export type EstadoMateria =
  | 'no-iniciada'
  | 'cursando'
  | 'regularizada'
  | 'debe-final'
  | 'aprobada'
  | 'promocionada';

export type DuracionMateria = 'anual' | 'cuatrimestral';

/**
 * Definición estática de una materia en el plan de estudios.
 * Esta estructura se define en materias.ts y no cambia (excepto electivas).
 */
export interface MateriaDefinicion {
  id: string;
  nombre: string;
  codigo: string;
  nivel: 1 | 2 | 3 | 4 | 5;
  duracion: DuracionMateria;
  /** IDs de materias que deben estar REGULARIZADAS para poder cursar esta */
  regularizadasRequeridas: string[];
  /** IDs de materias que deben estar APROBADAS o PROMOCIONADAS para poder cursar esta */
  aprobadasRequeridas: string[];
  esElectiva?: boolean;
}

/**
 * Estado dinámico de una materia (guardado en store / LocalStorage).
 */
export interface EstadoDinamico {
  estado: EstadoMateria;
  notasPersonales?: string;
  nombrePersonalizado?: string;
  duracionPersonalizada?: DuracionMateria;
}

/**
 * Materia completa: definición + estado dinámico + info computada.
 */
export interface MateriaCompleta extends MateriaDefinicion {
  estadoDinamico: EstadoDinamico;
  /** Calculado dinámicamente: true si no puede cursarse por correlatividades */
  estaBloqueada: boolean;
  /** Motivo del bloqueo (lista de materias pendientes) */
  motivoBloqueo: string[];
}

/**
 * Colores y etiquetas para cada estado.
 */
export const ESTADO_CONFIG: Record<EstadoMateria, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  glowColor: string;
  icon: string;
}> = {
  'no-iniciada': {
    label: 'No iniciada',
    color: '#4B5563',
    bgColor: 'bg-gray-800/60',
    borderColor: 'border-gray-600',
    textColor: 'text-gray-400',
    glowColor: 'transparent',
    icon: '○',
  },
  cursando: {
    label: 'Cursando',
    color: '#2563EB',
    bgColor: 'bg-blue-900/40',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-300',
    glowColor: 'rgba(59,130,246,0.25)',
    icon: '◉',
  },
  regularizada: {
    label: 'Regularizada',
    color: '#D97706',
    bgColor: 'bg-amber-900/40',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-300',
    glowColor: 'rgba(245,158,11,0.25)',
    icon: '◈',
  },
  'debe-final': {
    label: 'Debe Final',
    color: '#EA580C',
    bgColor: 'bg-orange-900/40',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-300',
    glowColor: 'rgba(249,115,22,0.25)',
    icon: '◇',
  },
  aprobada: {
    label: 'Aprobada',
    color: '#16A34A',
    bgColor: 'bg-green-900/40',
    borderColor: 'border-green-500',
    textColor: 'text-green-300',
    glowColor: 'rgba(34,197,94,0.25)',
    icon: '✓',
  },
  promocionada: {
    label: 'Promocionada',
    color: '#8B5CF6',
    bgColor: 'bg-violet-900/40',
    borderColor: 'border-violet-500',
    textColor: 'text-violet-300',
    glowColor: 'rgba(139,92,246,0.3)',
    icon: '★',
  },
};

/**
 * Config para estado "bloqueada" (no es un EstadoMateria pero necesita estilo propio)
 */
export const BLOQUEADA_CONFIG = {
  label: 'Bloqueada',
  color: '#374151',
  bgColor: 'bg-gray-900/80',
  borderColor: 'border-gray-700',
  textColor: 'text-gray-600',
  glowColor: 'transparent',
  icon: '🔒',
};

/**
 * Transiciones válidas desde cada estado.
 * Regla de negocio: no se puede retroceder de aprobada a cursando, etc.
 */
export const TRANSICIONES_VALIDAS: Record<EstadoMateria, EstadoMateria[]> = {
  'no-iniciada': ['cursando'],
  cursando: ['regularizada', 'aprobada', 'promocionada', 'no-iniciada'],
  regularizada: ['debe-final', 'aprobada', 'cursando'],
  'debe-final': ['aprobada', 'regularizada'],
  aprobada: ['promocionada', 'regularizada'],
  promocionada: ['aprobada'],
};

/**
 * Determina si un estado cuenta como "regularizada" para correlatividades.
 */
export function cuentaComoRegularizada(estado: EstadoMateria): boolean {
  return ['regularizada', 'debe-final', 'aprobada', 'promocionada'].includes(estado);
}

/**
 * Determina si un estado cuenta como "aprobada" para correlatividades.
 */
export function cuentaComoAprobada(estado: EstadoMateria): boolean {
  return ['aprobada', 'promocionada'].includes(estado);
}

export const NIVELES_NOMBRES: Record<number, string> = {
  1: 'Primer Nivel',
  2: 'Segundo Nivel',
  3: 'Tercer Nivel',
  4: 'Cuarto Nivel',
  5: 'Quinto Nivel',
};

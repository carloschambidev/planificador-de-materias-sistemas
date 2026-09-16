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
  /** Carga horaria de la materia (ej: '5Hs', '200Hs Reloj') */
  horas: string;
  /** Título personalizado para la sección de requisitos (ej: 'Requisitos para Iniciar y Acreditar:') */
  tituloRequisitos?: string;
  /** Requisitos adicionales especiales no basados en correlativas estándar */
  requisitoAdicional?: string;
  /** Descripción o nota informativa adicional de la materia */
  descripcion?: string;
}

export interface RequisitosCondicion {
  regularizadas?: string[];
  aprobadas?: string[];
}

export interface RequisitosElectiva {
  paraCursar: RequisitosCondicion;
  paraAprobar?: {
    aprobadas: string[];
  };
  observacion?: string;
}

/**
 * Definición de una materia electiva específica para elegir.
 */
export interface ElectivaDefinicion {
  id: string;
  nombre: string;
  codigo?: string;
  area: string;
  descripcion?: string;
  descripcionCompleta?: string;
  regularizadasRequeridas: string[];
  aprobadasRequeridas: string[];
  esPlan2008?: boolean;
  requisitos?: RequisitosElectiva;
}

/**
 * Estado dinámico de una materia (guardado en store / LocalStorage).
 */
export interface EstadoDinamico {
  estado: EstadoMateria;
  notasPersonales?: string;
  nombrePersonalizado?: string;
  duracionPersonalizada?: DuracionMateria;
  electivaAsignadaId?: string;
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
 * 💡 AQUÍ PUEDES MODIFICAR LOS COLORES DE LA VISTA DE PLAN DE ESTUDIOS (MODO OSCURO)
 * Modifica los campos 'bgColor', 'borderColor', 'textColor' y 'color' (para los badges) según prefieras.
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
    color: 'var(--color-status-not-started)',
    bgColor: 'bg-status-not-started-soft',
    borderColor: 'border-status-not-started',
    textColor: 'text-status-not-started',
    glowColor: 'transparent',
    icon: '○',
  },
  cursando: {
    label: 'Cursando',
    color: 'var(--color-status-current)',
    bgColor: 'bg-status-current-soft',
    borderColor: 'border-status-current',
    textColor: 'text-status-current',
    glowColor: 'transparent',
    icon: '◉',
  },
  regularizada: {
    label: 'Regularizada',
    color: 'var(--color-status-regularized)',
    bgColor: 'bg-status-regularized-soft',
    borderColor: 'border-status-regularized',
    textColor: 'text-status-regularized',
    glowColor: 'transparent',
    icon: '◈',
  },
  aprobada: {
    label: 'Aprobada',
    color: 'var(--color-status-approved)',
    bgColor: 'bg-status-approved-soft',
    borderColor: 'border-status-approved',
    textColor: 'text-status-approved',
    glowColor: 'transparent',
    icon: '✓',
  },
  promocionada: {
    label: 'Promocionada',
    color: 'var(--color-status-promoted)',
    bgColor: 'bg-status-promoted-soft',
    borderColor: 'border-status-promoted',
    textColor: 'text-status-promoted',
    glowColor: 'transparent',
    icon: '★',
  },
};

/**
 * Config para estado "bloqueada" (no es un EstadoMateria pero necesita estilo propio)
 */
export const BLOQUEADA_CONFIG = {
  label: 'Bloqueada',
  color: 'var(--color-status-locked)',
  bgColor: 'bg-status-locked-soft',
  borderColor: 'border-status-locked',
  textColor: 'text-status-locked',
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
  regularizada: ['aprobada', 'cursando'],
  aprobada: ['promocionada', 'regularizada'],
  promocionada: ['aprobada'],
};

/**
 * Determina si un estado cuenta como "regularizada" para correlatividades.
 */
export function cuentaComoRegularizada(estado: EstadoMateria): boolean {
  return ['regularizada', 'aprobada', 'promocionada'].includes(estado);
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

// ============================================================
// TIPOS PARA MI PLAN (PLAN DE ESTUDIO PERSONALIZADO)
// ============================================================

export type VistaApp = 'plan' | 'mapa' | 'electivas' | 'mi-plan';

export type PeriodoPlan = 'Anual' | '1C' | '2C';

export interface ItemPlanPersonalizado {
  idMateria: string;
  anio: number; // 1, 2, 3...
  periodo: PeriodoPlan;
}


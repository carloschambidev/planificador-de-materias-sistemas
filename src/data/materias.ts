// ============================================================
// PLAN DE ESTUDIOS: Ingeniería en Sistemas de Información
// Universidad Tecnológica Nacional – Facultad Regional Buenos Aires
// ============================================================
// Fuente: Plan de estudios oficial UTN FRBA
// Cada materia incluye sus correlatividades según el reglamento:
//   - regularizadasRequeridas: deben estar regularizadas para CURSAR
//   - aprobadasRequeridas: deben estar aprobadas para CURSAR
// ============================================================

import type { MateriaDefinicion } from '../types';

export const MATERIAS: MateriaDefinicion[] = [
  // ═══════════════════════════════════════════
  // PRIMER NIVEL
  // ═══════════════════════════════════════════
  {
    id: 'spn',
    nombre: 'Sistemas y Procesos de Negocio',
    codigo: 'SPN',
    nivel: 1,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
  },
  {
    id: 'am1',
    nombre: 'Análisis Matemático I',
    codigo: 'AM1',
    nivel: 1,
    duracion: 'anual',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
  },
  {
    id: 'led',
    nombre: 'Lógica y Estructuras Discretas',
    codigo: 'LED',
    nivel: 1,
    duracion: 'anual',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
  },
  {
    id: 'aed',
    nombre: 'Algoritmos y Estructuras de Datos',
    codigo: 'AED',
    nivel: 1,
    duracion: 'anual',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
  },
  {
    id: 'arqcomp',
    nombre: 'Arquitectura de Computadoras',
    codigo: 'ArqComp',
    nivel: 1,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
  },
  {
    id: 'aga',
    nombre: 'Álgebra y Geometría Analítica',
    codigo: 'AGA',
    nivel: 1,
    duracion: 'anual',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
  },
  {
    id: 'f1',
    nombre: 'Física I',
    codigo: 'F1',
    nivel: 1,
    duracion: 'anual',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
  },
  {
    id: 'iys',
    nombre: 'Ingeniería y Sociedad',
    codigo: 'IyS',
    nivel: 1,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
  },

  // ═══════════════════════════════════════════
  // SEGUNDO NIVEL
  // ═══════════════════════════════════════════
  {
    id: 'asi',
    nombre: 'Análisis de Sistemas de Información',
    codigo: 'ASI',
    nivel: 2,
    duracion: 'anual',
    // Para cursar: SPN y AED deben estar regularizadas
    regularizadasRequeridas: ['spn', 'aed'],
    aprobadasRequeridas: [],
  },
  {
    id: 'am2',
    nombre: 'Análisis Matemático II',
    codigo: 'AM2',
    nivel: 2,
    duracion: 'anual',
    // Para cursar: AM1 y AGA deben estar regularizadas
    regularizadasRequeridas: ['am1', 'aga'],
    aprobadasRequeridas: [],
  },
  {
    id: 'ssl',
    nombre: 'Sintaxis y Semántica de los Lenguajes',
    codigo: 'SSL',
    nivel: 2,
    duracion: 'cuatrimestral',
    // Para cursar: LED y AED deben estar regularizadas
    regularizadasRequeridas: ['led', 'aed'],
    aprobadasRequeridas: [],
  },
  {
    id: 'pp',
    nombre: 'Paradigmas de Programación',
    codigo: 'PP',
    nivel: 2,
    duracion: 'anual',
    // Para cursar: AED debe estar aprobada; LED regularizada
    regularizadasRequeridas: ['led'],
    aprobadasRequeridas: ['aed'],
  },
  {
    id: 'ing1',
    nombre: 'Inglés I',
    codigo: 'ING1',
    nivel: 2,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
  },
  {
    id: 'f2',
    nombre: 'Física II',
    codigo: 'F2',
    nivel: 2,
    duracion: 'anual',
    // Para cursar: AM1 y F1 deben estar regularizadas
    regularizadasRequeridas: ['am1', 'f1'],
    aprobadasRequeridas: [],
  },
  {
    id: 'so',
    nombre: 'Sistemas Operativos',
    codigo: 'SO',
    nivel: 2,
    duracion: 'cuatrimestral',
    // Para cursar: ArqComp debe estar aprobada; AED regularizada
    regularizadasRequeridas: ['aed'],
    aprobadasRequeridas: ['arqcomp'],
  },
  {
    id: 'pye',
    nombre: 'Probabilidad y Estadística',
    codigo: 'PyE',
    nivel: 2,
    duracion: 'cuatrimestral',
    // Para cursar: AM1 y AGA deben estar regularizadas
    regularizadasRequeridas: ['am1', 'aga'],
    aprobadasRequeridas: [],
  },

  // ═══════════════════════════════════════════
  // TERCER NIVEL
  // ═══════════════════════════════════════════
  {
    id: 'dsi',
    nombre: 'Diseño de Sistemas de Información',
    codigo: 'DSI',
    nivel: 3,
    duracion: 'anual',
    // Para cursar: ASI debe estar aprobada
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['asi'],
  },
  {
    id: 'ing2',
    nombre: 'Inglés II',
    codigo: 'ING2',
    nivel: 3,
    duracion: 'cuatrimestral',
    // Para cursar: ING1 debe estar aprobada
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['ing1'],
  },
  {
    id: 'eco',
    nombre: 'Economía',
    codigo: 'ECO',
    nivel: 3,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
  },
  {
    id: 'ds',
    nombre: 'Desarrollo de Software',
    codigo: 'DS',
    nivel: 3,
    duracion: 'anual',
    // Para cursar: PP y SSL deben estar aprobadas; SO regularizada
    regularizadasRequeridas: ['so'],
    aprobadasRequeridas: ['pp', 'ssl'],
  },
  {
    id: 'bd',
    nombre: 'Bases de Datos',
    codigo: 'BD',
    nivel: 3,
    duracion: 'anual',
    // Para cursar: SSL debe estar aprobada; ASI regularizada
    regularizadasRequeridas: ['asi'],
    aprobadasRequeridas: ['ssl'],
  },
  {
    id: 'si',
    nombre: 'Seminario Integrador',
    codigo: 'SI',
    nivel: 3,
    duracion: 'cuatrimestral',
    // Para cursar: ASI y PP regularizadas
    regularizadasRequeridas: ['asi', 'pp'],
    aprobadasRequeridas: [],
  },
  {
    id: 'cdd',
    nombre: 'Comunicación de Datos',
    codigo: 'CdD',
    nivel: 3,
    duracion: 'cuatrimestral',
    // Para cursar: ArqComp aprobada; SO regularizada
    regularizadasRequeridas: ['so'],
    aprobadasRequeridas: ['arqcomp'],
  },
  {
    id: 'rdd',
    nombre: 'Redes de Datos',
    codigo: 'RdD',
    nivel: 3,
    duracion: 'cuatrimestral',
    // Para cursar: CdD regularizada
    regularizadasRequeridas: ['cdd'],
    aprobadasRequeridas: [],
  },
  {
    id: 'electiva3',
    nombre: 'Electiva',
    codigo: 'EL3',
    nivel: 3,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
    esElectiva: true,
  },

  // ═══════════════════════════════════════════
  // CUARTO NIVEL
  // ═══════════════════════════════════════════
  {
    id: 'adm',
    nombre: 'Administración de Sistemas de Información',
    codigo: 'ADM',
    nivel: 4,
    duracion: 'anual',
    // Para cursar: DSI debe estar aprobada
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['dsi'],
  },
  {
    id: 'an',
    nombre: 'Análisis Numérico',
    codigo: 'AN',
    nivel: 4,
    duracion: 'cuatrimestral',
    // Para cursar: AM2 y PyE aprobadas
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['am2', 'pye'],
  },
  {
    id: 'ics',
    nombre: 'Ingeniería y Calidad de Software',
    codigo: 'ICS',
    nivel: 4,
    duracion: 'anual',
    // Para cursar: DS debe estar aprobada
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['ds'],
  },
  {
    id: 'sim',
    nombre: 'Simulación',
    codigo: 'SIM',
    nivel: 4,
    duracion: 'cuatrimestral',
    // Para cursar: PyE aprobada
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['pye'],
  },
  {
    id: 'leg',
    nombre: 'Legislación',
    codigo: 'LEG',
    nivel: 4,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
  },
  {
    id: 'io',
    nombre: 'Investigación Operativa',
    codigo: 'IO',
    nivel: 4,
    duracion: 'anual',
    // Para cursar: AM2 y PyE aprobadas
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['am2', 'pye'],
  },
  {
    id: 'tpa',
    nombre: 'Tecnologías para la Automatización',
    codigo: 'TPA',
    nivel: 4,
    duracion: 'cuatrimestral',
    // Para cursar: SO y CdD aprobadas
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['so', 'cdd'],
  },
  {
    id: 'cd',
    nombre: 'Ciencia de Datos',
    codigo: 'CD',
    nivel: 4,
    duracion: 'cuatrimestral',
    // Para cursar: BD y PyE aprobadas
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['bd', 'pye'],
  },
  {
    id: 'electiva4',
    nombre: 'Electiva',
    codigo: 'EL4',
    nivel: 4,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
    esElectiva: true,
  },

  // ═══════════════════════════════════════════
  // QUINTO NIVEL
  // ═══════════════════════════════════════════
  {
    id: 'pf',
    nombre: 'Proyecto Final',
    codigo: 'PF',
    nivel: 5,
    duracion: 'anual',
    // Para cursar: ASI, DS, ICS, BD aprobadas
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['asi', 'ds', 'ics', 'bd'],
  },
  {
    id: 'ia',
    nombre: 'Inteligencia Artificial',
    codigo: 'IA',
    nivel: 5,
    duracion: 'cuatrimestral',
    // Para cursar: CdD y CD aprobadas
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['cdd', 'cd'],
  },
  {
    id: 'gg',
    nombre: 'Gestión Gerencial',
    codigo: 'GG',
    nivel: 5,
    duracion: 'cuatrimestral',
    // Para cursar: ADM e IO aprobadas
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['adm', 'io'],
  },
  {
    id: 'sdg',
    nombre: 'Sistemas de Gestión',
    codigo: 'SdG',
    nivel: 5,
    duracion: 'cuatrimestral',
    // Para cursar: ADM aprobada
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['adm'],
  },
  {
    id: 'ssi',
    nombre: 'Seguridad en los Sistemas de Información',
    codigo: 'SSI',
    nivel: 5,
    duracion: 'cuatrimestral',
    // Para cursar: RdD y DS aprobadas
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['rdd', 'ds'],
  },
  {
    id: 'electiva5',
    nombre: 'Electiva',
    codigo: 'EL5',
    nivel: 5,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
    esElectiva: true,
  },
  {
    id: 'pps',
    nombre: 'Práctica Profesional Supervisada',
    codigo: 'PPS',
    nivel: 5,
    duracion: 'anual',
    // Para cursar requiere haber aprobado el 60% de las materias de la carrera
    // Se simplifica como: necesita aprobadas del 1er al 4to nivel
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['asi', 'dsi', 'ds', 'bd', 'adm', 'ics'],
  },
];

/**
 * Obtiene las materias organizadas por nivel.
 */
export function getMateriasPorNivel(): Map<number, MateriaDefinicion[]> {
  const mapa = new Map<number, MateriaDefinicion[]>();
  for (const materia of MATERIAS) {
    if (!mapa.has(materia.nivel)) {
      mapa.set(materia.nivel, []);
    }
    mapa.get(materia.nivel)!.push(materia);
  }
  return mapa;
}

/**
 * Obtiene una materia por ID.
 */
export function getMateriaById(id: string): MateriaDefinicion | undefined {
  return MATERIAS.find((m) => m.id === id);
}

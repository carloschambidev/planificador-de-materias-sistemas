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
    codigo: 'SyPN',
    nivel: 1,
    duracion: 'anual',
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
    codigo: 'LyED',
    nivel: 1,
    duracion: 'anual',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
  },
  {
    id: 'aed',
    nombre: 'Algoritmos y Estructuras de Datos',
    codigo: 'AyED',
    nivel: 1,
    duracion: 'anual',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
  },
  {
    id: 'arqcomp',
    nombre: 'Arquitectura de Computadoras',
    codigo: 'AdC',
    nivel: 1,
    duracion: 'anual',
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
    codigo: 'IngSoc',
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
    regularizadasRequeridas: ['spn', 'aed'],
    aprobadasRequeridas: [],
  },
  {
    id: 'am2',
    nombre: 'Análisis Matemático II',
    codigo: 'AM2',
    nivel: 2,
    duracion: 'anual',
    regularizadasRequeridas: ['am1', 'aga'],
    aprobadasRequeridas: [],
  },
  {
    id: 'ssl',
    nombre: 'Sintaxis y Semántica de los Lenguajes',
    codigo: 'SySL',
    nivel: 2,
    duracion: 'anual',
    regularizadasRequeridas: ['led', 'aed'],
    aprobadasRequeridas: [],
  },
  {
    id: 'pp',
    nombre: 'Paradigmas de Programación',
    codigo: 'PdP',
    nivel: 2,
    duracion: 'anual',
    regularizadasRequeridas: ['led', 'aed'],
    aprobadasRequeridas: [],
  },
  {
    id: 'ing1',
    nombre: 'Inglés I',
    codigo: 'IT1',
    nivel: 2,
    duracion: 'anual',
    regularizadasRequeridas: [],
    aprobadasRequeridas: [],
  },
  {
    id: 'f2',
    nombre: 'Física II',
    codigo: 'F2',
    nivel: 2,
    duracion: 'anual',
    regularizadasRequeridas: ['am1', 'f1'],
    aprobadasRequeridas: [],
  },
  {
    id: 'so',
    nombre: 'Sistemas Operativos',
    codigo: 'SSOO',
    nivel: 2,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['arqcomp'],
    aprobadasRequeridas: [],
  },
  {
    id: 'pye',
    nombre: 'Probabilidad y Estadística',
    codigo: 'PyE',
    nivel: 2,
    duracion: 'cuatrimestral',
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
    regularizadasRequeridas: ['asi', 'pp'],
    aprobadasRequeridas: ['ing1', 'aed', 'spn'],
  },
  {
    id: 'ing2',
    nombre: 'Inglés II',
    codigo: 'IT2',
    nivel: 3,
    duracion: 'anual',
    regularizadasRequeridas: ['ing1'],
    aprobadasRequeridas: [],
  },
  {
    id: 'eco',
    nombre: 'Economía',
    codigo: 'ECO',
    nivel: 3,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['am1', 'aga'],
  },
  {
    id: 'ds',
    nombre: 'Desarrollo de Software',
    codigo: 'DdS',
    nivel: 3,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['pp', 'asi'],
    aprobadasRequeridas: ['led', 'aed'],
  },
  {
    id: 'bd',
    nombre: 'Base de Datos',
    codigo: 'BD',
    nivel: 3,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['ssl', 'asi'],
    aprobadasRequeridas: ['led', 'aed'],
  },
  {
    id: 'si',
    nombre: 'Seminario Integrador',
    codigo: 'SI',
    nivel: 3,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['asi'],
    aprobadasRequeridas: ['spn', 'aed', 'ssl', 'pp'],
  },
  {
    id: 'cdd',
    nombre: 'Comunicación de Datos',
    codigo: 'CD',
    nivel: 3,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: [],
    aprobadasRequeridas: ['arqcomp', 'f1'],
  },
  {
    id: 'rdd',
    nombre: 'Redes de Datos',
    codigo: 'RD',
    nivel: 3,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['so', 'cdd'],
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
    codigo: 'AdmSI',
    nivel: 4,
    duracion: 'anual',
    regularizadasRequeridas: ['eco', 'dsi'],
    aprobadasRequeridas: ['asi'],
  },
  {
    id: 'an',
    nombre: 'Análisis Numérico',
    codigo: 'AN',
    nivel: 4,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['am2'],
    aprobadasRequeridas: ['am1', 'aga'],
  },
  {
    id: 'ics',
    nombre: 'Ingeniería y Calidad de Software',
    codigo: 'IyCS',
    nivel: 4,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['bd', 'ds', 'dsi'],
    aprobadasRequeridas: ['ssl', 'pp'],
  },
  {
    id: 'sim',
    nombre: 'Simulación',
    codigo: 'Sim',
    nivel: 4,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['pye'],
    aprobadasRequeridas: ['am2'],
  },
  {
    id: 'leg',
    nombre: 'Legislación',
    codigo: 'Leg',
    nivel: 4,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['iys'],
    aprobadasRequeridas: [],
  },
  {
    id: 'io',
    nombre: 'Investigación Operativa',
    codigo: 'IO',
    nivel: 4,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['pye', 'an'],
    aprobadasRequeridas: [],
  },
  {
    id: 'tpa',
    nombre: 'Tecnologías para la Automatización',
    codigo: 'TpA',
    nivel: 4,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['f2', 'an'],
    aprobadasRequeridas: ['am2'],
  },
  {
    id: 'cd',
    nombre: 'Ciencia de Datos',
    codigo: 'CdD',
    nivel: 4,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['sim'],
    aprobadasRequeridas: ['pye', 'bd'],
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
    regularizadasRequeridas: ['ics', 'adm', 'rdd'],
    aprobadasRequeridas: ['ing2', 'ds', 'dsi'],
  },
  {
    id: 'ia',
    nombre: 'Inteligencia Artificial',
    codigo: 'IA',
    nivel: 5,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['sim'],
    aprobadasRequeridas: ['pye', 'an'],
  },
  {
    id: 'gg',
    nombre: 'Gestión Gerencial',
    codigo: 'GC',
    nivel: 5,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['leg', 'adm'],
    aprobadasRequeridas: ['eco'],
  },
  {
    id: 'sdg',
    nombre: 'Sistemas de Gestión',
    codigo: 'SG',
    nivel: 5,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['eco', 'io'],
    aprobadasRequeridas: ['dsi'],
  },
  {
    id: 'ssi',
    nombre: 'Seguridad en los Sistemas de Información',
    codigo: 'SSI',
    nivel: 5,
    duracion: 'cuatrimestral',
    regularizadasRequeridas: ['rdd', 'adm'],
    aprobadasRequeridas: ['ds', 'cdd'],
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
    regularizadasRequeridas: ['ics', 'adm', 'rdd'],
    aprobadasRequeridas: ['ing2', 'ds', 'dsi'],
  }
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

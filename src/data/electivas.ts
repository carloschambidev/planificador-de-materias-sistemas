import type { ElectivaDefinicion } from '../types';

export const ELECTIVAS: ElectivaDefinicion[] = [
  // Gestión y Gerenciamiento de Sistemas
  {
    id: 'gerenciamiento_proyectos',
    nombre: 'Gerenciamiento de Proyectos de Sistemas de Información',
    area: 'Gestión y Gerenciamiento de Sistemas',
    regularizadasRequeridas: ['adm', 'ics'],
    aprobadasRequeridas: ['dsi', 'rdd'],
  },
  {
    id: 'admin_estrategica_rh',
    nombre: 'Administración Estratégica del Capital Humano',
    area: 'Gestión y Gerenciamiento de Sistemas',
    regularizadasRequeridas: ['spn', 'asi'],
    aprobadasRequeridas: ['iys'],
  },
  {
    id: 'metodologia_conduccion',
    nombre: 'Metodología de la Conducción de Equipos de Trabajo',
    area: 'Gestión y Gerenciamiento de Sistemas',
    regularizadasRequeridas: ['spn', 'asi'],
    aprobadasRequeridas: ['iys'],
  },
  {
    id: 'creatividad_innovacion',
    nombre: 'Creatividad e Innovación',
    area: 'Gestión y Gerenciamiento de Sistemas',
    regularizadasRequeridas: ['asi', 'eco'],
    aprobadasRequeridas: ['spn'],
  },

  // Software, Ciberseguridad e Infraestructura
  {
    id: 'tacs',
    nombre: 'Tecnologías Avanzadas en la Construcción de Software (TACS)',
    area: 'Software, Ciberseguridad e Infraestructura',
    regularizadasRequeridas: ['ds', 'dsi', 'bd'],
    aprobadasRequeridas: ['pp', 'ssl'],
  },
  {
    id: 'criptografia',
    nombre: 'Criptografía',
    area: 'Software, Ciberseguridad e Infraestructura',
    regularizadasRequeridas: ['rdd', 'cdd'],
    aprobadasRequeridas: ['led', 'aed'],
  },
  {
    id: 'ciberseguridad',
    nombre: 'Ciberseguridad',
    area: 'Software, Ciberseguridad e Infraestructura',
    regularizadasRequeridas: ['rdd', 'so'],
    aprobadasRequeridas: ['arqcomp', 'cdd'],
  },
  {
    id: 'ux',
    nombre: 'Experiencia de Usuario y Accesibilidad (UX)',
    area: 'Software, Ciberseguridad e Infraestructura',
    regularizadasRequeridas: ['dsi', 'ds'],
    aprobadasRequeridas: ['asi'],
  },

  // Inteligencia Artificial y Datos Avanzados
  {
    id: 'pln',
    nombre: 'Procesamiento del Lenguaje Natural (PLN)',
    area: 'Inteligencia Artificial y Datos Avanzados',
    regularizadasRequeridas: ['ssl', 'pye'],
    aprobadasRequeridas: ['aed', 'am1'],
  },
  {
    id: 'patrones_algoritmicos',
    nombre: 'Patrones Algorítmicos',
    area: 'Inteligencia Artificial y Datos Avanzados',
    regularizadasRequeridas: ['pp', 'aed'],
    aprobadasRequeridas: ['led'],
  }
];

export function getElectivaById(id: string): ElectivaDefinicion | undefined {
  return ELECTIVAS.find(e => e.id === id);
}

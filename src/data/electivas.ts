import type { ElectivaDefinicion } from '../types';

export const ELECTIVAS: ElectivaDefinicion[] = [
  // Gestión y Gerenciamiento de Sistemas
  {
    id: 'gerenciamiento_proyectos',
    nombre: 'Gerenciamiento de Proyectos de Sistemas de Información',
    area: 'Gestión y Gerenciamiento de Sistemas',
    descripcion: 'Enfoque en planificación, liderazgo y control de proyectos de software y sistemas.',
    regularizadasRequeridas: ['adm', 'ics'],
    aprobadasRequeridas: ['dsi', 'rdd'],
  },
  {
    id: 'admin_estrategica_rh',
    nombre: 'Administración Estratégica del Capital Humano',
    area: 'Gestión y Gerenciamiento de Sistemas',
    descripcion: 'Aborda gestión del talento y decisiones estratégicas de recursos humanos.',
    regularizadasRequeridas: ['spn', 'asi'],
    aprobadasRequeridas: ['iys'],
  },
  {
    id: 'metodologia_conduccion',
    nombre: 'Metodología de la Conducción de Equipos de Trabajo',
    area: 'Gestión y Gerenciamiento de Sistemas',
    descripcion: 'Desarrolla habilidades de dirección, coordinación y trabajo en equipo.',
    regularizadasRequeridas: ['spn', 'asi'],
    aprobadasRequeridas: ['iys'],
  },
  {
    id: 'creatividad_innovacion',
    nombre: 'Creatividad e Innovación',
    area: 'Gestión y Gerenciamiento de Sistemas',
    descripcion: 'Explora técnicas para generar ideas, resolver problemas y promover innovación.',
    regularizadasRequeridas: ['asi', 'eco'],
    aprobadasRequeridas: ['spn'],
  },

  // Software, Ciberseguridad e Infraestructura
  {
    id: 'tacs',
    nombre: 'Tecnologías Avanzadas en la Construcción de Software (TACS)',
    area: 'Software, Ciberseguridad e Infraestructura',
    descripcion: 'Profundiza en arquitectura, calidad y prácticas modernas para construir software.',
    regularizadasRequeridas: ['ds', 'dsi', 'bd'],
    aprobadasRequeridas: ['pp', 'ssl'],
  },
  {
    id: 'criptografia',
    nombre: 'Criptografía',
    area: 'Software, Ciberseguridad e Infraestructura',
    descripcion: 'Estudia fundamentos y mecanismos de seguridad para proteger la información.',
    regularizadasRequeridas: ['rdd', 'cdd'],
    aprobadasRequeridas: ['led', 'aed'],
  },
  {
    id: 'ciberseguridad',
    nombre: 'Ciberseguridad',
    area: 'Software, Ciberseguridad e Infraestructura',
    descripcion: 'Analiza amenazas, protección de sistemas y buenas prácticas de seguridad.',
    regularizadasRequeridas: ['rdd', 'so'],
    aprobadasRequeridas: ['arqcomp', 'cdd'],
  },
  {
    id: 'ux',
    nombre: 'Experiencia de Usuario y Accesibilidad (UX)',
    area: 'Software, Ciberseguridad e Infraestructura',
    descripcion: 'Cubre diseño centrado en el usuario y accesibilidad digital.',
    regularizadasRequeridas: ['dsi', 'ds'],
    aprobadasRequeridas: ['asi'],
  },

  // Inteligencia Artificial y Datos Avanzados
  {
    id: 'pln',
    nombre: 'Procesamiento del Lenguaje Natural (PLN)',
    area: 'Inteligencia Artificial y Datos Avanzados',
    descripcion: 'Introduce métodos para procesar y comprender lenguaje natural con inteligencia artificial.',
    regularizadasRequeridas: ['ssl', 'pye'],
    aprobadasRequeridas: ['aed', 'am1'],
  },
  {
    id: 'patrones_algoritmicos',
    nombre: 'Patrones Algorítmicos',
    area: 'Inteligencia Artificial y Datos Avanzados',
    descripcion: 'Revisa soluciones reutilizables y estrategias de diseño algorítmico.',
    regularizadasRequeridas: ['pp', 'aed'],
    aprobadasRequeridas: ['led'],
  }
];

export function getElectivaById(id: string): ElectivaDefinicion | undefined {
  return ELECTIVAS.find(e => e.id === id);
}

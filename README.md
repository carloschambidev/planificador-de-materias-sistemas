# Planificador de Materias UTN FRBA

## Link de la página

Accede al sitio por este link:  
https://carloschambidev.github.io/planificador-de-materias-sistemas/ 


## Propósito

Esta aplicación web sirve para planificar y seguir el avance de la carrera de Ingeniería en Sistemas de Información de la UTN FRBA. Permite visualizar las materias del plan de estudios, registrar su estado de avance y comprender fácilmente cuáles materias están habilitadas o bloqueadas por correlatividades.

La idea principal es ayudar al estudiante a tener un panorama claro del recorrido académico, identificar qué materias puede cursar en cada momento y llevar un seguimiento personal de su carrera.

## ¿Qué hace la página?

La aplicación ofrece dos formas principales de ver la carrera:

1. Vista de plan de estudios
   - Muestra las materias organizadas por nivel.
   - Cada materia puede marcarse con un estado como: no iniciada, cursando, regularizada, debe final, aprobada o promocionada.
   - Si una materia tiene correlatividades sin cumplir, se marca como bloqueada y se muestra el motivo.

2. Vista de mapa de correlatividades
   - Presenta las relaciones entre materias en un grafo visual.
   - Permite entender mejor cómo se conectan las asignaturas entre sí.

## Funcionalidades principales

- Seguimiento del estado de cada materia.
- Validación automática de correlatividades.
- Bloqueo visual de materias que no se pueden cursar todavía.
- Estadísticas generales de avance de la carrera.
- Personalización de nombres, duración y notas por materia.
- Guardado persistente en el navegador mediante LocalStorage.
- Importación y exportación de datos en formato JSON.
- Vista visual del mapa de dependencias académicas.

## Cómo funciona internamente

La lógica de la aplicación está organizada de forma sencilla:

- El estado general de la carrera se gestiona con Zustand.
- La información base de las materias se encuentra en el archivo de datos del proyecto.
- Un hook central valida las correlatividades y calcula el estado de cada materia.
- La interfaz se actualiza automáticamente cuando el usuario cambia el estado de alguna materia.

## Estructura del proyecto

- src/App.tsx: componente principal que organiza la interfaz.
- src/components: componentes de la UI como tarjetas de materias, modales, panel de estadísticas y mapa.
- src/store/useCarreraStore.ts: estado global y persistencia.
- src/hooks/useCorrelatividades.ts: lógica para validar prerequisitos y calcular estadísticas.
- src/data/materias.ts: definición del plan de estudios y correlatividades.
- src/types: tipos TypeScript usados en la aplicación.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Framer Motion
- React Flow


## Notas importantes

- Los datos se guardan localmente en el navegador, por lo que si borras el almacenamiento del sitio, podrías perder el progreso.
- La opción de guardar o cargar desde Google Drive aparece como una funcionalidad futura o simulada en el estado actual del proyecto.

## Objetivo final

Este proyecto busca convertir el plan de estudios en una herramienta práctica, visual y fácil de usar para que cada estudiante pueda organizar su carrera de forma más clara y eficiente.

# Documentacion complementaria del arquetipo angular-archetype

Este documento evita duplicar contenido del repositorio.
La fuente de verdad funcional y tecnica es `README.md`.

## Objetivo

Usar esta guia como mapa rapido de documentacion para saber donde editar cada tema.

## Fuente canonica

- Documento canonico: `README.md`
- Documentacion local por modulo:
  - `src/app/core/README.md`
  - `src/app/layout/README.md`
  - `src/app/shared/README.md`
  - `src/app/features/README.md`

## Mapa de secciones (sin duplicacion)

- Setup, scripts, requisitos y comandos:
  - ver `README.md`
- Estructura global de `src/app`:
  - ver `README.md`
- Estructura recomendada por feature (comparativa + plantilla):
  - ver `README.md`
- Clean Architecture / Hexagonal y demo `posts`:
  - ver `README.md`
- Checklist post-clone para retirar `posts`:
  - ver `README.md`
- Calidad, cobertura, CI, E2E, seguridad y performance:
  - ver `README.md`
- Convencion de commits:
  - ver `README.md`

## Regla editorial

Antes de agregar contenido tecnico nuevo:

1. Actualizar primero `README.md`.
2. Si aplica al contexto de una carpeta concreta, resumir en su `README` local.
3. En `document.md`, agregar solo referencia al lugar canonico.

## Criterio de mantenimiento

Si una seccion de `document.md` repite pasos, tablas o listas que ya existen en otro archivo, debe reemplazarse por referencia explicita al archivo canonico.

# AGENTS.md — Modo Guiado para angular-archetype

## Propósito

Este repositorio usa un modo de trabajo **spec-driven** y **guiado por fases** para mantener trazabilidad, calidad y velocidad.

## Reglas base

1. Modo por defecto: **guiado por fases**.
2. Atajo permitido para cambios triviales: `[SIN CONTROL]`.
3. El agente debe priorizar calidad y coherencia con la arquitectura existente.
4. Fuente de verdad documental: carpeta `/plan`.

## Estructura de planificación

Se trabaja con estos archivos:

- `/plan/analisis_funcional.md`
- `/plan/analisis_tecnico.md`
- `/plan/tareas.md`
- `/plan/METADATA.md` (opcional, caché de contexto)

## Flujo recomendado

1. Análisis funcional
2. Análisis técnico
3. Definición de tareas
4. Ejecución controlada
5. Validación técnica

El agente debe pedir validación humana al cerrar cada fase documental.

## Política de ejecución (acordada)

### Requiere confirmación explícita

- Cambios de arquitectura
- Cambios de contratos públicos
- Decisiones con impacto alto (seguridad, costos, rendimiento, plazos)

### Puede ejecutarse automáticamente (si no se indica lo contrario)

- `npm run check`
- `npm run e2e`
- `npm run security:check`
- comandos de lectura/diagnóstico no destructivos

## Política de testing (TDD obligatorio)

Todo desarrollo nuevo o cambio relevante debe seguir TDD:

1. **Red**: escribir primero el test que falla.
2. **Green**: implementar el mínimo código para pasar.
3. **Refactor**: limpiar diseño manteniendo tests en verde.

### Matriz mínima de pruebas por tipo de cambio

- Cambio de lógica de dominio/aplicación:
  - tests unitarios obligatorios.
- Cambio en adaptadores, HTTP, estado, integración entre capas:
  - tests de integración obligatorios.
- Cambio en rutas, flujos de usuario, SSR o comportamiento visible de extremo a extremo:
  - tests E2E obligatorios (Playwright).

### Definition of Done (DoD) de testing

Una tarea no puede considerarse cerrada si no cumple:

1. Tests nuevos/actualizados para el cambio.
2. `npm run check` en verde.
3. `npm run e2e` en verde cuando aplique por impacto.
4. Sin reducción del umbral de cobertura establecido.

## Feature demo obligatoria de retirar

La feature `posts` es **solo demostrativa** para explicar arquitectura hexagonal.

Al iniciar un proyecto real, ejecutar checklist post-clone:

1. Eliminar `src/app/features/posts`
2. Eliminar ruta demo en `src/app/app.routes.ts` (`path: 'posts'`)
3. Ajustar `src/app/layout/home.page.ts`
4. Limpiar tests demo:
   - `src/app/features/posts/**/*.spec.ts`
   - checks de `posts` en `src/app/app.routes.spec.ts`
   - casos `/posts/1` en `e2e/app.e2e.spec.ts`
5. Crear primera feature real siguiendo el patrón hexagonal

## Guardrails operativos activos

### Calidad

- `npm run check` (lint + test:coverage + build)
- cobertura mínima en Jest

### E2E

- Playwright integrado
- desactivar temporalmente local: `E2E_DISABLED=1 npm run e2e`
- desactivar temporalmente CI: variable `E2E_DISABLED=1`

### Seguridad

- `npm run security:check`
- desactivar job security en CI: variable `SECURITY_DISABLED=1`
- modo offline local controlado para audit:
  - `SECURITY_AUDIT_ALLOW_NETWORK_ERROR=1 npm run security:audit`

## Convención de commits

Se usa Conventional Commits:

```text
tipo(scope opcional): descripcion corta
```

Validado con commitlint en `.husky/commit-msg`.

## Enrutamiento de solicitudes

Ante una nueva solicitud:

1. Si es cambio menor y el usuario usa `[SIN CONTROL]`, ejecutar directo con validación mínima.
2. Si no es menor, enrutar al flujo por fases y registrar en `/plan/tareas.md`.
3. Si implica nueva capacidad, tratarla como feature y mantener consistencia arquitectónica.

## Jira / MCP

La integración Jira/MCP es **opcional** en este repositorio.

- Si está disponible, usarla para trazabilidad.
- Si no está disponible, continuar sin bloquear el flujo local.

## Cierre de tareas

Antes de marcar una tarea como terminada, el agente debe:

1. Resumir cambios (archivos y resultado)
2. Ejecutar validaciones acordadas
3. Dejar estado listo para revisión humana

## Comando de anulación consciente

Para saltar el flujo guiado en una solicitud puntual:

```text
[SIN CONTROL]
```

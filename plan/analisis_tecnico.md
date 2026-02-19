# Analisis tecnico

## Alcance tecnico

- Archivo objetivo principal: `README.md`.
- Cambio documental sin impacto en runtime, build ni contratos publicos.
- Se reutiliza la terminologia vigente del arquetipo (Clean Architecture / Hexagonal).

## Diseno de la solucion

1. Mantener la seccion existente de estructura global (`core/shared/features/layout`).
2. Agregar nueva seccion dedicada "Estructura recomendada por feature".
3. Incluir comparativa breve:
   - recomendacion feature-first;
   - alternativa por capas globales con tradeoff.
4. Incluir plantilla de carpetas/archivos reutilizable en bloque de codigo.
5. Agregar pasos practicos de adopcion para estandarizar implementacion.

## Riesgos y mitigaciones

- Riesgo: ambiguedad entre estructura global y estructura por feature.
  - Mitigacion: separar ambas secciones y explicitar que son complementarias.

## Validacion tecnica prevista

- Revision de consistencia en `README.md`.
- No aplica `npm run check` por ser cambio documental sin ejecucion de codigo.

## Estado de fase

Pendiente de validacion humana.

---

## Solicitud 4: actualizacion integral de dependencias sin regresion

## Alcance tecnico

- Actualizacion mayor coordinada de:
  - Angular (`@angular/*`, `@angular/cli`, `@angular/build`, `@angular/ssr`),
  - Jest stack (`jest`, `jest-environment-jsdom`, `jest-preset-angular`, `@angular-builders/jest`),
  - lint stack (`angular-eslint`, `typescript-eslint`).
- Validacion completa de calidad, e2e y seguridad.

## Diseno de la solucion

1. Levantar inventario de versiones desactualizadas y peers.
2. Ejecutar migraciones oficiales con `ng update` para Angular.
3. Actualizar paquetes de test/lint a versiones compatibles con Angular objetivo.
4. Reinstalar dependencias y resolver conflictos de peer si aparecen.
5. Ejecutar `npm run check`, `npm run e2e` y `npm run security:check`.

## Riesgos y mitigaciones

- Riesgo: ruptura por salto major en Angular/Jest.
  - Mitigacion: usar migraciones oficiales + validacion completa.
- Riesgo: incompatibilidades de peer deps en lint/testing.
  - Mitigacion: alinear versiones por matriz de peers antes de instalar.
- Riesgo: cambios de config en tests.
  - Mitigacion: ajustar configuracion minima y revalidar cobertura.

## Estado de fase

Pendiente de validacion humana.

## Validacion tecnica ejecutada (solicitud 4)

- `npm run check`: verde.
- `npm run e2e`: verde.
- `npm audit --omit=dev --json`: 0 vulnerabilidades (runtime/prod).
- `npm run security:check`: falla por 41 vulnerabilidades high en devDependencies (tooling).

## Bloqueo actual

- Las vulnerabilidades high restantes provienen de toolchain (Jest/ESLint/Angular builders) tras upgrade major.
- No existe correccion no-disruptiva via `npm audit fix` (solo propone downgrades/changes incompatibles).
- Se requiere decision de politica de seguridad:
  - mantener gate global (incluye dev deps) y no cerrar upgrade, o
  - ajustar gate para produccion (`npm audit --omit=dev`) con aprobacion explicita.

---

## Solicitud 5: alineacion documental post-upgrade

## Alcance tecnico

- Verificacion de consistencia entre:
  - `README.md`,
  - `package.json`,
  - `.github/workflows/ci.yml`,
  - `document.md`.

## Diseno de la solucion

1. Buscar referencias de versiones antiguas (Angular 20/CLI 20.x).
2. Corregir secciones de `README.md` para Angular 21.
3. Corregir afirmaciones de CI que no aplican al workflow actual (E2E/security/bundle como jobs por defecto).
4. Mantener `document.md` como indice sin duplicacion.

## Validacion tecnica ejecutada

- Verificacion por grep de referencias obsoletas: completada.
- Alineacion de `README.md` con `package.json` y `ci.yml`: completada.
- No aplica `npm run check` por ser cambio documental.

## Estado de fase

Pendiente de validacion humana.

---

## Solicitud 2: deduplicacion de documentacion

## Alcance tecnico

- Archivos objetivo:
  - `document.md`
  - `src/app/core/README.md`
  - `src/app/layout/README.md`
  - `src/app/shared/README.md`
  - `src/app/features/README.md`
- Sin impacto en runtime, build, contratos ni comportamiento de app.

## Diseno de la solucion

1. Transformar `document.md` en indice de navegacion (sin repetir contenido tecnico).
2. Declarar `README.md` como fuente canonica.
3. Mantener README locales con descripcion minima del modulo y referencia canonica.
4. Evitar tablas/listas duplicadas ya presentes en `README.md`.

## Riesgos y mitigaciones

- Riesgo: perder contexto util en documentos secundarios.
  - Mitigacion: conservar resumen breve por modulo + rutas claras al documento canonico.

## Validacion tecnica prevista

- Revision manual de duplicidad entre archivos documentales: completada.
- No aplica `npm run check` ni `npm run e2e` por tratarse de cambio documental.

## Estado de fase

Pendiente de validacion humana.

---

## Solicitud 3: auditoria y mitigacion de vulnerabilidades

## Alcance tecnico

- Diagnostico de vulnerabilidades con `npm audit`.
- Mitigacion controlada via `overrides` en `package.json`.
- Regeneracion de lockfile.
- Validacion de regresiones con `check`, `e2e` y `security:check`.

## Diseno de la solucion

1. Ejecutar `npm audit --json` con red para inventario real de CVEs.
2. Aplicar `overrides` para dependencias transitorias con fix no disruptivo:
   - `tar` (vulnerabilidad high),
   - `qs` (vulnerabilidad low).
3. Reinstalar dependencias para materializar overrides.
4. Revalidar audit y ejecutar suites tecnicas.

## Riesgos y mitigaciones

- Riesgo: overrides no aplicados en `node_modules`.
  - Mitigacion: ejecutar `npm install` y verificar arbol resuelto.
- Riesgo: regresion funcional por cambios transitivos.
  - Mitigacion: `npm run check` + `npm run e2e`.
- Riesgo residual: vulnerabilidades moderadas en toolchain (eslint/angular builders) sin fix seguro inmediato.
  - Mitigacion: documentar residual y planificar actualizacion mayor en ventana controlada.

## Validacion tecnica ejecutada

- `npm audit --json`:
  - antes: 30 (1 high, 28 moderate, 1 low),
  - despues: 28 (0 high, 28 moderate, 0 low).
- `npm run check`: verde.
- `npm run e2e`: verde.
- `npm run security:check`: verde (high/critical = 0).

## Estado de fase

Pendiente de validacion humana.

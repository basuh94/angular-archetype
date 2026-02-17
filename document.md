# Documentacion del arquetipo angular-archetype

## 1. Objetivo del proyecto

`angular-archetype` es un arquetipo Angular orientado a arrancar proyectos frontend con:

- base de arquitectura limpia (Clean Architecture / Hexagonal adaptada a frontend),
- calidad automatizada desde el inicio,
- SSR listo para produccion,
- convenciones de equipo y flujo de trabajo repetible.

---

## 2. Stack tecnico

- Angular 20 (standalone, signals, control flow moderno)
- SSR con Angular + Express
- Jest (en lugar de Karma)
- ESLint + Prettier
- Husky + lint-staged
- CI con GitHub Actions

---

## 3. Arquitectura del frontend

## 3.1 Estructura general

```text
src/app/
  core/         -> cross-cutting concerns (interceptors, logging, errores globales)
  shared/       -> piezas reutilizables (componentes, directivas, pipes)
  layout/       -> paginas de estructura general
  features/     -> vertical slices por funcionalidad
```

## 3.2 Arquitectura por feature (Hexagonal)

Cada feature sigue este patron:

```text
features/<feature>/
  domain/          -> modelos y puertos (sin Angular/HTTP)
  application/     -> casos de uso
  infrastructure/  -> adaptadores concretos (HTTP, mapeos, DTOs)
  presentation/    -> facade + pagina/componente
```

Ejemplo implementado:

`/src/app/features/posts`

- endpoint real de demo: `GET https://jsonplaceholder.typicode.com/posts/1`

### Mapa conceptual del ejemplo `posts`

- Adapter IN: `PostDetailPage` + `PostDetailFacade`
- Use Case: `GetPostByIdUseCase`
- Port OUT: `PostRepository`
- Adapter OUT: `HttpPostRepository`

---

## 4. Feature de ejemplo: Posts

Importante:

- `posts` es una feature **demostrativa** para explicar la arquitectura hexagonal.
- En proyectos reales, esta feature debe eliminarse tras clonar el arquetipo.

Ruta lazy:

- `/posts/:id`

Flujo:

1. `PostDetailPage` lee `id` desde ruta.
2. `PostDetailFacade.load(id)` ejecuta caso de uso.
3. `GetPostByIdUseCase` depende de `POST_REPOSITORY`.
4. `HttpPostRepository` hace llamada HTTP.
5. DTO se mapea al modelo de dominio `Post`.
6. La pagina renderiza estados `loading/error/success`.

Archivos clave:

- `src/app/features/posts/domain/post.model.ts`
- `src/app/features/posts/domain/post-repository.port.ts`
- `src/app/features/posts/application/get-post-by-id.use-case.ts`
- `src/app/features/posts/application/post-repository.token.ts`
- `src/app/features/posts/infrastructure/http-post.repository.ts`
- `src/app/features/posts/infrastructure/post.mapper.ts`
- `src/app/features/posts/presentation/post-detail.facade.ts`
- `src/app/features/posts/presentation/post-detail.page.ts`

### Checklist para eliminar la demo `posts`

1. Eliminar `src/app/features/posts`.
2. Eliminar ruta lazy `posts` en `src/app/app.routes.ts`.
3. Ajustar o simplificar `src/app/layout/home.page.ts`.
4. Eliminar o reemplazar tests ligados a demo:
   - `src/app/features/posts/**/*.spec.ts`
   - `src/app/app.routes.spec.ts` (ruta `posts`)
   - `e2e/app.e2e.spec.ts` (escenarios de `/posts/1`)
5. Crear la primera feature de negocio real reutilizando la misma estructura.

---

## 5. Interceptor HTTP y errores

Interceptor global:

- `src/app/core/interceptors/http-request.interceptor.ts`

Hace 3 cosas:

1. registra requests/responses con contexto,
2. transforma `HttpErrorResponse` en `ApiError` uniforme,
3. relanza error normalizado para que presentation no dependa de detalles HTTP.

Modelo de error:

- `src/app/core/errors/api-error.model.ts`
- `src/app/core/errors/http-error.mapper.ts`

Tipos normalizados:

- `network`
- `client`
- `server`
- `unknown`

Ejemplo de mapeo:

- `status 0` -> `NETWORK_ERROR`
- `status 404` -> `NOT_FOUND`
- `status 5xx` -> `SERVER_ERROR`

---

## 6. Logging y manejo global de errores

Logger central:

- `src/app/core/logging/logger.service.ts`

Niveles:

- `debug`, `info`, `warn`, `error`

Handler global Angular:

- `src/app/core/errors/global-error-handler.service.ts`

Registro en app:

- `src/app/app.config.ts`

Beneficio:

- errores no capturados pasan por un punto unico,
- formato de logs consistente,
- mejor trazabilidad para soporte/observabilidad.

---

## 7. SSR (Server-Side Rendering)

Servidor SSR:

- `src/server.ts`

Incluye:

- servidor Express para SSR,
- middleware de error controlado (`SSR_RENDER_ERROR`),
- logging estructurado en arranque y errores.

Rutas de servidor:

- `src/app/app.routes.server.ts`

Nota importante:

- rutas con parametros (`posts/:id`) estan en `RenderMode.Server`.
- resto en prerender (`RenderMode.Prerender`).

---

## 8. Calidad automatica y flujo local

Scripts relevantes (package.json):

- `npm run lint`
- `npm run lint:fix`
- `npm test`
- `npm run test:coverage`
- `npm run test:related`
- `npm run check` -> `lint + test:coverage + build`
- `npm run bundle:report`
- `npm run bundle:report:build`
- `npm run security:audit`
- `npm run security:licenses`
- `npm run security:check`

Pre-commit (Husky):

- ejecuta `lint-staged` + `test:related`
- valida rapido solo lo impactado por cambios staged.

Umbral de cobertura:

- global minimo: `60%` (statements/branches/functions/lines)
- configurado en `jest.config.js`

---

## 9. CI (GitHub Actions)

Workflow:

- `.github/workflows/ci.yml`

Dispara en:

- `pull_request`
- `push` a `main`/`master`

Pipeline:

1. `npm ci`
2. `npm run check`
3. subir artefacto de cobertura (`coverage-report`)
4. generar y subir artefacto de bundle (`bundle-report`)

---

## 9.1 Guardrails del arquetipo

| Guardrail                               | Que previene                                                | Donde esta configurado                                                            |
| --------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------- |
| ESLint + Prettier                       | Errores de estilo/calidad que degradan mantenibilidad       | `eslint.config.js`, `package.json` (`lint-staged`)                                |
| Pre-commit (lint-staged + test:related) | Commits con fallos basicos o cambios sin validar            | `.husky/pre-commit`, `scripts/test-related.sh`                                    |
| CI `check` (lint + coverage + build)    | Merge de cambios que rompen lint/tests/build                | `.github/workflows/ci.yml`, `package.json` (`check`)                              |
| Cobertura minima 60%                    | Caida excesiva de calidad de tests                          | `jest.config.js` (`coverageThreshold`)                                            |
| Commitlint en `commit-msg`              | Historial inconsistente de commits                          | `commitlint.config.cjs`, `.husky/commit-msg`                                      |
| E2E base con Playwright                 | Regresiones funcionales en flujos reales de usuario         | `playwright.config.ts`, `e2e/app.e2e.spec.ts`, job `e2e` en CI                    |
| Toggle de E2E (`E2E_DISABLED`)          | Bloqueos operativos por costo/tiempo de E2E temporalmente   | `scripts/run-e2e.sh`, condición `if` en `.github/workflows/ci.yml`                |
| Arquitectura por feature (hexagonal)    | Acoplamiento alto y mezcla de capas                         | `src/app/features/*` + documentación en `README.md` y este `document.md`          |
| Budgets de Angular + reporte de bundles | Crecimiento silencioso del bundle inicial                   | `angular.json`, `scripts/bundle-report.mjs`, artefacto `bundle-report` en CI      |
| Audit + licencias en CI (`security`)    | Entrada de vulnerabilidades severas o licencias no deseadas | `scripts/security-audit.sh`, `scripts/security-licenses.sh`, job `security` en CI |

---

## 10. Runtime y compatibilidad

- Node: `>=20.19.0`
- npm: `>=10`
- `.nvmrc` incluido para alinear entorno local/CI.

Archivos:

- `.nvmrc`
- `package.json`

---

## 11. Como usar este arquetipo (guia rapida)

## 11.1 Arranque

```bash
npm install
npm start
```

Abrir:

- `http://localhost:4200/`
- `http://localhost:4200/posts/1`

## 11.2 Validacion antes de PR

```bash
npm run check
```

## 11.3 Renombrar el arquetipo

Script de bootstrap:

- `scripts/rename-project.mjs`

Comando:

```bash
npm run project:rename -- --name \"Nombre Producto\" [--slug nombre-producto] [--yes]
```

Flujo recomendado:

1. Preview (sin cambios):
   - `npm run project:rename -- --name \"Acme Portal\"`
2. Aplicar:
   - `npm run project:rename -- --name \"Acme Portal\" --slug acme-portal --yes`
3. Verificar:
   - `npm install`
   - `npm run check`
   - `npm run e2e`

## 11.4 Crear una nueva feature (patron recomendado)

1. crear carpeta `src/app/features/<feature-name>/`
2. definir `domain` (modelos + puertos)
3. crear casos de uso en `application`
4. implementar adaptadores en `infrastructure`
5. crear `facade` y pagina en `presentation`
6. enrutar lazy en `app.routes.ts`
7. cubrir con tests unitarios por capa

---

## 12. Estado actual (resumen)

- Arquitectura hexagonal por feature con ejemplo funcional (`posts` demo).
- Calidad automatizada completa (`lint`, tests, cobertura, build, CI).
- Gobernanza de contribución (`PR template`, `commitlint`, `CODEOWNERS` preparado).
- E2E con Playwright y job dedicado en CI.
- Guardrails de performance (budgets + reporte de bundle).
- Guardrails de seguridad/supply chain (audit + licencias + hardening SSR).

---

## 13. Gobernanza y contribución

### Convencion de commits

Formato:

```text
tipo(scope opcional): descripcion corta
```

Tipos recomendados:

- `feat`
- `fix`
- `refactor`
- `test`
- `docs`
- `chore`
- `ci`

Ejemplos:

- `feat(posts): add post detail facade`
- `fix(ssr): handle render error middleware`
- `docs(readme): add commit convention section`

### Validacion automatica de commits

Se agrego `commitlint` para bloquear mensajes invalidos:

- Configuracion: `commitlint.config.cjs`
- Hook: `.husky/commit-msg`

Comando usado por el hook:

```bash
npx --no -- commitlint --edit "$1"
```

Ejemplo valido:

```text
feat(posts): add normalized api error handling
```

Ejemplo invalido:

```text
arreglo rapido
```

### CODEOWNERS (preparado, no forzado)

Se agrego archivo base:

- `.github/CODEOWNERS`

Importante:

- Mientras no actives branch protection en GitHub con `Require review from Code Owners`,
  el archivo no fuerza aprobaciones.

---

## 14. E2E (Playwright)

### Implementacion

- Configuracion:
  - `playwright.config.ts`
- Tests:
  - `e2e/app.e2e.spec.ts`
- Runner con toggle:
  - `scripts/run-e2e.sh`

### Flujos cubiertos

- Home renderiza contenido principal y link a feature `posts`.
- `/posts/1` renderiza contenido con API mockeada.
- `/posts/1` renderiza mensaje de error normalizado ante respuesta `500`.

### Scripts disponibles

- `npm run e2e`
- `npm run e2e:install`
- `npm run e2e:ui`

### CI para E2E

- Job separado `e2e` en:
  - `.github/workflows/ci.yml`
- El job instala Chromium y ejecuta `npm run e2e`.
- Publica artefacto `playwright-report`.

### Como desacoplar/desactivar E2E

- Local (sin tocar configuracion):
  - `E2E_DISABLED=1 npm run e2e`
- CI (sin eliminar archivos):
  - define variable de repositorio `E2E_DISABLED=1`.
  - el job `e2e` se omite automaticamente.

---

## 15. Performance y bundles

### Budgets

- `initial`: warning `350kB`, error `700kB`
- `anyComponentStyle`: warning `3kB`, error `6kB`

Configurado en:

- `angular.json`

### Reporte de bundle

Script:

- `scripts/bundle-report.mjs`

Comandos:

- `npm run bundle:report`
- `npm run bundle:report:build`

Salida:

- `reports/bundle-summary.json`
- `reports/bundle-summary.md`

### CI

En `/.github/workflows/ci.yml`:

- step para generar reporte con `npm run bundle:report`
- artefacto `bundle-report`

### Checklist en PR

Se agregó al template:

- campo `Impacto en performance/bundle`
- checkbox para adjuntar/revisar `reports/bundle-summary.md` cuando aplique

---

## 16. Seguridad y supply chain

### Controles automáticos

- `npm run security:audit`
  - genera `reports/npm-audit.json`
  - falla ante `high` o `critical`
  - falla si no puede obtener metadata del audit (comportamiento seguro)
- `npm run security:licenses`
  - genera `reports/licenses.json`
  - genera `reports/licenses-summary.txt`
- `npm run security:check`
  - ejecuta ambos controles

### CI de seguridad

- Job `security` en `/.github/workflows/ci.yml`
  - corre `npm run security:check`
  - publica artefacto `security-report`

### Hardening SSR

En `src/server.ts` se añadieron headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy`
- `Content-Security-Policy` base
- `x-powered-by` deshabilitado

### Desactivar seguridad temporalmente

- CI:
  - variable de repositorio `SECURITY_DISABLED=1`
  - el job `security` se omite automáticamente

Para entornos locales offline/restringidos:

- `SECURITY_AUDIT_ALLOW_NETWORK_ERROR=1 npm run security:audit`

### Playbook ante hallazgo de vulnerabilidad

1. Crear branch `security/deps-YYYYMMDD`.
2. Actualizar dependencias afectadas.
3. Ejecutar:
   - `npm run check`
   - `npm run e2e`
   - `npm run security:check`
4. Abrir PR con resumen de CVE/dependencias impactadas.
5. Merge con prioridad.

---

## 17. Referencias internas

- README principal: `README.md`
- changelog de avance: `change.log`

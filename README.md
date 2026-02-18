# angular-archetype

Arquetipo Angular para arrancar nuevos desarrollos. Generado con [Angular CLI](https://github.com/angular/angular-cli) 20.3.x.

## Qué incluye este arquetipo

- **Angular 20** con standalone, signals y control flow moderno (`@if`, `@for`, `@switch`)
- **SSR** con Express y hydration (event replay)
- **Jest** para pruebas unitarias (en lugar de Karma)
- **ESLint** + **Prettier** (angular-eslint, TypeScript, accesibilidad en templates)
- **Husky** + **lint-staged**: formato y lint solo sobre archivos staged en cada commit; tests en pre-commit
- **Interceptor HTTP global** para trazabilidad básica de peticiones
- **Manejo global de errores** (cliente + SSR) con logging estructurado
- **Ejemplo Clean Architecture / Hexagonal (frontend)** con feature `posts`
- **Playwright E2E** con suite base y job dedicado en CI
- **Convenciones** en `.cursor/rules`: OnPush, signals, `inject()`, reactive forms, etc.

## Desarrollo

```bash
npm install
ng serve
```

Abre `http://localhost:4200/`. La aplicación recarga al cambiar el código.

Si `npm install` falla por un error de Husky (p. ej. `EPERM` en Windows o en unidades de red), la instalación seguirá completándose. Para activar los hooks de pre-commit más tarde, ejecuta `npx husky` en una terminal con permisos de escritura en el repo.

## Scripts

| Script                        | Descripción                                                |
| ----------------------------- | ---------------------------------------------------------- |
| `ng serve` / `npm start`      | Servidor de desarrollo                                     |
| `ng build`                    | Build de producción (salida en `dist/`)                    |
| `ng test`                     | Tests unitarios con Jest                                   |
| `npm run test:coverage`       | Tests con cobertura                                        |
| `npm run test:related`        | Tests relacionados con archivos staged                     |
| `npm run check`               | Validación completa (`lint` + `test:coverage` + `build`)   |
| `npm run bundle:report`       | Genera reporte de tamaño de bundles desde `dist/`          |
| `npm run bundle:report:build` | Build + reporte de bundle                                  |
| `npm run e2e`                 | Suite E2E con Playwright                                   |
| `npm run e2e:install`         | Instala navegador Chromium para Playwright                 |
| `npm run e2e:ui`              | Ejecuta Playwright en modo UI                              |
| `npm run security:audit`      | Ejecuta auditoría de dependencias (falla en high/critical) |
| `npm run security:licenses`   | Genera reporte de licencias de dependencias de producción  |
| `npm run security:check`      | Ejecuta auditoría + reporte de licencias                   |
| `ng lint`                     | Lint (ESLint)                                              |
| `npm run lint:fix`            | Lint con auto-fix                                          |
| `npm run format`              | Formatear con Prettier                                     |

## Requisitos de entorno

- Node.js `>=20.19.0` (ver `.nvmrc`)
- npm `>=10`

## Renombrar el arquetipo al nombre del producto

Comando disponible:

- `npm run project:rename -- --name \"Nombre Producto\" [--slug nombre-producto] [--yes]`

Uso recomendado:

1. Vista previa (sin aplicar cambios):

```bash
npm run project:rename -- --name \"Acme Portal\"
```

2. Aplicar cambios de nombre:

```bash
npm run project:rename -- --name \"Acme Portal\" --slug acme-portal --yes
```

3. Validar el resultado:

```bash
npm install
npm run check
npm run e2e
```

## Estructura recomendada al crecer

Estructura base de `src/app/`:

```
src/app/
  core/         # Interceptors y piezas transversales
  shared/       # Componentes, directivas y pipes reutilizables
  features/     # Vertical slices por funcionalidad (lazy)
  layout/       # Páginas de estructura general (home/shell)
```

No es obligatorio crear todas las carpetas desde el inicio; se pueden añadir según necesidad.

## Estructura recomendada por feature

Para features nuevas, el arquetipo recomienda organizar por **slice vertical** (feature-first) y no por capas globales.

Comparativa rápida:

- Feature-first (recomendado): cada feature encapsula `domain`, `application`, `infrastructure` y `presentation`; reduce acoplamiento entre features y facilita evolución independiente.
- Capas globales (alternativa): agrupa por tipo técnico (`domain/`, `application/`, etc. a nivel raíz); puede servir en equipos pequeños al inicio, pero tiende a mezclar contextos de negocio y crecer con más fricción.

Plantilla reutilizable por feature:

```
src/app/features/<feature-name>/
  domain/
    <feature>.model.ts
    <feature>-repository.port.ts
  application/
    <use-case>.ts
    <use-case>.spec.ts
    <feature>-repository.token.ts
  infrastructure/
    <http-feature>.repository.ts
    <feature>.dto.ts
    <feature>.mapper.ts
    <feature>.mapper.spec.ts
  presentation/
    <feature>.facade.ts
    <feature>.facade.spec.ts
    <feature>.page.ts
    <feature>.page.html
    <feature>.page.scss
  <feature>.routes.ts
```

Guía práctica:

1. Crear la carpeta de feature en `src/app/features/`.
2. Definir primero `domain` y `application` (puertos + casos de uso).
3. Implementar adaptadores en `infrastructure`.
4. Exponer el flujo en `presentation` con facade y page.
5. Registrar rutas lazy (`<feature>.routes.ts`) y conectar DI por tokens.

## Clean Architecture / Hexagonal (Frontend)

Ejemplo implementado en `src/app/features/posts` usando endpoint de prueba:

- `GET https://jsonplaceholder.typicode.com/posts/1`
- **Nota:** `posts` es una feature de demo para mostrar la arquitectura. Debe eliminarse al iniciar un proyecto real.

Capas del ejemplo:

- `domain`: entidad `Post` y puerto `PostRepository` (sin Angular/HTTP)
- `application`: caso de uso `GetPostByIdUseCase`
- `infrastructure`: `HttpPostRepository`, DTO y mapper
- `presentation`: `PostDetailFacade` + `PostDetailPage`

El enrutado de la feature es lazy (`/posts/:id`) y el wiring de dependencias se hace vía DI con token (`POST_REPOSITORY`).

## Cómo probar el ejemplo

1. Levanta el proyecto:

```bash
npm start
```

2. Abre:

- `http://localhost:4200/`
- `http://localhost:4200/posts/1`

La página `/posts/1` obtiene y renderiza el post desde JSONPlaceholder.

## Checklist post-clone (eliminar demo `posts`)

1. Eliminar carpeta demo:
   - `src/app/features/posts`
2. Eliminar ruta demo en:
   - `src/app/app.routes.ts` (entrada `path: 'posts'`)
3. Ajustar Home demo si no aplica:
   - `src/app/layout/home.page.ts`
4. Eliminar tests demo asociados:
   - `src/app/features/posts/**/*.spec.ts`
   - `src/app/app.routes.spec.ts` (assert de ruta `posts`)
   - `e2e/app.e2e.spec.ts` (casos que navegan a `/posts/1`)
5. Crear tu primera feature real siguiendo el mismo patrón hexagonal.

## Generación de código

```bash
ng generate component nombre-componente
ng generate --help   # Listado de schematics (components, directives, pipes, etc.)
```

Por defecto los componentes se generan con estilo **SCSS** y prefijo **app**.

## Build

```bash
ng build
```

Artifacts en `dist/`. Build de producción con optimizaciones por defecto.

## Tests unitarios (Jest)

```bash
ng test
```

Se usa **Jest** con `jest-preset-angular` y umbral de cobertura global mínimo del `60%`.

## Política de calidad mínima

- La cobertura global mínima está fijada en `60%` para `statements`, `branches`, `functions` y `lines`.
- El alcance actual de cobertura está orientado al código de aplicación (`src/app/**/*.ts`) y excluye archivos boilerplate de configuración/rutas.
- El workflow de CI ejecuta `npm run check` (lint + tests con cobertura + build).
- El reporte de cobertura se publica como artefacto de GitHub Actions (`coverage-report`).
- El workflow incluye job E2E separado (`playwright-report`) que puede desactivarse con `E2E_DISABLED=1`.

## Guardrails de performance

- Budgets de Angular ajustados en `angular.json`:
  - `initial`: warning `350kB`, error `700kB`
  - `anyComponentStyle`: warning `3kB`, error `6kB`
- Reporte de bundle:
  - `npm run bundle:report`
  - salida en `reports/bundle-summary.json` y `reports/bundle-summary.md`
- CI publica artefacto `bundle-report` en cada ejecución de `validate`.

## Observabilidad y errores

- `Logger` central en `src/app/core/logging/logger.service.ts` con niveles `debug/info/warn/error`.
- `GlobalErrorHandler` en `src/app/core/errors/global-error-handler.service.ts` para errores no capturados en cliente.
- Interceptor HTTP (`src/app/core/interceptors/http-request.interceptor.ts`) que:
  - registra cada request/response,
  - normaliza `HttpErrorResponse` a `ApiError`.
- En SSR (`src/server.ts`) existe middleware de error para registrar y responder con código controlado (`SSR_RENDER_ERROR`).

## Convención de commits

Este arquetipo adopta **Conventional Commits**:

```text
tipo(scope opcional): descripcion corta
```

Tipos recomendados:

- `feat`: nueva funcionalidad
- `fix`: correccion de bug
- `refactor`: refactor sin cambio funcional
- `test`: cambios en tests
- `docs`: documentacion
- `chore`: mantenimiento tecnico
- `ci`: cambios de pipeline

Ejemplos:

- `feat(posts): add post detail facade`
- `fix(ssr): handle render error middleware`
- `docs(readme): add commit convention section`

Validación automática:

- Se usa `commitlint` con configuración en `commitlint.config.cjs`.
- Hook de Husky: `.husky/commit-msg`.
- Si el mensaje no cumple la convención, el commit se bloquea.

## E2E (Playwright)

El arquetipo incluye E2E con Playwright (`e2e/app.e2e.spec.ts`) con escenarios base:

- Home renderiza correctamente.
- `/posts/1` renderiza datos desde API mockeada.
- `/posts/1` renderiza error normalizado ante fallo de servidor.

Ejecución local:

```bash
npm run e2e:install
npm run e2e
```

Desacoplar / desactivar E2E temporalmente:

- Local:
  - `E2E_DISABLED=1 npm run e2e`
- CI:
  - define variable de repositorio `E2E_DISABLED=1` en GitHub Actions.
  - el job `e2e` se salta automáticamente.

## Seguridad y supply chain

Incluye controles automáticos:

- `npm run security:audit`:
  - genera `reports/npm-audit.json`
  - falla si detecta vulnerabilidades `high` o `critical`
  - si no hay conectividad al registry, falla por defecto (seguro por diseño)
- `npm run security:licenses`:
  - genera `reports/licenses.json`
  - genera `reports/licenses-summary.txt`
- `npm run security:check`:
  - ejecuta ambos controles

CI:

- job `security` dedicado en GitHub Actions:
  - corre auditoría + licencias
  - publica artefacto `security-report`

Desactivar temporalmente el job `security` en CI:

- define variable de repositorio `SECURITY_DISABLED=1`

Nota para entornos offline/locales restringidos:

- puedes permitir auditoría sin red de forma explícita:
  - `SECURITY_AUDIT_ALLOW_NETWORK_ERROR=1 npm run security:audit`

## Recursos

- [Angular CLI](https://angular.dev/tools/cli)
- [Angular Docs](https://angular.dev)

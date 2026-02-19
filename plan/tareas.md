# Tareas

## Tarea 1: revisar y mitigar vulnerabilidades de dependencias

- Estado: completada
- Archivos:
  - `package.json`
  - `package-lock.json`
- Acciones:
  - auditoria inicial con `npm audit --json`;
  - mitigacion via `overrides` para `tar` y `qs`;
  - reinstalacion de dependencias y re-auditoria.
- Resultado:
  - vulnerabilidades altas eliminadas (`high: 0`);
  - vulnerabilidades bajas eliminadas (`low: 0`);
  - permanecen vulnerabilidades moderadas de toolchain.

## Tarea 2: validar no regresion del arquetipo

- Estado: completada
- Validaciones ejecutadas:
  - `npm run check` (verde)
  - `npm run e2e` (verde)
  - `npm run security:check` (verde, `high/critical = 0`)

## Pendientes de mejora

- Evaluar upgrade mayor de stack de lint/build para reducir vulnerabilidades moderadas heredadas del toolchain.

## Tarea 3: actualizar dependencias del arquetipo sin regresion

- Estado: completada con bloqueo de politica de seguridad
- Alcance:
  - upgrade mayor coordinado de Angular/tooling,
  - upgrade de stack de test/lint compatible,
  - validacion funcional y de seguridad post-upgrade.
- Resultado:
  - Angular y tooling principal actualizados a rama 21 / Jest 30.
  - `check` y `e2e` en verde (sin regresion funcional).
  - Seguridad de produccion en verde (`npm audit --omit=dev`).
  - Falla gate global de seguridad por advisories high en devDependencies.

## Tarea 4: alinear documentacion con versiones y CI actuales

- Estado: completada
- Archivos:
  - `README.md`
- Resultado:
  - version de Angular/CLI actualizada a 21.1.x;
  - referencias de CI ajustadas al estado real del workflow (sin jobs E2E/security/bundle por defecto);
  - documentacion coherente con `package.json` y `.github/workflows/ci.yml`.

# Features

Cada feature contiene su propio vertical slice:

- `domain`: modelos y puertos (sin Angular/HTTP)
- `application`: casos de uso
- `infrastructure`: adaptadores concretos (HTTP, mapeos, DTOs)
- `presentation`: facade + componentes/páginas

## Convención sugerida para nueva feature

```text
features/<feature-name>/
  domain/
  application/
  infrastructure/
  presentation/
```

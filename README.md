# SGIP — Sistema de Gestión de Inversiones y Préstamos

Aplicación full stack para simular, registrar y administrar préstamos y sus transacciones. El backend aplica reglas de capacidad de pago, aprobación automática, cronogramas de cuota fija e idempotencia; el frontend ofrece un panel administrativo responsive.

## Aplicación publicada

- Frontend: https://sgip-psi.vercel.app
- API y Swagger: https://sgip-production.up.railway.app/swagger
- Código fuente: https://github.com/josemfacio/SGIP

> Railway usa un servicio gratuito/serverless. La primera solicitud después de un periodo de inactividad puede tardar algunos segundos.

## Tecnologías

### Backend

- .NET 8 y ASP.NET Core Web API
- Entity Framework Core 8
- PostgreSQL 16
- Swagger / OpenAPI
- xUnit, EF Core InMemory y Coverlet

### Frontend

- Next.js 16, React 19 y TypeScript
- Redux Toolkit y React Redux
- React Hook Form y Zod
- Tailwind CSS 4
- ESLint y Prettier

### Infraestructura

- Docker y Docker Compose
- Railway para API y PostgreSQL
- Vercel para frontend
- GitHub Actions para integración continua

## Funcionalidades

- Simulación de préstamos con cuota fija y cronograma de amortización.
- Registro de solicitudes con validación de monto y plazo.
- Validación de capacidad de pago: máximo 40 % de los ingresos mensuales.
- Límite de tres préstamos activos por cliente.
- Aprobación automática para solicitudes elegibles.
- Aprobación y rechazo manual de solicitudes pendientes.
- Desembolso automático al aprobar un préstamo.
- Registro y consulta de transacciones.
- Idempotencia por clave para evitar transacciones duplicadas.
- Filtros por usuario, tipo, estado y fechas.

## Arquitectura

El backend sigue una separación por capas:

```text
SGIP.Api             Controladores, configuración HTTP, CORS y Swagger
SGIP.Application     Casos de uso, DTOs, validaciones e interfaces
SGIP.Domain          Entidades y enumeraciones del negocio
SGIP.Infrastructure  EF Core, PostgreSQL, migraciones y repositorios
SGIP.Tests           Pruebas unitarias y de integración
SGIP.Frontend        Aplicación Next.js organizada por funcionalidades
```

Más información en [docs/architecture.md](docs/architecture.md).

## Ejecución con Docker

Requisitos: Docker Desktop con Docker Compose.

```bash
docker compose up --build
```

Servicios locales:

- Frontend: http://localhost:3000
- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger
- PostgreSQL: `localhost:5433`

Para personalizar credenciales o puertos:

```bash
copy .env.docker.example .env.docker
docker compose --env-file .env.docker up --build
```

Detener el entorno:

```bash
docker compose down
```

## Ejecución sin Docker

### Backend

1. Copiar `SGIP.Api/appsettings.Development.example.json` como `SGIP.Api/appsettings.Development.json`.
2. Ajustar la cadena de conexión local.
3. Ejecutar:

```bash
dotnet restore
dotnet run --project SGIP.Api
```

Las migraciones y los datos iniciales se aplican al iniciar la API.

### Frontend

Requiere Node.js 20.9 o superior y pnpm.

```bash
cd SGIP.Frontend
copy .env.example .env.local
pnpm install
pnpm dev
```

La variable `NEXT_PUBLIC_API_URL` debe apuntar a la API, por defecto `http://localhost:5190`.

## Pruebas y calidad

Backend:

```bash
dotnet test SGIP.Tests/SGIP.Tests.csproj --collect:"XPlat Code Coverage"
```

- 29 pruebas automatizadas.
- Cobertura de líneas: 39,23 %.
- Cobertura de ramas: 69,44 %.

Frontend:

```bash
cd SGIP.Frontend
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

## Variables de producción

API en Railway:

- `ConnectionStrings__DefaultConnection`
- `CORS_ORIGINS`
- `Swagger__Enabled=true`
- `RAILWAY_DOCKERFILE_PATH=SGIP.Api/Dockerfile`
- `ASPNETCORE_HTTP_PORTS=8080`

Frontend en Vercel:

- `NEXT_PUBLIC_API_URL=https://sgip-production.up.railway.app`

No se versionan credenciales ni archivos `.env` reales.

## Reglas principales del negocio

- Monto permitido: 500 a 50.000.
- Plazo permitido: 6 a 60 meses.
- Tipo soportado actualmente: cuota fija.
- Endeudamiento máximo: 40 % de los ingresos mensuales.
- Máximo: tres préstamos activos por cliente.
- Aprobación automática: monto menor a 10.000 y menos de dos préstamos activos, siempre que cumpla capacidad de pago.

## Autor

José Facio

# SGIP Frontend

Frontend del Sistema de Gestión de Inversiones y Préstamos, construido con Next.js, React y TypeScript.

## Tecnologías

- Next.js 16 con App Router
- React 19 y TypeScript
- Redux Toolkit
- React Hook Form y Zod
- Tailwind CSS

## Requisitos

- Node.js 20.9 o superior
- pnpm
- SGIP.Api ejecutándose en `http://localhost:5190`

## Configuración

```powershell
Copy-Item .env.example .env.local
pnpm install
```

## Ejecución

```powershell
pnpm dev
```

La aplicación estará disponible normalmente en `http://localhost:3000`.

## Comandos

- `pnpm dev`: desarrollo local.
- `pnpm build`: compilación de producción.
- `pnpm start`: ejecutar la compilación de producción.
- `pnpm typecheck`: validar TypeScript.
- `pnpm lint`: analizar el código.

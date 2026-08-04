# D'Amico Automotores

Portal web premium de venta de vehículos y panel de administración de stock.

- **Lado usuario:** home, catálogo marketplace, detalle de vehículo y consignación (contacto por WhatsApp).
- **Lado admin:** login + dashboard para publicar, editar, destacar y dar de baja unidades, con marcas y carrocerías dinámicas.

## Stack

- Frontend: React 19 + Vite + Tailwind CSS 4 + Lucide icons
- Backend: Express + Supabase (con fallback a `database.json` local)
- Auth admin: JWT (con override por variables de entorno)
- Hosting: Vercel (frontend estático + función serverless `/api`)

## Desarrollo local

```bash
npm install
npm run dev      # frontend en http://localhost:3000 + API en :3002
npm run lint     # typecheck (tsc --noEmit)
npm run build    # build de producción
```

### Configurar `.env`

```bash
cp .env.example .env
```

Completá los valores (Supabase, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD). Sin Supabase el backend funciona contra `database.json`.

### Acceso al panel admin (local)

Abrí `http://localhost:3000/?control-panel=true` (o `#control-panel`) y logueate con el email/contraseña de `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

- Para crear un admin local en `database.json`: `npm run seed-admin -- email password`

## Deploy en Vercel

1. **Supabase:** creá un proyecto y ejecutá `scripts/schema.sql` en el SQL Editor. Eso crea las tablas (`users`, `vehicles`, `consignments`) y siembra 8 vehículos + admin inicial.
2. **Vercel:** importá el repositorio (framework preset: Vite).
3. **Environment Variables** (Project > Settings > Environment Variables) — las mismas que en `.env`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` opcionales)
4. Build command: `npm run build`. Output directory: `dist`. Vercel detecta `api/index.ts` como función serverless y `vercel.json` hace el fallback SPA.
5. Deploy.

> IMPORTANTE: en Vercel el filesystem es efímero. Sin Supabase configurado, los cambios del admin (agregar/editar/borrar unidades) no persisten entre deploys.

### Acceso al panel admin (producción)

`https://tudominio.com/?control-panel=true` → login con `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Estructura

```
api/index.ts               Función serverless (Express)
server-app.ts              Backend Express (auth + CRUD vehicles/consignments)
src/
  App.tsx                  Router de tabs + deep linking #vehicle=id
  components/              Vistas públicas y panel admin
  context/                 AuthContext + InventoryContext (stock, filtros, listas dinámicas)
  types.ts                 Tipos de dominio
scripts/schema.sql         Esquema + seed de Supabase
WALKTHROUGH.md             Registro detallado de cambios visuales y funcionales
```

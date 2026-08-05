# Walkthrough - D'Amico Automotores (Referencia del Proyecto)

Documento oficial del proyecto. Pensado para que cualquier desarrollador entienda la arquitectura, la autenticación, la navegación y el flujo de datos en **menos de 10 minutos**, sin tener que leer el código fuente completo.

---

## 1. Resumen del proyecto

Sitio web de un concesionario multimarca con estética **marketplace premium**. Tiene una parte pública (home, catálogo con filtros, ficha de detalle por vehículo y página de consignación) y un **panel de administración** (login JWT + CRUD de inventario).

La particularidad más importante es la **separación de responsabilidades**: la autenticación, la navegación y los datos viven en tres contexts independientes y no se mezclan.

### Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Vite 6 |
| Estilos | Tailwind CSS 4 (vía `@tailwindcss/vite`) |
| Backend | Express 4 + TypeScript (`tsx`) |
| Base de datos | Supabase (cloud) con fallback local `database.json` |
| Autenticación | JWT propio (jsonwebtoken) + bcryptjs |
| Iconos | lucide-react |
| Deploy | Vercel (serverless function en `api/index.ts`) |

---

## 2. Estructura del proyecto

```
DamicoAutomotores/
├── server.ts                 # Boot del backend Express (puerto 3002)
├── server-app.ts             # App Express: rutas /api, auth JWT, Supabase client
├── api/index.ts              # Entry de Vercel (re-exporta server-app)
├── database.json             # Base local (fallback si no hay Supabase)
├── vercel.json               # Rewrites SPA + API
├── vite.config.ts            # Puerto 3000, proxy /api → 3002, alias @
├── .env / .env.example       # Variables de entorno
├── package.json              # Scripts y dependencias
├── scripts/
│   ├── create-admin.ts       # Crear/actualizar admin local en database.json
│   └── schema.sql            # Esquema SQL para Supabase
└── src/
    ├── main.tsx              # Mount de la app
    ├── App.tsx               # Providers + router de vistas + CTA + footer
    ├── types.ts              # Interfaces Vehicle, ConsignmentRequest, AppView
    ├── mockData.ts           # Vehículos iniciales y marcas por defecto
    ├── index.css             # Tema Tailwind (colores y fuentes de marca)
    ├── context/
    │   ├── AuthContext.tsx       # Autenticación (JWT)
    │   ├── NavigationContext.tsx # Navegación (vistas)
    │   └── InventoryContext.tsx  # Datos (vehículos, marcas, carrocerías)
    └── components/
        ├── Navigation.tsx        # Navbar (pública + "Volver al panel")
        ├── HomeView.tsx          # Home
        ├── CatalogView.tsx       # Marketplace / catálogo
        ├── VehicleDetailView.tsx # Ficha de detalle por vehículo
        ├── ConsignmentView.tsx   # Página de consignación (estática)
        ├── LoginPage.tsx         # Login del panel
        ├── AdminDashboard.tsx    # Panel admin
        ├── PublishForm.tsx       # Formulario crear/editar vehículo
        └── ProtectedRoute.tsx    # Guard de autorización del panel
```

---

## 3. Arquitectura

La app es una **SPA React** (sin React Router) que renderiza vistas según un estado de navegación. El backend Express expone una API REST bajo `/api`. Supabase se usa **únicamente como base de datos**; la autenticación NO usa Supabase Auth.

### 3.1 Separación de responsabilidades (los 3 contexts)

Los contexts están envueltos así en `App.tsx`:

```
<AuthProvider>
  <NavigationProvider>
    <InventoryProvider>
      <MainAppContent />
    </InventoryProvider>
  </NavigationProvider>
</AuthProvider>
```

#### AuthContext — `src/context/AuthContext.tsx`
Responsable **únicamente de autenticación**:

- Maneja el **JWT** (`token`) y el `user`.
- `signIn(email, password)` → `POST /api/login` → guarda `token` y `user` en estado y en `localStorage`.
- `signOut()` → limpia token y usuario (de estado y `localStorage`). **No navega**.
- `isAuthenticated` → derivado de `!!token`. Es la única fuente de verdad de "usuario logueado".
- `loading` → mientras restaura la sesión desde `localStorage` al arrancar.

> Regla clave: **ninguna vista modifica la autenticación**. Solo `signIn` y `signOut` tocan el token.

#### NavigationContext — `src/context/NavigationContext.tsx`
Responsable **únicamente de navegación**:

- `currentView` → vista actual (`AppView`).
- `setView(view)` → cambia de pantalla, limpia el hash `#control-panel` al salir de admin/login y hace scroll al tope.
- `selectedVehicleId` + `setSelectedVehicleId` → vehículo activo para la vista de detalle.
- `searchFilter` / `bodyTypeFilter` → filtros del catálogo (persisten al navegar entre vistas).

> Regla clave: **cambiar de vista nunca modifica el JWT**. Un admin puede ir home → catálogo → panel → home conservando la sesión.

#### InventoryContext — `src/context/InventoryContext.tsx`
Responsable **únicamente de los datos**:

- `vehicles`, `brands`, `bodyTypes` y `loading`.
- `addVehicle` / `updateVehicle` / `deleteVehicle` (CRUD contra `/api/vehicles`).
- `addBrand` / `addBodyType` (marcas y carrocerías dinámicas).
- Para las operaciones de escritura usa el token solo como **autorización** (header `Authorization: Bearer <token>`), no como estado.

> Regla clave: este context no sabe qué vista está activa y no decide adónde navegar.

### 3.2 Flujo de datos React ↔ Backend ↔ Supabase

```
React (frontend, :3000)
      │
      │  fetch('/api/...')           ← Vite proxya a Express
      ▼
Backend Express (server-app.ts, :3002)
      │
      ├── useSupabase = hay SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
      │        │
      │        ▼
      │   Supabase (tablas: users, vehicles, consignments)
      │
      └── si NO hay Supabase → database.json (archivo local)
```

- El backend decide el modo al arrancar: si existen `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`, opera contra Supabase con el client **service role**; si no, usa `database.json`.
- Las escrituras protegidas pasan por el middleware `authenticateToken` (valida el JWT).
- El frontend cachea vehículos en `localStorage` (`damico_vehicles`) para resiliencia offline.

### 3.3 Flujo del visitante (parte pública)

```
Visitante
   ↓
React (HomeView / CatalogView / VehicleDetailView / ConsignmentView)
   ↓
fetch('/api/vehicles')   ← público, sin token
   ↓
Backend Express
   ↓
Supabase (o database.json)
   ↓
Render en pantalla
```

### 3.4 Flujo del administrador (panel)

```
Login (LoginPage)
   ↓  POST /api/login → JWT firmado con JWT_SECRET (24h)
   ↓  { token, user } → localStorage (damico_auth_token / damico_auth_user)
AuthContext (isAuthenticated = true)
   ↓
NavigationContext (setView('admin'))
   ↓
ProtectedRoute (valida token; si no hay → home)
   ↓
Panel Admin (AdminDashboard)
   ↓  CRUD con Authorization: Bearer <token>
Backend Express (authenticateToken)
   ↓
Supabase (o database.json)
```

---

## 4. Autenticación (JWT propio)

> No se usa Supabase Auth. La autenticación es 100 % JWT firmado por el backend.

### Flujo de login

1. `LoginPage` envía email/contraseña a `AuthContext.signIn`.
2. `signIn` hace `POST /api/login` (`server-app.ts`).
3. El backend valida credenciales en este orden de prioridad:
   1. **Env override**: si `ADMIN_EMAIL` + `ADMIN_PASSWORD` existen y coinciden (más simple en Vercel).
   2. **Tabla `users` de Supabase**: compara `passwordHash` con bcrypt.
   3. **`database.json` local**: misma comparación bcrypt.
4. Si es válido, firma `jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' })` y responde `{ token, user }`.
5. El frontend guarda el token y el usuario en `localStorage` y en el estado de `AuthContext`.

### Manejo del JWT

| Dónde | Qué |
|---|---|
| Firma | `server-app.ts` → `JWT_SECRET` (env) o fallback `'damico-secret-key-super-secure'` |
| Expiración | 24 h |
| Almacenamiento cliente | `localStorage`: `damico_auth_token` y `damico_auth_user` |
| Envío a la API | Header `Authorization: Bearer <token>` en POST/PUT/DELETE |
| Validación | Middleware `authenticateToken` (401 sin token, 403 si inválido/expirado) |
| Limpieza | Únicamente `signOut()` (botón "Cerrar Sesión" del panel) |

### `localStorage` — claves usadas

| Clave | Contenido |
|---|---|
| `damico_auth_token` | JWT de sesión |
| `damico_auth_user` | Objeto `{ email, id }` |
| `damico_vehicles` | Caché temporal del catálogo (ver estrategia abajo) |
| `damico_custom_brands` | Marcas agregadas por el admin (persistencia local deliberada) |
| `damico_custom_body_types` | Carrocerías agregadas por el admin (persistencia local deliberada) |

> La clave legacy `damico_consignments` ya no se usa: se purga automáticamente al iniciar la app.

> **Nota de diseño** — `damico_custom_brands` y `damico_custom_body_types` **no son una caché del backend**, sino una **persistencia local deliberada**. No existe endpoint ni tabla para marcas/carrocerías; la fuente es una constante estática del frontend (`AVAILABLE_BRANDS` en `mockData.ts`, `DEFAULT_BODY_TYPES` en `InventoryContext.tsx`) más los agregados del admin guardados solo en su navegador. Por eso **no** se les aplica la estrategia de caché de `damico_vehicles` (que exige una fuente de verdad en el servidor). Esta decisión es consciente y no una limitación ni una tarea pendiente:
> - Se priorizó mantener la arquitectura lo más simple posible.
> - Actualmente no existe una necesidad real de sincronizar marcas y carrocerías entre distintos administradores o dispositivos.
> - Si en el futuro esa necesidad aparece, la evolución correcta será crear tablas y endpoints específicos en el backend, **sin modificar la lógica actual** hasta que exista ese requerimiento.

### Estrategia de caché del catálogo (`damico_vehicles`)

El inventario se obtiene siempre del backend, con la caché como respaldo temporal:

1. **Backend primero**: `InventoryContext` hace `GET /api/vehicles` al montar la app.
2. **Fallback por error de red**: si el servidor no responde o falla la petición, se muestra la última versión sincronizada guardada en `damico_vehicles`. Si no hay caché, se usa `INITIAL_VEHICLES` (`mockData.ts`).
3. **Actualización automática**: cuando el backend responde correctamente, la caché se sobrescribe con la respuesta. Las operaciones del panel (`addVehicle`, `updateVehicle`, `deleteVehicle`) también refrescan la caché tras confirmarse en el servidor.

### Autorización (ProtectedRoute)

`ProtectedRoute` envuelve el `AdminDashboard` en `App.tsx`. Si no hay `token` (y terminó el `loading`), redirige a `home`. Solo valida el JWT local; el backend valida de nuevo el token en cada mutación.

---

## 5. Navegación

### Vistas disponibles (`AppView` en `types.ts`)

```ts
export type AppView = 'home' | 'catalog' | 'consignment' | 'admin' | 'login' | 'vehicle-detail';
```

`App.tsx` renderiza la vista según `currentView` con renderizado condicional (sin React Router).

### Deep-linking por hash

| Hash / Query | Resultado |
|---|---|
| `#control-panel` o `?control-panel=true` | Va al panel si hay token, si no al login |
| `#vehicle={id}` | Abre el detalle de ese vehículo |

La URL del vehículo en WhatsApp usa `https://damicoautomotores.com/#vehicle=[id]` para que el asesor identifique rápido la unidad.

### Navbar (`Navigation.tsx`)

- La **web pública se ve igual para todos** los visitantes.
- Si existe un JWT válido (`isAuthenticated`) y no estás en el panel, aparece un botón discreto **"Volver al panel"** (desktop y mobile).
- Dentro del panel: badge "Sesión de Administración Activa" + botón "Vista Cliente" que navega en la misma pestaña.
- **No** se abren pestañas nuevas para alternar entre público y panel.

### Regla de oro

`setView(...)` **nunca** toca el token. `signOut()` **nunca** navega (el panel llama a `signOut()` y luego a `setView('home')` explícitamente, pero son dos responsabilidades separadas).

---

## 6. Vistas públicas

### HomeView
- Hero con badge, título, buscador y atajos de carrocería.
- "Destacados de la Semana": 3 tarjetas (click → `vehicle-detail`), con crossfade de imagen secundaria al hover.
- Pathway cards: "Quiero Comprar" (abre WhatsApp) y "Quiero Vender / Consignar" (va a `consignment`).

### CatalogView (Marketplace)
- Filtros horizontales colapsables: marca (con conteo), carrocería, transmisión, combustible, precio.
- Grilla responsive (1 → 4 columnas). Click en card → `vehicle-detail`.

### VehicleDetailView
- Galería grande con thumbnails y contador de imágenes.
- Specs completas, precio y botones de WhatsApp (con mensaje formal + link `#vehicle=`) y Compartir.

### ConsignmentView
- Página estática (sin formulario): CTA por WhatsApp, 4 pasos y caja "¿Por qué no venderlo por tu cuenta?".

---

## 7. Panel administrativo

### Acceso

- URL: `http://localhost:3000/#control-panel` (o `?control-panel=true`).
- Sin sesión muestra `LoginPage`; con sesión entra directo al dashboard.
- El usuario con sesión puede volver en cualquier momento con "Volver al panel".

### AdminDashboard (`AdminDashboard.tsx`)

- **Métricas**: Stock Total, Valor Activo Flota, Destacados, Reservados.
- **Tabla de inventario** con búsqueda: editar (modal `PublishForm`), eliminar, toggle "Destacado" y selector de estado (Disponible / Reservado / Vendido).
- Botón "Cerrar Sesión" (`signOut()` + `setView('home')`).
- Botón "Publicar Nuevo Vehículo" (modal `PublishForm`).

### PublishForm (`PublishForm.tsx`)

- 4 secciones: información básica, especificaciones, multimedia, visibilidad.
- **Compresión de imágenes** en el navegador (canvas, máx 1200px, JPEG 0.7) → base64.
- Galería de presets (URLs de Unsplash) para rellenar rápido.
- **Marcas y carrocerías dinámicas**: botones "Agregar marca nueva" / "Agregar carrocería nueva" que persisten en `localStorage` y se comparten con el filtro del catálogo y los atajos del home.

---

## 8. Backend / API (`server-app.ts`)

| Método | Ruta | Protegida | Uso |
|---|---|---|---|
| POST | `/api/login` | No | Login admin → JWT |
| GET | `/api/vehicles` | No | Listar inventario (público) |
| POST | `/api/vehicles` | Sí | Crear vehículo |
| PUT | `/api/vehicles/:id` | Sí | Editar vehículo |
| DELETE | `/api/vehicles/:id` | Sí | Eliminar vehículo |
| POST | `/api/consignments` | No | (Legacy, el frontend ya no lo usa) |
| GET | `/api/consignments` | Sí | (Legacy, sin consumidor) |
| PUT | `/api/consignments/:id` | Sí | (Legacy, sin consumidor) |

- Middleware: CORS abierto, `express.json({ limit: '50mb' })` (para las imágenes base64).
- `useSupabase` se resuelve al arranque; si falla cualquier operación en Supabase, cae al modo local.

---

## 9. Base de datos

### Supabase (cloud) — `scripts/schema.sql`

- **users**: `email`, `passwordHash` (bcrypt).
- **vehicles**: el mismo shape que `interface Vehicle` del frontend.
- **consignments**: propuestas legacy (ya sin consumidor en el frontend).

### Local fallback — `database.json`

- Si no hay credenciales Supabase, el backend lee/escribe `database.json` en la raíz.
- Se auto-inicializa con el admin `admin@damicoautomotores.com` / `adminPassword123` y los vehículos de `mockData.ts`.
- ⚠️ En Vercel el filesystem es efímero: sin Supabase los cambios del admin no persisten en producción.

---

## 10. Convenciones del proyecto

- **Un context, una responsabilidad**: auth, navegación y datos nunca se mezclan.
- **La única fuente de verdad de la sesión es el JWT** (`isAuthenticated`). No usar flags manuales tipo `isAdmin`/`adminViewMode`.
- **Cambiar de vista no modifica la autenticación, y salir de sesión no navega**.
- Tipado estricto en `types.ts` (evitar `any` salvo en el backend donde es necesario).
- Todos los IDs de los botones usan `kebab-case` con prefijo de contexto (`tab-home-btn`, `dash-add-vehicle-btn`, `detail-main-image`).
- Mismo origen público/admin; navegar entre ambos es navegación de SPA, no recargas.
- Componentes en `src/components/`, contexts en `src/context/`, tipos en `types.ts`.
- Cache del inventario en `localStorage` como fallback offline.

---

## 11. Variables de entorno (`.env`)

| Variable | Uso |
|---|---|
| `SUPABASE_URL` | URL del proyecto Supabase (backend) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (solo backend, nunca al cliente) |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Opcional, hoy el frontend no las usa |
| `JWT_SECRET` | Clave de firma de los JWT |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credenciales admin con prioridad (útil en Vercel) |

Ver `.env.example` para un template con comentarios.

---

## 12. Comandos útiles

```bash
npm run dev            # Frontend (Vite :3000) + Backend (tsx :3002) en paralelo
npm run server         # Solo backend
npm run lint           # Typecheck (tsc --noEmit)
npm run build          # Build de producción (Vite)
npm run seed-admin -- <email> <contraseña>   # Crear admin local en database.json
npm run clean          # Borra dist/ y database.json
```

---

## 13. Contacto / WhatsApp

- **Número:** +54 9 2915 36-7498 (`5492915367498`)
- Configurado en: `VehicleDetailView.tsx`, `ConsignmentView.tsx`, `App.tsx` (CTA banner) y `HomeView.tsx` (pathway).

---

## 14. Paleta de colores y tipografía (`src/index.css`)

| Token | Valor |
|---|---|
| `brand-primary` | `#CC1818` (rojo) |
| `brand-accent` | `#F5A396` (salmón) |
| `brand-dark` | `#14161a` (fondo) |
| `brand-card` | `#1c1f25` (cards) |
| `brand-gray` | `#ACACAC` |

- **Display:** Bebas Neue · **Sans:** Barlow Condensed (importadas en `index.css`).
- Estética: fondo oscuro, cards `brand-card`, bordes `neutral-800`, acentos rojos.

---

## 15. Estado actual del desarrollo

### Completado
- Rediseño marketplace (catálogo sin modal, ficha de detalle dedicada).
- Separación completa de Auth / Navigation / Inventory contexts.
- Botón "Volver al panel" para admins autenticados sin alterar la vista pública.
- Marcas y carrocerías dinámicas (admin + catálogo + home).
- Deep-linking por hash (`#control-panel`, `#vehicle={id}`).

### Eliminado (limpieza)
- `src/supabase.ts` (cliente del navegador sin uso + mock).
- `adminViewMode` (reemplazado por `isAuthenticated` + `currentView`).
- Sección "Propuestas" del panel y formulario de consignación del frontend (las rutas `/api/consignments` quedan como legacy en el backend).
- Simulador de financiación y modal de detalle.

### Sin uso (dependencias)
- `motion` y `@google/genai` figuran en `package.json` pero no se importan en `src/`.

---

## 16. Próximos pasos recomendados

- [ ] Crossfade con más de una imagen secundaria (hoy solo usa `imagenesSecundarias[0]`).
- [ ] Animación de entrada staggered para las tarjetas del marketplace.
- [ ] Lazy loading de imágenes del catálogo.
- [ ] Filtros persistentes en la URL (query params).
- [ ] Paginación o infinite scroll para catálogo grande.
- [ ] Migrar los endpoints legacy de `/api/consignments` (o eliminarlos del backend y del schema SQL).
- [ ] Remover dependencias sin uso (`motion`, `@google/genai`) y las variables `VITE_SUPABASE_*` del `.env` si se confirma que no harán falta.
- [ ] Validación del JWT contra `ADMIN_EMAIL`/`ADMIN_PASSWORD` ya cubre producción; opcional: rotar `JWT_SECRET` periódicamente.

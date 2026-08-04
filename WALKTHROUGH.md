# Walkthrough - Cambios Visuales D'Amico Automotores

## Resumen General

Se realizó un rediseño completo del sitio siguiendo una estética marketplace premium. Se migró de un catálogo con modal de detalle a una vista de marketplace estilo Facebook con página de detalle dedicada. Se actualizaron textos, se eliminó el simulador de financiación y el formulario de consignación, y se integró WhatsApp como canal de contacto principal.

---

## 1. HomeView (`src/components/HomeView.tsx`)

### Estructura de secciones (orden actual)
1. **Hero** → Badge "CONCESIONARIO MULTIMARCA EXCLUSIVO" + título "D'AMICO AUTOMOTORES" + buscador + categorías rápidas (botones de carrocería)
2. **Destacados de la Semana** → 3 tarjetas de vehículos destacados (click lleva a vista detalle)
3. **Pathway Cards** → "Quiero Comprar" (abre WhatsApp) / "Quiero Vender / Consignar" (va a consignment)
4. ~~Trust Banner~~ eliminado (Calidad Certificada, Operaciones Seguras, Atención Inmediata)

### Cambios realizados
- Eliminado el párrafo descriptivo debajo del título del hero
- Eliminado el Trust Banner completo (Calidad Certificada, Operaciones Seguras, Atención Inmediata)
- Cards de destacados ahora abren `VehicleDetailView` directamente (antes iban al catálogo filtrado)
- Botón "Quiero Comprar" ahora dice "Contactanos →" y abre WhatsApp
- Textos actualizados en pathway cards (más concisos, sin bullets)
- Padding reducido en cards pathway (`p-8` → `p-6`, `min-h-[350px]` → `min-h-[250px]`)

### Tarjeta de Destacados
- Imagen: `aspect-[4/3]` (~60% de la tarjeta)
- Crossfade: si tiene `imagenesSecundarias[0]`, al hacer hover aparece con `opacity-0 → opacity-100` (500ms)
- Badge "Destacado": `bg-brand-primary` (rojo), texto blanco, estrella rellena (`Star` de Lucide)
- Hover: `-translate-y-1.5`, `shadow-xl shadow-black/40`, imagen `scale-[1.03]`
- Nombre: `FORD RANGER` en una sola línea, `text-2xl font-bold tracking-wide`
- Specs: grilla 2x2 con iconos Lucide
- Precio: `text-[1.7rem]`
- Border: `rounded-2xl border border-neutral-800/80 bg-brand-card/40`

### Import de iconos Lucide
```
Search, Compass, Coins, Star, ChevronRight, ArrowUpRight, Calendar, Gauge, Fuel, Settings
```

---

## 2. CatalogView (`src/components/CatalogView.tsx`) — Marketplace

### Diseño marketplace
- **Filtros horizontales** colapsables (dropdowns compactos) en vez de sidebar
- **Buscador** prominent arriba de todo
- **Grilla responsive**: 1 col mobile → 2 col sm → 3 col lg → 4 col xl
- **Cards compactas**: imagen 4:3, nombre, versión, specs en línea (año • km • transmisión), precio, "Ver →"
- **Click en card** → navega a `VehicleDetailView` (ya no abre modal)

### Filtros
- Marca (select con conteo, lista dinámica: incluye marcas agregadas por el admin)
- Carrocería (lista dinámica: SUV, Pick-up, Sedán, Hatchback, Deportivos + las que agregue el admin)
- Transmisión (Todas, Manual, Automática)
- Combustible (Todos, Nafta, Diesel, Nafta/GNC, Diesel/GNC, Híbrido, Eléctrico)
- Precio quick filters (Todos, <25k, 25-50k, 50k+)
- Botón "Limpiar" visible solo cuando hay filtros activos

### Eliminado
- Sidebar de filtros lateral
- Modal de detalle completo (reemplazado por VehicleDetailView)
- Simulador de financiación prendaria
- Botón "Imprimir Ficha"
- Todas las referencias a `downPayment`, `interestPeriod`, `userInteractedWithSimulator`, `financingReport`

### Import de iconos Lucide
```
Search, Filter, Info, Star
```

---

## 3. VehicleDetailView (`src/components/VehicleDetailView.tsx`) — NUEVO

### Vista detalle completa (página dedicada)
- **Galería grande** a la izquierda (`lg:col-span-7`): imagen principal con flechas de navegación + contador de imágenes
- **Thumbnails** debajo de la galería (clickeables, scroll horizontal)
- **Info del vehículo** a la derecha (`lg:col-span-5`):
  - Badge "Unidad Destacada" (si aplica)
  - Marca (`text-5xl`) + Modelo (`text-4xl` brand-primary)
  - Versión + Año
  - Precio con badge "Listo para Transferir"
  - Specs grid: Año, Kilometraje, Combustible, Transmisión
  - Specs extra: Motorización, Tracción
- **Botones de contacto**:
  - WhatsApp (abre chat con mensaje formal + link del vehículo)
  - Compartir (copia link al portapapeles)
- **Botón "Volver al Catálogo"** arriba a la izquierda

### Deep linking
- Hash `#vehicle={id}` detectado en `App.tsx` al cargar la página
- Navega automáticamente al detalle del vehículo
- Usado en links de WhatsApp para que el asesor identifique rápido el vehículo

### WhatsApp message format
```
Hola Federico, me comunico porque vi en el catálogo de D'Amico Automotores la unidad [marca] [modelo] [version], año [anio], con un precio de USD [precio]. Me gustaría recibir más información y coordinar un test drive. Quedo atento, muchas gracias.

Link del vehículo: https://damicoautomotores.com/#vehicle=[id]
```

### Import de iconos Lucide
```
ArrowLeft, Send, Share2, Calendar, Gauge, Fuel, Settings, ChevronLeft, ChevronRight
```

---

## 4. ConsignmentView (`src/components/ConsignmentView.tsx`)

### Cambios realizados
- **Eliminado** el formulario de solicitud de cotización completo
- **Eliminado** el success card post-envío
- **Eliminado** los states y funciones relacionadas (`nombre`, `celular`, `marca`, `modelo`, etc., `handleSubmit`, `resetForm`)
- **Nuevo CTA** debajo del título: botón "Contactanos por WhatsApp" que abre chat directo
- **4 Steps** actualizados:
  1. Producción Profesional → Fotos y videos de alta calidad para destacar tu vehículo.
  2. Publicación Estratégica → Difundimos tu unidad en los principales portales y redes.
  3. Gestión de Interesados → Filtramos consultas y coordinamos visitas.
  4. Venta Segura → Cerramos la operación con toda la seguridad y transparencia.
- **"¿Por qué no venderlo por tu cuenta?"** centrado con 3 boxes verticales (borde `brand-primary/30`, tilde verde, `bg-brand-card/40`, `border-neutral-800`)
  - Gestoría integral → Nos ocupamos de toda la documentación.
  - Compradores filtrados → Coordinamos únicamente visitas calificadas.
  - Comisión transparente → Sin cargos ocultos.

### Import de iconos Lucide
```
ShieldCheck, Camera, HelpCircle, SendHorizontal, Sparkles
```

---

## 5. Navigation (`src/components/Navigation.tsx`)

- "Comprar Stock" renombrado a **"Catálogo"**

---

## 6. App.tsx

### Cambios
- Import de `VehicleDetailView`
- Renderizado condicional: `activeTab === 'vehicle-detail' && <VehicleDetailView />`
- **CTA Banner** antes del footer: botón "Contactanos por WhatsApp" con avioncito (`SendHorizontal`), sin fondo, visible en todas las páginas públicas (no login ni admin)
- **Deep linking**: detecta `#vehicle={id}` en el hash y navega al detalle
- Footer: eliminada columna "Oficina de Ventas", grid ajustado a 2 columnas de 6

### Import de iconos Lucide
```
Car, Sparkles, SendHorizontal
```

---

## 7. Panel Admin (`AdminDashboard.tsx` + `PublishForm.tsx`)

### Cambios realizados
- **Eliminada la sección de Propuestas** (lista de consignaciones, botones Aceptar/Rechazar, notas internas y el tab "Propuestas de Clientes")
- **Eliminada la tarjeta de métrica "Propuestas"** → reemplazada por una tarjeta "Reservados" (`activeReservations`)
- El panel ahora muestra únicamente: métricas (Stock, Valor, Destacados, Reservados) + tabla de Inventario con búsqueda

### Marcas y carrocerías dinámicas
- En `PublishForm` el admin puede **agregar marcas y carrocerías nuevas** ("Agregar marca nueva" / "Agregar carrocería nueva" debajo de cada select)
- Las nuevas opciones se guardan en `localStorage` (`damico_custom_brands`, `damico_custom_body_types`) y se comparten con:
  - El select de marca/carrocería del formulario
  - El filtro de marca y carrocería del catálogo
  - Los atajos de carrocería del home
- Listas expuestas por `InventoryContext` (`brands`, `addBrand`, `bodyTypes`, `addBodyType`)

### Combustibles
- Opciones actuales: Diesel, Nafta, **Nafta/GNC**, **Diesel/GNC**, Híbrido, Eléctrico

---

## 8. Tipos de datos (`src/types.ts`)

```typescript
type ActiveTab = 'home' | 'catalog' | 'consignment' | 'admin' | 'login' | 'vehicle-detail';
```

### Vehicle interface
```typescript
interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  version: string;
  anio: number;
  precio: number;
  kilometraje: number;
  motor: string;
  transmision: 'Manual' | 'Automática';
  traccion: '4x2' | '4x4' | 'AWD' | 'RWD';
  combustible: 'Nafta' | 'Diesel' | 'Nafta/GNC' | 'Diesel/GNC' | 'Híbrido' | 'Eléctrico';
  carroceria: string;
  imagen: string;
  imagenesSecundarias: string[];
  destacado: boolean;
  estado: 'Disponible' | 'Reservado' | 'Vendido';
  creadoEn: string;
}
```

---

## 9. Número de WhatsApp

- **Número actual:** +54 9 2915 36-7498 (`5492915367498`)
- **Archivos donde está configurado:**
  - `src/components/VehicleDetailView.tsx` (función `openWhatsappChat`)
  - `src/components/ConsignmentView.tsx` (link directo)
  - `src/App.tsx` (CTA banner + pathway card)

---

## 10. Paleta de colores
- **Rojo principal:** `brand-primary` (#CC1818)
- **Fondo oscuro:** `brand-dark` (#14161a, gris oscuro levemente más claro que el negro original)
- **Cards:** `brand-card` (#1c1f25)
- **Texto primario:** `white`
- **Texto secundario:** `neutral-400`
- **Texto specs:** `neutral-300`
- **Bordes:** `neutral-800/80`
- **Accent:** `brand-accent`

---

## 11. Comandos útiles
```bash
npm run dev          # Arranca frontend + backend
npm run lint         # Typecheck (tsc --noEmit)
npm run seed-admin   # Crear admin: npm run seed-admin -- email password
```

---

## 12. Acceso admin
- URL: `http://localhost:3000/#control-panel` o `?control-panel=true`
- Email: `fededamico@admin.com` (definido en `.env`)
- Credenciales de Supabase en `.env`

---

## 13. Pendientes / Ideas futuras
- [ ] Crossfade con más de una imagen secundaria (actualmente solo usa `imagenesSecundarias[0]`)
- [ ] Animación de entrada staggered para las tarjetas del marketplace
- [ ] Lazy loading de imágenes
- [ ] Filtros persistentes en URL (query params)
- [ ] Paginación o infinite scroll para catálogo grande

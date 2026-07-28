# Walkthrough - Cambios Visuales D'Amico Automotores

## Resumen General

Se realizó un rediseño completo de las tarjetas de vehículos y la homepage siguiendo una estética premium inspirada en Porsche Finder, BMW Approved y Audi Selection Plus.

---

## 1. HomeView (`src/components/HomeView.tsx`)

### Estructura de secciones (orden actual)
1. **Hero** → buscador + categorías rápidas (sin texto "Categorías Rápidas:", solo botones)
2. **Destacados de la Semana** → 3 tarjetas de vehículos destacados
3. **Pathway Cards** → "Quiero Comprar" / "Quiero Vender"
4. **Trust Banner** → Calidad Certificada, Operaciones Seguras, Atención Inmediata

### Tarjeta de Destacados
- Imagen: `aspect-[4/3]` (~60% de la tarjeta)
- Crossfade: si tiene `imagenesSecundarias[0]`, al hacer hover aparece con `opacity-0 → opacity-100` (500ms)
- Badge "Destacado": `bg-brand-primary` (rojo), texto blanco, estrella rellena (`Star` de Lucide), `text-sm font-bold`, `py-1.5 px-3.5`, `shadow-lg`
- Degradado: `h-[40%]`, `linear-gradient(to_top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 25%, transparent 50%)`
- Hover: `-translate-y-1.5` (6px), `shadow-xl shadow-black/40`, imagen `scale-[1.03]`, `duration-300`
- Nombre: `FORD RANGER` en una sola línea, `text-2xl font-bold tracking-wide`
- Versión: `text-xs` debajo del nombre
- Specs: grilla 2x2 con iconos Lucide (`Calendar`, `Gauge`, `Fuel`, `Settings`), `text-xs`, iconos `h-4 w-4 text-brand-primary/70`
- Precio: `text-[1.7rem]`, separado por divider sutil
- Border: `rounded-2xl border border-neutral-800/80 bg-brand-card/40`

### Import de iconos Lucide
```
Search, Compass, Coins, Star, Shield, HelpCircle, ChevronRight, ArrowUpRight, Calendar, Gauge, Fuel, Settings
```

---

## 2. CatalogView (`src/components/CatalogView.tsx`)

### Tarjeta de Catálogo
- Mismos cambios que la tarjeta de HomeView
- Badge de estado (Disponible/Reservado/Vendido) se mantiene con colores individuales
- Badge "Destacado": igual al de HomeView (rojo + estrella)
- Botón "Ver Detalle →" al lado del precio con `group-hover:translate-x-1`
- Hover: mismas microinteracciones que HomeView

### Import de iconos Lucide
```
Search, Filter, Info, X, Send, Landmark, ShieldCheck, Share2, ArrowLeft, Printer, Calendar, Gauge, Fuel, Settings, Star
```

### Modal de detalle
- Se mantiene sin cambios en esta ronda

---

## 3. Overlay de imágenes (ya aplicado antes)
- `HomeView.tsx` y `CatalogView.tsx`
- `h-2/3` → `h-[40%]`
- Gradiente: `linear-gradient(to_top, rgba(0,0,0,0.8)_0%, rgba(0,0,0,0.15)_25%, transparent_50%)`

---

## 4. Tipos de datos (`src/types.ts`)

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
  combustible: 'Nafta' | 'Diesel' | 'Nafta/GNC' | 'Híbrido' | 'Eléctrico';
  carroceria: 'SUV' | 'Pick-up' | 'Sedán' | 'Hatchback' | 'Deportivos';
  imagen: string;
  imagenesSecundarias: string[];
  destacado: boolean;
  estado: 'Disponible' | 'Reservado' | 'Vendido';
  creadoEn: string;
}
```

---

## 5. Paleta de colores
- **Rojo principal:** `brand-primary` (#CC1818)
- **Fondo oscuro:** `brand-dark`
- **Cards:** `brand-card/40`
- **Texto primario:** `white`
- **Texto secundario:** `neutral-400`
- **Texto specs:** `neutral-300`
- **Bordes:** `neutral-800/80`
- **Accent:** `brand-accent`

---

## 6. Comandos útiles
```bash
npm run dev          # Arranca frontend + backend
npm run lint         # Typecheck (tsc --noEmit)
npm run seed-admin   # Crear admin: npm run seed-admin -- email password
```

---

## 7. Acceso admin
- URL: `http://localhost:3000/#control-panel` o `?control-panel=true`
- Email: `fededamico@admin.com` (definido en `.env`)
- Credenciales de Supabase en `.env`

---

## 8. Pendientes / Ideas futuras
- [ ] Crossfade con más de una imagen secundaria (actualmente solo usa `imagenesSecundarias[0]`)
- [ ] Animación de entrada staggered para las tarjetas
- [ ] Lazy loading de imágenes
- [ ] Optimización de performance del modal de detalle

-- Esquema de Base de Datos para Supabase - D'Amico Automotores

-- 1. Tabla: users (para inicio de sesión del administrador único)
CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  "passwordHash" text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla: vehicles (inventario de autos en catálogo)
CREATE TABLE IF NOT EXISTS vehicles (
  id text PRIMARY KEY,
  marca text NOT NULL,
  modelo text NOT NULL,
  version text NOT NULL,
  anio integer NOT NULL,
  precio numeric NOT NULL,
  kilometraje integer NOT NULL,
  motor text NOT NULL,
  transmision text NOT NULL,
  traccion text NOT NULL,
  combustible text NOT NULL,
  carroceria text NOT NULL,
  imagen text NOT NULL,
  "imagenesSecundarias" text[] NOT NULL,
  destacado boolean NOT NULL DEFAULT false,
  estado text NOT NULL DEFAULT 'Disponible',
  "creadoEn" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla: consignments (propuestas de consignación recibidas)
CREATE TABLE IF NOT EXISTS consignments (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  celular text NOT NULL,
  marca text NOT NULL,
  modelo text NOT NULL,
  version text,
  anio integer NOT NULL,
  kilometraje integer NOT NULL,
  "precioPretendido" numeric NOT NULL,
  estado text NOT NULL DEFAULT 'Pendiente',
  "notasInternas" text,
  "creadoEn" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sembrado inicial de vehículos (si no existen previamente)
INSERT INTO vehicles (
  id, marca, modelo, version, anio, precio, kilometraje, motor, transmision, traccion, combustible, carroceria, imagen, "imagenesSecundarias", destacado, estado, "creadoEn"
) VALUES
('ford-ranger-2021', 'Ford', 'Ranger', 'Limited 3.2 4x4 AT', 2021, 38500, 45000, '3.2L Puma 5Cil (200cv)', 'Automática', '4x4', 'Diesel', 'Pick-up', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200', ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=600'], true, 'Disponible', '2026-05-10T12:00:00Z'),
('vw-amarok-2022', 'Volkswagen', 'Amarok', 'Highline 2.0 TDI 4x4 AT', 2022, 41000, 32000, '2.0L BiTDI (180cv)', 'Automática', '4x4', 'Diesel', 'Pick-up', 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=1200', ARRAY['https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600'], true, 'Disponible', '2026-05-15T10:30:00Z'),
('toyota-hilux-2020', 'Toyota', 'Hilux', 'SRV 2.8 TDI 4x4 AT', 2020, 36500, 68000, '2.8L D-4D (204cv)', 'Automática', '4x4', 'Diesel', 'Pick-up', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200', ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600'], false, 'Disponible', '2026-05-18T14:15:00Z'),
('peugeot-2008-2019', 'Peugeot', '2008', 'Crossway 1.6 Tiptronic', 2019, 17800, 52000, '1.6L VTi (115cv)', 'Automática', '4x2', 'Nafta', 'SUV', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200', ARRAY['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600'], true, 'Disponible', '2026-05-20T09:00:00Z'),
('porsche-macan-2021', 'Porsche', 'Macan', 'GTS 2.9 V6 Biturbo AWD', 2021, 125000, 14000, '2.9L TFSI V6 Biturbo (380cv)', 'Automática', 'AWD', 'Nafta', 'Deportivos', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200', ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=600'], true, 'Disponible', '2026-05-22T16:45:00Z'),
('audi-a4-2021', 'Audi', 'A4', 'S-line 2.0 TFSI S-tronic', 2021, 42900, 24000, '2.0L Turbo Mild-Hybrid (190cv)', 'Automática', '4x2', 'Híbrido', 'Sedán', 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=1200', ARRAY['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=600'], false, 'Disponible', '2026-05-24T11:00:00Z'),
('mercedes-c300-2021', 'Mercedes-Benz', 'C300', 'AMG-Line 2.0T AT', 2021, 54000, 18000, '2.0L Turbo 4Cil (258cv)', 'Automática', 'RWD', 'Nafta', 'Sedán', 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200', ARRAY['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600'], false, 'Reservado', '2026-05-26T15:20:00Z'),
('jeep-compass-2022', 'Jeep', 'Compass', 'Limited 2.0 TD 4x4 AT', 2022, 29500, 35000, '2.0L Turbodiesel (170cv)', 'Automática', '4x4', 'Diesel', 'SUV', 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200', ARRAY['https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=600'], false, 'Disponible', '2026-05-28T10:10:00Z')
ON CONFLICT (id) DO NOTHING;

-- Sembrado del usuario Administrador por defecto (admin@damicoautomotores.com / adminPassword123)
INSERT INTO users (email, "passwordHash")
VALUES ('admin@damicoautomotores.com', '$2b$10$n.nJG8uBNScJSVTCvO0wkes2fM74oEpfqwgtLL7PEP8cantShBUIi')
ON CONFLICT (email) DO NOTHING;

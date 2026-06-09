import express from 'express';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  version: string;
  anio: number;
  precio: number;
  kilometraje: number;
  motor: string;
  transmision: string;
  traccion: string;
  combustible: string;
  carroceria: string;
  imagen: string;
  imagenesSecundarias: string[];
  destacado: boolean;
  estado: string;
  creadoEn: string;
  [key: string]: unknown;
}

interface ConsignmentRequest {
  id: string;
  nombre: string;
  celular: string;
  marca: string;
  modelo: string;
  anio: number;
  version: string;
  kilometraje: number;
  precioPretendido: number;
  estado: string;
  notasInternas?: string;
  creadoEn: string;
  [key: string]: unknown;
}

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'ford-ranger-2021',
    marca: 'Ford',
    modelo: 'Ranger',
    version: 'Limited 3.2 4x4 AT',
    anio: 2021,
    precio: 38500,
    kilometraje: 45000,
    motor: '3.2L Puma 5Cil (200cv)',
    transmision: 'Automática',
    traccion: '4x4',
    combustible: 'Diesel',
    carroceria: 'Pick-up',
    imagen: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
    imagenesSecundarias: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=600'
    ],
    destacado: true,
    estado: 'Disponible',
    creadoEn: '2026-05-10T12:00:00Z'
  },
  {
    id: 'vw-amarok-2022',
    marca: 'Volkswagen',
    modelo: 'Amarok',
    version: 'Highline 2.0 TDI 4x4 AT',
    anio: 2022,
    precio: 41000,
    kilometraje: 32000,
    motor: '2.0L BiTDI (180cv)',
    transmision: 'Automática',
    traccion: '4x4',
    combustible: 'Diesel',
    carroceria: 'Pick-up',
    imagen: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=1200',
    imagenesSecundarias: [
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600'
    ],
    destacado: true,
    estado: 'Disponible',
    creadoEn: '2026-05-15T10:30:00Z'
  },
  {
    id: 'toyota-hilux-2020',
    marca: 'Toyota',
    modelo: 'Hilux',
    version: 'SRV 2.8 TDI 4x4 AT',
    anio: 2020,
    precio: 36500,
    kilometraje: 68000,
    motor: '2.8L D-4D (204cv)',
    transmision: 'Automática',
    traccion: '4x4',
    combustible: 'Diesel',
    carroceria: 'Pick-up',
    imagen: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
    imagenesSecundarias: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600'
    ],
    destacado: false,
    estado: 'Disponible',
    creadoEn: '2026-05-18T14:15:00Z'
  },
  {
    id: 'peugeot-2008-2019',
    marca: 'Peugeot',
    modelo: '2008',
    version: 'Crossway 1.6 Tiptronic',
    anio: 2019,
    precio: 17800,
    kilometraje: 52000,
    motor: '1.6L VTi (115cv)',
    transmision: 'Automática',
    traccion: '4x2',
    combustible: 'Nafta',
    carroceria: 'SUV',
    imagen: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200',
    imagenesSecundarias: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600'
    ],
    destacado: true,
    estado: 'Disponible',
    creadoEn: '2026-05-20T09:00:00Z'
  },
  {
    id: 'porsche-macan-2021',
    marca: 'Porsche',
    modelo: 'Macan',
    version: 'GTS 2.9 V6 Biturbo AWD',
    anio: 2021,
    precio: 125000,
    kilometraje: 14000,
    motor: '2.9L TFSI V6 Biturbo (380cv)',
    transmision: 'Automática',
    traccion: 'AWD',
    combustible: 'Nafta',
    carroceria: 'Deportivos',
    imagen: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
    imagenesSecundarias: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=600'
    ],
    destacado: true,
    estado: 'Disponible',
    creadoEn: '2026-05-22T16:45:00Z'
  },
  {
    id: 'audi-a4-2021',
    marca: 'Audi',
    modelo: 'A4',
    version: 'S-line 2.0 TFSI S-tronic',
    anio: 2021,
    precio: 42900,
    kilometraje: 24000,
    motor: '2.0L Turbo Mild-Hybrid (190cv)',
    transmision: 'Automática',
    traccion: '4x2',
    combustible: 'Híbrido',
    carroceria: 'Sedán',
    imagen: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=1200',
    imagenesSecundarias: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=600'
    ],
    destacado: false,
    estado: 'Disponible',
    creadoEn: '2026-05-24T11:00:00Z'
  },
  {
    id: 'mercedes-c300-2021',
    marca: 'Mercedes-Benz',
    modelo: 'C300',
    version: 'AMG-Line 2.0T AT',
    anio: 2021,
    precio: 54000,
    kilometraje: 18000,
    motor: '2.0L Turbo 4Cil (258cv)',
    transmision: 'Automática',
    traccion: 'RWD',
    combustible: 'Nafta',
    carroceria: 'Sedán',
    imagen: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200',
    imagenesSecundarias: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600'
    ],
    destacado: false,
    estado: 'Reservado',
    creadoEn: '2026-05-26T15:20:00Z'
  },
  {
    id: 'jeep-compass-2022',
    marca: 'Jeep',
    modelo: 'Compass',
    version: 'Limited 2.0 TD 4x4 AT',
    anio: 2022,
    precio: 29500,
    kilometraje: 35000,
    motor: '2.0L Turbodiesel (170cv)',
    transmision: 'Automática',
    traccion: '4x4',
    combustible: 'Diesel',
    carroceria: 'SUV',
    imagen: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200',
    imagenesSecundarias: [
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=600'
    ],
    destacado: false,
    estado: 'Disponible',
    creadoEn: '2026-05-28T10:10:00Z'
  }
];

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'damico-secret-key-super-secure';
const DB_FILE = path.join(process.cwd(), 'database.json');

// Supabase Connection Configuration
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const useSupabase = !!(supabaseUrl && supabaseServiceKey);
const supabase = useSupabase ? createClient(supabaseUrl!, supabaseServiceKey!) : null;

if (useSupabase) {
  console.log('[Damico Backend] Active DB mode: Supabase Cloud Database');
} else {
  console.log('[Damico Backend] Active DB mode: Local database.json File');
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Custom CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Database Interfaces
interface DatabaseSchema {
  users: Array<{ email: string; passwordHash: string }>;
  vehicles: Vehicle[];
  consignments: ConsignmentRequest[];
}

// Local Database Helpers
function readLocalDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    const defaultDb: DatabaseSchema = {
      users: [],
      vehicles: INITIAL_VEHICLES,
      consignments: []
    };
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('adminPassword123', salt);
    defaultDb.users.push({
      email: 'admin@damicoautomotores.com',
      passwordHash
    });
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf8');
    return defaultDb;
  }
  
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    const defaultDb: DatabaseSchema = {
      users: [],
      vehicles: INITIAL_VEHICLES,
      consignments: []
    };
    return defaultDb;
  }
}

function writeLocalDatabase(db: DatabaseSchema) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

// Ensure local db file is initialized on startup if not on Supabase
if (!useSupabase) {
  readLocalDatabase();
}

// Authentication Middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado.' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
    req.user = decoded;
    next();
  });
}

// Endpoints

// 1. PUBLIC: Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'El email y la contraseña son requeridos.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check Admin Env Override first (Simplifies serverless admin configuration on Vercel)
  const envAdminEmail = process.env.ADMIN_EMAIL || 'admin@damicoautomotores.com';
  const envAdminPassword = process.env.ADMIN_PASSWORD;

  if (normalizedEmail === envAdminEmail.toLowerCase().trim() && envAdminPassword) {
    if (password === envAdminPassword) {
      const token = jwt.sign({ email: envAdminEmail, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, user: { email: envAdminEmail, id: 'admin-env' } });
    }
  }

  // Fallback to Supabase users table
  if (useSupabase) {
    try {
      const { data, error } = await supabase!
        .from('users')
        .select('*')
        .eq('email', normalizedEmail)
        .single();
      
      if (!error && data) {
        const isPasswordValid = bcrypt.compareSync(password, data.passwordHash);
        if (isPasswordValid) {
          const token = jwt.sign({ email: data.email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
          return res.json({ token, user: { email: data.email, id: data.id || 'admin-sb' } });
        }
      }
    } catch (e) {
      console.error('Supabase auth check failed:', e);
    }
  }

  // Default to local DB check
  const db = readLocalDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    const token = jwt.sign({ email: user.email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { email: user.email, id: 'admin-local' } });
  }

  res.status(401).json({ error: 'Credenciales inválidas.' });
});

// 2. PUBLIC: Get all vehicles
app.get('/api/vehicles', async (req, res) => {
  if (useSupabase) {
    try {
      const { data, error } = await supabase!
        .from('vehicles')
        .select('*')
        .order('creadoEn', { ascending: false });
      
      if (!error) {
        return res.json(data || []);
      }
      console.error('Error fetching vehicles from Supabase:', error.message);
    } catch (e) {
      console.error('Supabase vehicles fetch failed:', e);
    }
  }

  const db = readLocalDatabase();
  res.json(db.vehicles);
});

// 3. PROTECTED: Add vehicle
app.post('/api/vehicles', authenticateToken, async (req, res) => {
  const vehicleData = req.body;
  const newVehicle: Vehicle = {
    ...vehicleData,
    id: `${vehicleData.marca.toLowerCase()}-${vehicleData.modelo.toLowerCase()}-${Date.now()}`,
    creadoEn: new Date().toISOString()
  };

  if (useSupabase) {
    try {
      const { data, error } = await supabase!
        .from('vehicles')
        .insert(newVehicle)
        .select()
        .single();
      
      if (!error && data) {
        return res.status(201).json(data);
      }
      console.error('Error adding vehicle to Supabase:', error?.message);
    } catch (e) {
      console.error('Supabase vehicle insert failed:', e);
    }
  }

  const db = readLocalDatabase();
  db.vehicles.unshift(newVehicle);
  writeLocalDatabase(db);
  res.status(201).json(newVehicle);
});

// 4. PROTECTED: Update vehicle
app.put('/api/vehicles/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (useSupabase) {
    try {
      const { data, error } = await supabase!
        .from('vehicles')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();
      
      if (!error && data) {
        return res.json(data);
      }
      console.error('Error updating vehicle in Supabase:', error?.message);
    } catch (e) {
      console.error('Supabase vehicle update failed:', e);
    }
  }

  const db = readLocalDatabase();
  const idx = db.vehicles.findIndex(v => v.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Vehículo no encontrado.' });
  }

  db.vehicles[idx] = {
    ...db.vehicles[idx],
    ...updatedData
  };

  writeLocalDatabase(db);
  res.json(db.vehicles[idx]);
});

// 5. PROTECTED: Delete vehicle
app.delete('/api/vehicles/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (useSupabase) {
    try {
      const { error } = await supabase!
        .from('vehicles')
        .delete()
        .eq('id', id);
      
      if (!error) {
        return res.json({ success: true, message: 'Vehículo eliminado con éxito.' });
      }
      console.error('Error deleting vehicle from Supabase:', error.message);
    } catch (e) {
      console.error('Supabase vehicle delete failed:', e);
    }
  }

  const db = readLocalDatabase();
  const filtered = db.vehicles.filter(v => v.id !== id);
  if (filtered.length === db.vehicles.length) {
    return res.status(404).json({ error: 'Vehículo no encontrado.' });
  }

  db.vehicles = filtered;
  writeLocalDatabase(db);
  res.json({ success: true, message: 'Vehículo eliminado con éxito.' });
});

// 6. PUBLIC: Submit Consignment request
app.post('/api/consignments', async (req, res) => {
  const reqData = req.body;
  const newReq: ConsignmentRequest = {
    ...reqData,
    id: `consign-${Date.now()}`,
    estado: 'Pendiente',
    creadoEn: new Date().toISOString()
  };

  if (useSupabase) {
    try {
      const { data, error } = await supabase!
        .from('consignments')
        .insert(newReq)
        .select()
        .single();
      
      if (!error && data) {
        return res.status(201).json(data);
      }
      console.error('Error adding consignment to Supabase:', error?.message);
    } catch (e) {
      console.error('Supabase consignment insert failed:', e);
    }
  }

  const db = readLocalDatabase();
  db.consignments.unshift(newReq);
  writeLocalDatabase(db);
  res.status(201).json(newReq);
});

// 7. PROTECTED: Get all consignment requests
app.get('/api/consignments', authenticateToken, async (req, res) => {
  if (useSupabase) {
    try {
      const { data, error } = await supabase!
        .from('consignments')
        .select('*')
        .order('creadoEn', { ascending: false });
      
      if (!error) {
        return res.json(data || []);
      }
      console.error('Error fetching consignments from Supabase:', error.message);
    } catch (e) {
      console.error('Supabase consignments fetch failed:', e);
    }
  }

  const db = readLocalDatabase();
  res.json(db.consignments);
});

// 8. PROTECTED: Update consignment notes or status
app.put('/api/consignments/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { estado, notasInternas } = req.body;
  const updatedData: any = {};
  if (estado !== undefined) updatedData.estado = estado;
  if (notasInternas !== undefined) updatedData.notasInternas = notasInternas;

  if (useSupabase) {
    try {
      const { data, error } = await supabase!
        .from('consignments')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();
      
      if (!error && data) {
        return res.json(data);
      }
      console.error('Error updating consignment in Supabase:', error?.message);
    } catch (e) {
      console.error('Supabase consignment update failed:', e);
    }
  }

  const db = readLocalDatabase();
  const idx = db.consignments.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Propuesta no encontrada.' });
  }

  if (estado !== undefined) db.consignments[idx].estado = estado;
  if (notasInternas !== undefined) db.consignments[idx].notasInternas = notasInternas;

  writeLocalDatabase(db);
  res.json(db.consignments[idx]);
});

export default app;

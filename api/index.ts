import express from 'express';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_VEHICLES } from '../src/mockData';
import { Vehicle, ConsignmentRequest } from '../src/types';

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

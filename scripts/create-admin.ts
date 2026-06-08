import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_FILE = path.join(process.cwd(), 'database.json');

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Uso: npx tsx scripts/create-admin.ts <email> <contraseña>');
  process.exit(1);
}

interface DatabaseSchema {
  users: Array<{ email: string; passwordHash: string }>;
  vehicles: any[];
  consignments: any[];
}

function run() {
  let db: DatabaseSchema = { users: [], vehicles: [], consignments: [] };
  
  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
      console.log('Base de datos corrupta o vacía, inicializando nueva estructura...');
    }
  }

  // Filter out any existing user with the same email
  db.users = db.users.filter(u => u.email.toLowerCase() !== email.toLowerCase());

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  db.users.push({
    email: email.toLowerCase(),
    passwordHash
  });

  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  console.log(`Usuario administrador registrado con éxito:`);
  console.log(`Email: ${email}`);
  console.log(`Contraseña: [Guardada de forma segura mediante Hash BCrypt]`);
}

run();

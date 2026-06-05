/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vehicle } from './types';

export const INITIAL_VEHICLES: Vehicle[] = [
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

export const AVAILABLE_BRANDS = [
  'Ford',
  'Volkswagen',
  'Toyota',
  'Peugeot',
  'Porsche',
  'Audi',
  'Mercedes-Benz',
  'Jeep',
  'BMW',
  'Chevrolet',
  'Honda',
  'Hyundai'
];

export const BODY_TYPES = [
  { id: 'SUV', label: 'SUV' },
  { id: 'Pick-up', label: 'Pick-up' },
  { id: 'Sedan', label: 'Sedán' },
  { id: 'Hatchback', label: 'Hatchback' },
  { id: 'Premium', label: 'Deportivos' }
];

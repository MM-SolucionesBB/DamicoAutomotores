/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Vehicle {
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

export interface ConsignmentRequest {
  id: string;
  nombre: string;
  celular: string;
  marca: string;
  modelo: string;
  anio: number;
  version: string;
  kilometraje: number;
  precioPretendido: number;
  estado: 'Pendiente' | 'Revisado' | 'Aceptado' | 'Rechazado';
  notasInternas?: string;
  creadoEn: string;
}

export type ActiveTab = 'home' | 'catalog' | 'consignment' | 'admin' | 'login' | 'vehicle-detail';

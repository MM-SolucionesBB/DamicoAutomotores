/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vehicle, ConsignmentRequest, ActiveTab } from '../types';
import { INITIAL_VEHICLES } from '../mockData';

interface InventoryContextProps {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'creadoEn'>) => void;
  updateVehicle: (id: string, updated: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  consignments: ConsignmentRequest[];
  addConsignment: (req: Omit<ConsignmentRequest, 'id' | 'creadoEn' | 'estado'>) => void;
  updateConsignmentStatus: (id: string, status: ConsignmentRequest['estado']) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  adminViewMode: boolean;
  setAdminViewMode: (val: boolean) => void;
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
  searchFilter: string;
  setSearchFilter: (term: string) => void;
  bodyTypeFilter: string;
  setBodyTypeFilter: (type: string) => void;
}

const InventoryContext = createContext<InventoryContextProps | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [consignments, setConsignments] = useState<ConsignmentRequest[]>([]);
  const [activeTab, setActiveTabInternal] = useState<ActiveTab>('home');
  const [adminViewMode, setAdminViewMode] = useState<boolean>(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [bodyTypeFilter, setBodyTypeFilter] = useState<string>('');

  // Initial load
  useEffect(() => {
    const cachedVehicles = localStorage.getItem('damico_vehicles');
    if (cachedVehicles) {
      try {
        setVehicles(JSON.parse(cachedVehicles));
      } catch (e) {
        setVehicles(INITIAL_VEHICLES);
      }
    } else {
      setVehicles(INITIAL_VEHICLES);
      localStorage.setItem('damico_vehicles', JSON.stringify(INITIAL_VEHICLES));
    }

    const cachedConsignments = localStorage.getItem('damico_consignments');
    if (cachedConsignments) {
      try {
        setConsignments(JSON.parse(cachedConsignments));
      } catch (e) {
        setConsignments([]);
      }
    } else {
      const defaultConsignments: ConsignmentRequest[] = [
        {
          id: 'consign-1',
          nombre: 'Juan Pérez',
          celular: '+5491122334455',
          marca: 'Toyota',
          modelo: 'Corolla',
          anio: 2018,
          version: 'SE-G 1.8 CVT',
          kilometraje: 72000,
          precioPretendido: 16500,
          estado: 'Pendiente',
          creadoEn: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setConsignments(defaultConsignments);
      localStorage.setItem('damico_consignments', JSON.stringify(defaultConsignments));
    }
  }, []);

  // Sync state to local storage
  const saveVehicles = (newVehicles: Vehicle[]) => {
    setVehicles(newVehicles);
    localStorage.setItem('damico_vehicles', JSON.stringify(newVehicles));
  };

  const saveConsignments = (newConsignments: ConsignmentRequest[]) => {
    setConsignments(newConsignments);
    localStorage.setItem('damico_consignments', JSON.stringify(newConsignments));
  };

  const addVehicle = (vehicleData: Omit<Vehicle, 'id' | 'creadoEn'>) => {
    const id = `${vehicleData.marca.toLowerCase()}-${vehicleData.modelo.toLowerCase()}-${Date.now()}`;
    const newVehicle: Vehicle = {
      ...vehicleData,
      id,
      creadoEn: new Date().toISOString()
    };
    saveVehicles([newVehicle, ...vehicles]);
  };

  const updateVehicle = (id: string, updated: Partial<Vehicle>) => {
    const updatedVehicles = vehicles.map(v => (v.id === id ? { ...v, ...updated } : v));
    saveVehicles(updatedVehicles);
  };

  const deleteVehicle = (id: string) => {
    const filtered = vehicles.filter(v => v.id !== id);
    saveVehicles(filtered);
    if (selectedVehicleId === id) {
      setSelectedVehicleId(null);
    }
  };

  const addConsignment = (reqData: Omit<ConsignmentRequest, 'id' | 'creadoEn' | 'estado'>) => {
    const id = `consign-${Date.now()}`;
    const newReq: ConsignmentRequest = {
      ...reqData,
      id,
      estado: 'Pendiente',
      creadoEn: new Date().toISOString()
    };
    saveConsignments([newReq, ...consignments]);
  };

  const updateConsignmentStatus = (id: string, status: ConsignmentRequest['estado']) => {
    const updated = consignments.map(c => (c.id === id ? { ...c, estado: status } : c));
    saveConsignments(updated);
  };

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabInternal(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <InventoryContext.Provider
      value={{
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        consignments,
        addConsignment,
        updateConsignmentStatus,
        activeTab,
        setActiveTab,
        adminViewMode,
        setAdminViewMode,
        selectedVehicleId,
        setSelectedVehicleId,
        searchFilter,
        setSearchFilter,
        bodyTypeFilter,
        setBodyTypeFilter
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

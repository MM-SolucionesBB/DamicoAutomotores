import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Vehicle } from '../types';
import { INITIAL_VEHICLES, AVAILABLE_BRANDS } from '../mockData';
import { useAuth } from './AuthContext';

export const DEFAULT_BODY_TYPES = ['SUV', 'Pick-up', 'Sedán', 'Hatchback', 'Deportivos'];

interface InventoryContextProps {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'creadoEn'>) => void;
  updateVehicle: (id: string, updated: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  brands: string[];
  addBrand: (name: string) => void;
  bodyTypes: string[];
  addBodyType: (name: string) => void;
  loading: boolean;
}

const InventoryContext = createContext<InventoryContextProps | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const [brands, setBrands] = useState<string[]>(() => {
    const custom = localStorage.getItem('damico_custom_brands');
    const customList = custom ? JSON.parse(custom) : [];
    return Array.from(new Set([...AVAILABLE_BRANDS, ...customList]));
  });
  const [bodyTypes, setBodyTypes] = useState<string[]>(() => {
    const custom = localStorage.getItem('damico_custom_body_types');
    const customList = custom ? JSON.parse(custom) : [];
    return Array.from(new Set([...DEFAULT_BODY_TYPES, ...customList]));
  });

  const addBrand = useCallback((name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setBrands(prev => {
      if (prev.includes(clean)) return prev;
      const next = [...prev, clean];
      const custom = next.filter(b => !AVAILABLE_BRANDS.includes(b));
      localStorage.setItem('damico_custom_brands', JSON.stringify(custom));
      return next;
    });
  }, []);

  const addBodyType = useCallback((name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setBodyTypes(prev => {
      if (prev.includes(clean)) return prev;
      const next = [...prev, clean];
      const custom = next.filter(b => !DEFAULT_BODY_TYPES.includes(b));
      localStorage.setItem('damico_custom_body_types', JSON.stringify(custom));
      return next;
    });
  }, []);

  useEffect(() => {
    localStorage.removeItem('damico_consignments');
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vehicles');
      if (!response.ok) throw new Error('Error al obtener vehículos del servidor.');
      const data = await response.json();
      setVehicles(data || []);
      localStorage.setItem('damico_vehicles', JSON.stringify(data || []));
    } catch (error) {
      console.error('Error fetching vehicles from Express:', error);
      const cached = localStorage.getItem('damico_vehicles');
      if (cached) {
        try {
          setVehicles(JSON.parse(cached));
        } catch {
          setVehicles(INITIAL_VEHICLES);
        }
      } else {
        setVehicles(INITIAL_VEHICLES);
        localStorage.setItem('damico_vehicles', JSON.stringify(INITIAL_VEHICLES));
      }
    }
    setLoading(false);
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'creadoEn'>) => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vehicleData)
      });
      if (!response.ok) throw new Error('Error al agregar vehículo.');
      const data = await response.json();
      setVehicles(prev => [data, ...prev]);
      // Sincronizar cache
      const cached = localStorage.getItem('damico_vehicles');
      const list = cached ? JSON.parse(cached) : [];
      localStorage.setItem('damico_vehicles', JSON.stringify([data, ...list]));
    } catch (error) {
      console.error('Error adding vehicle via API:', error);
      alert('Ocurrió un error al guardar la unidad en el servidor.');
    }
  };

  const updateVehicle = async (id: string, updated: Partial<Vehicle>) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
      if (!response.ok) throw new Error('Error al actualizar vehículo.');
      const data = await response.json();
      const updatedVehicles = vehicles.map(v => (v.id === id ? data : v));
      setVehicles(updatedVehicles);
      localStorage.setItem('damico_vehicles', JSON.stringify(updatedVehicles));
    } catch (error) {
      console.error('Error updating vehicle via API:', error);
      alert('Ocurrió un error al modificar la unidad en el servidor.');
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al eliminar vehículo.');
      const filtered = vehicles.filter(v => v.id !== id);
      setVehicles(filtered);
      localStorage.setItem('damico_vehicles', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting vehicle via API:', error);
      alert('Ocurrió un error al borrar la unidad del servidor.');
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        brands,
        addBrand,
        bodyTypes,
        addBodyType,
        loading
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

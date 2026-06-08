import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Vehicle, ConsignmentRequest, ActiveTab } from '../types';
import { INITIAL_VEHICLES } from '../mockData';
import { useAuth } from './AuthContext';

interface InventoryContextProps {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'creadoEn'>) => void;
  updateVehicle: (id: string, updated: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  consignments: ConsignmentRequest[];
  addConsignment: (req: Omit<ConsignmentRequest, 'id' | 'creadoEn' | 'estado'>) => void;
  updateConsignmentStatus: (id: string, status: ConsignmentRequest['estado']) => void;
  updateConsignmentNotes: (id: string, notes: string) => Promise<void>;
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
  loading: boolean;
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
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (token) {
      fetchConsignments();
    } else {
      setConsignments([]);
    }
  }, [token]);

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

  const fetchConsignments = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/consignments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al obtener propuestas del servidor.');
      const data = await response.json();
      setConsignments(data || []);
      localStorage.setItem('damico_consignments', JSON.stringify(data || []));
    } catch (error) {
      console.error('Error fetching consignments from Express:', error);
      const cached = localStorage.getItem('damico_consignments');
      if (cached) {
        try {
          setConsignments(JSON.parse(cached));
        } catch {
          setConsignments([]);
        }
      }
    }
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
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al eliminar vehículo.');
      const filtered = vehicles.filter(v => v.id !== id);
      setVehicles(filtered);
      localStorage.setItem('damico_vehicles', JSON.stringify(filtered));
      if (selectedVehicleId === id) {
        setSelectedVehicleId(null);
      }
    } catch (error) {
      console.error('Error deleting vehicle via API:', error);
      alert('Ocurrió un error al borrar la unidad del servidor.');
    }
  };

  const addConsignment = async (reqData: Omit<ConsignmentRequest, 'id' | 'creadoEn' | 'estado'>) => {
    try {
      const response = await fetch('/api/consignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqData)
      });
      if (!response.ok) throw new Error('Error al crear propuesta.');
      const data = await response.json();
      setConsignments(prev => [data, ...prev]);
      
      const cached = localStorage.getItem('damico_consignments');
      const list = cached ? JSON.parse(cached) : [];
      localStorage.setItem('damico_consignments', JSON.stringify([data, ...list]));
    } catch (error) {
      console.error('Error sending consignment:', error);
      alert('Ocurrió un error al enviar tu propuesta de consignación. Por favor reintentá.');
    }
  };

  const updateConsignmentStatus = async (id: string, status: ConsignmentRequest['estado']) => {
    try {
      const response = await fetch(`/api/consignments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: status })
      });
      if (!response.ok) throw new Error('Error al cambiar estado.');
      const data = await response.json();
      const updated = consignments.map(c => (c.id === id ? data : c));
      setConsignments(updated);
      localStorage.setItem('damico_consignments', JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado de la propuesta.');
    }
  };

  const updateConsignmentNotes = async (id: string, notes: string) => {
    try {
      const response = await fetch(`/api/consignments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notasInternas: notes })
      });
      if (!response.ok) throw new Error('Error al guardar notas.');
      const data = await response.json();
      const updated = consignments.map(c => (c.id === id ? data : c));
      setConsignments(updated);
      localStorage.setItem('damico_consignments', JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Error al guardar las notas en el servidor.');
    }
  };

  const setActiveTab = useCallback((tab: ActiveTab) => {
    setActiveTabInternal(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
        updateConsignmentNotes,
        activeTab,
        setActiveTab,
        adminViewMode,
        setAdminViewMode,
        selectedVehicleId,
        setSelectedVehicleId,
        searchFilter,
        setSearchFilter,
        bodyTypeFilter,
        setBodyTypeFilter,
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

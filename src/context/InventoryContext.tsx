import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vehicle, ConsignmentRequest, ActiveTab } from '../types';
import { INITIAL_VEHICLES } from '../mockData';
import { supabase } from '../supabase';

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

  useEffect(() => {
    fetchVehicles();
    fetchConsignments();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('creadoEn', { ascending: false });

    if (error) {
      console.error('Error fetching vehicles from Supabase:', error.message);
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
    } else {
      setVehicles(data || []);
      localStorage.setItem('damico_vehicles', JSON.stringify(data || []));
    }
    setLoading(false);
  };

  const fetchConsignments = async () => {
    const { data, error } = await supabase
      .from('consignments')
      .select('*')
      .order('creadoEn', { ascending: false });

    if (error) {
      console.error('Error fetching consignments from Supabase:', error.message);
      const cached = localStorage.getItem('damico_consignments');
      if (cached) {
        try {
          setConsignments(JSON.parse(cached));
        } catch {
          setConsignments([]);
        }
      } else {
        setConsignments([]);
      }
    } else {
      setConsignments(data || []);
      localStorage.setItem('damico_consignments', JSON.stringify(data || []));
    }
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'creadoEn'>) => {
    const newVehicle = {
      ...vehicleData,
      creadoEn: new Date().toISOString()
    };
    const { data, error } = await supabase
      .from('vehicles')
      .insert(newVehicle)
      .select()
      .single();

    if (error) {
      console.error('Error adding vehicle to Supabase:', error.message);
      const localVehicle: Vehicle = {
        ...newVehicle,
        id: `${vehicleData.marca.toLowerCase()}-${vehicleData.modelo.toLowerCase()}-${Date.now()}`
      };
      setVehicles(prev => [localVehicle, ...prev]);
      localStorage.setItem('damico_vehicles', JSON.stringify([localVehicle, ...vehicles]));
    } else if (data) {
      setVehicles(prev => [data as Vehicle, ...prev]);
      localStorage.setItem('damico_vehicles', JSON.stringify([data as Vehicle, ...vehicles]));
    }
  };

  const updateVehicle = async (id: string, updated: Partial<Vehicle>) => {
    const { error } = await supabase
      .from('vehicles')
      .update(updated)
      .eq('id', id);

    if (error) {
      console.error('Error updating vehicle in Supabase:', error.message);
    }

    const updatedVehicles = vehicles.map(v => (v.id === id ? { ...v, ...updated } : v));
    setVehicles(updatedVehicles);
    localStorage.setItem('damico_vehicles', JSON.stringify(updatedVehicles));
  };

  const deleteVehicle = async (id: string) => {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting vehicle from Supabase:', error.message);
    }

    const filtered = vehicles.filter(v => v.id !== id);
    setVehicles(filtered);
    localStorage.setItem('damico_vehicles', JSON.stringify(filtered));
    if (selectedVehicleId === id) {
      setSelectedVehicleId(null);
    }
  };

  const addConsignment = async (reqData: Omit<ConsignmentRequest, 'id' | 'creadoEn' | 'estado'>) => {
    const newReq = {
      ...reqData,
      estado: 'Pendiente' as const,
      creadoEn: new Date().toISOString()
    };
    const { data, error } = await supabase
      .from('consignments')
      .insert(newReq)
      .select()
      .single();

    if (error) {
      console.error('Error adding consignment to Supabase:', error.message);
      const localReq: ConsignmentRequest = {
        ...newReq,
        id: `consign-${Date.now()}`
      };
      setConsignments(prev => [localReq, ...prev]);
      localStorage.setItem('damico_consignments', JSON.stringify([localReq, ...consignments]));
    } else if (data) {
      setConsignments(prev => [data as ConsignmentRequest, ...prev]);
      localStorage.setItem('damico_consignments', JSON.stringify([data as ConsignmentRequest, ...consignments]));
    }
  };

  const updateConsignmentStatus = async (id: string, status: ConsignmentRequest['estado']) => {
    const { error } = await supabase
      .from('consignments')
      .update({ estado: status })
      .eq('id', id);

    if (error) {
      console.error('Error updating consignment in Supabase:', error.message);
    }

    const updated = consignments.map(c => (c.id === id ? { ...c, estado: status } : c));
    setConsignments(updated);
    localStorage.setItem('damico_consignments', JSON.stringify(updated));
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

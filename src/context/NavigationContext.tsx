import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppView } from '../types';

interface NavigationContextProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
  searchFilter: string;
  setSearchFilter: (term: string) => void;
  bodyTypeFilter: string;
  setBodyTypeFilter: (type: string) => void;
}

const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [bodyTypeFilter, setBodyTypeFilter] = useState<string>('');

  const setView = useCallback((view: AppView) => {
    setCurrentView(view);
    if (view !== 'admin' && view !== 'login') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('control-panel') || url.hash === '#control-panel') {
        url.searchParams.delete('control-panel');
        if (url.hash === '#control-panel') url.hash = '';
        window.history.replaceState({}, '', url.toString());
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        currentView,
        setView,
        selectedVehicleId,
        setSelectedVehicleId,
        searchFilter,
        setSearchFilter,
        bodyTypeFilter,
        setBodyTypeFilter
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

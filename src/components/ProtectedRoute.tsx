import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loading } = useAuth();
  const { setActiveTab } = useInventory();

  useEffect(() => {
    if (!loading && !token) {
      setActiveTab('home');
    }
  }, [token, loading, setActiveTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-brand-dark text-white">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <span className="text-neutral-400 font-sans text-xs uppercase tracking-widest font-bold block">
            Validando sesión de administración...
          </span>
        </div>
      </div>
    );
  }

  return token ? <>{children}</> : null;
};

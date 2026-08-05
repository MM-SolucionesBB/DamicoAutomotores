/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { InventoryProvider } from './context/InventoryContext';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { VehicleDetailView } from './components/VehicleDetailView';
import { ConsignmentView } from './components/ConsignmentView';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginPage } from './components/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Car, Sparkles, SendHorizontal } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentView, setView, setSelectedVehicleId } = useNavigation();
  const { token } = useAuth();

  React.useEffect(() => {
    const checkAdminUrl = () => {
      const hash = window.location.hash;
      if (hash === '#control-panel' || window.location.search.includes('control-panel=true')) {
        if (token) {
          setView('admin');
        } else {
          setView('login');
        }
      } else if (hash.startsWith('#vehicle=')) {
        const vehicleId = hash.replace('#vehicle=', '');
        setSelectedVehicleId(vehicleId);
        setView('vehicle-detail');
      } else {
        setView('home');
      }
    };
    checkAdminUrl();
    window.addEventListener('hashchange', checkAdminUrl);
    return () => window.removeEventListener('hashchange', checkAdminUrl);
  }, [setView, setSelectedVehicleId, token]);

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark text-white selection:bg-brand-primary selection:text-white font-sans">

      {/* Top Banner Navigation bar */}
      <Navigation />

      {/* Main Container Core Router */}
      <main className="flex-grow">
        {currentView === 'home' && <HomeView />}
        {currentView === 'catalog' && <CatalogView />}
        {currentView === 'vehicle-detail' && <VehicleDetailView />}
        {currentView === 'consignment' && <ConsignmentView />}
        {currentView === 'login' && <LoginPage />}
        {currentView === 'admin' && (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </main>

      {/* CTA Banner */}
      {currentView !== 'login' && currentView !== 'admin' && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <a
              href="https://wa.me/5492915367498?text=Hola%20Federico%2C%20me%20comunico%20desde%20la%20p%C3%A1gina%20web%20de%20D%27Amico%20Automotores."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-display text-base uppercase tracking-wider py-3.5 px-8 rounded-xl transition-all cursor-pointer shadow-lg shadow-brand-primary/20"
            >
              <SendHorizontal className="h-4 w-4" />
              Contactanos por WhatsApp
            </a>
          </div>
        </section>
      )}

      {/* Luxury Footer (Only visible on Client Public views, hidden on administrative board for cleaner density) */}
      {currentView !== 'login' && currentView !== 'admin' && (
        <footer className="bg-brand-dark border-t border-neutral-900 pt-16 pb-8" id="system-luxury-footer">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">

            {/* Column 1: Brand Info */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary">
                  <Car className="h-5 w-5 text-white font-bold" />
                </div>
                <span className="font-display text-2xl uppercase tracking-wider text-white">
                  D'Amico <span className="text-brand-primary">Automotores</span>
                </span>
              </div>
              <p className="font-sans text-xs text-neutral-400 leading-relaxed max-w-sm">
                Concesionario líder multimarca especializado en vehículos seleccionados de alta gama, SUV y pick-ups. Máxima transparencia registral y gestoría integral propria.
              </p>
            </div>

            {/* Column 2: Legal & Standards */}
            <div className="md:col-span-6 space-y-3">
              <h4 className="font-display text-sm uppercase tracking-widest text-white">Transparencia de Marca</h4>
              <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                Todas las transacciones de compra, venta o consignación digital de vehículos están sujetas a validación técnico-mecánica previa e información registral libre de deudas patente y multas nacionales.
              </p>
              <div className="flex items-center space-x-2 text-xs text-neutral-400 font-sans">
                <Sparkles className="h-3.5 w-3.5 text-brand-accent animate-pulse" />
                <span>Certificación D'Amico Premium Activa</span>
              </div>
            </div>

          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-neutral-900/60 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] text-neutral-600 gap-4">
            <span>© {new Date().getFullYear()} D'Amico Automotores. Todos los derechos reservados.</span>
            <div className="flex gap-4 font-mono text-[10px]">
              <a href="#terminos" className="hover:text-white transition-colors">Términos de servicio</a>
              <span>•</span>
              <a href="#privacidad" className="hover:text-white transition-colors">Política de Privacidad</a>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <InventoryProvider>
          <MainAppContent />
        </InventoryProvider>
      </NavigationProvider>
    </AuthProvider>
  );
}

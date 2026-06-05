/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { ConsignmentView } from './components/ConsignmentView';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginPage } from './components/LoginPage';
import { Car, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, adminViewMode } = useInventory();

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark text-white selection:bg-brand-primary selection:text-white font-sans">

      {/* Top Banner Navigation bar */}
      <Navigation />

      {/* Main Container Core Router */}
      <main className="flex-grow">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'catalog' && <CatalogView />}
        {activeTab === 'consignment' && <ConsignmentView />}
        {activeTab === 'login' && <LoginPage />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Luxury Footer (Only visible on Client Public views, hidden on administrative board for cleaner density) */}
      {!adminViewMode && (
        <footer className="bg-brand-dark border-t border-neutral-900 pt-16 pb-8" id="system-luxury-footer">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">

            {/* Column 1: Brand Info */}
            <div className="md:col-span-4 space-y-4">
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

            {/* Column 2: Quick Links */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="font-display text-sm uppercase tracking-widest text-brand-primary">Oficina de Ventas</h4>
              <ul className="space-y-2 text-xs text-neutral-400 font-sans">
                <li className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                  <span>Av. del Libertador 4200, Palermo, CABA, Argentina</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Calendar className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                  <span>Lunes a Viernes 9:00 a 19:30 hs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                  <span>Sábados de 9:00 a 13:00 hs</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Standards */}
            <div className="md:col-span-4 space-y-3">
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
      <InventoryProvider>
        <MainAppContent />
      </InventoryProvider>
    </AuthProvider>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Lock, Eye } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentView, setView } = useNavigation();
  const isAdminView = currentView === 'admin';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-900 bg-brand-dark/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Section */}
        <div 
          onClick={() => setView('home')}
          className="cursor-pointer transition-transform hover:scale-[1.02] py-2"
          id="nav-logo-btn"
        >
          <img src="/logo.png" alt="D'Amico Automotores" className="h-10 sm:h-12 w-auto object-contain" />
        </div>

        {/* Navigation Tabs - Client Mode */}
        {!isAdminView ? (
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setView('home')}
              className={`font-display text-lg tracking-wider uppercase transition-all duration-300 ${
                currentView === 'home'
                  ? 'text-brand-primary'
                  : 'text-neutral-400 hover:text-white'
              }`}
              id="tab-home-btn"
            >
              Inicio
            </button>
            <button
              onClick={() => setView('catalog')}
              className={`font-display text-lg tracking-wider uppercase transition-all duration-300 ${
                currentView === 'catalog'
                  ? 'text-brand-primary'
                  : 'text-neutral-400 hover:text-white'
              }`}
              id="tab-catalog-btn"
            >
              Catálogo
            </button>
            <button
              onClick={() => setView('consignment')}
              className={`font-display text-lg tracking-wider uppercase transition-all duration-300 ${
                currentView === 'consignment'
                  ? 'text-brand-primary'
                  : 'text-neutral-400 hover:text-white'
              }`}
              id="tab-consignment-btn"
            >
              Vender mi Auto
            </button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center space-x-2 rounded-full border border-neutral-800 bg-neutral-900/60 py-1.5 px-4 font-sans">
            <Lock className="h-3.5 w-3.5 text-brand-primary animate-pulse" />
            <span className="font-sans text-xs uppercase tracking-wider text-neutral-300">
              Sesión de Administración Activa
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {isAdminView && (
            <button
              onClick={() => window.open('/', '_blank', 'noopener,noreferrer')}
              className="flex items-center space-x-2 rounded-lg py-2 px-4 font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20 shadow-sm shadow-brand-primary/5 cursor-pointer"
              id="role-toggle-btn"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Vista Cliente</span>
            </button>
          )}

          {!isAdminView && (
            <button
              onClick={() => setView('catalog')}
              className="hidden lg:flex items-center justify-center rounded-lg bg-brand-primary py-2.5 px-5 font-display text-sm tracking-wide uppercase text-white transition-all duration-300 hover:bg-brand-primary/95 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-primary/20 cursor-pointer"
              id="nav-catalog-cta-btn"
            >
              Ver Inventario
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Drawer helper (bottom bar / float bar on small devices) */}
      <div className="md:hidden flex border-t border-neutral-900 bg-brand-dark py-1 justify-around text-center w-full">
        {isAdminView ? (
          <button
            onClick={() => { setView('admin'); }}
            className={`flex flex-col items-center py-2 px-3 text-brand-primary`}
            id="mobile-tab-admin-btn"
          >
            <span className="font-display text-base tracking-wider">Dashboard Control</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => setView('home')}
              className={`flex flex-col items-center py-2 px-3 ${currentView === 'home' ? 'text-brand-primary font-bold' : 'text-neutral-400'}`}
              id="mobile-tab-home-btn"
            >
              <span className="font-display text-base tracking-wider">Inicio</span>
            </button>
            <button
              onClick={() => setView('catalog')}
              className={`flex flex-col items-center py-2 px-3 ${currentView === 'catalog' ? 'text-brand-primary font-bold' : 'text-neutral-400'}`}
              id="mobile-tab-catalog-btn"
            >
              <span className="font-display text-base tracking-wider">Catálogo</span>
            </button>
            <button
              onClick={() => setView('consignment')}
              className={`flex flex-col items-center py-2 px-3 ${currentView === 'consignment' ? 'text-brand-primary font-bold' : 'text-neutral-400'}`}
              id="mobile-tab-consign-btn"
            >
              <span className="font-display text-base tracking-wider">Vender</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

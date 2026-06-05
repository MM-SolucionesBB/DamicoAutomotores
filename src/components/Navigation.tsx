/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { Car, Lock, Eye, ShoppingCart, Coins, ShieldCheck, Settings } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, adminViewMode, setAdminViewMode } = useInventory();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-900 bg-brand-dark/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Section */}
        <div 
          onClick={() => { setActiveTab('home'); setAdminViewMode(false); }}
          className="group flex cursor-pointer items-center space-x-3 transition-colors"
          id="nav-logo-btn"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-primary shadow-md shadow-brand-primary/20 transition-transform group-hover:scale-105">
            <Car className="h-6 w-6 text-white font-bold" />
          </div>
          <div>
            <div className="font-display text-2xl uppercase tracking-wider text-white leading-none">
              D'Amico
            </div>
            <div className="font-sans text-xs uppercase tracking-[0.2em] text-brand-primary font-bold">
              Automotores
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Client Mode */}
        {!adminViewMode ? (
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setActiveTab('home')}
              className={`font-display text-lg tracking-wider uppercase transition-all duration-300 ${
                activeTab === 'home'
                  ? 'text-brand-primary'
                  : 'text-neutral-400 hover:text-white'
              }`}
              id="tab-home-btn"
            >
              Inicio
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`font-display text-lg tracking-wider uppercase transition-all duration-300 ${
                activeTab === 'catalog'
                  ? 'text-brand-primary'
                  : 'text-neutral-400 hover:text-white'
              }`}
              id="tab-catalog-btn"
            >
              Comprar Stock
            </button>
            <button
              onClick={() => setActiveTab('consignment')}
              className={`font-display text-lg tracking-wider uppercase transition-all duration-300 ${
                activeTab === 'consignment'
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

        {/* Role Switcher & Action BTN */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              const nextMode = !adminViewMode;
              setAdminViewMode(nextMode);
              if (nextMode) {
                setActiveTab('admin');
              } else {
                setActiveTab('home');
              }
            }}
            className={`flex items-center space-x-2 rounded-lg py-2 px-4 font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              adminViewMode
                ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20 shadow-sm shadow-brand-primary/5'
                : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:bg-neutral-800'
            }`}
            id="role-toggle-btn"
          >
            {adminViewMode ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>Vista Cliente</span>
              </>
            ) : (
              <>
                <Settings className="h-3.5 w-3.5" />
                <span>Modo Admin</span>
              </>
            )}
          </button>

          {!adminViewMode && (
            <button
              onClick={() => setActiveTab('catalog')}
              className="hidden lg:flex items-center justify-center rounded-lg bg-brand-primary py-2.5 px-5 font-display text-sm tracking-wide uppercase text-white transition-all duration-300 hover:bg-brand-primary/95 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-primary/20"
              id="nav-catalog-cta-btn"
            >
              Ver Inventario
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Drawer helper (bottom bar / float bar on small devices) */}
      <div className="md:hidden flex border-t border-neutral-900 bg-brand-dark py-1 justify-around text-center w-full">
        {!adminViewMode ? (
          <>
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center py-2 px-3 ${activeTab === 'home' ? 'text-brand-primary font-bold' : 'text-neutral-400'}`}
              id="mobile-tab-home-btn"
            >
              <span className="font-display text-base tracking-wider">Inicio</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex flex-col items-center py-2 px-3 ${activeTab === 'catalog' ? 'text-brand-primary font-bold' : 'text-neutral-400'}`}
              id="mobile-tab-catalog-btn"
            >
              <span className="font-display text-base tracking-wider">Catálogo</span>
            </button>
            <button
              onClick={() => setActiveTab('consignment')}
              className={`flex flex-col items-center py-2 px-3 ${activeTab === 'consignment' ? 'text-brand-primary font-bold' : 'text-neutral-400'}`}
              id="mobile-tab-consign-btn"
            >
              <span className="font-display text-base tracking-wider">Vender</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => { setActiveTab('admin'); }}
            className={`flex flex-col items-center py-2 px-3 text-brand-primary`}
            id="mobile-tab-admin-btn"
          >
            <span className="font-display text-base tracking-wider">Dashboard Control</span>
          </button>
        )}
      </div>
    </header>
  );
};

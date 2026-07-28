/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { BODY_TYPES } from '../mockData';
import { Search, Compass, Coins, Star, ChevronRight, ArrowUpRight, Calendar, Gauge, Fuel, Settings } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setActiveTab, setSearchFilter, setBodyTypeFilter, setSelectedVehicleId, vehicles } = useInventory();
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilter(localSearch);
    setBodyTypeFilter('');
    setActiveTab('catalog');
  };

  const selectBodyStyle = (styleId: string) => {
    setBodyTypeFilter(styleId);
    setSearchFilter('');
    setActiveTab('catalog');
  };

  // Get first 3 featured vehicles
  const featured = vehicles.filter(v => v.destacado && v.estado === 'Disponible').slice(0, 3);

  return (
    <div className="flex flex-col bg-brand-dark text-white min-h-[calc(100vh-5rem)]">
      
      {/* Dynamic Background Banner / Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-950 to-brand-dark py-16 lg:py-24 border-b border-neutral-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent opacity-60"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-sans uppercase tracking-[0.2em] mb-4">
            CONCESIONARIO MULTIMARCA EXCLUSIVO
          </span>
          
          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl uppercase tracking-wider text-white mb-6">
            D'AMICO <span className="text-brand-primary">AUTOMOTORES</span>
          </h1>
          
          {/* Quick Search Input Card */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="mx-auto max-w-2xl bg-[#111111]/90 border border-neutral-800 rounded-xl p-2 flex items-center shadow-2xl shadow-black/80"
            id="home-search-form"
          >
            <div className="pl-3.5 text-neutral-500">
              <Search className="h-5 w-5" />
            </div>
            <input 
              type="text" 
              placeholder="Buscá por marca o modelo (ej: Ranger, Amarok, Hilux, Porsche...)"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-transparent font-sans py-3 px-3 text-sm text-white placeholder-neutral-500 focus:outline-none"
              id="home-search-input"
            />
            <button 
              type="submit" 
              className="bg-brand-primary hover:bg-brand-primary/90 text-white font-display text-lg tracking-wider uppercase py-3 px-6 rounded-lg transition-transform hover:scale-105 cursor-pointer"
              id="home-search-submit-btn"
            >
              Buscar
            </button>
          </form>

          {/* Slashed Quick Filters Buttons */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-3">
            {BODY_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => selectBodyStyle(type.id)}
                className="font-display text-base tracking-wide uppercase border border-neutral-800 hover:border-brand-primary/50 hover:bg-brand-primary/5 text-neutral-300 hover:text-white rounded-lg py-2 px-4 transition-all duration-300"
                id={`body-type-btn-${type.id}`}
              >
                {type.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Featured Stock Highlights */}
      <section className="mx-auto max-w-7xl w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-sans text-xs text-brand-primary uppercase tracking-widest font-bold">SELECCIONADO EXCLUSIVO</span>
            <h3 className="font-display text-3xl uppercase tracking-wider text-white mt-1">
              Destacados de la Semana
            </h3>
          </div>
          <button 
            onClick={() => { setSearchFilter(''); setBodyTypeFilter(''); setActiveTab('catalog'); }}
            className="flex items-center space-x-1 font-display text-sm uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
            id="see-all-featured-btn"
          >
            <span>Ver Todo el Stock</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map(v => (
            <div
              key={v.id}
              onClick={() => { setSelectedVehicleId(v.id); setActiveTab('vehicle-detail'); }}
              className="cursor-pointer group flex flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-brand-card/40 hover:border-neutral-700/80 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/40 transition-all duration-300"
              id={`featured-card-${v.id}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-brand-dark">
                <img 
                  src={v.imagen} 
                  alt={`${v.marca} ${v.modelo}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.03]"
                />
                {v.imagenesSecundarias?.[0] && (
                  <img 
                    src={v.imagenesSecundarias[0]} 
                    alt={`${v.marca} ${v.modelo} vista secundaria`}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                )}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-brand-primary text-white font-display text-sm font-bold tracking-wider uppercase py-1.5 px-3.5 rounded z-10 shadow-lg">
                  <Star className="h-4 w-4 fill-current" />
                  Destacado
                </div>
                <div className="absolute bottom-0 inset-x-0 h-[40%] bg-[linear-gradient(to_top,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.15)_25%,transparent_50%)]"></div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h4 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
                    {v.marca} {v.modelo}
                  </h4>
                  <p className="font-sans text-xs text-neutral-400 font-medium tracking-wide mt-1 uppercase">
                    {v.version}
                  </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-neutral-800/60">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-brand-primary/70 shrink-0" />
                      <span className="font-sans text-xs text-neutral-300 uppercase tracking-wider">{v.anio}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-brand-primary/70 shrink-0" />
                      <span className="font-sans text-xs text-neutral-300 uppercase tracking-wider">
                        {v.kilometraje === 0 ? '0 KM' : `${v.kilometraje.toLocaleString('de-DE')} KM`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-brand-primary/70 shrink-0" />
                      <span className="font-sans text-xs text-neutral-300 uppercase tracking-wider">{v.combustible}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-brand-primary/70 shrink-0" />
                      <span className="font-sans text-xs text-neutral-300 uppercase tracking-wider">{v.transmision}</span>
                    </div>
                  </div>
                  <div className="border-t border-neutral-800/60 pt-3">
                    <div className="font-display text-[1.7rem] text-white">
                      USD {v.precio.toLocaleString('de-DE')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pathways Split Cards (Quiero Comprar vs Quiero Vender) */}
      <section className="mx-auto max-w-7xl w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Path A: Quiero Comprar */}
          <div 
            onClick={() => window.open('https://wa.me/5492915367498?text=Hola%20Federico%2C%20me%20interesa%20comprar%20un%20veh%C3%ADculo%20en%20D%27Amico%20Automotores.', '_blank')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-800 bg-brand-card/40 p-6 hover:bg-brand-card/70 transition-all duration-500 flex flex-col justify-between min-h-[250px] shadow-lg hover:shadow-2xl shadow-black hover:border-brand-primary/20"
            id="pathway-buy-card"
          >
            <div className="absolute top-0 right-0 h-40 w-40 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent opacity-80"></div>
            
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                <Compass className="h-6 w-6" />
              </div>
              <h2 className="font-display text-3xl uppercase tracking-wider text-white mb-3">
                Quiero Comprar
              </h2>
              <p className="font-sans text-sm text-neutral-400 font-medium leading-relaxed max-w-md">
                Explorá nuestro stock de vehículos seleccionados y encontrá la unidad ideal con el respaldo y la transparencia que caracterizan a D'Amico Automotores.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-8 border-t border-neutral-800/60 pt-4">
              <span className="font-display text-sm uppercase tracking-widest text-[#F5A396] font-bold">
                Contactanos →
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 group-hover:bg-brand-primary text-neutral-400 group-hover:text-white transition-all duration-300">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Path B: Quiero Vender */}
          <div 
            onClick={() => setActiveTab('consignment')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-800 bg-brand-card/40 p-6 hover:bg-brand-card/70 transition-all duration-500 flex flex-col justify-between min-h-[250px] shadow-lg hover:shadow-2xl shadow-black hover:border-brand-primary/20"
            id="pathway-sell-card"
          >
            <div className="absolute top-0 right-0 h-40 w-40 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent opacity-80"></div>
            
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                <Coins className="h-6 w-6" />
              </div>
              <h2 className="font-display text-3xl uppercase tracking-wider text-white mb-3">
                Quiero Vender / Consignar
              </h2>
              <p className="font-sans text-sm text-neutral-400 font-medium leading-relaxed max-w-md">
                Publicamos tu vehículo, gestionamos las consultas, coordinamos las visitas y te acompañamos hasta concretar una operación segura.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-8 border-t border-neutral-800/60 pt-4">
              <span className="font-display text-sm uppercase tracking-widest text-[#F5A396] font-bold">
                Cotizar mi Vehículo →
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 group-hover:bg-brand-primary text-neutral-400 group-hover:text-white transition-all duration-300">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Guarantee banner */}
    </div>
  );
};

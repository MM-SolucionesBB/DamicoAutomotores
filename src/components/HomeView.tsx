/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { BODY_TYPES } from '../mockData';
import { Search, Compass, Coins, Star, Shield, HelpCircle, ChevronRight, ArrowUpRight } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setActiveTab, setSearchFilter, setBodyTypeFilter, vehicles } = useInventory();
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
          
          <p className="mx-auto max-w-2xl font-sans text-sm sm:text-base text-neutral-400 font-medium tracking-wide mb-10 leading-relaxed uppercase">
            Especialistas en Pick-ups, SUVs y unidades de alta gama seleccionadas bajo rigurosos estándares de calidad. Comprá, vendé o consigná tu vehículo con gestoría 100% transparente.
          </p>

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
            <span className="font-sans text-xs uppercase tracking-widest text-neutral-500 mr-2">Categorías Rápidas:</span>
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

      {/* Pathways Split Cards (Quiero Comprar vs Quiero Vender) */}
      <section className="mx-auto max-w-7xl w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Path A: Quiero Comprar */}
          <div 
            onClick={() => { setSearchFilter(''); setBodyTypeFilter(''); setActiveTab('catalog'); }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-800 bg-brand-card/40 p-8 hover:bg-brand-card/70 transition-all duration-500 flex flex-col justify-between min-h-[350px] shadow-lg hover:shadow-2xl shadow-black hover:border-brand-primary/20"
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
                Explorá nuestra flota exclusiva de vehículos minuciosamente revisados. Con documentación impecable de gestoría propia y listos para transferir de manera segura.
              </p>
              
              <ul className="mt-6 space-y-2 text-xs text-neutral-400 font-sans uppercase">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-brand-primary rounded-full"></span> Certificación D'Amico Premium
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-brand-primary rounded-full"></span> Recibimos unidades en parte de pago
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-brand-primary rounded-full"></span> Financiación prendaria exclusiva
                </li>
              </ul>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-8 border-t border-neutral-800/60 pt-4">
              <span className="font-display text-sm uppercase tracking-widest text-[#F5A396] font-bold">
                Ver Catálogo de Stock
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 group-hover:bg-brand-primary text-neutral-400 group-hover:text-white transition-all duration-300">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Path B: Quiero Vender */}
          <div 
            onClick={() => setActiveTab('consignment')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-800 bg-brand-card/40 p-8 hover:bg-brand-card/70 transition-all duration-500 flex flex-col justify-between min-h-[350px] shadow-lg hover:shadow-2xl shadow-black hover:border-brand-primary/20"
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
                Vendé rápido de forma digital al valor real del mercado. Nosotros realizamos la producción visual HD, la publicación en portales, filtramos clientes y cerramos el cobro seguro.
              </p>

              <ul className="mt-6 space-y-2 text-xs text-neutral-400 font-sans uppercase">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-brand-primary rounded-full"></span> Producción Audiovisual de Alta Gama
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-brand-primary rounded-full"></span> Publicación en portales líderes y redes
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-brand-primary rounded-full"></span> Filtro de ofertas y cobro inmediato
                </li>
              </ul>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-8 border-t border-neutral-800/60 pt-4">
              <span className="font-display text-sm uppercase tracking-widest text-[#F5A396] font-bold">
                Cotizar mi Vehículo
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 group-hover:bg-brand-primary text-neutral-400 group-hover:text-white transition-all duration-300">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Guarantee banner */}
      <section className="bg-brand-card border-y border-neutral-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary shrink-0">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-base tracking-wider text-white mb-1 uppercase">Calidad Certificada</h4>
                <p className="font-sans text-xs text-neutral-400 leading-relaxed">Cada vehículo disponible es inspeccionado en más de 120 puntos críticos antes de salir al stock oficial.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-base tracking-wider text-white mb-1 uppercase">Operaciones Seguras</h4>
                <p className="font-sans text-xs text-neutral-400 leading-relaxed">Aseguramos la trazabilidad absoluta de la transferencia monetaria y el estado registral legal.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary shrink-0">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-base tracking-wider text-white mb-1 uppercase">Atención Inmediata</h4>
                <p className="font-sans text-xs text-neutral-400 leading-relaxed">Respuestas instantáneas y personalizadas vía Whatsapp o visitas presenciales bajo cita privada.</p>
              </div>
            </div>
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
              onClick={() => { setSearchFilter(''); setBodyTypeFilter(''); setActiveTab('catalog'); }}
              className="cursor-pointer group flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-brand-card/30 hover:border-neutral-700 transition-all duration-300"
              id={`featured-card-${v.id}`}
            >
              <div className="relative aspect-video overflow-hidden bg-brand-dark">
                <img 
                  src={v.imagen} 
                  alt={`${v.marca} ${v.modelo}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-brand-primary text-white font-display text-xs tracking-wider uppercase py-1 px-2.5 rounded-md shadow-md z-10">
                  Destacado
                </div>
                <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-brand-dark to-transparent"></div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="font-display text-sm font-bold text-brand-primary uppercase tracking-wider mb-1">
                    {v.marca}
                  </div>
                  <h4 className="font-display text-xl text-white uppercase tracking-tight">
                    {v.modelo}
                  </h4>
                  <p className="font-sans text-xs text-neutral-400 font-medium tracking-wide mt-1 uppercase">
                    {v.version}
                  </p>
                </div>
                
                <div className="flex items-center justify-between border-t border-neutral-800/60 mt-6 pt-4">
                  <div className="font-display text-2xl text-white">
                    USD {v.precio.toLocaleString('de-DE')}
                  </div>
                  <div className="font-sans text-xs uppercase tracking-wider text-neutral-500">
                    {v.kilometraje === 0 ? 'A Estrenar' : `${v.kilometraje.toLocaleString('de-DE')} KM`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

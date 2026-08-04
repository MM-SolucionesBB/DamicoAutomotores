/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Search, Filter, Info, Star } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const {
    vehicles,
    searchFilter,
    setSearchFilter,
    bodyTypeFilter,
    setBodyTypeFilter,
    setActiveTab,
    setSelectedVehicleId,
    brands,
    bodyTypes
  } = useInventory();

  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [minAnio, setMinAnio] = useState<number>(2012);
  const [maxAnio, setMaxAnio] = useState<number>(2026);
  const [selectedTrans, setSelectedTrans] = useState('Todas');
  const [selectedFuel, setSelectedFuel] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);

  const brandsWithCount = useMemo(() => {
    const counts: { [key: string]: number } = {};
    vehicles.forEach(v => {
      counts[v.marca] = (counts[v.marca] || 0) + 1;
    });
    return counts;
  }, [vehicles]);

  const clearFilters = () => {
    setSelectedBrand('Todas');
    setMinPrice(0);
    setMaxPrice(150000);
    setMinAnio(2012);
    setMaxAnio(2026);
    setSelectedTrans('Todas');
    setSelectedFuel('Todos');
    setSearchFilter('');
    setBodyTypeFilter('');
  };

  const hasActiveFilters = selectedBrand !== 'Todas' || minPrice > 0 || maxPrice < 150000 || minAnio > 2015 || selectedTrans !== 'Todas' || selectedFuel !== 'Todos' || searchFilter !== '' || bodyTypeFilter !== '';

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const query = searchFilter.toLowerCase().trim();
      const matchText = query === '' ||
        v.marca.toLowerCase().includes(query) ||
        v.modelo.toLowerCase().includes(query) ||
        v.version.toLowerCase().includes(query) ||
        v.anio.toString().includes(query);

      const matchBrand = selectedBrand === 'Todas' || v.marca === selectedBrand;
      const matchPrice = v.precio >= minPrice && v.precio <= maxPrice;
      const matchAnio = v.anio >= minAnio && v.anio <= maxAnio;
      const matchTrans = selectedTrans === 'Todas' || v.transmision === selectedTrans;
      const matchFuel = selectedFuel === 'Todos' || v.combustible === selectedFuel;

      let matchBody = true;
      if (bodyTypeFilter) {
        const normalize = (str: string) => {
          return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
        };
        const filterType = normalize(bodyTypeFilter);
        const vehicleBody = v.carroceria ? normalize(v.carroceria) : '';
        if (filterType === 'pickup' || filterType === 'pickups') {
          matchBody = vehicleBody === 'pickup';
        } else if (filterType === 'suv' || filterType === 'suvs') {
          matchBody = vehicleBody === 'suv';
        } else if (filterType === 'sedan' || filterType === 'sedans') {
          matchBody = vehicleBody === 'sedan';
        } else if (filterType === 'hatchback' || filterType === 'hatchbacks') {
          matchBody = vehicleBody === 'hatchback';
        } else if (filterType === 'premium' || filterType === 'deportivos' || filterType === 'deportivo' || filterType === 'deportivas') {
          matchBody = vehicleBody === 'deportivos' || vehicleBody === 'premium' || vehicleBody === 'deportivo' || vehicleBody === 'deportivas';
        } else {
          matchBody = vehicleBody === filterType;
        }
      }

      return matchText && matchBrand && matchPrice && matchAnio && matchTrans && matchFuel && matchBody;
    });
  }, [vehicles, searchFilter, selectedBrand, minPrice, maxPrice, minAnio, maxAnio, selectedTrans, selectedFuel, bodyTypeFilter]);

  const openVehicleDetail = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setActiveTab('vehicle-detail');
  };

  return (
    <div className="bg-brand-dark text-white min-h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="border-b border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-sans text-xs text-brand-primary uppercase tracking-widest font-bold">FLOTA EXCLUSIVA</span>
              <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-white mt-1">
                Marketplace de Vehículos
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs text-neutral-400 bg-brand-card border border-neutral-800 py-2 px-4 rounded-xl">
                <strong className="text-white">{filteredVehicles.length}</strong> unidades
              </span>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 font-display text-sm uppercase tracking-wider py-2 px-4 rounded-xl border transition-all cursor-pointer ${
                  showFilters || hasActiveFilters
                    ? 'bg-brand-primary/10 border-brand-primary/40 text-brand-primary'
                    : 'bg-brand-card border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filters Bar */}
      <div className="border-b border-neutral-900 bg-brand-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          {/* Search input */}
          <div className="relative bg-[#111111] border border-neutral-800 rounded-xl flex items-center p-1 mb-4">
            <div className="pl-3 text-neutral-500">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Buscá por marca, modelo o versión..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-transparent w-full py-3 px-3 text-sm text-white placeholder-neutral-500 focus:outline-none font-sans"
              id="catalog-search-input"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="pr-3 text-neutral-500 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter dropdowns row */}
          {showFilters && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Brand */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-[#111111] border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-sans focus:outline-none focus:border-brand-primary/50 uppercase tracking-wider"
              >
                <option value="Todas">Todas las marcas</option>
                {brands.map(b => (
                  <option key={b} value={b}>{b} ({brandsWithCount[b] || 0})</option>
                ))}
              </select>

              {/* Body type */}
              <select
                value={bodyTypeFilter}
                onChange={(e) => setBodyTypeFilter(e.target.value)}
                className="bg-[#111111] border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-sans focus:outline-none focus:border-brand-primary/50 uppercase tracking-wider"
              >
                <option value="">Todas las carrocerías</option>
                {bodyTypes.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              {/* Transmission */}
              <select
                value={selectedTrans}
                onChange={(e) => setSelectedTrans(e.target.value)}
                className="bg-[#111111] border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-sans focus:outline-none focus:border-brand-primary/50 uppercase tracking-wider"
              >
                <option value="Todas">Transmisión: Todas</option>
                <option value="Manual">Manual</option>
                <option value="Automática">Automática</option>
              </select>

              {/* Fuel */}
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="bg-[#111111] border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-sans focus:outline-none focus:border-brand-primary/50 uppercase tracking-wider"
              >
                <option value="Todos">Combustible: Todos</option>
                <option value="Nafta">Nafta</option>
                <option value="Diesel">Diesel</option>
                <option value="Nafta/GNC">Nafta/GNC</option>
                <option value="Diesel/GNC">Diesel/GNC</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>

              {/* Price quick filters */}
              <div className="flex gap-1.5">
                {[
                  { label: 'Todos', min: 0, max: 150000 },
                  { label: '<25k', min: 0, max: 25000 },
                  { label: '25-50k', min: 25000, max: 50000 },
                  { label: '50k+', min: 50000, max: 150000 },
                ].map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => { setMinPrice(opt.min); setMaxPrice(opt.max); }}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-sans uppercase font-bold border transition-all cursor-pointer ${
                      minPrice === opt.min && maxPrice === opt.max
                        ? 'border-brand-primary/45 bg-brand-primary/10 text-brand-primary'
                        : 'border-neutral-800 text-neutral-500 hover:text-white bg-[#111111]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Clear */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="bg-brand-primary/10 border border-brand-primary/30 text-brand-primary font-display text-xs uppercase tracking-wider py-2.5 rounded-xl hover:bg-brand-primary/20 transition-all cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {filteredVehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-brand-card/20 border border-neutral-900 rounded-2xl text-center">
            <Info className="h-12 w-12 text-neutral-700 mb-4" />
            <h3 className="font-display text-2xl uppercase text-white mb-2">No se encontraron resultados</h3>
            <p className="font-sans text-xs text-neutral-400 max-w-md leading-relaxed mb-6">
              Prueba cambiando los parámetros de filtrado o buscando palabras clave más simples.
            </p>
            <button
              onClick={clearFilters}
              className="bg-brand-primary hover:bg-brand-primary/95 text-white font-display text-base tracking-wider uppercase py-2.5 px-6 rounded-lg transition-transform hover:scale-105 cursor-pointer"
            >
              Restaurar Búsqueda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredVehicles.map(v => (
              <article
                key={v.id}
                onClick={() => openVehicleDetail(v.id)}
                className="cursor-pointer group flex flex-col bg-brand-card border border-neutral-800/80 hover:border-neutral-700/80 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 rounded-2xl overflow-hidden transition-all duration-300"
                id={`stock-unit-${v.id}`}
              >
                {/* Image */}
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

                  {/* Status badge */}
                  <span className={`absolute top-3 left-3 font-sans text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full z-10 shadow-md ${
                    v.estado === 'Disponible'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : v.estado === 'Reservado'
                      ? 'bg-brand-primary/15 text-brand-accent border border-brand-primary/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {v.estado}
                  </span>

                  {v.destacado && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 bg-brand-primary text-white font-display text-[10px] font-bold tracking-wider uppercase py-1 px-2.5 rounded z-10 shadow-lg">
                      <Star className="h-3 w-3 fill-current" />
                      Destacado
                    </span>
                  )}

                  <div className="absolute bottom-0 inset-x-0 h-[40%] bg-[linear-gradient(to_top,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.15)_25%,transparent_50%)]"></div>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h2 className="font-display text-lg font-bold text-white uppercase tracking-wide group-hover:text-brand-primary transition-colors duration-300 leading-tight">
                      {v.marca} {v.modelo}
                    </h2>
                    <p className="font-sans text-[11px] text-neutral-400 tracking-wide font-medium mt-0.5 uppercase truncate">
                      {v.version}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-800/60">
                    <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-sans mb-2.5">
                      <span>{v.anio}</span>
                      <span className="text-neutral-700">•</span>
                      <span>{v.kilometraje === 0 ? '0 KM' : `${v.kilometraje.toLocaleString('de-DE')} KM`}</span>
                      <span className="text-neutral-700">•</span>
                      <span>{v.transmision}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-display text-xl text-white font-bold">
                        USD {v.precio.toLocaleString('de-DE')}
                      </div>
                      <span className="font-display text-[10px] uppercase tracking-wider text-brand-primary group-hover:translate-x-1 duration-300 transition-transform">
                        Ver →
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

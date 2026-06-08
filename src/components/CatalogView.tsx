/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Vehicle } from '../types';
import { Search, Filter, Calendar, Gauge, Info, X, Send, Landmark, ShieldCheck, Share2, ArrowLeft, FileText, Printer } from 'lucide-react';
import { AVAILABLE_BRANDS } from '../mockData';

export const CatalogView: React.FC = () => {
  const { 
    vehicles, 
    searchFilter, 
    setSearchFilter, 
    bodyTypeFilter, 
    setBodyTypeFilter, 
    selectedVehicleId, 
    setSelectedVehicleId 
  } = useInventory();

  // Expanded Local Filtration States
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [minAnio, setMinAnio] = useState<number>(2012);
  const [maxAnio, setMaxAnio] = useState<number>(2026);
  const [selectedTrans, setSelectedTrans] = useState('Todas');
  const [selectedFuel, setSelectedFuel] = useState('Todos');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Modal active auxiliary photo tracker
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Financial Simulator states
  const [downPayment, setDownPayment] = useState<number>(15000);
  const [interestPeriod, setInterestPeriod] = useState<number>(24);
  const [userInteractedWithSimulator, setUserInteractedWithSimulator] = useState<boolean>(false);

  // Synchronize dynamic pre-fills from external sources
  useEffect(() => {
    setActiveMediaIndex(0);
    setUserInteractedWithSimulator(false);
  }, [selectedVehicleId]);

  // Compute boundaries dynamically based on total vehicles
  const brandsWithCount = useMemo(() => {
    const counts: { [key: string]: number } = {};
    vehicles.forEach(v => {
      counts[v.marca] = (counts[v.marca] || 0) + 1;
    });
    return counts;
  }, [vehicles]);

  // Clear filters helper
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

  // Perform client-side filter computation
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      // 1. Text Search matches Marca or Modelo or Version
      const query = searchFilter.toLowerCase().trim();
      const matchText = query === '' || 
        v.marca.toLowerCase().includes(query) ||
        v.modelo.toLowerCase().includes(query) ||
        v.version.toLowerCase().includes(query) ||
        v.anio.toString().includes(query);

      // 2. Brand selector
      const matchBrand = selectedBrand === 'Todas' || v.marca === selectedBrand;

      // 3. Price Slider bound
      const matchPrice = v.precio >= minPrice && v.precio <= maxPrice;

      // 4. Year selector
      const matchAnio = v.anio >= minAnio && v.anio <= maxAnio;

      // 5. Transmisión selector
      const matchTrans = selectedTrans === 'Todas' || v.transmision === selectedTrans;

      // 6. Fuel selector
      const matchFuel = selectedFuel === 'Todos' || v.combustible === selectedFuel;

      // 7. Body Style selector (matched against the new carroceria field)
      let matchBody = true;
      if (bodyTypeFilter) {
        const normalize = (str: string) => {
          return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "")
            .trim();
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

  // Selected Unit context
  const targetUnit = useMemo(() => {
    return vehicles.find(v => v.id === selectedVehicleId) || null;
  }, [vehicles, selectedVehicleId]);

  // Financial calculations
  const financingReport = useMemo(() => {
    if (!targetUnit) return null;
    const balance = targetUnit.precio - downPayment;
    const rate = 0.085; // Annual rate
    const monthlyRate = rate / 12;
    const installmentsCount = interestPeriod;
    
    if (balance <= 0) {
      return { balance: 0, monthlyQuota: 0 };
    }

    // Standard amortization formula: PMT = r * PV / (1 - (1 + r)^-n)
    const monthlyQuota = (monthlyRate * balance) / (1 - Math.pow(1 + monthlyRate, -installmentsCount));
    return {
      balance,
      monthlyQuota: Math.round(monthlyQuota)
    };
  }, [targetUnit, downPayment, interestPeriod]);

  // Handle WhatsApp trigger helper
  const openWhatsappChat = (
    vehicle: Vehicle,
    simulation?: { downPayment: number; period: number; quota: number } | null
  ) => {
    const phone = '5491133036614'; // Configured dealership standard hotline
    let text = `Hola D'Amico Automotores! Vi en el catálogo la unidad [${vehicle.marca} ${vehicle.modelo} ${vehicle.version}, Año ${vehicle.anio}, USD ${vehicle.precio.toLocaleString('de-DE')}].`;
    if (simulation) {
      text += ` Estuve usando el simulador prendario y me interesaría dar un anticipo de USD ${simulation.downPayment.toLocaleString('de-DE')} y financiar el saldo en ${simulation.period} cuotas de USD ${simulation.quota.toLocaleString('de-DE')}.`;
    }
    text += ` Me gustaría recibir más información y coordinar un test drive. Gracias!`;
    const webUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
    window.open(webUrl, '_blank');
  };

  const generateSpecPDF = (vehicle: Vehicle) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const logoUrl = window.location.origin + '/logo.png';

    const secondaryPhotosHTML = vehicle.imagenesSecundarias && vehicle.imagenesSecundarias.length > 0
      ? vehicle.imagenesSecundarias.slice(0, 3).map(img => `<img src="${img}" style="width: 31%; height: 120px; object-fit: cover; border-radius: 8px;" />`).join('')
      : '';

    printWindow.document.write(`
      <html>
        <head>
          <title>Ficha Técnica - ${vehicle.marca} ${vehicle.modelo}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; margin: 40px; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #CC1818; padding-bottom: 20px; }
            .title-section { margin-top: 30px; }
            .title { font-size: 32px; font-weight: bold; text-transform: uppercase; margin: 0; }
            .version { font-size: 16px; color: #666; margin: 5px 0 0 0; text-transform: uppercase; }
            .price-badge { background-color: #f8f8f8; border: 1px solid #ddd; border-radius: 12px; padding: 15px 25px; margin-top: 20px; display: inline-block; }
            .price-label { font-size: 10px; color: #666; font-weight: bold; display: block; text-transform: uppercase; }
            .price-value { font-size: 28px; font-weight: bold; color: #CC1818; }
            .main-img { width: 100%; height: 350px; object-fit: cover; border-radius: 12px; margin-top: 25px; }
            .specs-grid { display: flex; flex-wrap: wrap; justify-content: space-between; margin-top: 30px; }
            .spec-box { width: 48%; background: #fdfdfd; border: 1px solid #eee; border-radius: 8px; padding: 12px; margin-bottom: 15px; box-sizing: border-box; }
            .spec-label { font-size: 10px; color: #888; text-transform: uppercase; font-weight: bold; display: block; }
            .spec-val { font-size: 14px; font-weight: bold; color: #111; margin-top: 4px; }
            .secondary-gallery { display: flex; justify-content: space-between; margin-top: 20px; }
            .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 11px; color: #888; }
            @media print {
              body { margin: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoUrl}" style="height: 55px; width: auto; object-fit: contain;" />
            <div style="text-align: right; font-size: 12px; color: #666; line-height: 1.4;">
              Av. del Libertador 4200, Palermo, CABA<br>
              Tel: 11 3303-6614
            </div>
          </div>
          
          <div class="title-section">
            <h1 class="title">${vehicle.marca} ${vehicle.modelo}</h1>
            <p class="version">${vehicle.version} • Año ${vehicle.anio}</p>
          </div>

          <div class="price-badge">
            <span class="price-label">PRECIO DE VENTA</span>
            <span class="price-value">USD ${vehicle.precio.toLocaleString('de-DE')}</span>
          </div>

          <img src="${vehicle.imagen}" class="main-img" />

          <div class="specs-grid">
            <div class="spec-box">
              <span class="spec-label">Kilometraje</span>
              <span class="spec-val">${vehicle.kilometraje === 0 ? '0 KM (A Estrenar)' : vehicle.kilometraje.toLocaleString('de-DE') + ' KM'}</span>
            </div>
            <div class="spec-box">
              <span class="spec-label">Motorización</span>
              <span class="spec-val">${vehicle.motor}</span>
            </div>
            <div class="spec-box">
              <span class="spec-label">Transmisión</span>
              <span class="spec-val">${vehicle.transmision}</span>
            </div>
            <div class="spec-box">
              <span class="spec-label">Tracción</span>
              <span class="spec-val">${vehicle.traccion}</span>
            </div>
            <div class="spec-box" style="width: 100%;">
              <span class="spec-label">Combustible</span>
              <span class="spec-val">${vehicle.combustible}</span>
            </div>
          </div>

          <div class="secondary-gallery">
            ${secondaryPhotosHTML}
          </div>

          <div class="footer">
            Ficha técnica generada para D'Amico Automotores. Sujeto a peritaje técnico-mecánico y disponibilidad de stock. © ${new Date().getFullYear()} D'Amico Automotores.
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-brand-dark text-white min-h-[calc(100vh-5rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl w-full">
        
        {/* Breadcrumb / Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-neutral-900 gap-4">
          <div>
            <span className="font-sans text-xs text-brand-primary uppercase tracking-widest font-bold">FLOTA EXCLUSIVA DISPONIBLE</span>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white mt-1">
              Catálogo de Vehículos
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs text-neutral-400 bg-brand-card border border-neutral-800 py-2 px-4 rounded-xl">
              Mostrando <strong className="text-white">{filteredVehicles.length}</strong> de <strong className="text-brand-primary">{vehicles.length}</strong> unidades
            </span>
            {(selectedBrand !== 'Todas' || minPrice > 0 || maxPrice < 150000 || minAnio > 2015 || selectedTrans !== 'Todas' || selectedFuel !== 'Todos' || searchFilter !== '' || bodyTypeFilter !== '') && (
              <button 
                onClick={clearFilters}
                className="font-display text-sm uppercase tracking-wider text-white bg-brand-primary hover:bg-brand-primary/95 border border-brand-primary/20 py-2 px-4 rounded-xl transition-all cursor-pointer"
                id="clear-all-filters-btn"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Catalog Scaffold Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden w-full">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-between bg-brand-card/85 p-4 rounded-xl border border-neutral-800/80 hover:border-brand-primary text-white font-display text-sm uppercase tracking-wider transition-all cursor-pointer"
              id="mobile-filter-toggle-btn"
            >
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-brand-primary" />
                {showMobileFilters ? 'Ocultar Filtros de Búsqueda' : 'Mostrar Filtros de Búsqueda'}
              </span>
              <span className="text-xs bg-[#161616] py-1 px-2.5 rounded-lg border border-neutral-800 text-[#F5A396] font-sans font-bold">
                {filteredVehicles.length} un.
              </span>
            </button>
          </div>

          {/* Sidebar Filter Container */}
          <aside className={`lg:col-span-1 bg-brand-card/70 p-6 rounded-2xl border border-neutral-800/80 static lg:sticky lg:top-24 h-auto lg:h-fit max-h-none lg:max-h-[85vh] overflow-visible lg:overflow-y-auto ${
            showMobileFilters ? 'block' : 'hidden lg:block'
          }`}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800/60">
              <span className="font-display text-lg uppercase tracking-wider flex items-center gap-2 text-white">
                <Filter className="h-4 w-4 text-brand-primary" />
                Filtrar Stock
              </span>
              <span className="font-sans text-[10px] text-brand-primary uppercase tracking-widest font-bold">Ajuste Fino</span>
            </div>

            {/* Keyword search input */}
            <div className="mb-5">
              <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block mb-2 font-bold">Palabra Clave</label>
              <div className="relative bg-[#161616] border border-neutral-800 rounded-xl flex items-center p-1">
                <input 
                  type="text" 
                  placeholder="Modelo, versión..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="bg-transparent w-full text-xs py-2 px-3 focus:outline-none placeholder-neutral-600 font-sans text-white"
                  id="sidebar-search-input"
                />
                <Search className="h-4 w-4 text-neutral-500 mr-2" />
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-5">
              <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block mb-2 font-bold">Marca</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-2.5 text-xs text-white uppercase tracking-wider font-sans focus:outline-none focus:border-brand-primary/50"
                id="brand-select-filter"
              >
                <option value="Todas">Todas las marcas</option>
                {AVAILABLE_BRANDS.map(b => (
                  <option key={b} value={b}>
                    {b} ({brandsWithCount[b] || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Carrocería Filter */}
            <div className="mb-5">
              <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block mb-2 font-bold">Carrocería</label>
              <select
                value={bodyTypeFilter}
                onChange={(e) => setBodyTypeFilter(e.target.value)}
                className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-2.5 text-xs text-white uppercase tracking-wider font-sans focus:outline-none focus:border-brand-primary/50"
                id="body-type-select-filter"
              >
                <option value="">Todas las carrocerías</option>
                <option value="SUV">SUV</option>
                <option value="Pick-up">Pick-up</option>
                <option value="Sedan">Sedán</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Premium">Deportivos</option>
              </select>
            </div>

            {/* Price Filter (Botonera rápida + Dropdowns Min/Max) */}
            <div className="mb-5 border-t border-neutral-900/40 pt-4">
              <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block mb-2 font-bold">Precio (USD)</label>
              
              {/* Quick Filters */}
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                <button
                  type="button"
                  onClick={() => { setMinPrice(0); setMaxPrice(150000); }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-sans uppercase font-bold border transition-all cursor-pointer ${
                    minPrice === 0 && maxPrice === 150000
                      ? 'border-brand-primary/45 bg-brand-primary/10 text-brand-primary'
                      : 'border-neutral-800 text-neutral-500 hover:text-white bg-[#161616]'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => { setMinPrice(0); setMaxPrice(25000); }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-sans uppercase font-bold border transition-all cursor-pointer ${
                    minPrice === 0 && maxPrice === 25000
                      ? 'border-brand-primary/45 bg-brand-primary/10 text-brand-primary'
                      : 'border-neutral-800 text-neutral-500 hover:text-white bg-[#161616]'
                  }`}
                >
                  Hasta 25k
                </button>
                <button
                  type="button"
                  onClick={() => { setMinPrice(25000); setMaxPrice(50000); }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-sans uppercase font-bold border transition-all cursor-pointer ${
                    minPrice === 25000 && maxPrice === 50000
                      ? 'border-brand-primary/45 bg-brand-primary/10 text-brand-primary'
                      : 'border-neutral-800 text-neutral-500 hover:text-white bg-[#161616]'
                  }`}
                >
                  25k - 50k
                </button>
                <button
                  type="button"
                  onClick={() => { setMinPrice(50000); setMaxPrice(150000); }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-sans uppercase font-bold border transition-all cursor-pointer ${
                    minPrice === 50000 && maxPrice === 150000
                      ? 'border-brand-primary/45 bg-brand-primary/10 text-brand-primary'
                      : 'border-neutral-800 text-neutral-500 hover:text-white bg-[#161616]'
                  }`}
                >
                  Más de 50k
                </button>
              </div>

              {/* Min Max Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-sans text-[9px] text-neutral-500 uppercase block mb-1 font-bold">Mínimo (USD)</span>
                  <input
                    type="number"
                    value={minPrice === 0 ? '' : minPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMinPrice(val === '' ? 0 : Number(val));
                    }}
                    placeholder="USD 0"
                    className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-2 text-xs text-white font-sans focus:outline-none focus:border-brand-primary/50"
                  />
                </div>
                <div>
                  <span className="font-sans text-[9px] text-neutral-500 uppercase block mb-1 font-bold">Máximo (USD)</span>
                  <input
                    type="number"
                    value={maxPrice === 150000 ? '' : maxPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMaxPrice(val === '' ? 150000 : Number(val));
                    }}
                    placeholder="USD 150.000"
                    className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-2 text-xs text-white font-sans focus:outline-none focus:border-brand-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Year Filter (Double Select) */}
            <div className="mb-5 border-t border-neutral-900/40 pt-4">
              <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block mb-2 font-bold">Año (Rango)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-sans text-[9px] text-neutral-500 uppercase block mb-1 font-bold">Desde</span>
                  <select
                    value={minAnio}
                    onChange={(e) => setMinAnio(Number(e.target.value))}
                    className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-2 text-xs text-white font-sans focus:outline-none focus:border-brand-primary/50"
                  >
                    {[2012, 2015, 2018, 2020, 2022, 2024, 2026].map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="font-sans text-[9px] text-neutral-500 uppercase block mb-1 font-bold">Hasta</span>
                  <select
                    value={maxAnio}
                    onChange={(e) => setMaxAnio(Number(e.target.value))}
                    className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-2 text-xs text-white font-sans focus:outline-none focus:border-brand-primary/50"
                  >
                    {[2012, 2015, 2018, 2020, 2022, 2024, 2026].map(yr => (
                      <option key={yr} value={yr} disabled={yr < minAnio}>{yr}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Transmision selector */}
            <div className="mb-5">
              <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-bold">Transmisión</label>
              <div className="grid grid-cols-3 gap-2">
                {['Todas', 'Manual', 'Automática'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSelectedTrans(opt)}
                    className={`p-2 rounded-lg text-[11px] font-sans tracking-wide uppercase border transition-all ${
                      selectedTrans === opt
                        ? 'border-brand-primary/40 bg-brand-primary/10 text-brand-primary font-bold'
                        : 'border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white bg-[#161616]'
                    }`}
                    id={`trans-filter-btn-${opt}`}
                  >
                    {opt === 'Todas' ? 'Todo' : opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Combustible Filter */}
            <div className="mb-3">
              <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-bold">Combustible</label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full bg-[#161616] border border-neutral-800 rounded-xl p-2.5 text-xs text-white uppercase tracking-wider font-sans focus:outline-none focus:border-brand-primary/50"
                id="fuel-select-filter"
              >
                <option value="Todos">Todos</option>
                <option value="Nafta">Nafta</option>
                <option value="Diesel">Diesel</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>
            </div>

          </aside>

          {/* Cards Catalogue Grid */}
          <main className="lg:col-span-3">
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
                  id="reset-filter-inner-btn"
                >
                  Restaurar Búsqueda
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map(v => (
                  <article
                    key={v.id}
                    onClick={() => {
                      setSelectedVehicleId(v.id);
                      setDownPayment(Math.round(v.precio * 0.35)); // Pre fill 35%
                    }}
                    className="cursor-pointer group flex flex-col bg-brand-card border border-neutral-800/80 hover:border-brand-primary hover:bg-brand-card/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-md shadow-black"
                    id={`stock-unit-${v.id}`}
                  >
                    {/* Media segment */}
                    <div className="relative aspect-video overflow-hidden bg-brand-dark">
                      <img 
                        src={v.imagen} 
                        alt={`${v.marca} ${v.modelo}`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Floating tag state */}
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
                        <span className="absolute top-3 right-3 bg-brand-primary text-white font-display text-xs tracking-wider uppercase py-1 px-2.5 rounded-md shadow-md">
                          Destacado
                        </span>
                      )}

                      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-brand-card to-transparent"></div>
                    </div>

                    {/* Metadata specs segment */}
                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex items-center justify-between text-xs font-sans uppercase tracking-widest text-[#F5A396] font-bold mb-1">
                          <span>{v.marca}</span>
                          <span>{v.anio}</span>
                        </div>
                        <h2 className="font-display text-2xl text-white uppercase group-hover:text-brand-primary transition-colors tracking-tight">
                          {v.modelo}
                        </h2>
                        <p className="font-sans text-xs text-neutral-400 tracking-wide font-medium mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis uppercase">
                          {v.version}
                        </p>
                      </div>

                      {/* Pill features badges */}
                      <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-sans text-neutral-400 uppercase">
                        <div className="flex items-center gap-1.5 bg-[#161616] border border-neutral-800/60 p-1.5 rounded-lg">
                          <Gauge className="h-3.5 w-3.5 text-brand-primary shrink-0" />
                          <span>{v.kilometraje === 0 ? 'A Estrenar' : `${v.kilometraje?.toLocaleString('de-DE')} KM`}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#161616] border border-neutral-800/60 p-1.5 rounded-lg">
                          <Calendar className="h-3.5 w-3.5 text-brand-primary shrink-0" />
                          <span>{v.combustible} {v.transmision === 'Automática' ? 'AT' : 'MT'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-neutral-800/60 mt-5 pt-4">
                        <div className="font-display text-2xl text-white">
                          USD {v.precio.toLocaleString('de-DE')}
                        </div>
                        <span className="font-display text-base uppercase tracking-wider text-brand-primary group-hover:translate-x-1 duration-300 transition-transform">
                          Ver Detalle →
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Dynamic Modal Dialog Detail Overlay */}
      {targetUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="absolute inset-0" onClick={() => setSelectedVehicleId(null)}></div>
          
          <div 
            className="relative w-full max-w-5xl bg-brand-dark border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl shadow-black max-h-[92vh] overflow-y-auto z-10"
            id={`detail-modal-${targetUnit.id}`}
          >
            {/* Upper gallery display */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 bg-brand-dark relative aspect-video lg:aspect-auto lg:h-[420px]">
                <img 
                  src={targetUnit.imagenesSecundarias[activeMediaIndex] || targetUnit.imagen} 
                  alt={`${targetUnit.marca} ${targetUnit.modelo}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-all"
                  id="modal-main-gallery-image"
                />
                
                {/* Close Button mobile */}
                <button 
                  onClick={() => setSelectedVehicleId(null)}
                  className="absolute top-4 left-4 bg-brand-dark/80 hover:bg-[#161616] text-white p-2.5 rounded-full border border-neutral-800 block md:hidden cursor-pointer"
                  id="modal-close-btn-mobile"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                {/* Overlaid tags */}
                <span className={`absolute top-4 right-4 font-display text-sm uppercase tracking-wider py-1 px-3 rounded-md shadow-lg ${
                  targetUnit.estado === 'Disponible' 
                    ? 'bg-emerald-600 text-white' 
                    : targetUnit.estado === 'Reservado'
                    ? 'bg-brand-primary text-white'
                    : 'bg-rose-600 text-white'
                }`}>
                  Unidad {targetUnit.estado}
                </span>

                {/* Thumbnails array preview */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 px-4">
                  {[targetUnit.imagen, ...targetUnit.imagenesSecundarias].map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveMediaIndex(index)}
                      className={`h-12 w-20 overflow-hidden rounded-lg border-2 bg-brand-dark transition-all ${
                        activeMediaIndex === index ? 'border-brand-primary scale-105' : 'border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                      id={`modal-thumb-btn-${index}`}
                    >
                      <img src={img} alt="Thumb" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Core Information side block */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between h-auto lg:h-[420px] bg-brand-card/50 border-l border-neutral-900">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg text-brand-primary uppercase tracking-wider font-black">
                    {targetUnit.marca} • Año {targetUnit.anio}
                  </span>
                  
                  {/* Close button Desktop */}
                  <button 
                    onClick={() => setSelectedVehicleId(null)}
                    className="hidden md:block text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-900 border border-neutral-800/60 cursor-pointer"
                    id="modal-close-btn-desktop"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4">
                  <h3 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-white leading-none">
                    {targetUnit.modelo}
                  </h3>
                  <p className="font-sans text-xs text-neutral-400 tracking-wide mt-1.5 uppercase font-medium">
                    {targetUnit.version}
                  </p>
                </div>

                <div className="bg-brand-dark border border-neutral-800/80 p-4 rounded-2xl flex items-center justify-between my-5">
                  <div>
                    <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-wider block font-bold">PRECIO EFECTIVO/TRANSFERENCIA</span>
                    <span className="font-display text-3xl font-black text-white">
                      USD {targetUnit.precio.toLocaleString('de-DE')}
                    </span>
                  </div>
                  <span className="font-sans text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md py-1 px-2.5 font-bold uppercase tracking-wider">
                    Listo para Transferir
                  </span>
                </div>

                {/* Instant WhatsApp Send or Share */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => openWhatsappChat(targetUnit, (financingReport && userInteractedWithSimulator) ? { downPayment, period: interestPeriod, quota: financingReport.monthlyQuota } : null)}
                    className="flex-grow flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-display text-base uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-brand-primary/20"
                    id="whatsapp-contact-api-btn"
                  >
                    <Send className="h-4 w-4" />
                    Consultar por WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Enlace copiado al portapapeles!');
                    }}
                    className="border border-neutral-800 hover:border-neutral-700 bg-brand-card text-neutral-300 hover:text-white p-3.5 rounded-xl transition-all flex items-center justify-center gap-1 text-xs font-sans uppercase tracking-wider font-bold cursor-pointer"
                    id="share-link-unit-btn"
                  >
                    <Share2 className="h-4 w-4" />
                    Compartir
                  </button>
                  <button
                    onClick={() => generateSpecPDF(targetUnit)}
                    className="border border-neutral-800 hover:border-neutral-700 bg-brand-card text-neutral-300 hover:text-white p-3.5 rounded-xl transition-all flex items-center justify-center gap-1 text-xs font-sans uppercase tracking-wider font-bold cursor-pointer"
                    id="print-pdf-unit-btn"
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir Ficha
                  </button>
                </div>
              </div>
            </div>

            {/* Downward auxiliary technical specs tabs & Financial Simulator */}
            <div className="p-6 sm:p-8 border-t border-neutral-900 grid grid-cols-1 md:grid-cols-2 gap-8 bg-brand-dark">
              
              {/* Left block: Specs details table */}
              <div id="technical-specifications-block">
                <h4 className="font-display text-lg uppercase tracking-wider text-white border-b border-neutral-900 pb-3 mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-primary" />
                  Especificaciones Técnicas
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-card/50 border border-neutral-900 p-3.5 rounded-xl">
                    <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-wider block font-bold">Kilometraje</span>
                    <span className="font-sans text-xs text-white font-bold tracking-wide uppercase">
                      {targetUnit.kilometraje === 0 ? 'A Estrenar (0 KM)' : `${targetUnit.kilometraje.toLocaleString('de-DE')} KM`}
                    </span>
                  </div>
                  <div className="bg-brand-card/50 border border-neutral-900 p-3.5 rounded-xl">
                    <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-wider block font-bold">Motorización</span>
                    <span className="font-sans text-xs text-white font-bold uppercase">
                      {targetUnit.motor}
                    </span>
                  </div>
                  <div className="bg-brand-card/50 border border-neutral-900 p-3.5 rounded-xl">
                    <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-wider block font-bold">Transmisión</span>
                    <span className="font-sans text-xs text-white font-bold uppercase">
                      {targetUnit.transmision}
                    </span>
                  </div>
                  <div className="bg-brand-card/50 border border-neutral-900 p-3.5 rounded-xl">
                    <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-wider block font-bold">Tracción</span>
                    <span className="font-sans text-xs text-white font-bold uppercase">
                      {targetUnit.traccion}
                    </span>
                  </div>
                  <div className="bg-brand-card/50 border border-neutral-900 p-3.5 rounded-xl col-span-2">
                    <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-wider block font-bold">Combustible y Energía</span>
                    <span className="font-sans text-xs text-white font-bold uppercase">
                      {targetUnit.combustible}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right block: Interactive Credit Simulator */}
              <div className="bg-brand-card p-6 rounded-2xl border border-neutral-800/80" id="financial-simulator-block">
                <h4 className="font-display text-lg uppercase tracking-wider text-white pb-3 border-b border-neutral-850 mb-4 flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-brand-primary" />
                  Simulador Financiación Prendaria
                </h4>
                
                <p className="font-sans text-xs text-neutral-400 leading-relaxed mb-4 uppercase">
                  Calculá tu plan de pago adaptado de manera instantánea con una Tasa Preferencial Anual del 8.5%.
                </p>

                {/* Anticipo down slider */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5 font-sans font-bold">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Anticipo (Efectivo / Auto Usado)</span>
                    <span className="text-xs text-brand-primary font-bold">
                      USD {downPayment.toLocaleString('de-DE')}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min={Math.round(targetUnit.precio * 0.20)} // Minimum 20% down
                    max={Math.round(targetUnit.precio * 0.80)} // Maximum 80%
                    step="500"
                    value={downPayment}
                    onChange={(e) => {
                      setDownPayment(Number(e.target.value));
                      setUserInteractedWithSimulator(true);
                    }}
                    className="w-full accent-brand-primary bg-neutral-850 rounded-lg cursor-pointer h-1.5"
                    id="finance-downpayment-slider"
                  />
                  <div className="flex justify-between text-[9px] text-neutral-600 font-sans mt-1 uppercase">
                    <span>Min (20%): USD {Math.round(targetUnit.precio * 0.20).toLocaleString('de-DE')}</span>
                    <span>Max (80%): USD {Math.round(targetUnit.precio * 0.80).toLocaleString('de-DE')}</span>
                  </div>
                </div>

                {/* Installments options select */}
                <div className="mb-4">
                  <span className="font-sans text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-bold">Plazo de Cuotas</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[12, 24, 36].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setInterestPeriod(m);
                          setUserInteractedWithSimulator(true);
                        }}
                        className={`p-2 rounded-lg text-xs font-sans text-center tracking-wider border transition-all ${
                          interestPeriod === m
                            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary font-bold'
                            : 'border-neutral-800 text-neutral-500 hover:border-neutral-700 bg-brand-dark'
                        }`}
                        id={`installment-btn-${m}`}
                      >
                        {m} Meses
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary outcome metrics */}
                {financingReport && (
                  <div className="bg-brand-dark p-4 rounded-xl border border-neutral-800/80 flex items-center justify-between">
                    <div>
                      <span className="font-sans text-[9px] text-neutral-500 uppercase tracking-wider block font-bold">SALDO A FINANCIAR</span>
                      <span className="font-sans text-xs text-white font-bold">USD {financingReport.balance.toLocaleString('de-DE')}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-sans text-[9.5px] text-brand-primary uppercase tracking-wider block font-bold">CUOTA MENSUAL ESTIMADA</span>
                      <strong className="font-display text-2xl text-white">
                        USD {financingReport.monthlyQuota.toLocaleString('de-DE')}
                      </strong>
                      <span className="font-sans text-[9px] text-neutral-500 block">/ mes</span>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

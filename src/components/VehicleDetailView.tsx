/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useInventory } from '../context/InventoryContext';
import { Vehicle } from '../types';
import { ArrowLeft, Send, Share2, Calendar, Gauge, Fuel, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

export const VehicleDetailView: React.FC = () => {
  const { selectedVehicleId, setView } = useNavigation();
  const { vehicles } = useInventory();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const vehicle = vehicles.find(v => v.id === selectedVehicleId) || null;

  if (!vehicle) {
    return (
      <div className="bg-brand-dark text-white min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="font-sans text-neutral-400 mb-4">No se encontró el vehículo.</p>
          <button
            onClick={() => setView('catalog')}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white font-display text-sm uppercase tracking-wider py-2.5 px-6 rounded-lg transition-all cursor-pointer"
          >
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  const allImages = [vehicle.imagen, ...vehicle.imagenesSecundarias];

  const openWhatsappChat = (v: Vehicle) => {
    const phone = '5492915367498';
    const vehicleUrl = `${window.location.origin}/#vehicle=${v.id}`;
    const text = `Hola Federico, me comunico porque vi en el catálogo de D'Amico Automotores la unidad ${v.marca} ${v.modelo} ${v.version}, año ${v.anio}, con un precio de USD ${v.precio.toLocaleString('de-DE')}. Me gustaría recibir más información y coordinar un test drive. Quedo atento, muchas gracias.\n\nLink del vehículo: ${vehicleUrl}`;
    const webUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
    window.open(webUrl, '_blank');
  };

  return (
    <div className="bg-brand-dark text-white min-h-[calc(100vh-5rem)]">
      {/* Top bar */}
      <div className="border-b border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => setView('catalog')}
            className="flex items-center gap-2 font-display text-sm uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
            id="back-to-catalog-btn"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Catálogo
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Gallery */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-card border border-neutral-800/80">
              <img
                src={allImages[activeMediaIndex] || vehicle.imagen}
                alt={`${vehicle.marca} ${vehicle.modelo}`}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
                id="detail-main-image"
              />

              {/* Status badge */}
              <span className={`absolute top-4 left-4 font-display text-sm uppercase tracking-wider py-1.5 px-4 rounded-lg shadow-lg ${
                vehicle.estado === 'Disponible'
                  ? 'bg-emerald-600 text-white'
                  : vehicle.estado === 'Reservado'
                  ? 'bg-brand-primary text-white'
                  : 'bg-rose-600 text-white'
              }`}>
                {vehicle.estado}
              </span>

              {/* Nav arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveMediaIndex(i => i === 0 ? allImages.length - 1 : i - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-brand-dark/80 hover:bg-brand-dark text-white p-2 rounded-full border border-neutral-800 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveMediaIndex(i => i === allImages.length - 1 ? 0 : i + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand-dark/80 hover:bg-brand-dark text-white p-2 rounded-full border border-neutral-800 transition-all cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <span className="absolute bottom-4 right-4 bg-brand-dark/80 text-white text-xs font-sans py-1 px-2.5 rounded-lg border border-neutral-800">
                {activeMediaIndex + 1} / {allImages.length}
              </span>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveMediaIndex(index)}
                    className={`shrink-0 h-16 w-24 overflow-hidden rounded-xl border-2 bg-brand-card transition-all cursor-pointer ${
                      activeMediaIndex === index
                        ? 'border-brand-primary scale-105'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                    id={`detail-thumb-${index}`}
                  >
                    <img src={img} alt="Thumb" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Header */}
            <div>
              {vehicle.destacado && (
                <span className="inline-flex items-center gap-1.5 bg-brand-primary/15 text-brand-primary border border-brand-primary/20 rounded-lg py-1 px-3 text-xs font-display uppercase tracking-wider font-bold mb-3">
                  ★ Unidad Destacada
                </span>
              )}
              <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white leading-none">
                {vehicle.marca}
              </h1>
              <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-brand-primary mt-1">
                {vehicle.modelo}
              </h2>
              <p className="font-sans text-sm text-neutral-400 uppercase tracking-wide mt-2 font-medium">
                {vehicle.version} • Año {vehicle.anio}
              </p>
            </div>

            {/* Price */}
            <div className="mt-6 bg-brand-card border border-neutral-800/80 p-5 rounded-2xl">
              <span className="font-sans text-[10px] text-neutral-500 uppercase tracking-wider block font-bold mb-1">Precio de Venta</span>
              <div className="font-display text-4xl font-black text-white">
                USD {vehicle.precio.toLocaleString('de-DE')}
              </div>
              <span className="font-sans text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md py-1 px-2.5 font-bold uppercase tracking-wider inline-block mt-2">
                Listo para Transferir
              </span>
            </div>

            {/* Specs grid */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-brand-card border border-neutral-800/80 p-4 rounded-xl flex items-center gap-3">
                <Calendar className="h-5 w-5 text-brand-primary/70 shrink-0" />
                <div>
                  <span className="font-sans text-[9px] text-neutral-500 uppercase tracking-wider block font-bold">Año</span>
                  <span className="font-sans text-sm text-white font-bold">{vehicle.anio}</span>
                </div>
              </div>
              <div className="bg-brand-card border border-neutral-800/80 p-4 rounded-xl flex items-center gap-3">
                <Gauge className="h-5 w-5 text-brand-primary/70 shrink-0" />
                <div>
                  <span className="font-sans text-[9px] text-neutral-500 uppercase tracking-wider block font-bold">Kilometraje</span>
                  <span className="font-sans text-sm text-white font-bold">
                    {vehicle.kilometraje === 0 ? '0 KM' : `${vehicle.kilometraje.toLocaleString('de-DE')} KM`}
                  </span>
                </div>
              </div>
              <div className="bg-brand-card border border-neutral-800/80 p-4 rounded-xl flex items-center gap-3">
                <Fuel className="h-5 w-5 text-brand-primary/70 shrink-0" />
                <div>
                  <span className="font-sans text-[9px] text-neutral-500 uppercase tracking-wider block font-bold">Combustible</span>
                  <span className="font-sans text-sm text-white font-bold">{vehicle.combustible}</span>
                </div>
              </div>
              <div className="bg-brand-card border border-neutral-800/80 p-4 rounded-xl flex items-center gap-3">
                <Settings className="h-5 w-5 text-brand-primary/70 shrink-0" />
                <div>
                  <span className="font-sans text-[9px] text-neutral-500 uppercase tracking-wider block font-bold">Transmisión</span>
                  <span className="font-sans text-sm text-white font-bold">{vehicle.transmision}</span>
                </div>
              </div>
            </div>

            {/* Extra specs */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="bg-brand-card border border-neutral-800/80 p-4 rounded-xl">
                <span className="font-sans text-[9px] text-neutral-500 uppercase tracking-wider block font-bold">Motorización</span>
                <span className="font-sans text-sm text-white font-bold">{vehicle.motor}</span>
              </div>
              <div className="bg-brand-card border border-neutral-800/80 p-4 rounded-xl">
                <span className="font-sans text-[9px] text-neutral-500 uppercase tracking-wider block font-bold">Tracción</span>
                <span className="font-sans text-sm text-white font-bold">{vehicle.traccion}</span>
              </div>
            </div>

            {/* Contact actions */}
            <div className="mt-8 space-y-3">
              <button
                onClick={() => openWhatsappChat(vehicle)}
                className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-display text-base uppercase tracking-wider py-4 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-brand-primary/20"
                id="detail-whatsapp-btn"
              >
                <Send className="h-4 w-4" />
                Consultar por WhatsApp
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Enlace copiado al portapapeles!');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 border border-neutral-800 hover:border-neutral-700 bg-brand-card text-neutral-300 hover:text-white py-3 rounded-xl transition-all text-xs font-sans uppercase tracking-wider font-bold cursor-pointer"
                  id="detail-share-btn"
                >
                  <Share2 className="h-4 w-4" />
                  Compartir
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

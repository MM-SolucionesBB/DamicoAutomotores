/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Vehicle } from '../types';
import { X, Save, Image as ImageIcon, Camera, HelpCircle, FileText, Check } from 'lucide-react';
import { AVAILABLE_BRANDS } from '../mockData';

interface PublishFormProps {
  mode: 'create' | 'edit';
  vehicleId: string | null;
  onClose: () => void;
}

// Curated gallery presets of high-quality vehicles
const PRESET_VEHICLE_IMAGES = [
  {
    label: 'Ford Ranger (Gris Selva)',
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200'
  },
  {
    label: 'Volkswagen Amarok (Gris Plata)',
    url: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=1200'
  },
  {
    label: 'Toyota Hilux (Rojo Aventura)',
    url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200'
  },
  {
    label: 'Peugeot 2008 (Naranja Cobre)',
    url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200'
  },
  {
    label: 'Porsche Macan GTS (Negro Carbón)',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200'
  },
  {
    label: 'Audi A4 S-line (Azul Royal)',
    url: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=1200'
  },
  {
    label: 'Mercedes-Benz C-Class (Gris Nardo)',
    url: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200'
  },
  {
    label: 'Jeep Compass/Grand Cherokee (Gris Oscuro)',
    url: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200'
  }
];

export const PublishForm: React.FC<PublishFormProps> = ({ mode, vehicleId, onClose }) => {
  const { vehicles, addVehicle, updateVehicle } = useInventory();

  // Primary States
  const [marca, setMarca] = useState('Ford');
  const [modelo, setModelo] = useState('');
  const [version, setVersion] = useState('');
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [precio, setPrecio] = useState<number>(30000);
  const [kilometraje, setKilometraje] = useState<number>(0);
  const [motor, setMotor] = useState('');
  const [transmision, setTransmision] = useState<'Manual' | 'Automática'>('Automática');
  const [traccion, setTraccion] = useState<'4x2' | '4x4' | 'AWD' | 'RWD'>('4x4');
  const [combustible, setCombustible] = useState<'Nafta' | 'Diesel' | 'Nafta/GNC' | 'Híbrido' | 'Eléctrico'>('Diesel');
  const [imagen, setImagen] = useState('');
  const [destacado, setDestacado] = useState(false);
  const [estado, setEstado] = useState<'Disponible' | 'Reservado' | 'Vendido'>('Disponible');

  // Load existing vehicle data if editing
  useEffect(() => {
    if (mode === 'edit' && vehicleId) {
      const match = vehicles.find(v => v.id === vehicleId);
      if (match) {
        setMarca(match.marca);
        setModelo(match.modelo);
        setVersion(match.version);
        setAnio(match.anio);
        setPrecio(match.precio);
        setKilometraje(match.kilometraje);
        setMotor(match.motor);
        setTransmision(match.transmision);
        setTraccion(match.traccion);
        setCombustible(match.combustible);
        setImagen(match.imagen);
        setDestacado(match.destacado);
        setEstado(match.estado);
      }
    } else {
      // Create defaults
      setMarca('Ford');
      setModelo('');
      setVersion('');
      setAnio(2022);
      setPrecio(28500);
      setKilometraje(25000);
      setMotor('2.0 Turbo Diesel (180cv)');
      setTransmision('Automática');
      setTraccion('4x4');
      setCombustible('Diesel');
      setImagen(PRESET_VEHICLE_IMAGES[0].url); // select first preset as default
      setDestacado(false);
      setEstado('Disponible');
    }
  }, [mode, vehicleId, vehicles]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelo || !version || !motor || !imagen) {
      alert('Por favor complete todos los datos del formulario.');
      return;
    }

    // Set secondary mockup photos automatically based on the main image for carousel
    const imagenesSecundarias = [
      imagen,
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=600'
    ];

    const currentData = {
      marca,
      modelo,
      version,
      anio,
      precio,
      kilometraje,
      motor,
      transmision,
      traccion,
      combustible,
      imagen,
      imagenesSecundarias,
      destacado,
      estado
    };

    if (mode === 'edit' && vehicleId) {
      updateVehicle(vehicleId, currentData);
    } else {
      addVehicle(currentData);
    }
    
    onClose();
  };

  return (
    <form 
      onSubmit={handleSave}
      className="bg-brand-dark border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
      id="publication-form-overlay"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-brand-card/20">
        <div>
          <span className="font-sans text-[11px] uppercase tracking-widest text-brand-primary font-bold">Consola de Catalogación</span>
          <h2 className="font-display text-2xl uppercase text-white tracking-wider">
            {mode === 'edit' ? 'Editar Vehículo Existente' : 'Publicar Nuevo Vehículo'}
          </h2>
        </div>
        <button 
          type="button"
          onClick={onClose}
          className="text-neutral-500 hover:text-white p-1 rounded-full border border-neutral-800 hover:bg-neutral-900 cursor-pointer"
          id="btn-close-publish-form"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main double scrollable content area */}
      <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-8 font-sans">
        
        {/* Section 1: Información Básica */}
        <div id="publish-section-basic">
          <h3 className="font-display text-lg uppercase tracking-wider text-white border-b border-neutral-900 pb-2 mb-4 flex items-center gap-2">
            <span className="h-4 w-1 bg-brand-primary rounded"></span>
            1. Información Básica del Vehículo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 text-xs">
            {/* Marca */}
            <div className="lg:col-span-3">
              <label className="font-sans text-[11px] text-neutral-400 uppercase block mb-1.5 font-bold">Marca *</label>
              <select
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className="w-full bg-[#161616] border border-neutral-800 focus:border-brand-primary rounded-xl p-3 focus:outline-none text-white font-sans uppercase tracking-wider"
                id="form-input-brand"
              >
                {AVAILABLE_BRANDS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Modelo */}
            <div className="lg:col-span-3">
              <label className="font-sans text-[11px] text-neutral-400 uppercase block mb-1.5 font-bold">Modelo *</label>
              <input 
                type="text"
                required
                placeholder="Ej: Ranger, Amarok, C300..."
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="w-full bg-[#161616] border border-neutral-800 focus:border-brand-primary rounded-xl p-3 focus:outline-none placeholder-neutral-600 text-white font-sans"
                id="form-input-model"
              />
            </div>

            {/* Versión */}
            <div className="lg:col-span-6">
              <label className="font-sans text-[11px] text-neutral-400 uppercase block mb-1.5 font-bold">Versión Exacta / Equipamiento *</label>
              <input 
                type="text"
                required
                placeholder="Ej: Limited 3.2 4x4 Automática S"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-[#161616] border border-neutral-800 focus:border-brand-primary rounded-xl p-3 focus:outline-none placeholder-neutral-600 text-white font-sans"
                id="form-input-version"
              />
            </div>

            {/* Año */}
            <div className="lg:col-span-4">
              <label className="font-sans text-[11px] text-neutral-400 uppercase block mb-1.5 font-bold">Año Modelo (Fabricación) *</label>
              <input 
                type="number"
                required
                min="2010"
                max="2026"
                value={anio}
                onChange={(e) => setAnio(Number(e.target.value))}
                className="w-full bg-[#161616] border border-neutral-800 focus:border-brand-primary rounded-xl p-3 focus:outline-none text-white font-sans"
                id="form-input-year"
              />
            </div>

            {/* Precio en USD */}
            <div className="lg:col-span-4">
              <label className="font-sans text-[11px] text-neutral-400 uppercase block mb-1.5 font-bold">Precio pretendido (USD) *</label>
              <input 
                type="number"
                required
                min="1000"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
                className="w-full bg-[#161616] border border-neutral-800 focus:border-brand-primary rounded-xl p-3 focus:outline-none text-white font-sans"
                id="form-input-price"
              />
            </div>

            {/* Kilometraje */}
            <div className="lg:col-span-4">
              <label className="font-sans text-[11px] text-neutral-400 uppercase block mb-1.5 font-bold">Kilometraje (KM) *</label>
              <input 
                type="number"
                required
                min="0"
                value={kilometraje}
                onChange={(e) => setKilometraje(Number(e.target.value))}
                className="w-full bg-[#161616] border border-neutral-800 focus:border-brand-primary rounded-xl p-3 focus:outline-none text-white font-sans"
                id="form-input-mileage"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Especificaciones */}
        <div id="publish-section-specs">
          <h3 className="font-display text-lg uppercase tracking-wider text-white border-b border-neutral-900 pb-2 mb-4 flex items-center gap-2">
            <span className="h-4 w-1 bg-brand-primary rounded"></span>
            2. Especificaciones de Motor & Tracción
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
            {/* Motorización */}
            <div className="sm:col-span-2">
              <label className="font-sans text-[11px] text-neutral-400 uppercase block mb-1.5 font-bold">Motorización / Cilindrada *</label>
              <input 
                type="text"
                required
                placeholder="Ej: 3.2L Puma 5Cil (200cv), 2.0 TDI..."
                value={motor}
                onChange={(e) => setMotor(e.target.value)}
                className="w-full bg-[#161616] border border-neutral-800 focus:border-brand-primary rounded-xl p-3 focus:outline-none placeholder-neutral-600 text-white font-sans"
                id="form-input-engine"
              />
            </div>

            {/* Transmisión */}
            <div>
              <label className="font-sans text-[11px] text-neutral-400 uppercase block mb-1.5 font-bold">Transmisión *</label>
              <select
                value={transmision}
                onChange={(e) => setTransmision(e.target.value as any)}
                className="w-full bg-[#161616] border border-neutral-800 focus:border-brand-primary rounded-xl p-3 focus:outline-none text-white font-sans"
                id="form-input-trans"
              >
                <option value="Manual">Manual</option>
                <option value="Automática">Automática</option>
              </select>
            </div>

            {/* Tracción */}
            <div>
              <label className="font-sans text-[11px] text-neutral-400 uppercase block mb-1.5 font-bold">Tracción *</label>
              <select
                value={traccion}
                onChange={(e) => setTraccion(e.target.value as any)}
                className="w-full bg-[#161616] border border-neutral-800 focus:border-brand-primary rounded-xl p-3 focus:outline-none text-white font-sans"
                id="form-input-traction"
              >
                <option value="4x2">4x2</option>
                <option value="4x4">4x4 / AWD</option>
                <option value="AWD">AWD (Integral)</option>
                <option value="RWD">RWD (Trasera)</option>
              </select>
            </div>

            {/* Combustible */}
            <div className="sm:col-span-2">
              <label className="font-sans text-[11px] text-neutral-400 uppercase block mb-1.5 font-bold">Combustible *</label>
              <select
                value={combustible}
                onChange={(e) => setCombustible(e.target.value as any)}
                className="w-full bg-[#161616] border border-neutral-800 focus:border-brand-primary rounded-xl p-3 focus:outline-none text-white font-sans"
                id="form-input-fuel"
              >
                <option value="Diesel">Diesel</option>
                <option value="Nafta">Nafta</option>
                <option value="Nafta/GNC">Nafta/GNC</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Fotografía e Imagen */}
        <div id="publish-section-multimedia">
          <h3 className="font-display text-lg uppercase tracking-wider text-white border-b border-neutral-900 pb-2 mb-2 flex items-center gap-2">
            <span className="h-4 w-1 bg-brand-primary rounded"></span>
            3. Recurso Fotográfico (Imagen Principal)
          </h3>
          
          <p className="font-sans text-xs text-neutral-500 mb-4 font-bold uppercase leading-relaxed">
            Escriba una URL de imagen válida o elija un modelo pre-seleccionado en alta definición de nuestra galería recomendada.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Selected Photo visual block */}
            <div className="lg:col-span-4 aspect-video lg:h-36 rounded-xl overflow-hidden border border-neutral-800 bg-[#161616] relative">
              {imagen ? (
                <img src={imagen} alt="Preview" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-neutral-600 h-full">
                  <Camera className="h-8 w-8 mb-1" />
                  <span className="font-sans text-[9px] font-bold">S/FOTO PREVIA</span>
                </div>
              )}
            </div>

            {/* Preset selecting visual slider */}
            <div className="lg:col-span-8 space-y-3.5">
              <div>
                <label className="font-sans text-[11px] text-neutral-400 uppercase block mb-1.5 font-bold">Dirección URL de Imagen Principal *</label>
                <input 
                  type="text"
                  required
                  placeholder="Pegue una URL pública..."
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                  className="w-full bg-[#161616] border border-neutral-800 focus:border-brand-primary rounded-xl p-3 focus:outline-none placeholder-neutral-600 text-white font-mono text-xs"
                  id="form-input-image-url"
                />
              </div>

              {/* Gallery presets items lists */}
              <div>
                <span className="font-sans text-[11px] text-neutral-500 uppercase block mb-2 font-bold select-none">Galería de Muestras Rápidas (Presioná para elegir):</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_VEHICLE_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImagen(preset.url)}
                      className={`relative h-12 rounded-lg overflow-hidden border transition-all text-left ${
                        imagen === preset.url ? 'border-brand-primary scale-[1.02]' : 'border-neutral-900 hover:border-neutral-800'
                      }`}
                      id={`gallery-preset-selector-${idx}`}
                    >
                      <img src={preset.url} alt="Preset thumb" referrerPolicy="no-referrer" className="h-full w-full object-cover opacity-60" />
                      <div className="absolute inset-x-1 bottom-1 text-[8px] bg-neutral-950/80 text-white truncate px-1 rounded uppercase font-sans">
                        {preset.label}
                      </div>
                      {imagen === preset.url && (
                        <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-brand-primary text-white flex items-center justify-center">
                          <Check className="h-2 w-2" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Publicación e Visibilidad */}
        <div id="publish-section-visibility">
          <h3 className="font-display text-lg uppercase tracking-wider text-white border-b border-neutral-900 pb-2 mb-4 flex items-center gap-2">
            <span className="h-4 w-1 bg-brand-primary rounded"></span>
            4. Configuración de Listado e Visibilidad
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Destacado */}
            <div className="bg-brand-card/45 border border-neutral-950 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <strong className="text-white block font-display text-xl uppercase tracking-wider">Destacar Unidad</strong>
                <p className="text-neutral-500 font-sans text-[11px] mt-1 uppercase">
                  ¿Habilitar carrusel y etiquetas superiores destacadas en la página principal?
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={destacado} 
                  onChange={(e) => setDestacado(e.target.checked)}
                  className="sr-only peer"
                  id="form-switch-featured"
                />
                <div className="w-10 h-5 bg-[#161616] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-600 peer-checked:after:bg-brand-primary after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary/10 border border-neutral-700 peer-checked:border-brand-primary/40"></div>
              </label>
            </div>

            {/* Estado original */}
            <div className="bg-brand-card/45 border border-neutral-950 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <strong className="text-white block font-display text-xl uppercase tracking-wider">Estado Inicial</strong>
                <p className="text-neutral-500 font-sans text-[11px] mt-1 uppercase">
                  Defina el estatus de stock de disponibilidad para las búsquedas.
                </p>
              </div>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as any)}
                className="bg-[#161616] border border-neutral-800 text-xs font-sans font-bold uppercase tracking-wider rounded-xl p-3 focus:outline-none text-white focus:border-brand-primary"
                id="form-select-status"
              >
                <option value="Disponible">Disponible</option>
                <option value="Reservado">Reservado</option>
                <option value="Vendido">Vendido</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Footer bar buttons */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-900 bg-brand-card/30">
        <button
          type="button"
          onClick={onClose}
          className="border border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-400 hover:text-white font-sans text-xs uppercase font-bold tracking-wider py-3 px-5 rounded-xl transition-colors cursor-pointer"
          id="btn-discard-publish"
        >
          Descartar / Cancelar
        </button>

        <button
          type="submit"
          className="bg-brand-primary hover:bg-brand-primary/95 text-white font-display text-lg uppercase tracking-wider py-3 px-6 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-brand-primary/10"
          id="btn-confirm-save-vehicle"
        >
          <Save className="h-4 w-4" />
          <span>{mode === 'edit' ? 'Guardar Cambios' : 'Publicar Vehículo'}</span>
        </button>
      </div>

    </form>
  );
};

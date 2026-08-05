/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { useNavigation } from '../context/NavigationContext';
import { Car, Landmark, Star, Edit3, Trash2, Plus, LogOut, Search } from 'lucide-react';
import { PublishForm } from './PublishForm';

export const AdminDashboard: React.FC = () => {
  const { signOut } = useAuth();
  const { setView } = useNavigation();
  const { 
    vehicles, 
    deleteVehicle, 
    updateVehicle 
  } = useInventory();

  // Selected vehicle for edit (null means creating, undefined means not showing form)
  const [formMode, setFormMode] = useState<'create' | 'edit' | undefined>(undefined);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  // Local Search term inside dashboard
  const [panelSearch, setPanelSearch] = useState('');

  // Count metrics
  const stats = useMemo(() => {
    let totalStock = vehicles.length;
    let totalValue = vehicles.reduce((sum, v) => sum + v.precio, 0);
    let featuredCount = vehicles.filter(v => v.destacado).length;
    let activeReservations = vehicles.filter(v => v.estado === 'Reservado').length;

    return {
      totalStock,
      totalValue,
      featuredCount,
      activeReservations
    };
  }, [vehicles]);

  // Compute vehicles matching panel search text
  const filteredDashboardVehicles = useMemo(() => {
    const q = panelSearch.toLowerCase().trim();
    if (!q) return vehicles;
    return vehicles.filter(v => 
      v.marca.toLowerCase().includes(q) ||
      v.modelo.toLowerCase().includes(q) ||
      v.version.toLowerCase().includes(q) ||
      v.anio.toString().includes(q)
    );
  }, [vehicles, panelSearch]);

  const handleEditInit = (id: string) => {
    setEditingVehicleId(id);
    setFormMode('edit');
  };

  const handleCreateInit = () => {
    setEditingVehicleId(null);
    setFormMode('create');
  };

  return (
    <div className="bg-brand-dark text-white min-h-[calc(100vh-5rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl w-full">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-neutral-900 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-primary animate-pulse"></span>
              <span className="font-sans text-xs uppercase tracking-widest text-[#F5A396] font-bold">
                MÓDULO DE GESTIÓN INTERNA
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white mt-1">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateInit}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white font-display text-sm uppercase tracking-wider py-3 px-5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              id="dash-add-vehicle-btn"
            >
              <Plus className="h-4 w-4" />
              Publicar Nuevo Vehículo
            </button>
            <button
              onClick={async () => { await signOut(); setView('home'); }}
              className="border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 text-neutral-400 hover:text-white font-sans text-xs uppercase font-bold tracking-wider py-3 px-4 rounded-xl transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
              id="dash-exit-btn"
            >
              <LogOut className="h-3.5 w-3.5" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* METRICS Bento Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          
          {/* Card 1: Total Stock */}
          <div className="bg-brand-card/60 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-500 mb-4">
              <Car className="h-5 w-5 text-brand-primary" />
              <span className="font-sans text-[11px] uppercase tracking-wider font-bold">Stock Total</span>
            </div>
            <div>
              <span className="font-display text-4xl font-extrabold text-white block">
                {stats.totalStock}
              </span>
              <span className="font-sans text-[11px] text-neutral-500 mt-1 block uppercase">Unidades cargadas</span>
            </div>
          </div>

          {/* Card 2: Valor en Stock */}
          <div className="bg-brand-card/60 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between text-neutral-500 mb-4">
              <Landmark className="h-5 w-5 text-emerald-500" />
              <span className="font-sans text-[11px] uppercase tracking-wider font-bold">Valor Activo Flota</span>
            </div>
            <div>
              <span className="font-display text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 block">
                USD {stats.totalValue.toLocaleString('de-DE')}
              </span>
              <span className="font-sans text-[11px] text-neutral-500 mt-1 block uppercase">Capital invertido estimado</span>
            </div>
          </div>

          {/* Card 3: Destacados */}
          <div className="bg-brand-card/60 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-500 mb-4">
              <Star className="h-5 w-5 text-brand-primary" />
              <span className="font-sans text-[11px] uppercase tracking-wider font-bold">Destacados</span>
            </div>
            <div>
              <span className="font-display text-4xl font-extrabold text-white block">
                {stats.featuredCount}
              </span>
              <span className="font-sans text-[11px] text-neutral-500 mt-1 block uppercase font-medium">Mostrados en inicio</span>
            </div>
          </div>

          {/* Card 4: Reservados */}
          <div className="bg-brand-card/60 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-500 mb-4">
              <Star className="h-5 w-5 text-brand-accent" />
              <span className="font-sans text-[11px] uppercase tracking-wider font-bold">Reservados</span>
            </div>
            <div>
              <span className="font-display text-4xl font-extrabold text-white block">
                {stats.activeReservations}
              </span>
              <span className="font-sans text-[11px] text-neutral-500 mt-1 block uppercase">
                Unidades con reserva
              </span>
            </div>
          </div>

        </div>

        {/* Dashboard Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-900 mb-6 pb-2 gap-4">
          <div className="flex mb-0 space-x-6">
            <span className="font-display text-xl uppercase tracking-wider pb-3 text-brand-primary relative">
              Inventario de Stock ({vehicles.length})
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary"></span>
            </span>
          </div>

          <div className="relative bg-[#161616] border border-neutral-800 rounded-xl flex items-center p-1 font-sans w-full sm:max-w-xs mb-2">
            <input 
              type="text" 
              placeholder="Filtrar por marca, modelo..."
              value={panelSearch}
              onChange={(e) => setPanelSearch(e.target.value)}
              className="bg-transparent w-full text-xs py-1.5 px-3 focus:outline-none placeholder-neutral-600 text-white uppercase"
              id="dash-search-input"
            />
            <Search className="h-4 w-4 text-neutral-500 mr-2" />
          </div>
        </div>

        {/* Inventory List Table */}
        <div className="overflow-x-auto bg-brand-card/40 border border-neutral-900 rounded-2xl shadow-xl shadow-black">
            <table className="w-full text-left border-collapse" id="dash-inventory-table">
              <thead>
                <tr className="border-b border-neutral-900 text-xs font-sans text-neutral-500 uppercase tracking-wider bg-brand-card/70 font-bold">
                  <th className="py-4 px-6">Vehículo</th>
                  <th className="py-4 px-6">Año</th>
                  <th className="py-4 px-6">Precio / KM</th>
                  <th className="py-4 px-6">Destacado</th>
                  <th className="py-4 px-6">Estado de Unidad</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-xs font-sans">
                {filteredDashboardVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 px-6 text-center text-neutral-500 font-bold uppercase">
                      No se encontraron vehículos que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredDashboardVehicles.map(v => (
                    <tr key={v.id} className="hover:bg-brand-card/20 transition-colors">
                      {/* Media and simple title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3.5">
                          <div className="h-12 w-20 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 shrink-0">
                            <img src={v.imagen} alt={v.modelo} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <span className="font-display text-sm text-brand-primary uppercase tracking-wider block leading-none mb-1 font-bold">
                              {v.marca}
                            </span>
                            <span className="font-sans text-sm font-bold text-white block">
                              {v.modelo}
                            </span>
                            <span className="text-[10px] text-neutral-500 block leading-tight font-bold uppercase mt-0.5">
                              {v.version}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Year */}
                      <td className="py-4 px-6 font-display text-base text-neutral-300">
                        {v.anio}
                      </td>

                      {/* Cost and KM */}
                      <td className="py-4 px-6">
                        <strong className="text-white block font-display text-base">
                          USD {v.precio.toLocaleString('de-DE')}
                        </strong>
                        <span className="font-sans text-xs text-neutral-400 mt-0.5 block uppercase">
                          {v.kilometraje === 0 ? 'A Estrenar' : `${v.kilometraje.toLocaleString('de-DE')} KM`}
                        </span>
                      </td>

                      {/* Featured button checkbox slider */}
                      <td className="py-4 px-6">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={v.destacado} 
                            onChange={(e) => updateVehicle(v.id, { destacado: e.target.checked })}
                            className="sr-only peer"
                            id={`feat-toggle-${v.id}`}
                          />
                          <div className="w-9 h-5 bg-neutral-950 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-600 peer-checked:after:bg-brand-primary after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary/10 border border-neutral-800 peer-checked:border-brand-primary/40"></div>
                        </label>
                      </td>

                      {/* Unit state selection */}
                      <td className="py-4 px-6">
                        <select
                           value={v.estado}
                           onChange={(e) => updateVehicle(v.id, { estado: e.target.value as any })}
                           className={`bg-brand-dark/95 border border-neutral-800 text-xs uppercase font-sans tracking-wider font-bold rounded-lg p-1.5 focus:outline-none focus:border-brand-primary ${
                            v.estado === 'Disponible' 
                              ? 'text-emerald-400' 
                              : v.estado === 'Reservado' 
                              ? 'text-brand-primary' 
                              : 'text-rose-400'
                          }`}
                          id={`state-sel-${v.id}`}
                        >
                          <option value="Disponible">Disponible</option>
                          <option value="Reservado">Reservado</option>
                          <option value="Vendido">Vendido</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditInit(v.id)}
                            className="bg-[#161616] hover:bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white p-2 rounded-lg transition-colors cursor-pointer"
                            id={`act-edit-${v.id}`}
                            title="Editar"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('¿Está seguro de eliminar esta publicación de vehículo?')) {
                                deleteVehicle(v.id);
                              }
                            }}
                            className="bg-[#161616] hover:bg-rose-950 hover:border-rose-900 hover:text-rose-400 border border-neutral-800 text-neutral-500 p-2 rounded-lg transition-colors cursor-pointer"
                            id={`act-delete-${v.id}`}
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

      </div>

      {/* Embedded Form Dialogue Overlay (Create/Edit) */}
      {formMode !== undefined && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="absolute inset-0" onClick={() => setFormMode(undefined)}></div>
          <div className="relative w-full max-w-4xl z-10 my-8">
            <PublishForm 
              mode={formMode}
              vehicleId={editingVehicleId}
              onClose={() => setFormMode(undefined)}
            />
          </div>
        </div>
      )}

    </div>
  );
};

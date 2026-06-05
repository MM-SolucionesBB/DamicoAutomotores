/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { Vehicle, ConsignmentRequest } from '../types';
import { Car, Landmark, Star, HelpCircle, Edit3, Trash2, Plus, LogOut, CheckCircle2, XCircle, Send, Search, Sparkles } from 'lucide-react';
import { PublishForm } from './PublishForm';

export const AdminDashboard: React.FC = () => {
  const { signOut } = useAuth();
  const { 
    vehicles, 
    deleteVehicle, 
    updateVehicle, 
    consignments, 
    updateConsignmentStatus,
    setAdminViewMode,
    setActiveTab 
  } = useInventory();

  // Selected vehicle for edit (null means creating, undefined means not showing form)
  const [formMode, setFormMode] = useState<'create' | 'edit' | undefined>(undefined);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  // Active section inside the panel
  const [activeSegment, setActiveSegment] = useState<'inventory' | 'proposals'>('inventory');

  // Local Search term inside dashboard
  const [panelSearch, setPanelSearch] = useState('');

  // Count metrics
  const stats = useMemo(() => {
    let totalStock = vehicles.length;
    let totalValue = vehicles.reduce((sum, v) => sum + v.precio, 0);
    let featuredCount = vehicles.filter(v => v.destacado).length;
    let activeReservations = vehicles.filter(v => v.estado === 'Reservado').length;
    let pendingProposals = consignments.filter(c => c.estado === 'Pendiente').length;

    return {
      totalStock,
      totalValue,
      featuredCount,
      activeReservations,
      pendingProposals
    };
  }, [vehicles, consignments]);

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

  const handleTriggerMessage = (req: ConsignmentRequest) => {
    const text = `Hola ${req.nombre}! Me comunico de D'Amico Automotores sobre tu consulta por el ${req.marca} ${req.modelo} (${req.anio}) cotizado en USD ${req.precioPretendido.toLocaleString('de-DE')}. Quisiera coordinar detalles para su revisión física.`;
    const url = `https://api.whatsapp.com/send?phone=${req.celular}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };  return (
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
              onClick={async () => { await signOut(); setAdminViewMode(false); setActiveTab('home'); }}
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

          {/* Card 4: Consignaciones */}
          <div className="bg-brand-card/60 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-500 mb-4">
              <HelpCircle className="h-5 w-5 text-[#F5A396]" />
              <span className="font-sans text-[11px] uppercase tracking-wider font-bold">Propuestas</span>
            </div>
            <div>
              <span className="font-display text-4xl font-extrabold text-white block">
                {consignments.length}
              </span>
              <span className="font-sans text-[11px] text-neutral-500 mt-1 block uppercase">
                {stats.pendingProposals} pendientes
              </span>
            </div>
          </div>

        </div>

        {/* Dashboard Navigation Segment & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-900 mb-6 pb-2 gap-4">
          <div className="flex mb-0 space-x-6">
            <button
              onClick={() => setActiveSegment('inventory')}
              className={`font-display text-xl uppercase tracking-wider pb-3 transition-colors relative cursor-pointer ${
                activeSegment === 'inventory' ? 'text-brand-primary' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              id="btn-segment-inventory"
            >
              Inventario de Stock ({vehicles.length})
              {activeSegment === 'inventory' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary"></span>
              )}
            </button>
            <button
              onClick={() => setActiveSegment('proposals')}
              className={`font-display text-xl uppercase tracking-wider pb-3 transition-colors relative cursor-pointer flex items-center gap-1.5 ${
                activeSegment === 'proposals' ? 'text-brand-primary' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              id="btn-segment-proposals"
            >
              Propuestas de Clientes ({consignments.length})
              {stats.pendingProposals > 0 && (
                <span className="bg-brand-primary text-white font-sans text-xs font-bold leading-none rounded-full py-1 px-1.5">
                  {stats.pendingProposals}
                </span>
              )}
              {activeSegment === 'proposals' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary"></span>
              )}
            </button>
          </div>

          {activeSegment === 'inventory' && (
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
          )}
        </div>

        {/* segment a: INVENTORY LIST TABLE */}
        {activeSegment === 'inventory' && (
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
        )}

        {/* segment b: CONSIGNMENT PROPOSALS LIST */}
        {activeSegment === 'proposals' && (
          <div className="space-y-4">
            {consignments.length === 0 ? (
              <div className="py-12 text-center bg-brand-card/40 border border-neutral-900 rounded-2xl text-neutral-500 font-bold uppercase text-xs">
                Aún no se han recibido propuestas de consignación por parte de clientes.
              </div>
            ) : (
              consignments.map(c => (
                <div 
                  key={c.id}
                  className="bg-brand-card/60 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  id={`prop-req-${c.id}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-sans font-bold uppercase tracking-wider py-1 px-2.5 rounded-full ${
                        c.estado === 'Pendiente'
                          ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                          : c.estado === 'Aceptado'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : c.estado === 'Revisado'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        Propuesta {c.estado}
                      </span>
                      <span className="font-sans text-xs text-neutral-500 font-bold">
                        {new Date(c.creadoEn).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl text-white uppercase tracking-wider">
                      {c.marca} {c.modelo} {c.version || ''} <span className="text-neutral-500 text-base">({c.anio})</span>
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-xs font-sans text-neutral-400 uppercase">
                      <div>
                        <span className="text-neutral-500 block leading-none mb-1 font-bold">Precio sugerido</span>
                        <strong className="text-emerald-400 font-display text-base">USD {c.precioPretendido.toLocaleString('de-DE')}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block leading-none mb-1 font-bold">Kilometraje</span>
                        <strong className="text-white text-base font-display">{c.kilometraje.toLocaleString('de-DE')} KM</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block leading-none mb-1 font-bold">Cliente</span>
                        <strong className="text-white text-xs">{c.nombre}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block leading-none mb-1 font-bold">WhatsApp</span>
                        <strong className="text-white text-xs">{c.celular}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 border-t md:border-t-0 border-neutral-900 pt-4 md:pt-0">
                    <button
                      onClick={() => handleTriggerMessage(c)}
                      className="bg-[#161616] hover:bg-neutral-900 border border-neutral-800 text-white font-sans text-xs uppercase font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      id={`prop-wa-btn-${c.id}`}
                    >
                      <Send className="h-3.5 w-3.5 text-emerald-400" />
                      Contactar
                    </button>
                    
                    {c.estado === 'Pendiente' && (
                      <>
                        <button
                          onClick={() => updateConsignmentStatus(c.id, 'Aceptado')}
                          className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-neutral-950 border border-emerald-500/20 py-2.5 px-4 rounded-xl text-center font-sans text-xs uppercase font-bold transition-all cursor-pointer"
                          id={`prop-accept-${c.id}`}
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => updateConsignmentStatus(c.id, 'Rechazado')}
                          className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 py-2.5 px-3 rounded-xl transition-all font-sans text-xs uppercase font-bold cursor-pointer"
                          id={`prop-reject-${c.id}`}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

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

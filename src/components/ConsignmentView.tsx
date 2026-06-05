/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { ShieldCheck, Camera, HelpCircle, FileText, Send, SendHorizontal, CheckCircle2, DollarSign, Sparkles } from 'lucide-react';

export const ConsignmentView: React.FC = () => {
  const { addConsignment } = useInventory();
  
  // Form values
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState<number>(2020);
  const [version, setVersion] = useState('');
  const [kilometraje, setKilometraje] = useState<number>(50000);
  const [precioPretendido, setPrecioPretendido] = useState<number>(20000);
  
  // Submission success tracker
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !celular || !marca || !modelo) {
      alert('Por favor complete todos los datos obligatorios.');
      return;
    }

    addConsignment({
      nombre,
      celular,
      marca,
      modelo,
      anio,
      version,
      kilometraje,
      precioPretendido
    });

    setSubmitted(true);
  };

  const resetForm = () => {
    setNombre('');
    setCelular('');
    setMarca('');
    setModelo('');
    setAnio(2020);
    setVersion('');
    setKilometraje(50000);
    setPrecioPretendido(20000);
    setSubmitted(false);
  };

  return (
    <div className="bg-brand-dark text-white min-h-[calc(100vh-5rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl w-full">
        
        {/* Banner Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-sans uppercase tracking-[0.2em] mb-4 font-bold">
            SERVICIOS PROFESIONALES DE CONSIGNACIÓN
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl uppercase tracking-wider text-white mb-4 leading-none">
            Vendé Tu Auto Al Mejor Precio
          </h1>
          <p className="font-sans text-sm text-neutral-400 font-medium leading-relaxed uppercase">
            Consignación Digital Premium: Nos encargamos de todo de principio a fin para que cobres el valor justo del mercado sin moverte de tu casa ni lidiar con visitas de extraños.
          </p>
        </div>

        {/* 4 Steps Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          
          {/* Step 1 */}
          <div className="flex flex-col bg-brand-card/60 border border-neutral-900 rounded-2xl p-6 relative">
            <span className="font-display text-7xl font-black text-brand-primary/10 absolute top-2 right-4">01</span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary mb-5 relative z-10">
              <Camera className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl text-white uppercase tracking-wider mb-2 relative z-10">
              Producción Visual
            </h3>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed uppercase">
              Tomamos fotografías HD en nuestro local o a domicilio y videos detallados realzando las virtudes estéticas y mecánicas de tu unidad.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col bg-brand-card/60 border border-neutral-900 rounded-2xl p-6 relative">
            <span className="font-display text-7xl font-black text-brand-primary/10 absolute top-2 right-4">02</span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary mb-5 relative z-10">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl text-white uppercase tracking-wider mb-2 relative z-10">
              Publicación Masiva
            </h3>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed uppercase">
              Anunciamos tu vehículo con pauta patrocinada en los portales líderes (MercadoLibre, Facebook, Autofoco) y campañas orgánicas en nuestras redes.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col bg-brand-card/60 border border-neutral-900 rounded-2xl p-6 relative">
            <span className="font-display text-7xl font-black text-brand-primary/10 absolute top-2 right-4">03</span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary mb-5 relative z-10">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl text-white uppercase tracking-wider mb-2 relative z-10">
              Gestión Comercial
            </h3>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed uppercase">
              Filtramos consultas, gestionamos llamados y coordinamos visitas solo con interesados de solvencia confirmada. Vos no mostrás tu auto.
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col bg-brand-card/60 border border-neutral-900 rounded-2xl p-6 relative">
            <span className="font-display text-7xl font-black text-brand-primary/10 absolute top-2 right-4">04</span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary mb-5 relative z-10">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl text-white uppercase tracking-wider mb-2 relative z-10">
              Cierre de Venta Seguro
            </h3>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed uppercase">
              Asistimos en la gestoría integral, confección del boleto de compra-venta y validamos la transferencia bancaria con la máxima tranquilidad.
            </p>
          </div>

        </div>

        {/* Dynamic Dual split: Left Info / Right Proposal Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-display text-3xl uppercase tracking-wider text-white mb-4">
              ¿Por qué elegirnos frente a la venta particular?
            </h2>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed uppercase">
              La venta de un vehículo particular suele ser un proceso desgastante y riesgoso en materia de seguridad. D'Amico Automotores te aporta el respaldo comercial, la solidez financiera y una vitrina con alta exposición de marca para acelerar la venta.
            </p>

            {/* Bullet points benefits */}
            <div className="space-y-4 pt-4 border-t border-neutral-900">
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-display text-lg text-white uppercase">Gestoría Integral PROPIA</h4>
                  <p className="font-sans text-xs text-neutral-400 uppercase">Nosotros resolvemos toda la burocracia, informes de dominio, multas y patentes de forma instantánea.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-display text-lg text-white uppercase">Gestión de permutas completas</h4>
                  <p className="font-sans text-xs text-neutral-400 uppercase">Si un interesado quiere dejar su auto usado de menor valor, nosotros podemos tomarlo para asegurar que cobres tu efectivo de inmediato.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-display text-lg text-white uppercase">Comisión Fija Transparente</h4>
                  <p className="font-sans text-xs text-neutral-400 uppercase">Sin sorpresas ni cargos ocultos. Acordamos el margen por escrito de manera previa.</p>
                </div>
              </div>
            </div>

            {/* Quick Contact Line */}
            <div className="bg-brand-card/40 border border-neutral-900 rounded-2xl p-6 mt-8">
              <h4 className="font-display text-lg tracking-wider text-brand-primary uppercase mb-2">Canal de Contacto Directo</h4>
              <p className="font-sans text-xs text-neutral-400 mb-4 uppercase">¿Preferís conversar directamente con un tasador? Escribinos ahora por WhatsApp.</p>
              <a
                href="https://wa.me/5491133036614?text=Hola,%20quisiera%20conversar%20con%20un%20tasador%20de%20D'Amico%20Automotores%20por%20consignacion."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-display text-sm uppercase rounded-xl py-3 px-5 transition-colors w-full tracking-wider"
                id="direct-consignment-wa-btn"
              >
                <Send className="h-4 w-4 text-white" />
                Contactar Tasador Vía WhatsApp
              </a>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7">
            
            {!submitted ? (
              <form 
                onSubmit={handleSubmit}
                className="bg-brand-card/70 border border-neutral-800/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black relative"
                id="consignment-form"
              >
                <div className="absolute top-0 right-0 h-32 w-32 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-primary/5 via-transparent to-transparent opacity-60"></div>
                
                <h3 className="font-display text-2xl uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-primary" />
                  Formulario de Solicitud de Cotización
                </h3>

                <p className="font-sans text-xs text-neutral-400 leading-relaxed mb-6 uppercase">
                  Complete los datos de su vehículo para recibir de forma gratuita una tasación aproximada ajustada a valores del mercado actual.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Nombre */}
                  <div className="sm:col-span-2">
                    <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block mb-2 font-bold">Nombre y Apellido *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Juan Antonio Pérez"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full bg-[#161616] border border-neutral-800 hover:border-neutral-700 focus:border-brand-primary focus:outline-none rounded-xl py-3 px-4 text-xs font-sans placeholder-neutral-600 transition-all text-white"
                      id="input-consign-name"
                    />
                  </div>

                  {/* Celular */}
                  <div className="sm:col-span-2">
                    <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block mb-2 font-bold">WhatsApp de Contacto *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="Ej: +54 9 11 1234 5678"
                      value={celular}
                      onChange={(e) => setCelular(e.target.value)}
                      className="w-full bg-[#161616] border border-neutral-800 hover:border-neutral-700 focus:border-brand-primary focus:outline-none rounded-xl py-3 px-4 text-xs font-sans placeholder-neutral-600 transition-all text-white"
                      id="input-consign-phone"
                    />
                  </div>

                  {/* Marca */}
                  <div>
                    <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block mb-2 font-bold">Marca del Vehículo *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Ford, Volkswagen, Toyota..."
                      value={marca}
                      onChange={(e) => setMarca(e.target.value)}
                      className="w-full bg-[#161616] border border-neutral-800 hover:border-neutral-700 focus:border-brand-primary focus:outline-none rounded-xl py-3 px-4 text-xs font-sans placeholder-neutral-600 transition-all text-white"
                      id="input-consign-brand"
                    />
                  </div>

                  {/* Modelo */}
                  <div>
                    <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block mb-2 font-bold">Modelo *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Ranger, Amarok, Hilux..."
                      value={modelo}
                      onChange={(e) => setModelo(e.target.value)}
                      className="w-full bg-[#161616] border border-neutral-800 hover:border-neutral-700 focus:border-brand-primary focus:outline-none rounded-xl py-3 px-4 text-xs font-sans placeholder-neutral-600 transition-all text-white"
                      id="input-consign-model"
                    />
                  </div>

                  {/* Año */}
                  <div>
                    <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block mb-2 font-bold">Año de fabricación</label>
                    <input 
                      type="number" 
                      min="2010"
                      max="2026"
                      value={anio}
                      onChange={(e) => setAnio(Number(e.target.value))}
                      className="w-full bg-[#161616] border border-neutral-800 hover:border-neutral-700 focus:border-brand-primary focus:outline-none rounded-xl py-3 px-4 text-xs font-sans transition-all text-white"
                      id="input-consign-year"
                    />
                  </div>

                  {/* Versión */}
                  <div>
                    <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block mb-2 font-bold">Versión Exacta</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Limited 3.2 AWD, Lariat..."
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      className="w-full bg-[#161616] border border-neutral-800 hover:border-neutral-700 focus:border-brand-primary focus:outline-none rounded-xl py-3 px-4 text-xs font-sans placeholder-neutral-600 transition-all text-white"
                      id="input-consign-version"
                    />
                  </div>

                  {/* Kilometraje */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block font-bold">Kilometraje</label>
                      <span className="font-display text-base text-brand-primary font-bold">{kilometraje.toLocaleString('de-DE')} KM</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="250000"
                      step="5000"
                      value={kilometraje}
                      onChange={(e) => setKilometraje(Number(e.target.value))}
                      className="w-full accent-brand-primary bg-neutral-800 rounded-lg cursor-pointer h-1.5"
                      id="input-consign-km-range"
                    />
                  </div>

                  {/* Precio pretendido */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-sans text-[11px] text-neutral-400 uppercase tracking-wider block font-bold">Precio Pretendido (USD)</label>
                      <span className="font-display text-base text-emerald-400 font-bold">USD {precioPretendido.toLocaleString('de-DE')}</span>
                    </div>
                    <input 
                      type="range"
                      min="5000"
                      max="150000"
                      step="1000"
                      value={precioPretendido}
                      onChange={(e) => setPrecioPretendido(Number(e.target.value))}
                      className="w-full accent-brand-primary bg-neutral-800 rounded-lg cursor-pointer h-1.5"
                      id="input-consign-price-range"
                    />
                  </div>

                </div>

                <div className="mt-8 border-t border-neutral-800/60 pt-6">
                  <button
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-brand-primary/95 text-white font-display text-lg uppercase tracking-wider py-4 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    id="submit-proposal-btn"
                  >
                    <span>Enviar Solicitud a Cotización</span>
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* Success Submission Card */
              <div 
                className="bg-brand-card/70 border border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-xl shadow-black text-center flex flex-col items-center justify-center"
                id="consignment-success-card"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-6">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                
                <h3 className="font-display text-3xl uppercase tracking-wider text-white mb-3">
                  ¡Solicitud Registrada con Éxito!
                </h3>
                
                <p className="font-sans text-sm text-neutral-400 leading-relaxed max-w-md mb-8 uppercase">
                  Muchas gracias <strong className="text-white">{nombre}</strong>. Tu propuesta para el <strong className="text-brand-primary">{marca} {modelo} {version}</strong> ha quedado asentada en nuestra base de datos.
                </p>

                <div className="bg-[#161616] border border-neutral-900 rounded-2xl p-4 w-full max-w-sm text-left mb-8 space-y-2 text-xs font-sans text-neutral-400 uppercase">
                  <div><span className="text-neutral-650 font-bold">ID PROPUESTA:</span> #{Math.floor(Math.random() * 89999 + 10000)}</div>
                  <div><span className="text-neutral-650 font-bold">UNIDAD:</span> {marca} {modelo} ({anio})</div>
                  <div><span className="text-neutral-650 font-bold">PRECIO PREVISTO:</span> USD {precioPretendido.toLocaleString('de-DE')}</div>
                  <div><span className="text-neutral-650 font-bold">ATENCIÓN:</span> Un asesor comercial revisará su propuesta y se comunicará vía WhatsApp al <span className="text-white font-bold">{celular}</span> en menos de 24 hs.</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                  <button 
                    onClick={resetForm}
                    className="flex-grow border border-neutral-800 text-neutral-400 hover:text-white rounded-xl py-3 px-5 text-xs font-sans uppercase tracking-wider hover:border-neutral-700 transition-colors cursor-pointer font-bold"
                    id="reset-consignment-form-btn"
                  >
                    Cargar otro vehículo
                  </button>
                  <a
                    href={`https://wa.me/5491133036614?text=Hola!%20Acabo%20de%20enviar%20el%20formulario%20de%20consignacion%20en%20el%20portal%20por%20mi%20auto%20${marca}%20${modelo}%20${anio}.%20Quisiera%20saber%20el%20estado.%20Mi%20nombre%20es%20${nombre}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-grow bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl py-3 px-5 text-xs font-sans font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    id="success-whatsapp-contact-btn"
                  >
                    <Send className="h-4 w-4" />
                    Chatear por WhatsApp
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

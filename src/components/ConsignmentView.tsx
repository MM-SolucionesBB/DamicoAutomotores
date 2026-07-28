/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Camera, HelpCircle, SendHorizontal, Sparkles } from 'lucide-react';

export const ConsignmentView: React.FC = () => {
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
          <a
            href="https://wa.me/5492915367498?text=Hola%20Federico%2C%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20el%20servicio%20de%20consignaci%C3%B3n%20de%20veh%C3%ADculos.%20%C2%BFPodr%C3%ADamos%20conversar%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-display text-base uppercase tracking-wider py-3.5 px-8 rounded-xl transition-all cursor-pointer shadow-lg shadow-brand-primary/20"
          >
            <SendHorizontal className="h-4 w-4" />
            Contactanos por WhatsApp
          </a>
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
              Producción Profesional
            </h3>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed uppercase">
              Fotos y videos de alta calidad para destacar tu vehículo.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col bg-brand-card/60 border border-neutral-900 rounded-2xl p-6 relative">
            <span className="font-display text-7xl font-black text-brand-primary/10 absolute top-2 right-4">02</span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary mb-5 relative z-10">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl text-white uppercase tracking-wider mb-2 relative z-10">
              Publicación Estratégica
            </h3>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed uppercase">
              Difundimos tu unidad en los principales portales y redes.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col bg-brand-card/60 border border-neutral-900 rounded-2xl p-6 relative">
            <span className="font-display text-7xl font-black text-brand-primary/10 absolute top-2 right-4">03</span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary mb-5 relative z-10">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl text-white uppercase tracking-wider mb-2 relative z-10">
              Gestión de Interesados
            </h3>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed uppercase">
              Filtramos consultas y coordinamos visitas.
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col bg-brand-card/60 border border-neutral-900 rounded-2xl p-6 relative">
            <span className="font-display text-7xl font-black text-brand-primary/10 absolute top-2 right-4">04</span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary mb-5 relative z-10">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl text-white uppercase tracking-wider mb-2 relative z-10">
              Venta Segura
            </h3>
            <p className="font-sans text-xs text-neutral-400 leading-relaxed uppercase">
              Cerramos la operación con toda la seguridad y transparencia.
            </p>
          </div>

        </div>

        {/* Info Section */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl uppercase tracking-wider text-white mb-4">
            ¿Por qué no venderlo por tu cuenta?
          </h2>
          <p className="font-sans text-xs text-neutral-400 leading-relaxed uppercase">
            Vender un vehículo por cuenta propia implica tiempo, consultas, negociaciones y trámites. Nosotros nos ocupamos de todo para que vos solo tengas que decidir cuándo vender.
          </p>

          <div className="flex flex-col items-center gap-4 pt-4 border-t border-neutral-900 mt-6">
            <div className="w-full max-w-md bg-brand-card/40 border border-neutral-800 rounded-2xl p-6 grid grid-cols-[auto_1fr] items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                ✓
              </div>
              <div className="text-center">
                <h4 className="font-display text-lg text-white uppercase">Gestoría integral</h4>
                <p className="font-sans text-xs text-neutral-400 uppercase">Nos ocupamos de toda la documentación.</p>
              </div>
            </div>

            <div className="w-full max-w-md bg-brand-card/40 border border-neutral-800 rounded-2xl p-6 grid grid-cols-[auto_1fr] items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                ✓
              </div>
              <div className="text-center">
                <h4 className="font-display text-lg text-white uppercase">Compradores filtrados</h4>
                <p className="font-sans text-xs text-neutral-400 uppercase">Coordinamos únicamente visitas calificadas.</p>
              </div>
            </div>

            <div className="w-full max-w-md bg-brand-card/40 border border-neutral-800 rounded-2xl p-6 grid grid-cols-[auto_1fr] items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                ✓
              </div>
              <div className="text-center">
                <h4 className="font-display text-lg text-white uppercase">Comisión transparente</h4>
                <p className="font-sans text-xs text-neutral-400 uppercase">Sin cargos ocultos.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

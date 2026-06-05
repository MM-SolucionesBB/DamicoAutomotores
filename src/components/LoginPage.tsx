import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { Car, Lock, Mail, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const { setActiveTab, setAdminViewMode } = useInventory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setAdminViewMode(true);
      setActiveTab('admin');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-brand-card/60 border border-neutral-900 rounded-3xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-2xl bg-brand-primary flex items-center justify-center">
              <Car className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">Admin</h1>
          <p className="font-sans text-xs text-neutral-400 mt-1 uppercase tracking-wider">
            Iniciar sesión en el panel de gestión
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-rose-400 font-sans text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="font-sans text-[11px] text-neutral-400 uppercase block mb-1.5 font-bold">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="email"
                required
                placeholder="admin@damicoautomotores.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#161616] border border-neutral-800 focus:border-brand-primary rounded-xl py-3 pl-10 pr-3 focus:outline-none placeholder-neutral-600 text-white font-sans text-sm"
              />
            </div>
          </div>

          <div>
            <label className="font-sans text-[11px] text-neutral-400 uppercase block mb-1.5 font-bold">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161616] border border-neutral-800 focus:border-brand-primary rounded-xl py-3 pl-10 pr-3 focus:outline-none placeholder-neutral-600 text-white font-sans text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 text-white font-display text-lg uppercase tracking-wider py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

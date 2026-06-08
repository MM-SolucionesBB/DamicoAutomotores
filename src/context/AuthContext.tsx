import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  email: string;
  id: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('damico_auth_token');
    const storedUser = localStorage.getItem('damico_auth_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('damico_auth_token');
        localStorage.removeItem('damico_auth_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return data.error || 'Credenciales inválidas.';
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('damico_auth_token', data.token);
      localStorage.setItem('damico_auth_user', JSON.stringify(data.user));
      return null;
    } catch (err) {
      console.error('Login error:', err);
      return 'Error de conexión con el servidor.';
    }
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('damico_auth_token');
    localStorage.removeItem('damico_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

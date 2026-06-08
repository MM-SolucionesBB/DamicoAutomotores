import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const isEnvConfigured = 
  typeof supabaseUrl === 'string' && 
  typeof supabaseKey === 'string' && 
  supabaseUrl.trim() !== '' && 
  supabaseKey.trim() !== '' && 
  supabaseUrl !== 'undefined' && 
  supabaseKey !== 'undefined';

class MockSupabaseClient {
  auth = {
    getSession: async () => ({
      data: { session: null },
      error: null,
    }),
    onAuthStateChange: (callback: any) => {
      // Set up a mock subscription
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    signInWithPassword: async ({ email, password }: any) => {
      // Mock login for developer testing
      if (email === 'admin@damicoautomotores.com') {
        return {
          data: {
            user: { id: 'mock-admin-id', email },
            session: { access_token: 'mock-token', user: { id: 'mock-admin-id', email } }
          },
          error: null
        };
      }
      return {
        data: { user: null, session: null },
        error: { message: 'Desarrollo local: Utilizá admin@damicoautomotores.com para ingresar.' }
      };
    },
    signOut: async () => ({ error: null })
  };

  from(table: string) {
    const mockQueryBuilder = {
      select: () => mockQueryBuilder,
      order: () => mockQueryBuilder,
      insert: () => mockQueryBuilder,
      single: () => mockQueryBuilder,
      update: () => mockQueryBuilder,
      delete: () => mockQueryBuilder,
      eq: () => mockQueryBuilder,
      then: (onfulfilled: any) => {
        // Return an error so context uses its localStorage/mockData fallback
        return Promise.resolve(
          onfulfilled({
            data: null,
            error: { message: 'Supabase no configurado. Utilizando datos locales.' }
          })
        );
      }
    };
    return mockQueryBuilder as any;
  }
}

export const supabase = isEnvConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : (new MockSupabaseClient() as any);


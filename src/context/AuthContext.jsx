import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../services/mockApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(api.getCurrentUser());
    setLoading(false);
  }, []);

  async function signIn(email, password) {
    const loggedUser = await api.login(email, password);
    setUser(loggedUser);
    return loggedUser;
  }

  async function signUp(data) {
    const newUser = await api.register(data);
    setUser(newUser);
    return newUser;
  }

  function signOut() {
    api.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  return ctx;
}

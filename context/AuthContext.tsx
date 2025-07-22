import { AuthContextType } from '@/types/dataType';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';


const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  login: async () => {}, 
  logout: async () => {} 
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      try {
        const res = await axios.get('http://<your-api>/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axios.post('http://<your-api>/auth/login', { email, password });
    await SecureStore.setItemAsync('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
    {children}
  </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

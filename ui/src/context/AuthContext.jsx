import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('webeans_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('webeans_user');
    if (savedUser && token) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('webeans_token', authToken);
    localStorage.setItem('webeans_user', JSON.stringify(userData));
    console.log('[AUTH] Login saved user:', userData.username, '| role:', userData.role);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('webeans_token');
    localStorage.removeItem('webeans_user');
    console.log('[UI] [AUTH] Logout session deleted');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
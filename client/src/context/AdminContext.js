import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skillyer_admin_token'));

  useEffect(() => {
    const stored = localStorage.getItem('skillyer_admin_user');
    if (stored && token) setAdmin(JSON.parse(stored));
  }, [token]);

  const login = (adminData, authToken) => {
    setAdmin(adminData);
    setToken(authToken);
    localStorage.setItem('skillyer_admin_token', authToken);
    localStorage.setItem('skillyer_admin_user', JSON.stringify(adminData));
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('skillyer_admin_token');
    localStorage.removeItem('skillyer_admin_user');
  };

  return (
    <AdminContext.Provider value={{ admin, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);

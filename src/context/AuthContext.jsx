import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for remembered session
    const savedUser = localStorage.getItem('aura_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, rememberMe) => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        if (email === 'intern@demo.com' && password === 'intern123') {
          const userData = { email, lastLogin: new Date().toISOString() };
          setUser(userData);
          if (rememberMe) {
            localStorage.setItem('aura_session', JSON.stringify(userData));
          }
          resolve(userData);
        } else {
          reject(new Error('Invalid email or password. Please try again.'));
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aura_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
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

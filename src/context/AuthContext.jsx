import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localSession = localStorage.getItem('aura_session');
    const sessionData = sessionStorage.getItem('aura_session');

    if (localSession) {
      try {
        const parsedData = JSON.parse(localSession);
        if (parsedData.expiry && Date.now() > parsedData.expiry) {
          localStorage.removeItem('aura_session');
        } else {
          setUser(parsedData);
        }
      } catch (e) {
        localStorage.removeItem('aura_session');
      }
    } else if (sessionData) {
      setUser(JSON.parse(sessionData));
    }

    setLoading(false);
  }, []);

  const login = (email, password, rememberMe) => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        if (email === 'intern@demo.com' && password === 'intern123') {
          const userData = { email, lastLogin: new Date().toISOString() };
          
          if (rememberMe) {
            userData.expiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
            localStorage.setItem('aura_session', JSON.stringify(userData));
          } else {
            sessionStorage.setItem('aura_session', JSON.stringify(userData));
          }
          
          setUser(userData);
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
    sessionStorage.removeItem('aura_session');
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

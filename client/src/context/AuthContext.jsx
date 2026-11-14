import { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Check localStorage on initial load to keep user logged in on refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ss_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('ss_user', JSON.stringify(foundUser));
      return { success: true, role: foundUser.role };
    }
    return { success: false, message: 'Invalid email or password.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ss_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use auth in any component
export const useAuth = () => useContext(AuthContext);

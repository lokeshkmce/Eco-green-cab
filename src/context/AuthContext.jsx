import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  // Load from local storage on mount (optional, just to mock persistence during dev)
  useEffect(() => {
    const savedUser = localStorage.getItem('eco_green_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (userData) => {
    // userData should look like: { name: "Lokesh", email: "user@example.com", roles: ["renter"] }
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('eco_green_user', JSON.stringify(userData));
  };

  const addRole = (newRole) => {
    if (user && !user.roles.includes(newRole)) {
      const updatedUser = { ...user, roles: [...user.roles, newRole] };
      setUser(updatedUser);
      localStorage.setItem('eco_green_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('eco_green_user');
  };

  const updateUser = (newData) => {
    if (user) {
      const updatedUser = { ...user, ...newData };
      setUser(updatedUser);
      localStorage.setItem('eco_green_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, addRole, updateUser, isAuthModalOpen, setAuthModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

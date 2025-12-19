import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; 
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check if user is already logged in on App Start
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data");
        localStorage.removeItem('user'); 
        localStorage.removeItem('token'); // Also clear token if data is bad
      }
    }
    setLoading(false);
  }, []); 

  // 2. Login Function
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password }); 
      
      const backendUser = data.user; 
      
      const userData = {
        id: backendUser._id,
        fullName: backendUser.full_name, 
        email: backendUser.email,
        phone: backendUser.phone,
        role: backendUser.role,
        department: backendUser.department,
        isActive: backendUser.is_active, 
        permissions: {
            canBookLabs: backendUser.permissions?.can_book_labs || false,
            canBookAuditorium: backendUser.permissions?.can_book_auditorium || false
        }
      };
      
      // Save to LocalStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData)); 
      
      setUser(userData);
      
      toast.success(`Welcome back, ${userData.fullName}!`);
      return true; 

    } catch (error) {
      console.error("Login Failed:", error);
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return false; 
    }
  };

  // 3. Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success("Logged out successfully");
    window.location.href = "/login"
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
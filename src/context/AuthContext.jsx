import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    
    // Check URL for OAuth success
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth_success') === 'true') {
      console.log("🎯 OAuth success detected");
      window.history.replaceState({}, document.title, window.location.pathname);
      await fetchUserFromBackend();
      setLoading(false);
      return;
    }

    // Check for existing session via cookie (backend will validate)
    try {
      console.log("📡 Checking authentication status...");
      const response = await authAPI.getCurrentUser();
      if (response.data && response.data.email) {
        const user = {
          email: response.data.email,
          name: response.data.name || response.data.email.split('@')[0]
        };
        console.log("✅ Session found:", user);
        setSessionState(user);
      }
    } catch (error) {
      // No session, that's fine - user can still use calculator
      console.log("ℹ️ No active session - public access mode");
      setSessionState(null);
    }
    setLoading(false);
  };

  const fetchUserFromBackend = async () => {
    try {
      console.log("📡 Fetching user from backend...");
      const response = await axios.get('http://localhost:8080/api/auth/me', {
        withCredentials: true
      });
      
      console.log("📡 Backend response:", response.data);
      
      if (response.data && response.data.email) {
        const user = {
          email: response.data.email,
          name: response.data.name || response.data.email.split('@')[0]
        };
        console.log("✅ User set:", user);
        setSessionState(user);
        toast.success('Login successful!');
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to fetch user:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  async function login(email, password) {
    try {
      const response = await authAPI.login({ email, password });
      if (response.data.success) {
        // Don't store token in localStorage anymore - use cookie only
        const user = { 
          email: response.data.email, 
          name: response.data.name || email.split('@')[0] 
        };
        setSessionState(user);
        toast.success('Login successful!');
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return false;
    }
  }

  async function signup(name, email, password, mobile) {
    try {
      const response = await authAPI.signup({ name, email, password, mobile });
      if (response.data.success) {
        toast.success('Account created! Please login.');
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Signup failed';
      toast.error(message);
      return false;
    }
  }

  async function logout() {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setSessionState(null);
    toast.info('Logged out');
  }

  return (
    <AuthContext.Provider value={{ session, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
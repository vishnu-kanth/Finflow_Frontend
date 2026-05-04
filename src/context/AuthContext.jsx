import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        console.log("[AUTH-CONTEXT] Found token in localStorage, attempting to restore session...");
        try {
          // Decode token to get basic info
          const decoded = jwtDecode(token);
          console.log("[AUTH-CONTEXT] Token decoded successfully. User email:", decoded.sub);
          
          // Optionally fetch full profile
          try {
            const profile = await authService.getMe();
            console.log("[AUTH-CONTEXT] Profile fetched successfully for:", profile.email);
            setUser({ ...decoded, ...profile });
          } catch (e) {
            console.error("[AUTH-CONTEXT] Failed to fetch full profile. Error:", e.response?.status, e.response?.data);
            console.warn("[AUTH-CONTEXT] Clearing stale or invalid token.");
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error("[AUTH-CONTEXT] Invalid token format. Error:", error);
          localStorage.removeItem('token');
        }
      } else {
        console.log("[AUTH-CONTEXT] No token found in localStorage.");
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem('token', data.token); // Crucial to save before calling getMe
    const decoded = jwtDecode(data.token);
    
    try {
      const profile = await authService.getMe();
      setUser({ ...decoded, ...profile });
    } catch (e) {
      console.error("Failed to fetch full profile after login", e);
      // We still set user using decoded token as a fallback so login isn't completely broken if /me fails temporarily,
      // BUT for strictness, the user requested: if request fails -> remove token.
      // Wait, the prompt says "If request fails -> remove token and logout user" for initAuth. For login, it's safer to either succeed or fail entirely.
      // Let's set it based on the profile if successful, otherwise clear it.
      localStorage.removeItem('token');
      throw new Error("Failed to load user profile");
    }
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn("[AUTH-CONTEXT] Backend logout call failed, but clearing local state anyway.");
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  if (loading) {
    return <div className="auth-container"><div className="spinner"></div></div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

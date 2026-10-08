import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToAuthState, loginUser, registerUser, logoutUser } from '../services/auth';
import { getMe } from '../services/api';
import { Loader2 } from 'lucide-react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [appProfile, setAppProfile] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [isProfileMissing, setIsProfileMissing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await getMe();
      setAppProfile(res.data.user);
      setProfileError(null);
      setIsProfileMissing(false);
      return res.data.user;
    } catch (err) {
      if (err.status === 404) {
        setIsProfileMissing(true);
        setProfileError(null);
      } else {
        setIsProfileMissing(false);
        setProfileError(err.message || "Failed to load application profile.");
      }
      setAppProfile(null);
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      if (currentUser) {
        try {
          await fetchProfile();
        } catch {
          // Error state is handled in fetchProfile
        }
      } else {
        setAppProfile(null);
        setProfileError(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    return await loginUser(email, password);
  };

  const register = async (email, password, name) => {
    return await registerUser(email, password, name);
  };

  const logout = async () => {
    return await logoutUser();
  };

  const value = {
    user,
    appProfile,
    profileError,
    isProfileMissing,
    loading,
    login,
    register,
    logout,
    fetchProfile
  };

  // Prevent flicker during initial auth state resolution
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFC] flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="animate-spin h-12 w-12 text-brand-donor mb-4" />
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

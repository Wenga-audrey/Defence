import { useState, useEffect } from 'react';
import { api, getAuthToken, removeAuthToken } from '@shared/api';
import { API_CONFIG } from '@shared/config';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  currentLevel?: string;
  examTargets?: string[];
  learningGoals?: string;
  availableHours?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Verify token and get user profile
    const verifyToken = async () => {
      try {
        const response = await api.get<{ user: User; valid: boolean }>(API_CONFIG.ENDPOINTS.USERS.PROFILE);
        if (response.success && response.data?.user) {
          setState({
            user: response.data.user,
            token,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          removeAuthToken();
          setState(prev => ({ ...prev, token: null, isLoading: false }));
        }
      } catch (error) {
        removeAuthToken();
        setState(prev => ({ ...prev, token: null, isLoading: false }));
      }
    };

    verifyToken();
  }, []);

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem('userRole');
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
    window.location.href = '/signin';
  };

  return { ...state, logout };
}

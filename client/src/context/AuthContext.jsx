import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { apiBaseUrl } from '../data/siteContent';

const AuthContext = createContext(null);
const storageKey = 'marketing-sales-auth-token';

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(storageKey) || '');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem(storageKey)));

  const clearAuth = () => {
    localStorage.removeItem(storageKey);
    setToken('');
    setUser(null);
  };

  const fetchCurrentUser = async (authToken = token) => {
    if (!authToken) {
      setAuthLoading(false);
      return null;
    }

    setAuthLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to load your account.');
      }

      setUser(result.user);
      return result.user;
    } catch (_error) {
      clearAuth();
      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setAuthLoading(false);
    }
  }, [token]);

  const authenticate = async (endpoint, payload) => {
    const response = await fetch(`${apiBaseUrl}/auth/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Authentication failed.');
    }

    localStorage.setItem(storageKey, result.token);
    setToken(result.token);
    const currentUser = await fetchCurrentUser(result.token);
    return currentUser || result.user;
  };

  const register = (payload) => authenticate('register', payload);
  const login = (payload) => authenticate('login', payload);
  const logout = () => clearAuth();

  const value = useMemo(
    () => ({
      user,
      token,
      authLoading,
      isAuthenticated: Boolean(user && token),
      register,
      login,
      logout,
      fetchCurrentUser
    }),
    [user, token, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
};

export { AuthProvider, useAuth };

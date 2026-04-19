import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { API } from '../data/siteContent';

const AuthContext = createContext(null);
const storageKey = 'marketing-sales-auth-token';

const parseJsonSafely = async (response, requestLabel) => {
  const rawText = await response.text();
  const trimmedText = rawText.trim();

  console.debug(`[Auth] ${requestLabel} response`, {
    url: response.url,
    status: response.status,
    ok: response.ok,
    hasBody: Boolean(trimmedText),
    contentType: response.headers.get('content-type') || ''
  });

  if (!trimmedText) {
    return {};
  }

  try {
    return JSON.parse(trimmedText);
  } catch (error) {
    console.error(`[Auth] ${requestLabel} returned invalid JSON`, {
      url: response.url,
      status: response.status,
      bodyPreview: trimmedText.slice(0, 240),
      error
    });

    throw new Error('The server returned an invalid response. Please try again.');
  }
};

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
      const response = await fetch(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      const result = await parseJsonSafely(response, 'fetchCurrentUser');

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
    const requestUrl = `${API}/auth/${endpoint}`;

    console.debug('[Auth] authenticate request', {
      endpoint,
      url: requestUrl,
      method: 'POST',
      hasEmail: Boolean(payload?.email),
      hasPassword: Boolean(payload?.password)
    });

    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await parseJsonSafely(response, `authenticate:${endpoint}`);

      if (!response.ok) {
        throw new Error(result.message || 'Authentication failed.');
      }

      localStorage.setItem(storageKey, result.token);
      setToken(result.token);
      const currentUser = await fetchCurrentUser(result.token);
      return currentUser || result.user;
    } catch (error) {
      if (error instanceof TypeError) {
        console.error('[Auth] network error', {
          endpoint,
          url: requestUrl,
          error
        });

        throw new Error('Unable to reach the server. Please check that the backend is running on http://localhost:5000.');
      }

      throw error;
    }
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

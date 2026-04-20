import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { API, API_BASE } from '../data/siteContent';

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
    if (!API) {
      throw new Error('Server configuration is missing. Please try again later.');
    }

    const apiUrl = API_BASE;
    const requestUrl = `${apiUrl}/api/auth/${endpoint}`;
    const isFormData = payload instanceof FormData;

    console.debug('[Auth] authenticate request', {
      endpoint,
      apiUrl,
      url: requestUrl,
      method: 'POST',
      hasEmail: isFormData ? payload.get('email') : Boolean(payload?.email),
      hasPassword: isFormData ? Boolean(payload.get('password')) : Boolean(payload?.password)
    });

    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: isFormData
          ? {}
          : {
            'Content-Type': 'application/json'
          },
        body: isFormData ? payload : JSON.stringify(payload)
      });

      const result = await parseJsonSafely(response, `authenticate:${endpoint}`);

      if (!response.ok) {
        if (response.status === 400 || response.status === 401) {
          throw new Error(result.message || 'Invalid email or password.');
        }

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

        throw new Error(
          import.meta.env.DEV
            ? `Unable to connect to server. Please check that the backend is running on ${API_BASE}.`
            : 'Unable to connect to server. Please try again later.'
        );
      }

      throw error;
    }
  };

  const register = (payload) => authenticate('register', payload);
  const login = (payload) => authenticate('login', payload);
  const updateProfile = async (payload) => {
    if (!token) {
      throw new Error('Please log in again to update your profile.');
    }

    const response = await fetch(`${API}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const result = await parseJsonSafely(response, 'updateProfile');

    if (!response.ok) {
      throw new Error(result.message || 'Unable to update your profile.');
    }

    setUser(result.user);
    return result.user;
  };
  const uploadResume = async (resumeFile) => {
    if (!token) {
      throw new Error('Please log in again to upload your resume.');
    }

    const payload = new FormData();
    payload.append('resume', resumeFile);

    const response = await fetch(`${API}/auth/resume`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: payload
    });

    const result = await parseJsonSafely(response, 'uploadResume');

    if (!response.ok) {
      throw new Error(result.message || 'Unable to upload resume.');
    }

    setUser(result.user);
    return result.user;
  };
  const logout = () => clearAuth();

  const value = useMemo(
    () => ({
      user,
      token,
      authLoading,
      isAuthenticated: Boolean(user && token),
      register,
      login,
      updateProfile,
      uploadResume,
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

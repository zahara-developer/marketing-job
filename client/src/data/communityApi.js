import { API } from './siteContent';

const communityRouteBases = [`${API}/communities`, `${API}/community`];

const parseJsonSafely = async (response) => {
  const text = await response.text();

  if (!text.trim()) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (_error) {
    return {};
  }
};

export const fetchCommunityEndpoint = async (
  endpoint = '',
  options = {},
  fallbackMessage = 'Unable to load community right now.'
) => {
  if (!API) {
    throw new Error(fallbackMessage);
  }

  let lastError = null;

  for (const base of communityRouteBases) {
    try {
      const response = await fetch(`${base}${endpoint}`, options);
      const result = await parseJsonSafely(response);

      if (response.ok) {
        return result;
      }

      if (response.status === 404) {
        lastError = new Error(result.message || fallbackMessage);
        continue;
      }

      throw new Error(result.message || fallbackMessage);
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(fallbackMessage);
};

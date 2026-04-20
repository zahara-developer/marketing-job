import { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, SlidersHorizontal } from 'lucide-react';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import RoleList from '../components/RoleList';
import LoadingSkeletonGrid from '../components/LoadingSkeletonGrid';
import RevealSection from '../components/RevealSection';
import { imageSources } from '../assets/images/imageSources';
import { API } from '../data/siteContent';
import defaultRoles from '../data/defaultRoles';

const fallbackRoles = defaultRoles;

const parseJsonSafely = async (response) => {
  const rawText = await response.text();
  const trimmedText = rawText.trim();

  if (!trimmedText) {
    return [];
  }

  try {
    return JSON.parse(trimmedText);
  } catch (error) {
    console.error('[RolesPage] Invalid JSON response', {
      url: response.url,
      status: response.status,
      bodyPreview: trimmedText.slice(0, 240),
      error
    });

    throw new Error('Invalid roles response from server.');
  }
};

function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resultsNotice, setResultsNotice] = useState('');
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    category: ''
  });

  const categoryOptions = useMemo(
    () => [...new Set(roles.map((role) => role.category).filter(Boolean))].sort(),
    [roles]
  );

  const locationOptions = useMemo(
    () => [...new Set(roles.map((role) => role.location).filter(Boolean))].sort(),
    [roles]
  );

  const filteredRolesState = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    const selectedLocation = filters.location.trim().toLowerCase();
    const selectedCategory = filters.category.trim().toLowerCase();

    const normalize = (value) => `${value || ''}`.trim().toLowerCase();
    const tokenize = (value) =>
      normalize(value)
        .split(/[\s,/+-]+/)
        .map((item) => item.trim())
        .filter(Boolean);

    const keywordTokens = tokenize(keyword);
    const categoryTokens = tokenize(selectedCategory);
    const locationTokens = tokenize(selectedLocation);

    const broadCategoryMap = {
      marketing: ['marketing', 'content', 'brand', 'performance', 'analytics', 'growth', 'seo', 'social', 'lifecycle'],
      sales: ['sales', 'business', 'field', 'account', 'relationship', 'lead', 'inside', 'client', 'revenue']
    };

    const roleText = (role) =>
      [
        role.title,
        role.category,
        role.description,
        role.company,
        role.companyName,
        role.location,
        role.experienceLevel,
        ...(role.skills || [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    const locationMatches = (role) => {
      if (!selectedLocation) {
        return true;
      }

      const haystack = [role.location, role.description, role.company, role.companyName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return locationTokens.every((token) => haystack.includes(token));
    };

    const exactMatches = roles.filter((role) => {
      const haystack = roleText(role);
      const roleCategory = normalize(role.category);

      const keywordOk = keyword
        ? haystack.includes(keyword) || keywordTokens.some((token) => role.title?.toLowerCase().includes(token))
        : true;
      const categoryOk = selectedCategory
        ? roleCategory === selectedCategory ||
          categoryTokens.some((token) => roleCategory === token)
        : true;

      return keywordOk && categoryOk && locationMatches(role);
    });

    if (exactMatches.length) {
      return { roles: exactMatches, notice: '' };
    }

    const partialMatches = roles.filter((role) => {
      const haystack = roleText(role);
      const roleCategory = normalize(role.category);

      const keywordOk = keyword
        ? keywordTokens.some((token) => haystack.includes(token))
        : true;
      const categoryOk = selectedCategory
        ? categoryTokens.some((token) => {
            const relatedTerms = broadCategoryMap[token] || [token];
            return relatedTerms.some((term) => roleCategory.includes(term) || haystack.includes(term));
          })
        : true;
      const locationOk = selectedLocation
        ? locationTokens.some((token) => haystack.includes(token)) || haystack.includes('remote')
        : true;

      return keywordOk && categoryOk && locationOk;
    });

    if (partialMatches.length) {
      return { roles: partialMatches, notice: 'Showing closest available roles' };
    }

    const relatedRoles = roles.filter((role) => {
      const haystack = roleText(role);
      const roleCategory = normalize(role.category);
      const searchTokens = [...keywordTokens, ...categoryTokens];

      if (!searchTokens.length && selectedLocation) {
        return haystack.includes('remote') || role.location;
      }

      return searchTokens.some((token) => {
        const relatedTerms = broadCategoryMap[token] || [token];
        return relatedTerms.some((term) => roleCategory.includes(term) || haystack.includes(term));
      });
    });

    if (relatedRoles.length) {
      return { roles: relatedRoles, notice: 'Showing similar roles' };
    }

    return {
      roles,
      notice: roles.length ? 'Showing all available roles' : ''
    };
  }, [filters, roles]);

  const filteredRoles = filteredRolesState.roles;

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const fetchRoles = async () => {
      const requestUrl = `${API}/roles`;

      try {
        console.debug('[RolesPage] Fetching roles', {
          url: requestUrl,
          method: 'GET'
        });

        const response = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        });

        const data = await parseJsonSafely(response);

        if (!response.ok) {
          console.error('[RolesPage] Roles request failed', {
            url: requestUrl,
            status: response.status,
            data
          });
          throw new Error('Unable to load roles right now.');
        }

        const nextRoles = Array.isArray(data) ? data : [];

        if (!nextRoles.length) {
          console.warn('[RolesPage] Roles response was empty, using fallback roles.', {
            url: requestUrl
          });
          setRoles(fallbackRoles);
          setResultsNotice('');
          setError('');
          return;
        }

        setRoles(nextRoles.length >= 8 ? nextRoles : [...nextRoles, ...fallbackRoles].slice(0, 18));
        setResultsNotice('');
        setError('');
      } catch (fetchError) {
        console.error('[RolesPage] Unable to fetch roles, using fallback roles.', {
          url: requestUrl,
          error: fetchError
        });
        setRoles(fallbackRoles);
        setResultsNotice('');
        setError('');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    setResultsNotice(filteredRolesState.notice);
  }, [filteredRolesState.notice]);

  return (
    <>
      <PageHero
        eyebrow="Featured roles"
        title="Explore the roles that keep brands growing and pipelines moving."
        description="Each role here reflects a distinct mix of creativity, communication, commercial sense, and analytical ownership."
        image={imageSources.hero}
        imageAlt="Sales and marketing professionals collaborating in a meeting"
      />

      <RevealSection className="content-section">
        <SectionHeader
          eyebrow="Role directory"
          title="Browse marketing and sales roles with cleaner filters."
          description="Search by role keyword, refine by location or category, and explore matching opportunities in a more focused directory."
        />
        <form className="roles-filter-bar" onSubmit={handleFilterSubmit}>
          <label className="roles-filter-field roles-filter-field-wide">
            <span>Search roles</span>
            <div className="roles-filter-input">
              <Search size={16} />
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                placeholder="Digital Marketing, SEO, Sales"
              />
            </div>
          </label>

          <label className="roles-filter-field">
            <span>Location</span>
            <div className="roles-filter-input">
              <MapPin size={16} />
              <select name="location" value={filters.location} onChange={handleFilterChange}>
                <option value="">All locations</option>
                {locationOptions.map((locationOption) => (
                  <option key={locationOption} value={locationOption}>
                    {locationOption}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className="roles-filter-field">
            <span>Category</span>
            <div className="roles-filter-input">
              <SlidersHorizontal size={16} />
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All categories</option>
                {categoryOptions.map((categoryOption) => (
                  <option key={categoryOption} value={categoryOption}>
                    {categoryOption}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </form>
        {loading ? <LoadingSkeletonGrid type="role" count={6} /> : null}
        {error ? <p className="status-text error-text">{error}</p> : null}
        {!loading && resultsNotice ? <p className="roles-results-note">{resultsNotice}</p> : null}
        {!loading && filteredRoles.length ? <RoleList roles={filteredRoles} /> : null}
        {!loading && !filteredRoles.length && !roles.length ? (
          <div className="search-results-empty-state">
            <p className="status-text">Roles will appear here as soon as opportunities are available.</p>
          </div>
        ) : null}
      </RevealSection>
    </>
  );
}

export default RolesPage;

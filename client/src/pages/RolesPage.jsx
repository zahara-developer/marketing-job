import { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import RoleList from '../components/RoleList';
import LoadingSkeletonGrid from '../components/LoadingSkeletonGrid';
import RevealSection from '../components/RevealSection';
import { imageSources } from '../assets/images/imageSources';
import { API } from '../data/siteContent';

const fallbackRoles = [
  {
    title: 'Digital Marketing',
    description: 'SEO, social media, campaign execution',
    category: 'Marketing',
    location: 'Remote',
    salaryRange: 'Discuss during application',
    skills: ['SEO', 'Social Media', 'Campaigns']
  },
  {
    title: 'Sales Executive',
    description: 'Lead generation, outreach, conversion',
    category: 'Sales',
    location: 'Remote',
    salaryRange: 'Discuss during application',
    skills: ['Outreach', 'Lead Generation', 'Conversion']
  },
  {
    title: 'Business Development',
    description: 'Partnerships, growth, client acquisition',
    category: 'Growth',
    location: 'Remote',
    salaryRange: 'Discuss during application',
    skills: ['Partnerships', 'Growth', 'Client Acquisition']
  },
  {
    title: 'Brand Management',
    description: 'Brand positioning and campaign planning',
    category: 'Brand',
    location: 'Remote',
    salaryRange: 'Discuss during application',
    skills: ['Branding', 'Positioning', 'Campaign Planning']
  },
  {
    title: 'Marketing Analyst',
    description: 'Reporting, dashboards, campaign insights',
    category: 'Analytics',
    location: 'Remote',
    salaryRange: 'Discuss during application',
    skills: ['Reporting', 'Dashboards', 'Campaign Insights']
  },
  {
    title: 'Inside Sales',
    description: 'Remote sales, follow-ups, pipeline handling',
    category: 'Sales',
    location: 'Remote',
    salaryRange: 'Discuss during application',
    skills: ['Remote Sales', 'Follow-ups', 'Pipeline']
  }
];

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
          setError('');
          return;
        }

        setRoles(nextRoles);
        setError('');
      } catch (fetchError) {
        console.error('[RolesPage] Unable to fetch roles, using fallback roles.', {
          url: requestUrl,
          error: fetchError
        });
        setRoles(fallbackRoles);
        setError('');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

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
          title="A focused view of the core opportunities in marketing and sales."
          description="Browse role paths that can help you understand where your strengths fit best."
        />
        {loading ? <LoadingSkeletonGrid type="role" count={6} /> : null}
        {error ? <p className="status-text error-text">{error}</p> : null}
        {!loading && roles.length ? <RoleList roles={roles} /> : null}
        {!loading && !roles.length ? (
          <p className="status-text">No roles available right now.</p>
        ) : null}
      </RevealSection>
    </>
  );
}

export default RolesPage;

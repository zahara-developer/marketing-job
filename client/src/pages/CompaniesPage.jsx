import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import CompanySpotlight from '../components/CompanySpotlight';
import LoadingSkeletonGrid from '../components/LoadingSkeletonGrid';
import RevealSection from '../components/RevealSection';
import { imageSources } from '../assets/images/imageSources';
import { companyLogoMap } from '../assets/logos/companyLogos';
import { API } from '../data/siteContent';

const fallbackCompanies = [
  {
    name: 'Google',
    logo: companyLogoMap.Google,
    description: 'Global technology company focused on search, advertising, and digital growth.',
    shortDescription: 'Global technology company focused on search, advertising, and digital growth.',
    industry: 'Technology',
    location: 'Mountain View, USA'
  },
  {
    name: 'Microsoft',
    logo: companyLogoMap.Microsoft,
    description: 'Cloud and productivity company building strong commercial sales and brand teams.',
    shortDescription: 'Cloud and productivity company building strong commercial sales and brand teams.',
    industry: 'Cloud and Productivity',
    location: 'Redmond, USA'
  },
  {
    name: 'Amazon',
    logo: companyLogoMap.Amazon,
    description: 'E-commerce and cloud company with marketing, marketplace, and growth roles.',
    shortDescription: 'E-commerce and cloud company with marketing, marketplace, and growth roles.',
    industry: 'E-commerce and Cloud',
    location: 'Seattle, USA'
  },
  {
    name: 'HubSpot',
    logo: companyLogoMap.HubSpot,
    description: 'Marketing and CRM platform recognized for inbound growth and lifecycle strategy.',
    shortDescription: 'Marketing and CRM platform recognized for inbound growth and lifecycle strategy.',
    industry: 'Marketing SaaS',
    location: 'Cambridge, USA'
  },
  {
    name: 'Salesforce',
    logo: companyLogoMap.Salesforce,
    description: 'CRM software company supporting account growth, enablement, and customer success.',
    shortDescription: 'CRM software company supporting account growth, enablement, and customer success.',
    industry: 'CRM Software',
    location: 'San Francisco, USA'
  },
  {
    name: 'Adobe',
    logo: companyLogoMap.Adobe,
    description: 'Creative and marketing software company blending product marketing and enterprise sales.',
    shortDescription: 'Creative and marketing software company blending product marketing and enterprise sales.',
    industry: 'Creative Software',
    location: 'San Jose, USA'
  },
  {
    name: 'Shopify',
    logo: companyLogoMap.Shopify,
    description: 'Commerce platform known for growth marketing, partner success, and merchant acquisition.',
    shortDescription: 'Commerce platform known for growth marketing, partner success, and merchant acquisition.',
    industry: 'Commerce Platform',
    location: 'Ottawa, Canada'
  },
  {
    name: 'Zoho',
    logo: companyLogoMap.Zoho,
    description: 'Business software company with sales enablement, CRM, and campaign-focused roles.',
    shortDescription: 'Business software company with sales enablement, CRM, and campaign-focused roles.',
    industry: 'Business Software',
    location: 'Chennai, India'
  },
  {
    name: 'LinkedIn',
    logo: companyLogoMap.LinkedIn,
    description: 'Professional platform with talent solutions, B2B marketing, and account growth teams.',
    shortDescription: 'Professional platform with talent solutions, B2B marketing, and account growth teams.',
    industry: 'Professional Platform',
    location: 'Sunnyvale, USA'
  }
];

async function parseJsonSafely(response) {
  const rawText = await response.text();
  const trimmedText = rawText.trim();

  if (!trimmedText) {
    return [];
  }

  try {
    return JSON.parse(trimmedText);
  } catch (error) {
    console.error('[CompaniesPage] Invalid JSON response received.', {
      status: response.status,
      bodyPreview: trimmedText.slice(0, 200),
      error
    });
    throw new Error('The companies response was not valid JSON.');
  }
}

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      const requestUrl = `${API}/companies`;

      try {
        console.debug('[CompaniesPage] Fetching companies.', {
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
          console.error('[CompaniesPage] Companies request failed.', {
            url: requestUrl,
            status: response.status,
            statusText: response.statusText,
            responseBody: data
          });
          throw new Error('Unable to load companies right now.');
        }

        if (!Array.isArray(data) || !data.length) {
          console.warn('[CompaniesPage] Companies response was empty. Using fallback company cards.', {
            url: requestUrl,
            responseBody: data
          });
          setCompanies(fallbackCompanies);
          setError('');
          return;
        }

        setCompanies(data);
        setError('');
      } catch (fetchError) {
        console.error('[CompaniesPage] Unable to fetch companies. Using fallback company cards.', {
          url: requestUrl,
          error: fetchError
        });
        setCompanies(fallbackCompanies);
        setError('');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Top employers"
        title="Companies hiring for modern marketing and sales talent."
        description="From B2B SaaS to digital marketing and commerce brands, growth teams need people who can connect story, audience, and outcomes."
        image={imageSources.companies}
        imageAlt="Presentation and hiring discussions in a bright office"
      />

      <RevealSection className="content-section">
        <SectionHeader
          eyebrow="Company spotlight"
          title="We are connected with leading companies hiring marketing and sales talent."
          description="Explore top companies, recognize their brands, and discover where strong career opportunities can grow."
        />
        {loading ? <LoadingSkeletonGrid type="company" count={6} /> : null}
        {error ? <p className="status-text error-text">{error}</p> : null}
        {!loading && !error && companies.length ? (
          <CompanySpotlight companies={companies} />
        ) : null}
        {!loading && !error && !companies.length ? (
          <p className="status-text">No companies available right now.</p>
        ) : null}
      </RevealSection>

      <RevealSection className="content-section alt-section" delay={0.04}>
        <div className="single-visual-block">
          <motion.img
            src={imageSources.contact}
            alt="Recruiters and hiring teams in discussion"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
          />
        </div>
      </RevealSection>
    </>
  );
}

export default CompaniesPage;

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import CompanySpotlight from '../components/CompanySpotlight';
import { imageSources } from '../assets/images/imageSources';

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');

        if (!response.ok) {
          throw new Error('Unable to load companies right now.');
        }

        const data = await response.json();
        setCompanies(Array.isArray(data) ? data : []);
        setError('');
      } catch (_error) {
        setCompanies([]);
        setError('Unable to load companies right now.');
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

      <section className="content-section">
        <SectionHeader
          eyebrow="Company spotlight"
          title="A curated look at teams building serious demand and revenue engines."
          description="These sample employers show the range of environments where early-career and growth-ready talent can thrive."
        />
        {loading ? <p className="status-text">Loading companies...</p> : null}
        {error ? <p className="status-text error-text">{error}</p> : null}
        {!loading && !error && companies.length ? (
          <CompanySpotlight companies={companies} />
        ) : null}
        {!loading && !error && !companies.length ? (
          <p className="status-text">No companies available right now.</p>
        ) : null}
      </section>

      <section className="content-section alt-section">
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
      </section>
    </>
  );
}

export default CompaniesPage;

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import RevealSection from '../components/RevealSection';
import { imageSources } from '../assets/images/imageSources';
import { useAuth } from '../context/AuthContext';
import { API } from '../data/siteContent';

function ApplicationsPage() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`${API}/applications/mine`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Unable to load your applications.');
        }

        setApplications(Array.isArray(result) ? result : []);
        setError('');
      } catch (fetchError) {
        setApplications([]);
        setError(fetchError.message || 'Unable to load your applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  return (
    <>
      <PageHero
        eyebrow="Applications"
        title="Track every job application from one place."
        description="Review the roles you have applied to and keep an eye on the hiring stage for each one."
        image={imageSources.contact}
        imageAlt="Candidate application tracking and recruiter review"
      />

      <RevealSection className="content-section">
        <SectionHeader
          eyebrow="Application history"
          title="Your submitted roles and current statuses."
          description="Each card shows the role, timing, and stage so you know what is moving."
        />
        {loading ? <p className="status-text">Loading your applications...</p> : null}
        {error ? <p className="status-text error-text">{error}</p> : null}
        {!loading && !error ? (
          applications.length ? (
            <div className="application-list">
              {applications.map((application, index) => (
                <motion.article
                  key={application._id || `${application.roleInterested}-${index}`}
                  className="application-card"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <div className="application-card-top">
                    <div>
                      <h3>{application.roleInterested}</h3>
                      <p>{application.experienceLevel}</p>
                    </div>
                    <span className={`application-status application-status-${application.status || 'applied'}`}>
                      {application.status || 'applied'}
                    </span>
                  </div>
                  <p>{application.message}</p>
                  <span className="application-date">
                    {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Recently submitted'}
                  </span>
                </motion.article>
              ))}
            </div>
          ) : (
            <p className="status-text">You have not applied to any jobs yet.</p>
          )
        ) : null}
      </RevealSection>
    </>
  );
}

export default ApplicationsPage;

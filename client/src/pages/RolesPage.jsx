import { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import RoleList from '../components/RoleList';
import { imageSources } from '../assets/images/imageSources';

const API = import.meta.env.VITE_API_URL;

function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API}/roles`);

        if (!response.ok) {
          throw new Error('Unable to load roles right now.');
        }

        const data = await response.json();
        setRoles(Array.isArray(data) ? data : []);
        setError('');
      } catch (_error) {
        setRoles([]);
        setError('Unable to load roles right now.');
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

      <section className="content-section">
        <SectionHeader
          eyebrow="Role directory"
          title="A focused view of the core opportunities in marketing and sales."
          description="Browse role paths that can help you understand where your strengths fit best."
        />
        {loading ? <p className="status-text">Loading roles...</p> : null}
        {error ? <p className="status-text error-text">{error}</p> : null}
        {!loading && !error && roles.length ? <RoleList roles={roles} /> : null}
        {!loading && !error && !roles.length ? (
          <p className="status-text">No roles available right now.</p>
        ) : null}
      </section>
    </>
  );
}

export default RolesPage;

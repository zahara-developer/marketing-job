import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import { imageSources } from '../assets/images/imageSources';
import { useAuth } from '../context/AuthContext';
import { API } from '../data/siteContent';

function DashboardPage() {
  const { user, token } = useAuth();
  const [totalLoginActivity, setTotalLoginActivity] = useState(0);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!token) {
        setTotalLoginActivity(0);
        return;
      }

      try {
        const response = await fetch(`${API}/auth/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Unable to load dashboard stats.');
        }

        setTotalLoginActivity(result.stats?.totalLoginActivity ?? 0);
      } catch (_error) {
        setTotalLoginActivity(0);
      }
    };

    fetchDashboardStats();
  }, [token]);

  const stats = [
    {
      label: 'User Sign-ins',
      value: user?.loginCount ?? 0
    },
    {
      label: 'Login Activity',
      value: totalLoginActivity
    },
    {
      label: 'Jobs Applied',
      value: user?.appliedJobsCount ?? 0
    }
  ];

  return (
    <>
      <PageHero
        eyebrow="Profile"
        title={`Welcome back, ${user?.fullName || 'Candidate'}.`}
        description="Your dashboard now keeps things simple and shows quick account stats instead of full personal details."
        image={imageSources.about}
        imageAlt="Candidate dashboard and profile overview"
      />

      <section className="content-section">
        <SectionHeader
          eyebrow="Dashboard"
          title="Your account snapshot"
          description="A quick look at your account activity in one place."
        />
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <div className="dashboard-grid">
            {stats.map((item) => (
              <div key={item.label}>
                <label>{item.label}</label>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}

export default DashboardPage;

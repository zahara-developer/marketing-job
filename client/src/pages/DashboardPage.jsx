import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import { imageSources } from '../assets/images/imageSources';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { user } = useAuth();
  const stats = [
    {
      label: 'Total Logins',
      value: user?.loginCount ?? 0
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
          description="These numbers are loaded from the backend after login."
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

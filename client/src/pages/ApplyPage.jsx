import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import ContactForm from '../components/ContactForm';
import { imageSources } from '../assets/images/imageSources';
import useSiteData from '../hooks/useSiteData';

function ApplyPage() {
  const location = useLocation();
  const { roles } = useSiteData();
  const selectedRole = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('role') || '';
  }, [location.search]);

  return (
    <>
      <PageHero
        eyebrow="Apply"
        title="Apply separately for the role that fits your goals."
        description="Complete your application here and share the role, experience, and message you want the hiring team to see."
        image={imageSources.contact}
        imageAlt="Recruiters and candidates discussing career opportunities"
      />

      <section className="content-section">
        <SectionHeader
          eyebrow="Application form"
          title="Ready to apply?"
          description="Use this separate page to submit your job application."
        />
        <div className="contact-layout">
          <motion.div
            className="contact-image-panel"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
          >
            <img src={imageSources.hero} alt="Career consultation and hiring support" />
            <div className="contact-panel-copy">
              <h3>Take the next step.</h3>
              <p>Choose your role, share your details, and send your application directly from this page.</p>
            </div>
          </motion.div>
          <ContactForm roles={roles} selectedRole={selectedRole} />
        </div>
      </section>
    </>
  );
}

export default ApplyPage;

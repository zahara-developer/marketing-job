import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import ContactForm from '../components/ContactForm';
import { imageSources } from '../assets/images/imageSources';
import { apiBaseUrl } from '../data/siteContent';
import useSiteData from '../hooks/useSiteData';

function ContactPage() {
  const location = useLocation();
  const { roles } = useSiteData();
  const selectedRole = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('role') || '';
  }, [location.search]);

  return (
    <>
      <PageHero
        eyebrow="Contact and apply"
        title="Tell us which role fits your strengths and where you want to grow next."
        description="Submit your details to express interest in opportunities across marketing, growth, and sales teams."
        image={imageSources.contact}
        imageAlt="Recruiters and candidates discussing career opportunities"
      />

      <section className="content-section">
        <SectionHeader
          eyebrow="Application form"
          title="Ready to step into a growth-focused career path?"
          description="Use the form below to apply, express interest, or start a conversation with the hiring team."
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
              <h3>Make your next move visible.</h3>
              <p>Share your role preference, experience level, and goals so the application reaches the right team.</p>
            </div>
          </motion.div>
          <ContactForm roles={roles} apiBaseUrl={apiBaseUrl} selectedRole={selectedRole} />
        </div>
      </section>
    </>
  );
}

export default ContactPage;

import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import { imageSources } from '../assets/images/imageSources';
import { tips } from '../data/siteContent';

function CareerTipsPage() {
  return (
    <>
      <PageHero
        eyebrow="Career tips"
        title="Practical advice for interviews, portfolios, and early momentum."
        description="The fastest gains usually come from clarity, proof of work, and confident communication."
        image={imageSources.contact}
        imageAlt="Professional coaching and hiring preparation"
      />

      <section className="content-section">
        <SectionHeader
          eyebrow="Practical advice"
          title="Small improvements create noticeable career momentum."
          description="These tips are simple, memorable, and well-suited for internship and fresher audiences."
        />
        <div className="tips-row">
          {tips.map((tip, index) => (
            <motion.div
              key={tip}
              className="tip-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              {tip}
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

export default CareerTipsPage;

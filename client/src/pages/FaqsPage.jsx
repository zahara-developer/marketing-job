import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import { imageSources } from '../assets/images/imageSources';
import { faqItems } from '../data/siteContent';

function FaqsPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQs"
        title="A few common questions from students and early-career applicants."
        description="Clear, direct answers that help visitors understand the space quickly and confidently."
        image={imageSources.companies}
        imageAlt="Professional group discussing roles and growth"
      />

      <section className="content-section">
        <SectionHeader
          eyebrow="Answers"
          title="Straightforward guidance for entering the field."
          description="These FAQs make the site feel more complete and more helpful for first-time visitors."
        />
        <div className="faq-list">
          {faqItems.map((item, index) => (
            <motion.article
              key={item.question}
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}

export default FaqsPage;

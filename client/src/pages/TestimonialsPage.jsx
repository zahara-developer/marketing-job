import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import { imageSources } from '../assets/images/imageSources';
import { testimonials } from '../data/siteContent';

function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="People who thrive here enjoy a mix of energy, analysis, and ambition."
        description="These short perspective snapshots help the field feel more human, aspirational, and career-ready."
        image={imageSources.about}
        imageAlt="Team discussion around a growth strategy"
      />

      <section className="content-section">
        <SectionHeader
          eyebrow="Voices from the field"
          title="A career path that rewards both curiosity and consistency."
          description="Growth roles feel especially meaningful when your ideas can be measured, refined, and seen in real outcomes."
        />
        <div className="quote-grid">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.author}
              className="quote-item"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <p>{item.quote}</p>
              <footer>
                <strong>{item.author}</strong>
                <span>{item.role}</span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </section>
    </>
  );
}

export default TestimonialsPage;

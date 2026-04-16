import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import { imageSources } from '../assets/images/imageSources';
import { blogItems } from '../data/siteContent';

function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Career stories and practical ideas worth bookmarking."
        description="Editorial-style prompts for interviews, portfolios, and early-career growth in marketing and sales."
        image={imageSources.resources}
        imageAlt="Workspace with analytics and content planning visuals"
      />

      <section className="content-section">
        <SectionHeader
          eyebrow="Reading list"
          title="Quick ideas that feel useful instead of generic."
          description="This page gives the project a more complete careers-site feel while keeping the layout clean and open."
        />
        <div className="stack-list">
          {blogItems.map((item, index) => (
            <motion.div
              key={item}
              className="stack-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

export default BlogPage;

import { motion } from 'framer-motion';

function SectionHeader({ eyebrow, title, description, align = 'left' }) {
  return (
    <motion.div
      className={`section-header section-header-${align}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      <span className="section-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </motion.div>
  );
}

export default SectionHeader;

import { motion } from 'framer-motion';

function RevealSection({
  children,
  className = '',
  y = 22,
  delay = 0,
  duration = 0.55
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default RevealSection;

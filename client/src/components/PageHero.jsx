import { motion } from 'framer-motion';

function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  children,
  fullBackground = false
}) {
  return (
    <section className={`page-hero ${fullBackground ? 'page-hero-full' : ''}`}>
      <div className="glow glow-one" />
      <div className="glow glow-two" />
      {fullBackground ? (
        <>
          <div className="page-hero-background">
            <img src={image} alt={imageAlt} />
          </div>
          <div className="page-hero-overlay" />
        </>
      ) : null}
      <div className="page-hero-copy">
        <motion.span
          className="hero-kicker"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {description}
        </motion.p>
        {children}
      </div>

      {!fullBackground ? (
        <motion.div
          className="page-hero-visual"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
        >
          <img src={image} alt={imageAlt} />
        </motion.div>
      ) : null}
    </section>
  );
}

export default PageHero;

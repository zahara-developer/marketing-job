import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import { imageSources } from '../assets/images/imageSources';
import { metrics, professionalVideos } from '../data/siteContent';
import useSiteData from '../hooks/useSiteData';

const carouselSlides = [
  {
    eyebrow: 'Marketing jobs',
    title: 'Discover digital, brand, and growth roles built for modern teams.',
    description: 'Explore focused openings across SEO, social media, analytics, and performance.',
    image: imageSources.hero
  },
  {
    eyebrow: 'Sales hiring',
    title: 'Find sales roles with real career momentum across India.',
    description: 'See openings in business development, inside sales, account growth, and retail sales.',
    image: imageSources.contact
  },
  {
    eyebrow: 'Career growth',
    title: 'Start with sharper direction and cleaner role discovery.',
    description: 'Use the role pages, companies page, and resources page only when you want them.',
    image: imageSources.about
  }
];

function HomePage() {
  const { roles, applications, loading, error } = useSiteData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredRoles = roles.slice(0, 4);
  const summaryStats = [
    {
      label: 'Total Applications',
      value: applications.length
    },
    {
      label: 'Featured Roles',
      value: roles.length
    }
  ];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  return (
    <>
      <PageHero
        eyebrow="Marketing and sales career hub"
        title="Build a smart start in marketing and sales."
        description="Explore focused roles, discover growth paths, and open other sections only when you need them."
        image={imageSources.hero}
        imageAlt="Recruiter and candidate in a professional hiring discussion"
        fullBackground
      >
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link to="/roles" className="primary-button">
            Explore Roles
            <ArrowRight size={18} />
          </Link>
          <Link to="/companies" className="secondary-button">
            View Companies
          </Link>
        </motion.div>

        <motion.div
          className="metric-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {metrics.map((metric) => (
            <div key={metric.label} className="metric-item">
              <metric.icon size={18} />
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </motion.div>

        <div className="hero-badge hero-badge-inline">
          <Sparkles size={18} />
          <span>Clean. Focused. Career-ready.</span>
        </div>
      </PageHero>

      <section className="content-section">
        <SectionHeader
          eyebrow="Featured highlights"
          title="A simple homepage with only the key things up front."
          description="Open the other pages from the sidebar when you want more details."
        />
        <div className="carousel-shell">
          <AnimatePresence mode="wait">
            <motion.article
              key={carouselSlides[currentSlide].title}
              className="carousel-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.4 }}
            >
              <div className="carousel-copy">
                <span className="section-eyebrow">{carouselSlides[currentSlide].eyebrow}</span>
                <h3>{carouselSlides[currentSlide].title}</h3>
                <p>{carouselSlides[currentSlide].description}</p>
              </div>
              <div className="carousel-visual">
                <img
                  src={carouselSlides[currentSlide].image}
                  alt={carouselSlides[currentSlide].title}
                />
              </div>
            </motion.article>
          </AnimatePresence>

          <div className="carousel-controls">
            <button type="button" className="carousel-button" onClick={handlePrevSlide} aria-label="Previous slide">
              <ChevronLeft size={18} />
            </button>
            <div className="carousel-dots">
              {carouselSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
            <button type="button" className="carousel-button" onClick={handleNextSlide} aria-label="Next slide">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="content-section">
        <SectionHeader
          eyebrow="Featured roles"
          title="A short preview before you open the full roles page."
          description="The full role list stays inside the Roles page."
        />
        {loading ? <p className="status-text">Loading roles...</p> : null}
        {!loading && featuredRoles.length ? (
          <div className="role-card-grid">
            {featuredRoles.map((role, index) => (
              <motion.article
                key={role._id || role.title}
                className="role-card-compact"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, scale: 1.01 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <span className="role-category">{role.category}</span>
                <h3>{role.title}</h3>
                <p>{role.location}</p>
                <strong>{role.salaryRange}</strong>
                <div className="role-skill-line">
                  {Array.isArray(role.skills) ? role.skills.slice(0, 3).join(', ') : ''}
                </div>
              </motion.article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="content-section">
        <SectionHeader
          eyebrow="Industry Insights"
          title="Professional Career Insights"
          description="Watch working professional talks that help with communication, confidence, positioning, and career growth."
        />
        <div className="video-grid">
          {professionalVideos.map((video, index) => (
            <motion.article
              key={video.title}
              className="video-frame pastel-video-frame"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <div className="video-section-head">
                <div>
                  <span className="section-eyebrow">Career Growth Video</span>
                  <h3>{video.title}</h3>
                </div>
                <div className="video-badge">
                  <PlayCircle size={18} />
                  <span>Now playing</span>
                </div>
              </div>
              <iframe
                src={video.embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <p className="video-description">{video.description}</p>
              <a
                className="video-link"
                href={video.watchUrl}
                target="_blank"
                rel="noreferrer"
              >
                Watch on YouTube
              </a>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeader
          eyebrow="Platform Snapshot"
          title="Quick totals only"
          description="This section now shows counts instead of full candidate details."
        />
        {loading ? <p className="status-text">Loading summary...</p> : null}
        {!loading && error ? <p className="status-text error-text">{error}</p> : null}
        {!loading && !error ? (
          <div className="candidate-showcase">
            {summaryStats.map((item, index) => (
              <motion.article
                key={item.label}
                className="candidate-card"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <div className="candidate-card-header">
                  <strong>{item.label}</strong>
                </div>
                <div className="candidate-card-grid">
                  <div>
                    <label>{item.label}</label>
                    <span>{item.value}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}

export default HomePage;

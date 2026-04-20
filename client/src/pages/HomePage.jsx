import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Eye,
  MapPin,
  MessageSquareQuote,
  Search,
  Sparkles,
  Target,
  Upload,
  UserPlus,
  Workflow
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { imageSources } from '../assets/images/imageSources';
import { companyLogoMap } from '../assets/logos/companyLogos';

const gettingStartedSteps = [
  {
    title: 'Search your job',
    description: 'Find marketing and sales roles that match your interests and skills.',
    icon: Search
  },
  {
    title: 'Register your account',
    description: 'Create your profile to unlock job applications and recruiter visibility.',
    icon: UserPlus
  },
  {
    title: 'Upload your resume',
    description: 'Add your resume so companies can review your profile quickly.',
    icon: Upload
  },
  {
    title: 'Apply for dream job',
    description: 'Apply to the best-fit opportunities in one smooth flow.',
    icon: CircleCheckBig
  }
];

const featuredHighlights = [
  {
    title: 'Growth Marketing Specialist',
    description: 'Performance-focused roles built around campaigns, funnels, and measurable brand growth.',
    image: imageSources.about
  },
  {
    title: 'Enterprise Sales Executive',
    description: 'High-intent revenue opportunities for candidates who thrive in pipeline and account conversations.',
    image: imageSources.companies
  },
  {
    title: 'Brand & Content Lead',
    description: 'Creative commercial roles for marketers who shape positioning, storytelling, and market visibility.',
    image: imageSources.resources
  }
];

const trustedBrands = [
  { name: 'Zoho' },
  { name: 'Wipro', mark: 'W' },
  { name: 'HCL', mark: 'HCL' },
  { name: 'Deloitte', mark: 'D' },
  { name: 'Capgemini', mark: 'C' },
  { name: 'Cognizant', mark: 'C' },
  { name: 'Google' },
  { name: 'Amazon' },
  { name: 'Microsoft' },
  { name: 'Salesforce' },
  { name: 'Adobe' },
  { name: 'HubSpot' },
  { name: 'Infosys' },
  { name: 'TCS' },
  { name: 'Accenture' }
].map((brand) => ({
  ...brand,
  logo: companyLogoMap[brand.name] || null
}));

const hiringBenefits = [
  {
    title: 'Focused talent pool',
    description: 'Only marketing and sales candidates, easier to match faster.',
    icon: Target
  },
  {
    title: 'Better visibility',
    description: 'Structured profiles and resumes help recruiters review candidates quickly.',
    icon: Eye
  },
  {
    title: 'Smarter hiring flow',
    description: 'From discovery to shortlist, the platform keeps the process simple.',
    icon: Workflow
  }
];

const testimonials = [
  {
    quote: 'This platform helped me find a marketing role much faster because the jobs actually matched my background.',
    author: 'Aditi Verma',
    role: 'Performance Marketing Associate'
  },
  {
    quote: 'The experience felt clean and focused. I could upload my resume, save roles, and apply without hunting through noise.',
    author: 'Rahul Menon',
    role: 'Business Development Executive'
  },
  {
    quote: 'The companies felt more relevant than generic job boards, which made my applications feel more intentional.',
    author: 'Sneha Kapoor',
    role: 'Content Strategist'
  }
];

function HomePage() {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    keyword: '',
    role: '',
    location: ''
  });
  const [activeHighlight, setActiveHighlight] = useState(0);

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const hasSearchInput =
      searchForm.keyword.trim() ||
      searchForm.role.trim() ||
      searchForm.location.trim();

    if (!hasSearchInput) {
      return;
    }

    const params = new URLSearchParams();

    if (searchForm.keyword.trim()) {
      params.set('keyword', searchForm.keyword.trim());
    }

    if (searchForm.role) {
      params.set('role', searchForm.role);
    }

    if (searchForm.location.trim()) {
      params.set('location', searchForm.location.trim());
    }

    navigate(`/roles${params.toString() ? `?${params.toString()}` : ''}`);
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveHighlight((prev) => (prev + 1) % featuredHighlights.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, []);

  const handlePreviousHighlight = () => {
    setActiveHighlight((prev) => (prev - 1 + featuredHighlights.length) % featuredHighlights.length);
  };

  const handleNextHighlight = () => {
    setActiveHighlight((prev) => (prev + 1) % featuredHighlights.length);
  };

  return (
    <>
      <section className="landing-shell portal-home-shell">
        <div className="portal-home-hero">
          <div className="portal-home-hero-media" aria-hidden="true">
            <img
              src={imageSources.hero}
              alt=""
              className="portal-home-hero-background-image"
            />
            <div className="portal-home-hero-background-overlay" />
          </div>

          <div className="portal-home-hero-top">
            <motion.div
              className="landing-hero-copy portal-home-copy"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <span className="hero-kicker">Marketing &amp; Sales hiring platform</span>
              <h1>Find the Right Marketing &amp; Sales Opportunity</h1>
              <p>
                Search focused roles, discover hiring brands, and start your next move on a cleaner,
                more modern career platform.
              </p>
            </motion.div>
          </div>

          <div className="portal-home-search-layer">
            <motion.form
              className="portal-search-bar portal-search-bar-bottom"
              onSubmit={handleSearchSubmit}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
            >
              <label className="portal-search-field portal-search-field-wide">
                <span>Search</span>
                <div className="portal-search-input">
                  <Search size={16} />
                  <input
                    type="text"
                    name="keyword"
                    value={searchForm.keyword}
                    onChange={handleSearchChange}
                    placeholder="Search roles, companies, skills..."
                  />
                </div>
              </label>

              <label className="portal-search-field">
                <span>Location</span>
                <div className="portal-search-location">
                  <MapPin size={16} />
                  <input
                    type="text"
                    name="location"
                    value={searchForm.location}
                    onChange={handleSearchChange}
                    placeholder="Mumbai, Bengaluru, Remote"
                  />
                </div>
              </label>

              <label className="portal-search-field">
                <span>Type</span>
                <select name="role" value={searchForm.role} onChange={handleSearchChange}>
                  <option value="">All types</option>
                  {[
                    'Digital Marketing',
                    'Social Media Manager',
                    'SEO Specialist',
                    'Content Strategist',
                    'Marketing Analyst',
                    'Sales Executive',
                    'Business Development Executive',
                    'CRM Executive'
                  ].map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>

              <button type="submit" className="primary-button portal-search-button">
                <Search size={18} />
                Search Jobs
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      <section className="content-section portal-home-carousel-section">
        <motion.div
          className="portal-home-carousel-shell"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <div className="portal-home-carousel-header">
            <div>
              <span className="section-eyebrow">Featured Role Highlights</span>
              <h2>Spotlight opportunities across marketing and sales.</h2>
            </div>
            <div className="portal-home-carousel-actions">
              <button
                type="button"
                className="carousel-button portal-home-carousel-button"
                onClick={handlePreviousHighlight}
                aria-label="Previous highlight"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="carousel-button portal-home-carousel-button"
                onClick={handleNextHighlight}
                aria-label="Next highlight"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="portal-home-carousel-stage">
            {featuredHighlights.map((item, index) => (
              <motion.article
                key={item.title}
                className={`portal-home-carousel-card ${index === activeHighlight ? 'active' : ''}`}
                initial={false}
                animate={{
                  opacity: index === activeHighlight ? 1 : 0,
                  x: index === activeHighlight ? 0 : 24,
                  pointerEvents: index === activeHighlight ? 'auto' : 'none'
                }}
                transition={{ duration: 0.45 }}
              >
                <div className="portal-home-carousel-copy">
                  <span className="portal-home-carousel-kicker">Hiring highlight</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="portal-home-carousel-visual">
                  <img src={item.image} alt={item.title} />
                </div>
              </motion.article>
            ))}
          </div>

          <div className="carousel-dots portal-home-carousel-dots">
            {featuredHighlights.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={`carousel-dot ${index === activeHighlight ? 'active' : ''}`}
                onClick={() => setActiveHighlight(index)}
                aria-label={`Go to ${item.title}`}
              />
            ))}
          </div>
        </motion.div>
      </section>

      <section className="landing-logo-marquee-section portal-home-trusted" aria-label="Trusted by leading hiring brands">
        <div className="landing-logo-marquee-shell portal-home-trusted-shell">
          <div className="portal-home-trusted-header">
            <h2>Trusted by leading hiring brands</h2>
          </div>
            <div className="portal-home-logo-marquee">
              <div className="portal-home-logo-track">
                {[...trustedBrands, ...trustedBrands].map((company, index) => (
                  <div
                    key={`${company.name}-${index}`}
                    className="portal-home-logo-card"
                    aria-hidden={index >= trustedBrands.length}
                  >
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={index < trustedBrands.length ? `${company.name} logo` : ''}
                        className="landing-logo-marquee-image"
                      />
                    ) : (
                      <span className="portal-home-logo-mark" aria-hidden="true">
                        {company.mark || company.name.slice(0, 2)}
                      </span>
                    )}
                    <span className="portal-home-logo-name">{company.name}</span>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      <section className="content-section portal-home-company-benefits-section">
        <div className="portal-home-company-benefits-shell">
          <div className="section-header section-header-center portal-home-company-benefits-header">
            <span className="section-eyebrow">Hiring Partners</span>
            <h2>Why companies hire through us</h2>
          </div>
          <div className="portal-home-company-benefits-layout">
            <motion.div
              className="portal-home-company-visual"
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45 }}
            >
              <img src={imageSources.resources} alt="Hiring managers reviewing resumes and shortlisted candidates" />
            </motion.div>

            <div className="portal-home-company-benefits-grid">
              {hiringBenefits.map((item, index) => (
                <motion.article
                  key={item.title}
                  className="portal-home-company-benefit-card"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                >
                  <div className="portal-home-company-benefit-icon">
                    <item.icon size={18} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section portal-home-steps-section">
        <div className="portal-home-process-shell">
          <div className="section-header section-header-center portal-home-process-header">
            <span className="section-eyebrow">Getting Started</span>
            <h2>Getting Started Is Easy</h2>
            <p>Start your marketing and sales job journey in four simple steps.</p>
          </div>
          <div className="portal-home-steps-grid">
            {gettingStartedSteps.map((step, index) => (
              <motion.article
                key={step.title}
                className={`portal-home-step-card portal-home-step-card-${index + 1}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <div className="portal-home-step-badge">
                  <step.icon size={18} />
                </div>
                <div className="portal-home-step-top">
                  <span>0{index + 1}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < gettingStartedSteps.length - 1 ? (
                  <div className={`portal-home-step-connector portal-home-step-connector-${index + 1}`} aria-hidden="true">
                    <svg viewBox="0 0 180 90" preserveAspectRatio="none">
                      <path d="M6 42 C52 10, 118 10, 174 44" />
                    </svg>
                  </div>
                ) : null}
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section portal-home-testimonials-section">
        <div className="section-header section-header-center">
          <span className="section-eyebrow">Testimonials</span>
          <h2>What candidates say about the experience.</h2>
        </div>
        <div className="portal-home-testimonial-grid">
          {testimonials.map((item, index) => (
            <motion.article
              key={item.author}
              className="portal-home-testimonial-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <MessageSquareQuote size={18} />
              <p>{item.quote}</p>
              <strong>{item.author}</strong>
              <span>{item.role}</span>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;

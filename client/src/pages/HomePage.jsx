import {
  ArrowRight,
  Compass,
  FileText,
  Megaphone,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import careerGrowthVisual from '../assets/images/career-growth.svg';
import interviewMeetingVisual from '../assets/images/interview-meeting.svg';
import jobSearchVisual from '../assets/images/job-search.svg';
import marketingTeamVisual from '../assets/images/marketing-team.svg';
import officeWorkVisual from '../assets/images/office-work.svg';
import { imageSources } from '../assets/images/imageSources';
import { companyLogoMap, heroTrustedBrands, homepageLogoStrip } from '../assets/logos/companyLogos';
import { aboutPoints } from '../data/siteContent';
import { useAuth } from '../context/AuthContext';
import useSiteData from '../hooks/useSiteData';

const categoryItems = [
  { title: 'Digital Marketing', icon: Megaphone, image: marketingTeamVisual, alt: 'Digital Marketing illustration' },
  { title: 'Sales Executive', icon: Target, image: interviewMeetingVisual, alt: 'Sales Executive illustration' },
  { title: 'Business Development', icon: TrendingUp, image: careerGrowthVisual, alt: 'Business Development illustration' },
  { title: 'Brand Management', icon: Compass, image: officeWorkVisual, alt: 'Brand Management illustration' },
  { title: 'Marketing Analyst', icon: FileText, image: jobSearchVisual, alt: 'Marketing Analyst illustration' },
  { title: 'Inside Sales', icon: Users, image: interviewMeetingVisual, alt: 'Inside Sales illustration' }
];

function HomePage() {
  const { isAuthenticated } = useAuth();
  const { companies, loading } = useSiteData();
  const trustedCompanies = companies.slice(0, 6);

  return (
    <>
      <section className="landing-shell">
        <div
          className="landing-hero-grid"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(255, 250, 246, 0.76) 0%, rgba(255, 246, 239, 0.54) 38%, rgba(84, 35, 61, 0.08) 100%), url(${imageSources.hero})`
          }}
        >
          <motion.div
            className="landing-hero-copy"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="hero-kicker">Marketing &amp; Sales hiring platform</span>
            <h1>Find the Right Marketing &amp; Sales Opportunity</h1>
            <p>
              Explore focused roles, connect with hiring companies, and discover better
              career opportunities in marketing and sales.
            </p>

            <div className="hero-actions">
              <Link to={isAuthenticated ? '/roles' : '/register'} className="primary-button">
                {isAuthenticated ? 'Explore Roles' : 'Create Account'}
                <ArrowRight size={18} />
              </Link>
              <Link to={isAuthenticated ? '/dashboard' : '/login'} className="secondary-button">
                {isAuthenticated ? 'Open Dashboard' : 'Login'}
              </Link>
            </div>

            <div className="hero-trusted-brands" aria-label="Trusted marketing and sales brands">
              <span className="hero-trusted-label">Trusted marketing and sales brands</span>
              <div className="hero-trusted-logos">
              {heroTrustedBrands.map((company) => (
                  <div key={company.name} className="hero-trusted-logo-item">
                    <img src={company.logo} alt={`${company.name} logo`} className="hero-trusted-logo-image" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="landing-logo-marquee-section" aria-label="Trusted by leading hiring brands">
        <div className="landing-logo-marquee-shell">
          <div className="landing-logo-marquee-header">
            <span className="section-eyebrow">Trusted by leading hiring brands</span>
          </div>
          <div className="landing-logo-marquee" role="presentation">
            <div className="landing-logo-marquee-track">
              {[...homepageLogoStrip, ...homepageLogoStrip].map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="landing-logo-marquee-item"
                  aria-hidden={index >= homepageLogoStrip.length}
                >
                  <img
                    src={company.logo}
                    alt={index < homepageLogoStrip.length ? `${company.name} logo` : ''}
                    className="landing-logo-marquee-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="landing-intro-layout">
          <div>
            <SectionHeader
              eyebrow="Why This Platform"
              title="Focused hiring for marketing and sales careers."
              description="The strongest growth teams need people who can combine insight, communication, positioning, and measurable business impact."
            />
            <div className="about-copy landing-about-copy">
              {aboutPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  className="about-point"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -18 : 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45 }}
                >
                  <point.icon size={20} />
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="landing-support-visual"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
          >
            <img src={imageSources.about} alt="Marketing and sales professionals planning growth strategy" />
          </motion.div>
        </div>
      </section>

      <section className="content-section">
        <SectionHeader
          eyebrow="Popular Roles"
          title="Explore the career paths people usually start with first."
          description="A short category overview helps job seekers understand where they fit before moving into the full platform."
        />
        <div className="landing-category-grid">
          {categoryItems.map((item, index) => (
            <motion.article
              key={item.title}
              className="landing-category-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <div className="landing-category-image-wrap">
                <img src={item.image} alt={item.alt} className="landing-category-image" />
              </div>
              <div className="landing-category-icon">
                <item.icon size={16} />
              </div>
              <h3>{item.title}</h3>
            </motion.article>
          ))}
        </div>
      </section>

      {trustedCompanies.length ? (
        <section className="content-section">
          <SectionHeader
            eyebrow="Hiring Partners"
            title="Companies hiring on the platform."
            description="A simple company section gives users quick trust and context without overloading the page."
          />
          {loading ? <p className="status-text">Loading companies...</p> : null}
          {!loading ? (
            <div className="landing-logo-grid">
              {trustedCompanies.map((company, index) => (
                <motion.article
                  key={company._id || company.name}
                  className="landing-logo-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <div className="landing-logo-mark-wrap">
                    <img
                      src={companyLogoMap[company.name] || company.logo}
                      alt={`${company.name} logo`}
                      className="landing-logo-image"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                        event.currentTarget.nextElementSibling?.classList.add('landing-logo-mark-visible');
                      }}
                    />
                    <div className="landing-logo-mark">
                      {company.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  </div>
                  <div className="landing-logo-copy">
                    <strong>{company.name}</strong>
                    <span>{company.industry}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="content-section">
        <motion.div
          className="landing-final-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <span className="section-eyebrow">Next Step</span>
            <h2>Start your next move in marketing and sales.</h2>
            <p>Join the platform to explore roles, connect with hiring teams, and move into the full experience.</p>
          </div>
          <div className="hero-actions">
            <Link to={isAuthenticated ? '/dashboard' : '/register'} className="primary-button">
              {isAuthenticated ? 'Open Dashboard' : 'Create Account'}
              <ArrowRight size={18} />
            </Link>
            <Link to={isAuthenticated ? '/roles' : '/login'} className="secondary-button">
              {isAuthenticated ? 'View Roles' : 'Login'}
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}

export default HomePage;

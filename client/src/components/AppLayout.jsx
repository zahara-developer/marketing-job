import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import hireflowLogo from '../assets/logo/hireflow-logo.svg';
import Sidebar from './Sidebar';
import FloatingChatbot from './FloatingChatbot';

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: Instagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: Linkedin },
  { label: 'YouTube', href: 'https://www.youtube.com/', icon: Youtube },
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: Facebook },
  { label: 'X', href: 'https://x.com/', icon: Twitter }
];

const footerGroups = [
  {
    title: 'Platform',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Roles', to: '/roles' },
      { label: 'Companies', to: '/companies' },
      { label: 'Community', to: '/community' },
      { label: 'Resources', to: '/resources' }
    ]
  },
  {
    title: 'Legal & Support',
    links: [
      { label: 'Blog', to: '/blog' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & Conditions', to: '/terms-and-conditions' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'FAQs', to: '/faqs' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Career Tips', to: '/career-tips' },
      { label: 'Dashboard', to: '/dashboard' }
    ]
  }
];

function AppLayout() {
  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content">
        <Outlet />
        <footer className="site-footer">
          <motion.div
            className="footer-main-grid"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
          >
            <div className="footer-brand-block">
              <div className="footer-brand-top">
                <div className="footer-brand">
                  <img src={hireflowLogo} alt="Hireflow logo" className="logo-img" />
                </div>
                <div className="footer-copy">
                  <p>Marketing &amp; Sales Careers</p>
                  <span>Connecting talent with marketing and sales opportunities.</span>
                </div>
              </div>

              <div className="footer-socials" aria-label="Social media links">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    className="footer-social-link"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                  >
                    <item.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {footerGroups.map((group) => (
              <motion.div
                key={group.title}
                className="footer-link-group"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: 0.04 }}
              >
                <strong>{group.title}</strong>
                <div className="footer-link-list">
                  {group.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) => `footer-link ${isActive ? 'active' : ''}`}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="footer-bottom-bar"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <span>&copy; 2026 Marketing &amp; Sales Careers. All rights reserved.</span>
            <span>Connecting talent with marketing and sales opportunities.</span>
          </motion.div>
        </footer>
      </main>
      <FloatingChatbot />
    </div>
  );
}

export default AppLayout;

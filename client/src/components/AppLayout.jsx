import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
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
      { label: 'About', to: '/about' },
      { label: 'Roles', to: '/roles' },
      { label: 'Resources', to: '/resources' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQs', to: '/faqs' },
      { label: 'Blog', to: '/blog' },
      { label: 'Login', to: '/login' },
      { label: 'Create Account', to: '/register' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'Companies', to: '/companies' },
      { label: 'Career Tips', to: '/career-tips' },
      { label: 'Contact', to: '/contact' },
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
            className="footer-brand-block"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
          >
            <div className="footer-copy">
              <p>Marketing & Sales Career Studio</p>
              <span>Focused hiring and career discovery for marketing, sales, growth, and brand teams.</span>
            </div>
            <div className="footer-contact-list">
              <span><Mail size={16} /> contact@marketingsalesstudio.com</span>
              <span><Phone size={16} /> +91 9876543210</span>
              <span><MapPin size={16} /> Bengaluru, India</span>
            </div>
          </motion.div>

          <motion.div
            className="footer-links-grid"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            {footerGroups.map((group) => (
              <div key={group.title} className="footer-link-group">
                <strong>{group.title}</strong>
                <div className="footer-link-list">
                  {group.links.map((link) => (
                    <Link key={link.to} to={link.to}>{link.label}</Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="footer-link-group">
              <strong>Contact</strong>
              <div className="footer-link-list footer-contact-links">
                <span>Email support</span>
                <span>Hiring assistance</span>
                <span>Candidate guidance</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="footer-socials"
            aria-label="Social media links"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
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
          </motion.div>
        </footer>
      </main>
      <FloatingChatbot />
    </div>
  );
}

export default AppLayout;

import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import Sidebar from './Sidebar';
import FloatingChatbot from './FloatingChatbot';

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: Instagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: Linkedin },
  { label: 'YouTube', href: 'https://www.youtube.com/', icon: Youtube },
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: Facebook },
  { label: 'X', href: 'https://x.com/', icon: Twitter }
];

function AppLayout() {
  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content">
        <Outlet />
        <footer className="site-footer">
          <motion.div
            className="footer-copy"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
          >
            <p>Marketing & Sales Career Studio</p>
            <span>Designed for aspiring marketers, growth teams, and modern sales professionals.</span>
            <span>Email: contact@marketingsalesstudio.com</span>
            <span>Phone: +91 9876543210</span>
            <span>Location: Bengaluru, India</span>
          </motion.div>
          <motion.div
            className="footer-socials"
            aria-label="Social media links"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: 0.08 }}
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

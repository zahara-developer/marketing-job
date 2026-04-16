import { Outlet } from 'react-router-dom';
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
          <div className="footer-copy">
            <p>Marketing & Sales Career Studio</p>
            <span>Designed for aspiring marketers, growth teams, and modern sales professionals.</span>
            <span>Email: contact@marketingsalesstudio.com</span>
            <span>Phone: +91 9876543210</span>
            <span>Location: Bengaluru, India</span>
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
        </footer>
      </main>
      <FloatingChatbot />
    </div>
  );
}

export default AppLayout;

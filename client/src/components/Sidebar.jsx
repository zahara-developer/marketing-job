import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BookOpenText,
  FileText,
  HelpCircle,
  Info,
  Mail,
  Menu,
  Newspaper,
  ShieldCheck,
  UserPlus,
  X
} from 'lucide-react';
import hireflowLogo from '../assets/logo/hireflow-logo.svg';
import { useAuth } from '../context/AuthContext';

const authNavItems = [
  { path: '/', label: 'Home' },
  { path: '/roles', label: 'Roles' },
  { path: '/companies', label: 'Companies' },
  { path: '/community', label: 'Community' },
  { path: '/resources', label: 'Resources' },
  { path: '/dashboard', label: 'Dashboard' }
];

const publicNavItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' }
];

const moreMenuItems = [
  { path: '/blog', label: 'Blog', icon: Newspaper },
  { path: '/privacy-policy', label: 'Privacy Policy', icon: ShieldCheck },
  { path: '/terms-and-conditions', label: 'Terms & Conditions', icon: FileText },
  { path: '/contact', label: 'Contact Us', icon: Mail },
  { path: '/faqs', label: 'FAQs', icon: HelpCircle },
  { path: '/about', label: 'About', icon: Info },
  { path: '/career-tips', label: 'Career Tips', icon: BookOpenText }
];

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [showTopbar, setShowTopbar] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const displayName = user?.fullName?.trim() || 'User';

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!moreOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMoreOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 12);

      if (currentScrollY <= 20) {
        setShowTopbar(true);
      } else if (currentScrollY < lastScrollY) {
        setShowTopbar(true);
      } else if (currentScrollY > lastScrollY) {
        setShowTopbar(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const resetNavbarState = () => {
    setMobileOpen(false);
    setMoreOpen(false);
  };

  return (
    <>
      <button
        className="mobile-menu-button"
        type="button"
        aria-label="Toggle navigation"
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <header className={`topbar ${showTopbar ? '' : 'topbar-hidden'} ${isScrolled ? 'topbar-scrolled' : ''}`}>
        <div className="topbar-inner">
          <NavLink to="/" className="topbar-brand animate-logo" onClick={resetNavbarState}>
            <div className="brand">
              <img src={hireflowLogo} alt="Hireflow logo" className="brand-logo" />
            </div>
          </NavLink>

          {isAuthenticated ? (
            <nav className={`topbar-nav ${mobileOpen ? 'topbar-nav-open' : ''}`} aria-label="Primary navigation">
              {authNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={resetNavbarState}
                >
                  {item.label}
                </NavLink>
              ))}

              <button
                type="button"
                className={`nav-link nav-link-button ${moreOpen ? 'active' : ''}`}
                onClick={() => setMoreOpen(true)}
              >
                More
              </button>

              <div className="topbar-mobile-actions">
                <div className="topbar-mobile-row">
                  <NavLink
                    to="/profile"
                    aria-label="Profile page"
                    className={({ isActive }) =>
                      `topbar-user-badge ${isActive ? 'active' : ''}`
                    }
                    onClick={resetNavbarState}
                  >
                    <span className="topbar-user-emoji" aria-hidden="true">👤</span>
                    {displayName}
                  </NavLink>
                </div>
                <div className="topbar-mobile-actions-row">
                  <button
                    type="button"
                    className="auth-action-button auth-action-logout"
                    onClick={() => {
                      logout();
                      resetNavbarState();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </nav>
          ) : (
            <nav className={`topbar-nav topbar-nav-public ${mobileOpen ? 'topbar-nav-open' : ''}`} aria-label="Public navigation">
              {publicNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={resetNavbarState}
                >
                  {item.label}
                </NavLink>
              ))}

              <button
                type="button"
                className={`nav-link nav-link-button ${moreOpen ? 'active' : ''}`}
                onClick={() => setMoreOpen(true)}
              >
                More
              </button>

              <div className="topbar-mobile-actions topbar-mobile-actions-public">
                <div className="topbar-mobile-actions-row guest-auth-actions">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `auth-action-button auth-action-login ${isActive ? 'active' : ''}`
                    }
                    onClick={resetNavbarState}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `auth-action-button auth-action-register ${isActive ? 'active' : ''}`
                    }
                    onClick={resetNavbarState}
                  >
                    <span className="btn-icon" aria-hidden="true">
                      <UserPlus size={14} />
                    </span>
                    Create Account
                  </NavLink>
                </div>
              </div>
            </nav>
          )}

          <div className="topbar-right">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  aria-label="Profile page"
                  className={({ isActive }) =>
                    `topbar-user-badge ${isActive ? 'active' : ''}`
                  }
                  onClick={resetNavbarState}
                >
                  <span className="topbar-user-emoji" aria-hidden="true">👤</span>
                  {displayName}
                </NavLink>

                <button
                  type="button"
                  className="auth-action-button auth-action-logout"
                  onClick={() => {
                    logout();
                    resetNavbarState();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `auth-action-button auth-action-login ${isActive ? 'active' : ''}`
                  }
                  onClick={resetNavbarState}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `auth-action-button auth-action-register ${isActive ? 'active' : ''}`
                  }
                  onClick={resetNavbarState}
                >
                  <span className="btn-icon" aria-hidden="true">
                    <UserPlus size={14} />
                  </span>
                  Create Account
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      {moreOpen ? (
        <button
          type="button"
          aria-label="Close more menu"
          className="topbar-more-overlay"
          onClick={() => setMoreOpen(false)}
        />
      ) : null}

      <aside className={`topbar-more-drawer ${moreOpen ? 'is-open' : ''}`} aria-hidden={!moreOpen}>
        <div className="topbar-more-drawer-header">
          <div>
            <span className="section-eyebrow">More</span>
            <h3>Explore more from Marketing &amp; Sales Careers</h3>
          </div>
          <button
            type="button"
            className="topbar-more-close"
            aria-label="Close more menu"
            onClick={() => setMoreOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="topbar-more-links">
          {moreMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `topbar-more-link ${isActive ? 'active' : ''}`}
              onClick={resetNavbarState}
            >
              <span className="topbar-more-link-icon" aria-hidden="true">
                <item.icon size={16} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

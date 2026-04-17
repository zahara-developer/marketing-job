import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/roles', label: 'Roles' },
  { path: '/companies', label: 'Companies' },
  { path: '/resources', label: 'Resources' },
  { path: '/dashboard', label: 'Dashboard' }
];

const moreItems = [
  { path: '/testimonials', label: 'Testimonials' },
  { path: '/blog', label: 'Blog' },
  { path: '/faqs', label: 'FAQs' },
  { path: '/career-tips', label: 'Careers Tips' }
];

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [showTopbar, setShowTopbar] = useState(true);
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 20) {
        setShowTopbar(true);
      } else if (currentScrollY < lastScrollY) {
        setShowTopbar(true);
      } else if (currentScrollY > lastScrollY) {
        setShowTopbar(false);
        setMoreOpen(false);
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

      <header className={`topbar ${showTopbar ? '' : 'topbar-hidden'}`}>
        <div className="topbar-inner">
          <div className="topbar-brand">
            <span className="brand-mark">MS</span>
            <div className="brand-copy">
              <p>Marketing & Sales</p>
              <span>Career Studio</span>
            </div>
          </div>

          <nav className={`topbar-nav ${mobileOpen ? 'topbar-nav-open' : ''}`} aria-label="Primary navigation">
            {navItems.map((item) => (
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

            <div className="more-menu">
              <button
                type="button"
                className={`nav-link nav-link-expand ${
                  moreItems.some((item) => item.path === location.pathname) ? 'active' : ''
                }`}
                onClick={() => setMoreOpen((prev) => !prev)}
              >
                More
                <ChevronDown
                  size={16}
                  className={`chevron ${moreOpen ? 'chevron-open' : ''}`}
                />
              </button>

              <div className={`submenu ${moreOpen ? 'submenu-open' : ''}`}>
                {moreItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                    onClick={resetNavbarState}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="topbar-mobile-actions">
              <div className="topbar-mobile-row">
                <NavLink
                  to="/contact"
                  aria-label="Contact page"
                  className={({ isActive }) =>
                    `contact-corner-link ${isActive ? 'active' : ''}`
                  }
                  onClick={resetNavbarState}
                >
                  <Mail size={15} />
                </NavLink>
                {isAuthenticated && user ? (
                  <div className="topbar-user">
                    <strong>{user.fullName.split(' ')[0]}</strong>
                  </div>
                ) : null}
              </div>
              <div className="topbar-mobile-actions-row">
                {!isAuthenticated ? (
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `auth-action-button auth-action-login ${isActive ? 'active' : ''}`
                    }
                    onClick={resetNavbarState}
                  >
                    Login
                  </NavLink>
                ) : (
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
                )}
                <NavLink
                  to="/apply"
                  className={({ isActive }) =>
                    `apply-action-button ${isActive ? 'active' : ''}`
                  }
                  onClick={resetNavbarState}
                >
                  Apply
                </NavLink>
              </div>
            </div>
          </nav>

          <div className="topbar-right">
            <NavLink
              to="/contact"
              aria-label="Contact page"
              className={({ isActive }) =>
                `contact-corner-link ${isActive ? 'active' : ''}`
              }
              onClick={resetNavbarState}
            >
              <Mail size={15} />
            </NavLink>

            {isAuthenticated && user ? (
              <div className="topbar-user">
                <strong>{user.fullName.split(' ')[0]}</strong>
              </div>
            ) : null}

            {!isAuthenticated ? (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `auth-action-button auth-action-login ${isActive ? 'active' : ''}`
                }
                onClick={resetNavbarState}
              >
                Login
              </NavLink>
            ) : (
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
            )}

            <NavLink
              to="/apply"
              className={({ isActive }) =>
                `apply-action-button ${isActive ? 'active' : ''}`
              }
              onClick={resetNavbarState}
            >
              Apply
            </NavLink>
          </div>
        </div>
      </header>
    </>
  );
}

export default Sidebar;

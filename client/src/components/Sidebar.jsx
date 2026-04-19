import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Mail, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const authNavItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/roles', label: 'Roles' },
  { path: '/companies', label: 'Companies' },
  { path: '/resources', label: 'Resources' },
  { path: '/dashboard', label: 'Dashboard' }
];

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTopbar, setShowTopbar] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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
          <NavLink to="/" className="topbar-brand" onClick={resetNavbarState}>
            <span className="brand-mark">MS</span>
            <div className="brand-copy">
              <p>Marketing & Sales</p>
              <span>Career Studio</span>
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
                  {user ? (
                    <div className="topbar-user">
                      <strong>{user.fullName.split(' ')[0]}</strong>
                    </div>
                  ) : null}
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
            <div className={`topbar-nav topbar-nav-public ${mobileOpen ? 'topbar-nav-open' : ''}`}>
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
            </div>
          )}

          <div className="topbar-right">
            {isAuthenticated ? (
              <>
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

                {user ? (
                  <div className="topbar-user">
                    <strong>{user.fullName.split(' ')[0]}</strong>
                  </div>
                ) : null}

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
    </>
  );
}

export default Sidebar;

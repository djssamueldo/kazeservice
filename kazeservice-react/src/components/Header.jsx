import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import '../styles/style.css';
import { getSession, getMyProfile } from '../api/auth';
import PasswordChangeModal from './PasswordChangeModal';

const Header = ({ onRdvClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const getAvatarColor = (name) => {
    const colors = ['#12699F', '#F2921A', '#E8A93D', '#1F2937', '#667085', '#DC2626', '#059669', '#7C3AED'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const loadUser = async () => {
      const session = await getSession();
      if (session?.user) {
        const profile = await getMyProfile(session.user.id);
        setUser({
          nom: profile?.nom || session.user.email.split('@')[0],
          email: session.user.email,
          role: profile?.role || 'client',
          permissions: profile?.permissions || {},
        });
      } else {
        setUser(null);
      }
    };
    loadUser();

    // Écouter les changements d'authentification
    const handleAuthChange = () => {
      loadUser();
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAccountMenuOpen) {
        const accountMenu = document.querySelector('.account-menu-container');
        if (accountMenu && !accountMenu.contains(event.target)) {
          setIsAccountMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountMenuOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false);
        setShowPasswordModal(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const header = document.querySelector('header.site');

    const handleScroll = () => {
      if (header) {
        const isHomePage = document.body.classList.contains('home');

        if (isHomePage) {
          // Home page: header appears when scrolling down 30% of hero height
          const heroSection = document.querySelector('.hero-split');
          if (heroSection) {
            const heroHeight = heroSection.offsetHeight;
            const scrollThreshold = heroHeight * 0.3; // 30% of hero height

            if (window.scrollY > scrollThreshold) {
              header.classList.add('visible');
            } else {
              header.classList.remove('visible');
            }
          }
        } else {
          // Internal pages: header is always visible
          if (window.scrollY > 50) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }
      }
    };

    // Initial check with a small delay to ensure DOM is ready
    setTimeout(() => {
      handleScroll();
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen);
  };

  const closeAccountMenu = () => {
    setIsAccountMenuOpen(false);
  };

  const handleLogout = async () => {
    const { signOut } = await import('../api/auth');
    await signOut();
    setUser(null);
    setIsAccountMenuOpen(false);
    window.location.href = '/compte';
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <header className="site">
        <div className="container nav-row">
          <Link to="/" className="logo">
            <img src="/logo-kazeservice.jpg" alt="Kazeservices" className="header-logo-img" />
          </Link>
          <nav className="links">
            <Link to="/" className={isActive('/')}>Accueil</Link>
            <Link to="/nos-offres" className={isActive('/nos-offres')}>Nos Offres</Link>
            <Link to="/services" className={isActive('/services')}>Services</Link>
            <Link to="/transaction-immobiliere" className={isActive('/transaction-immobiliere')}>Transaction Immobilière</Link>
            <Link to="/estimer-et-vendre" className={isActive('/estimer-et-vendre')}>Estimer et Vendre</Link>
            <Link to="/faire-gerer-ma-location" className={isActive('/faire-gerer-ma-location')}>Faire Gérer Ma Location</Link>
            <Link to="/formations" className={isActive('/formations')}>Formations</Link>
            <Link to="/investir-dans-immobilier" className={isActive('/investir-dans-immobilier')}>Investir dans l'Immobilier</Link>
            <Link to="/partenaire" className={isActive('/partenaire')}>Partenaire</Link>
            <Link to="/contact" className={isActive('/contact')}>Contact</Link>
            <div className="dropdown">
              <span className="dropdown-toggle">Autres ▾</span>
              <div className="dropdown-menu">
                <Link to="/placement-personnel">Placement Personnel</Link>
                <Link to="/services-informatiques">Services Informatiques</Link>
              </div>
            </div>
          </nav>
          <div className="nav-actions">
            <button className="btn-appointment" id="rdvBtn" onClick={onRdvClick || (() => {})}>Prendre RDV</button>
            <div className="account-menu-container">
              <button
                className="account-avatar"
                aria-label="Ouvrir le menu compte"
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                title="Mon compte"
                onClick={user ? toggleAccountMenu : () => navigate('/compte')}
              >
                {user ? (
                  <div className="avatar-initials" style={{ backgroundColor: getAvatarColor(user.nom || user.email) }}>
                    {getInitials(user.nom || user.email)}
                  </div>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 2.25c-3.004 0-9 1.508-9 4.5V21h18v-2.25c0-2.992-5.996-4.5-9-4.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              {user && isAccountMenuOpen && (
                <div className="account-dropdown-menu" role="menu">
                  <div className="account-dropdown-header">
                    <div className="avatar-initials" style={{ backgroundColor: getAvatarColor(user.nom || user.email) }}>
                      {getInitials(user.nom || user.email)}
                    </div>
                    <div className="account-dropdown-info">
                      <span className="account-dropdown-name">{user.nom}</span>
                      <span className="account-dropdown-email">{user.email}</span>
                    </div>
                  </div>
                  <div className="account-dropdown-divider"></div>
                  <Link to="/compte" className="account-dropdown-item" role="menuitem" onClick={closeAccountMenu}>
                    Mon compte
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'staff') && (
                    <>
                      <div className="account-dropdown-divider"></div>
                      <Link to="/admin" className="account-dropdown-item" role="menuitem" onClick={closeAccountMenu}>
                        Administration
                      </Link>
                    </>
                  )}
                  <button
                    className="account-dropdown-item"
                    role="menuitem"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      setShowPasswordModal(true);
                    }}
                    type="button"
                  >
                    Changer le mot de passe
                  </button>
                  <div className="account-dropdown-divider"></div>
                  <button className="account-dropdown-item account-dropdown-danger" role="menuitem" onClick={handleLogout}>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
          <button className="burger" id="navBurger" aria-label="Ouvrir le menu" onClick={toggleMobileMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            <img src="/logo-kazeservice.jpg" alt="Kazeservices" className="header-logo-img" />
          </Link>
          <button className="mobile-menu-close" aria-label="Fermer le menu" onClick={closeMobileMenu}>&times;</button>
        </div>
        <nav className="mobile-menu-links">
          <Link to="/" onClick={closeMobileMenu}>Accueil</Link>
          <Link to="/nos-offres" onClick={closeMobileMenu}>Nos Offres</Link>
          <Link to="/services" onClick={closeMobileMenu}>Services</Link>
          <Link to="/transaction-immobiliere" onClick={closeMobileMenu}>Transaction Immobilière</Link>
          <Link to="/estimer-et-vendre" onClick={closeMobileMenu}>Estimer et Vendre</Link>
          <Link to="/faire-gerer-ma-location" onClick={closeMobileMenu}>Faire Gérer Ma Location</Link>
          <Link to="/formations" onClick={closeMobileMenu}>Formations</Link>
          <Link to="/investir-dans-immobilier" onClick={closeMobileMenu}>Investir dans l'Immobilier</Link>
          <Link to="/partenaire" onClick={closeMobileMenu}>Partenaire</Link>
          <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>
          <Link to="/placement-personnel" onClick={closeMobileMenu}>Placement Personnel</Link>
          <Link to="/services-informatiques" onClick={closeMobileMenu}>Services Informatiques</Link>
        </nav>
        <nav className="mobile-menu-actions">
          <button className="btn-appointment" id="mobileRdvBtn" onClick={() => { closeMobileMenu(); if (onRdvClick) onRdvClick(); }}>Prendre RDV</button>
        </nav>
      </div>

      <PasswordChangeModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </>
  );
};

export default Header;

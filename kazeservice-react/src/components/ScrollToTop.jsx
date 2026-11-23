import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si il y a un hash, on laisse le comportement naturel du navigateur gérer le scroll vers l'ancre
    if (hash) {
      return;
    }

    // Sinon, on scroll en haut de la page lors du changement de route
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;

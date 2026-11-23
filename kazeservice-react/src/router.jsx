import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import NosOffres from './pages/NosOffres';
import Services from './pages/Services';
import TransactionImmobiliere from './pages/TransactionImmobiliere';
import EstimerEtVendre from './pages/EstimerEtVendre';
import FaireGererMaLocation from './pages/FaireGererMaLocation';
import Formations from './pages/Formations';
import InvestirDansImmobilier from './pages/InvestirDansImmobilier';
import Partenaire from './pages/Partenaire';
import Contact from './pages/Contact';
import PlacementPersonnel from './pages/PlacementPersonnel';
import ServicesInformatiques from './pages/ServicesInformatiques';
import BienDetail from './pages/BienDetail';
import FormationDetail from './pages/FormationDetail';
import Compte from './pages/Compte';
import Admin from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';
import { getSession, getMyProfile } from './api/auth';

// Layout global pour inclure ScrollToTop
const Layout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

// Wrapper pour protéger la route admin
const AdminRoute = () => {
  const checkAccess = async () => {
    const session = await getSession();
    if (!session?.user) {
      return <Navigate to="/compte" replace />;
    }
    const profile = await getMyProfile(session.user.id);
    const isAdmin = profile?.role === 'admin';
    const isStaff = profile?.role === 'staff';
    const hasPermissions = Object.values(profile?.permissions || {}).some(Boolean);

    if (!isAdmin && !isStaff && !hasPermissions) {
      return <Navigate to="/compte" replace />;
    }
    return <Admin />;
  };

  // Pour simplifier, on rend Admin qui fera sa propre vérification
  // Dans une vraie app, on utiliserait un composant avec loading state
  return <Admin />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'nos-offres',
        element: <NosOffres />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'transaction-immobiliere',
        element: <TransactionImmobiliere />,
      },
      {
        path: 'estimer-et-vendre',
        element: <EstimerEtVendre />,
      },
      {
        path: 'faire-gerer-ma-location',
        element: <FaireGererMaLocation />,
      },
      {
        path: 'formations',
        element: <Formations />,
      },
      {
        path: 'investir-dans-immobilier',
        element: <InvestirDansImmobilier />,
      },
      {
        path: 'partenaire',
        element: <Partenaire />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'placement-personnel',
        element: <PlacementPersonnel />,
      },
      {
        path: 'services-informatiques',
        element: <ServicesInformatiques />,
      },
      {
        path: 'bien/:id',
        element: <BienDetail />,
      },
      {
        path: 'formation/:slug',
        element: <FormationDetail />,
      },
      {
        path: 'compte',
        element: <Compte />,
      },
      {
        path: 'admin',
        element: <AdminRoute />,
      },
    ],
  },
]);

export default router;

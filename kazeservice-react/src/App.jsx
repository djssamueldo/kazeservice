import { RouterProvider } from 'react-router-dom';
import router from './router';
import './styles/style.css';
import './styles/responsive-optimized.css';
import './styles/responsive-intelligent.css';

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

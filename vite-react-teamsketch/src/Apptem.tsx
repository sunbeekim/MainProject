import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/account/Login';
import Signup from './pages/account/Signup';
import MainLayout from './components/layout/MainLayout';
import { useCategories } from './hooks/useCategories';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  useCategories();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const publicPaths = ['/login', '/signup'];
    
    if (!token && !publicPaths.includes(location.pathname)) {
      navigate('/login');
    }
  }, [navigate, location]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      <main className={`flex-1 ${!isAuthPage ? 'pt-12' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute>                
                <MainLayout />               
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default App;

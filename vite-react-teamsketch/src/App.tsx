import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/login/Login';
import Signup from './pages/login/Signup';
import MainLayout from './components/layout/MainLayout';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const publicPaths = ['/login', '/signup'];
    
    if (!token && !publicPaths.includes(location.pathname)) {
      navigate('/login');
    }
  }, [navigate, location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 ${isAuthPage ? 'bg-gray-50 dark:bg-gray-900' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <div className="pb-16">
                  <MainLayout />
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;

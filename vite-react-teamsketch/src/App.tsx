import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/login/Login';
import Signup from './pages/login/Signup';
import MainLayout from './components/layout/MainLayout';

const App = () => {
  return (
    <div className="min-h-screen pb-16">
      <Header />
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
      <Footer />
    </div>
  );
};

export default App;

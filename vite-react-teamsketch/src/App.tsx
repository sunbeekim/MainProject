
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MainLayout from './components/layout/MainLayout';

const App = () => {
  return (
    <div className="min-h-screen pb-16">
      <Header />
      <MainLayout />
      <Footer />
    </div>
  );
};

export default App;

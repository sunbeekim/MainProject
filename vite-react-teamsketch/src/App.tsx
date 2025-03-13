import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MainLayout from './components/layout/MainLayout';
import { useCategories } from './hooks/useCategories';

const App = () => {
  useCategories();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <MainLayout />
      </main>
      <Footer />
    </div>
  );
};

export default App;

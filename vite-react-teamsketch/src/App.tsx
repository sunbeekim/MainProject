
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MainLayout from './components/layout/MainLayout';

const App = () => {
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

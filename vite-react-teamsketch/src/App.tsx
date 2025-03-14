import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MainLayout from './components/layout/MainLayout';
import { useCategories } from './hooks/useCategories';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  useCategories();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <MainLayout />
      </main>
      <Footer />
      <ToastContainer
  position="top-center"
  autoClose={2000}
  hideProgressBar={false} // 진행 바 숨김 (깔끔한 디자인)
  newestOnTop={true}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="dark"
  toastClassName={() =>
    "relative flex items-center rounded-lg shadow-lg bg-primary-500 text-white text-sm p-4 mb-4 mt-12"
  }
  progressClassName="bg-primary-500"
/>

    </div>
  );
};

export default App;

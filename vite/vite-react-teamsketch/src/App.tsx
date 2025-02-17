
import { Routes, Route } from 'react-router-dom';

import Header from './components/layout/header/Header';
import Home from './pages/Home';
import Login from './pages/Login';


const App = () => {
  return (
    <div>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

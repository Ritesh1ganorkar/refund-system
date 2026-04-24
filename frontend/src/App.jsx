import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SellerDashboard from './pages/SellerDashboard';
import ReturnPage from './pages/ReturnPage';
import { AppProvider } from './context/AppContext';

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen w-full relative overflow-hidden transition-colors duration-500">
      {/* Decorative background glow elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-pulse pointer-events-none transition-all duration-1000"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-pulse delay-700 pointer-events-none transition-all duration-1000"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-400/20 dark:bg-pink-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-pulse delay-1000 pointer-events-none transition-all duration-1000"></div>

      <Navbar />
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/return/:orderId/:productId" element={<ReturnPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

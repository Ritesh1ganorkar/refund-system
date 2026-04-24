import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { t } = useContext(AppContext);

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('https://refund-system.onrender.com/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleRunDemo = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first to run the automated demo.');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      await axios.post('https://refund-system.onrender.com/demo/run', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('🎬 Demo sequence executed successfully! Redirecting to dashboard to track the automated return.');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Demo execution failed');
      setLoading(false);
    }
  };

  const handleBuy = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to buy items.');
      navigate('/login');
      return;
    }

    try {
      await axios.post('https://refund-system.onrender.com/orders', {
        items: [{ productId: product.id, name: product.name, price: product.price, quantity: 1 }],
        totalAmount: product.price
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order placed successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to place order');
    }
  };

  const filteredProducts = products.filter(p => {
    if (!p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'low-return') return p.price > 100; // Mock logic
    if (filter === 'fast-refund') return p.price < 50; // Mock logic
    return true;
  });

  return (
    <div className="flex flex-col gap-16 pb-16 relative">
      {/* HERO SECTION */}
      <section className="relative w-full rounded-3xl overflow-hidden glass-card mt-6 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/40">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-blue-900/40 mix-blend-overlay"></div>
        <div className="relative px-8 py-24 md:py-32 flex flex-col items-center text-center max-w-4xl mx-auto z-10 animate-fade-in-up">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md shadow-sm border border-white/20 mb-8 hover:scale-105 hover:shadow-purple-500/30 transition-all cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
            <span className="text-xs font-bold text-gray-200 uppercase tracking-widest">{t.aiPowered} Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight text-white drop-shadow-xl">
            {t.heroTitle.split(' ').slice(0, 2).join(' ')} <br className="hidden md:block" />
            <span className="text-gradient drop-shadow-2xl">{t.heroTitle.split(' ').slice(2).join(' ')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-medium leading-relaxed drop-shadow-md">
            {t.heroSub}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold border border-blue-500/30 flex items-center gap-1 shadow-inner shadow-blue-500/20">
              🤖 {t.aiPowered}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-yellow-500/20 text-yellow-300 text-sm font-bold border border-yellow-500/30 flex items-center gap-1 shadow-inner shadow-yellow-500/20">
              ⚡ {t.instantEligible}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 text-sm font-bold border border-pink-500/30 flex items-center gap-1 shadow-inner shadow-pink-500/20">
              🛡️ {t.fraudDetection}
            </span>
          </div>
          
          <div className="relative w-full max-w-xl group mb-8">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-purple-400 group-focus-within:text-purple-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="block w-full pl-14 pr-32 py-5 border border-white/20 bg-white/10 backdrop-blur-xl rounded-full leading-5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 text-lg shadow-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 font-medium text-white placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="absolute inset-y-2 right-2 btn-gradient px-8 py-2 rounded-full font-bold shadow-md">
              {t.searchBtn}
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={handleRunDemo}
              className="btn-gradient-secondary px-8 py-4 rounded-full font-black tracking-wide flex items-center gap-2"
            >
              {t.runDemo}
            </button>
            <button 
              className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-black tracking-wide shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-white/20 hover:border-purple-400 hover:shadow-purple-500/30 hover:bg-white/20"
            >
              {t.instantRefund}
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 px-2 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">Featured Collection</h2>
            <p className="text-gray-400 mt-2 font-medium">Curated products with hassle-free returns</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 border ${filter === 'all' ? 'btn-gradient border-transparent' : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:text-white hover:border-purple-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('low-return')} 
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 border ${filter === 'low-return' ? 'btn-gradient border-transparent' : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:text-white hover:border-purple-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]'}`}
            >
              {t.lowReturn}
            </button>
            <button 
              onClick={() => setFilter('fast-refund')} 
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 hover:scale-105 border ${filter === 'fast-refund' ? 'btn-gradient border-transparent' : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:text-white hover:border-purple-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]'}`}
            >
              <svg className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.8)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
              Fast Refund
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="glass-card p-5 h-[420px] flex flex-col animate-pulse">
                <div className="w-full h-48 bg-white/10 rounded-2xl mb-4"></div>
                <div className="h-6 bg-white/10 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-5/6 flex-grow"></div>
                <div className="flex justify-between mt-4">
                  <div className="h-8 bg-white/10 rounded w-1/3"></div>
                  <div className="h-10 bg-white/10 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p, i) => (
              <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <ProductCard product={p} onBuy={handleBuy} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card py-20 text-center flex flex-col items-center justify-center animate-fade-in-up">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
            <p className="text-gray-400 font-medium">Try adjusting your search query.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

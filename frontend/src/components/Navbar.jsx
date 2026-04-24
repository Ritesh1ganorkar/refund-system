import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const { lang, setLang, t } = useContext(AppContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold tracking-tight hover:scale-105 transition-transform duration-300 drop-shadow-md">
          <span className="text-gradient">Refund</span>
          <span className="text-white">Pro</span>
        </Link>
        <div className="flex gap-6 items-center">

          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="bg-white/10 text-white text-sm rounded-xl border border-white/20 focus:ring-purple-500 focus:border-purple-500 block p-2 transition-all hover:shadow-lg hover:shadow-purple-500/20 outline-none backdrop-blur-md cursor-pointer"
          >
            <option value="en" className="bg-slate-900">English</option>
            <option value="hi" className="bg-slate-900">हिंदी</option>
          </select>

          {user ? (
            <>
              {user.role === 'seller' ? (
                <Link to="/seller-dashboard" className="text-gray-300 font-medium relative group hover:text-white transition-colors hidden sm:block">
                  {t.manageBusiness}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"></span>
                </Link>
              ) : (
                <Link to="/dashboard" className="text-gray-300 font-medium relative group hover:text-white transition-colors hidden sm:block">
                  {t.dashboard}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"></span>
                </Link>
              )}
              
              <div className="flex items-center gap-4 pl-4 border-l border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[2px] shadow-lg shadow-purple-500/30 cursor-pointer hover:scale-110 transition-transform">
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                      <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-400 font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span className="text-white font-semibold hidden lg:block">Hi, {user.name}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="bg-white/10 text-pink-400 font-semibold border border-pink-500/30 px-5 py-2 rounded-xl hover:bg-pink-500/20 hover:text-pink-300 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 ease-in-out active:scale-95"
                >
                  {t.logout}
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn-gradient px-6 py-2.5 rounded-xl font-semibold tracking-wide">
              {t.login}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

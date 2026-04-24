import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const { t } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        console.log("Attempting login with:", formData.email);
        const res = await axios.post('http://127.0.0.1:5000/auth/login', {
          email: formData.email,
          password: formData.password
        });
        console.log("Login successful, token received");
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate(res.data.user.role === 'seller' ? '/seller-dashboard' : '/dashboard');
      } else {
        console.log("Attempting signup for:", formData.email);
        await axios.post('http://127.0.0.1:5000/auth/signup', {
          ...formData,
          role: isSeller ? 'seller' : 'user'
        });
        alert('Signup successful, please login');
        setIsLogin(true);
      }
    } catch (err) {
      console.error("FULL ERROR OBJECT:", err);
      if (err.response) {
        console.error("BACKEND RESPONSE DATA:", err.response.data);
        console.error("BACKEND RESPONSE STATUS:", err.response.status);
      } else if (err.request) {
        console.error("NO RESPONSE RECEIVED (NETWORK ERROR):", err.request);
      } else {
        console.error("REQUEST SETUP ERROR:", err.message);
      }
      alert(err.response?.data?.message || err.message || "An error occurred during authentication");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-lg glass-card p-10 md:p-14 relative overflow-hidden group shadow-2xl shadow-[0_0_40px_rgba(139,92,246,0.15)] animate-fade-in-up border-white/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full blur-2xl opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-gradient-to-tr from-blue-500 to-pink-500 rounded-full blur-2xl opacity-40 pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <h2 className="text-4xl font-black tracking-tight mb-2 text-white drop-shadow-md">
            {isLogin ? 'Welcome Back' : 'Join '}
            {!isLogin && <span className="text-gradient drop-shadow-lg">RefundPro</span>}
          </h2>
          <p className="text-gray-400 font-medium">
            {isLogin ? 'Enter your details to access your account' : 'Create an account to start shopping or selling'}
          </p>
        </div>
        
        {!isLogin && (
          <div className="flex bg-black/20 backdrop-blur-md p-1.5 rounded-2xl mb-8 relative z-10 shadow-inner border border-white/10">
            <button 
              type="button"
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${!isSeller ? 'bg-white/10 border border-white/20 text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.3)] transform scale-[1.02]' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => setIsSeller(false)}
            >
              Customer
            </button>
            <button 
              type="button"
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${isSeller ? 'bg-white/10 border border-white/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)] transform scale-[1.02]' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => setIsSeller(true)}
            >
              Seller
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          {!isLogin && (
            <div className="relative group">
              <input 
                type="text" 
                id="name"
                className="block w-full px-5 pt-6 pb-2 text-white bg-white/10 border border-white/20 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all peer shadow-inner hover:bg-white/20" 
                placeholder=" "
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
              <label htmlFor="name" className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-purple-400 font-medium">Full Name</label>
            </div>
          )}
          
          <div className="relative group">
            <input 
              type="email" 
              id="email"
              className="block w-full px-5 pt-6 pb-2 text-white bg-white/10 border border-white/20 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all peer shadow-inner hover:bg-white/20" 
              placeholder=" "
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
            <label htmlFor="email" className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-purple-400 font-medium">Email Address</label>
          </div>

          <div className="relative group">
            <input 
              type="password" 
              id="password"
              className="block w-full px-5 pt-6 pb-2 text-white bg-white/10 border border-white/20 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all peer shadow-inner hover:bg-white/20" 
              placeholder=" "
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required
            />
            <label htmlFor="password" className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-purple-400 font-medium">Password</label>
          </div>

          <button type="submit" className="btn-gradient w-full py-4 rounded-2xl font-bold text-lg mt-2 tracking-wide flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            {isLogin ? 'Sign In' : 'Create Account'}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center relative z-10">
          <p className="text-gray-400 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              className="text-purple-400 font-bold hover:text-purple-300 transition-colors ml-1 focus:outline-none drop-shadow-md" 
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '' });
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

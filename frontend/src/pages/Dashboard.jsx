import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { t } = useContext(AppContext);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userStr || !token) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    setUser(user);

    axios.get(`https://refund-system.onrender.com/orders/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));

    axios.get(`https://refund-system.onrender.com/returns/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setReturns(res.data))
      .catch(err => console.error(err));
  }, [navigate]);

  return (
    <div className="max-w-6xl mx-auto py-8 bg-radial-glow relative z-10">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight mb-2 text-white drop-shadow-lg">{t.customerDashboard}</h1>
          <p className="text-gray-400 font-medium text-lg">Manage your orders and track refunds seamlessly.</p>
        </div>
        {user && (
          <div className="glass-card p-4 flex items-center gap-4 animate-fade-in-up border-[#22D3EE]/30 shadow-[0_0_25px_rgba(34,211,238,0.2)] bg-gradient-to-r from-white/5 to-[#22D3EE]/5 hover:scale-105 transition-all cursor-default">
            <div>
              <p className="text-xs text-[#22D3EE] font-bold uppercase tracking-widest mb-1">AI {t.trustScore}</p>
              <div className="flex items-center gap-2">
                <div className="relative w-14 h-14 flex items-center justify-center rounded-full bg-black/60 shadow-inner border border-white/5">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={`${(user.trustScore ?? 100) * 1.5} 150`} className={`${user.trustScore >= 80 ? 'text-[#34D399] drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : user.trustScore >= 50 ? 'text-[#FBBF24] drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'} transition-all duration-1000`} />
                  </svg>
                  <span className={`relative text-lg font-black ${user.trustScore >= 80 ? 'text-[#34D399] drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : user.trustScore >= 50 ? 'text-[#FBBF24]' : 'text-red-500'}`}>
                    {user.trustScore ?? 100}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className={`px-4 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1.5 border uppercase tracking-wider ${user.trustScore >= 80 ? 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]'}`}>
                {user.trustScore >= 80 ? `🛡️ ${t.trustedUser}` : `⚠ ${t.riskyUser}`}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column - Orders */}
        <div className="lg:col-span-2">
          
          <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up">
            <div className="glass-card p-5 text-center hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] border-t-2 border-t-[#8B5CF6] bg-gradient-to-b from-[#8B5CF6]/10 to-transparent">
              <p className="text-xs text-[#A78BFA] font-bold uppercase tracking-wider">{t.orders}</p>
              <p className="text-3xl font-black text-white drop-shadow-md">{orders.length}</p>
            </div>
            <div className="glass-card p-5 text-center hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] border-t-2 border-t-[#22D3EE] bg-gradient-to-b from-[#22D3EE]/10 to-transparent">
              <p className="text-xs text-[#67E8F9] font-bold uppercase tracking-wider">{t.refundSpeed}</p>
              <p className="text-3xl font-black text-white drop-shadow-md">&lt; 2m</p>
            </div>
            <div className="glass-card p-5 text-center hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] border-t-2 border-t-[#EC4899] bg-gradient-to-b from-[#EC4899]/10 to-transparent">
              <p className="text-xs text-[#F472B6] font-bold uppercase tracking-wider">{t.successRate}</p>
              <p className="text-3xl font-black text-white drop-shadow-md">99%</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black flex items-center gap-3 text-white drop-shadow-md">
              <div className="p-2.5 bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] text-white rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              Purchase History
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {orders.length === 0 ? (
              <div className="glass-card p-12 text-center flex flex-col items-center animate-fade-in-up border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/10">
                  <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium text-lg">No orders yet.</p>
                <Link to="/" className="mt-6 text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] font-black hover:opacity-80 transition-opacity drop-shadow-sm text-lg">Start Shopping →</Link>
              </div>
            ) : (
              orders.map((order, i) => (
                <div key={order.id} className="glass-card overflow-hidden group hover:-translate-y-1 transition-all duration-400 animate-fade-in-up border-white/10 hover:shadow-[0_0_25px_rgba(139,92,246,0.2)] hover:border-[#8B5CF6]/50" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between items-center group-hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Order Number</p>
                      <p className="font-mono font-bold text-gray-200 drop-shadow-sm">#{order.id.substring(0, 8)}...</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total</p>
                      <p className="font-black text-2xl text-[#22D3EE] drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">${order.totalAmount}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-4">
                    {order.items.map(item => (
                      <div key={item.productId} className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/30 p-4 rounded-2xl border border-white/5 shadow-inner hover:bg-white/5 transition-colors gap-4 group/item hover:border-white/10">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6]/20 to-[#3B82F6]/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#8B5CF6]/30 shadow-[0_0_10px_rgba(139,92,246,0.1)] group-hover/item:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all">
                            <svg className="w-8 h-8 text-[#A78BFA] drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg drop-shadow-sm group-hover/item:text-[#A78BFA] transition-colors">{item.name}</p>
                            <p className="text-gray-400 font-medium">Qty: {item.quantity} • <span className="text-[#22D3EE] font-bold">${item.price}</span></p>
                          </div>
                        </div>
                        <Link 
                          to={`/return/${order.id}/${item.productId}`} 
                          className="bg-white/10 border border-white/20 text-white hover:bg-gradient-to-r hover:from-[#EC4899] hover:to-[#8B5CF6] hover:border-transparent px-6 py-2.5 rounded-xl font-bold text-sm transition-all text-center flex-shrink-0 shadow-sm hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:scale-105"
                        >
                          Return / Track
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Returns */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black flex items-center gap-3 text-white drop-shadow-md">
              <div className="p-2.5 bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] text-white rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {t.returnRequests}
            </h2>
          </div>

          <div className="glass-card p-6 animate-fade-in-up border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            {returns.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                <p className="text-gray-400 font-medium">No active returns.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {returns.map(ret => (
                  <div key={ret.id} className="bg-black/30 border border-white/5 p-5 rounded-2xl shadow-inner hover:bg-white/5 transition-colors relative overflow-hidden group hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:border-white/10">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#8B5CF6] to-[#22D3EE] shadow-[0_0_10px_rgba(139,92,246,0.8)]"></div>
                    
                    <div className="mb-4 pl-1">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Return ID</p>
                      <p className="font-mono text-sm text-gray-300 break-all">{ret.id}</p>
                    </div>
                    
                    <div className="flex justify-between items-end mb-5 pl-1">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
                        <span className="inline-flex items-center gap-1.5 bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-[#93C5FD] px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                          <span className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse shadow-[0_0_5px_rgba(96,165,250,0.8)]"></span>
                          {ret.status}
                        </span>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/return/${ret.orderId}/${ret.productId}`} 
                      className="block w-full text-center bg-white/5 hover:bg-gradient-to-r hover:from-[#8B5CF6] hover:to-[#3B82F6] text-white font-bold py-3 rounded-xl transition-all text-sm border border-white/10 hover:border-transparent hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    >
                      {t.viewDetails}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

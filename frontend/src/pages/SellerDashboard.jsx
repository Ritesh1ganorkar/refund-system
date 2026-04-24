import { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [returns, setReturns] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', imageUrl: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { t } = useContext(AppContext);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr || !token) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'seller') {
      navigate('/dashboard');
      return;
    }

    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data.filter(p => p.sellerId === user.id)))
      .catch(err => console.error(err));

    axios.get(`http://localhost:5000/returns/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setReturns(res.data))
      .catch(err => console.error(err));
  }, [navigate, token]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setNewProduct({ ...newProduct, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts([...products, res.data]);
      setNewProduct({ name: '', price: '', description: '', imageUrl: '' });
      setPreviewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      alert('Failed to add product');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await axios.put(`http://localhost:5000/returns/status/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReturns(returns.map(r => r.id === id ? res.data : r));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-4 min-h-[85vh] bg-radial-glow">
      {/* LEFT SIDEBAR */}
      <div className="w-full lg:w-72 flex flex-col gap-6 flex-shrink-0">
        <div className="glass-card p-6 sticky top-24 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#EC4899] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)] text-white font-bold text-xl">
              S
            </div>
            <div>
              <h2 className="font-bold text-white text-lg leading-tight drop-shadow-md">Seller Portal</h2>
              <p className="text-sm text-gray-400 font-medium">{t.manageBusiness}</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left ${activeTab === 'products' ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-500/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'text-gray-400 hover:bg-white/10 hover:text-white border border-transparent'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Products Catalog
            </button>
            <button 
              onClick={() => setActiveTab('returns')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left ${activeTab === 'returns' ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-500/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'text-gray-400 hover:bg-white/10 hover:text-white border border-transparent'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
              </svg>
              {t.returnRequests}
              {returns.filter(r => r.status === 'Requested').length > 0 && (
                <span className="ml-auto bg-gradient-to-r from-pink-500 to-[#8B5CF6] text-white text-xs px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.6)] animate-pulse">
                  {returns.filter(r => r.status === 'Requested').length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 w-full flex flex-col gap-8">
        
        {/* ANALYTICS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
          <div className="glass-card p-5 flex flex-col justify-center transition-all hover:scale-105 border-t-2 border-t-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] bg-gradient-to-br from-purple-500/10 to-transparent">
            <p className="text-xs text-purple-300 font-bold uppercase tracking-wider mb-1">{t.totalProducts}</p>
            <p className="text-3xl font-black text-white drop-shadow-md">{products.length}</p>
          </div>
          <div className="glass-card p-5 flex flex-col justify-center transition-all hover:scale-105 border-t-2 border-t-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-gradient-to-br from-[#3B82F6]/10 to-transparent">
            <p className="text-xs text-[#3B82F6] font-bold uppercase tracking-wider mb-1">{t.totalOrders}</p>
            <p className="text-3xl font-black text-white drop-shadow-md">{Math.max(10, returns.length * 5)}</p>
          </div>
          <div className="glass-card p-5 flex flex-col justify-center transition-all hover:scale-105 border-t-2 border-t-[#EC4899] shadow-[0_0_15px_rgba(236,72,153,0.1)] hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] bg-gradient-to-br from-[#EC4899]/10 to-transparent">
            <p className="text-xs text-[#EC4899] font-bold uppercase tracking-wider mb-1">{t.returnRate}</p>
            <p className="text-3xl font-black text-white drop-shadow-md">{returns.length ? Math.round((returns.length / Math.max(10, returns.length * 5)) * 100) : 0}%</p>
          </div>
          <div className="glass-card p-5 flex flex-col justify-center transition-all hover:scale-105 border-t-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] bg-gradient-to-br from-red-500/20 to-transparent">
            <p className="text-xs text-red-300 font-bold uppercase tracking-wider mb-1">{t.fraudSuspected}</p>
            <p className="text-3xl font-black text-red-400 drop-shadow-md">{returns.filter(r => r.fraudFlag === 'Risky').length}</p>
          </div>
        </div>
        
        {activeTab === 'products' && (
          <div className="animate-fade-in-up">
            <div className="glass-card p-8 mb-8 relative overflow-hidden shadow-lg shadow-purple-500/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>
              <h2 className="text-2xl font-black mb-6 relative z-10 flex items-center gap-2 text-white">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Product
              </h2>
              
              <form onSubmit={handleAddProduct} className="flex flex-col gap-5 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative">
                    <label className="block text-sm font-bold text-gray-300 mb-1">Product Name</label>
                    <input type="text" className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner outline-none hover:bg-white/20" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-bold text-gray-300 mb-1">Price ($)</label>
                    <input type="number" className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner outline-none hover:bg-white/20" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-300 mb-1">Description</label>
                  <textarea rows="3" className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner resize-none outline-none hover:bg-white/20" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required />
                </div>
                <div className="relative mb-2">
                  <label className="block text-sm font-bold text-gray-300 mb-1">Upload Product Image</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed border-purple-500/50 rounded-xl cursor-pointer bg-purple-500/10 hover:bg-purple-500/20 transition-colors shadow-inner relative overflow-hidden group">
                      {previewImage ? (
                        <div className="absolute inset-0 w-full h-full">
                          <img src={previewImage} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-black/70 text-white px-3 py-1 rounded-full font-bold text-sm border border-white/20">Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-8 h-8 text-purple-400 mb-2 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-purple-300 font-bold">Click to upload</span>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn-gradient self-end px-10 py-4 rounded-xl font-bold tracking-wide flex items-center gap-2 mt-4 text-lg">
                  Publish Product
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                </button>
              </form>
            </div>

            <h2 className="text-2xl font-black mb-6 px-2 text-white drop-shadow-md">Product Catalog</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.length === 0 ? (
                <div className="col-span-full glass-card py-16 text-center">
                  <p className="text-gray-400 font-medium">You haven't listed any products yet.</p>
                </div>
              ) : products.map(p => (
                <div key={p.id} className="glass-card p-5 flex flex-col group hover:scale-105 transition-all duration-300 relative overflow-hidden border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#8B5CF6]/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  <div className="w-full h-48 bg-white/5 rounded-xl mb-4 overflow-hidden relative shadow-inner border border-white/10 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-[#EC4899]/20 flex items-center justify-center">
                        <svg className="w-12 h-12 text-white/30 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="font-black text-xl text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#EC4899] group-hover:to-[#8B5CF6] transition-all drop-shadow-sm">{p.name}</h3>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#22D3EE] font-black text-2xl mt-auto drop-shadow-md">${p.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-black mb-6 px-2 text-white drop-shadow-md">{t.returnRequests}</h2>
            <div className="flex flex-col gap-6">
              {returns.length === 0 ? (
                <div className="glass-card py-16 text-center border-white/20">
                  <p className="text-gray-400 font-medium">No return requests to manage.</p>
                </div>
              ) : returns.map(ret => (
                <div key={ret.id} className="glass-card p-0 overflow-hidden group hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 border-white/20 hover:scale-[1.02]">
                  <div className={`h-2 w-full shadow-[0_0_15px_currentColor] ${
                    ret.status === 'Requested' ? 'bg-[#3B82F6] text-[#3B82F6]' :
                    ret.status === 'Approved' ? 'bg-[#10B981] text-[#10B981]' :
                    ret.status === 'Picked Up' ? 'bg-[#F59E0B] text-[#F59E0B]' : 'bg-[#8B5CF6] text-[#8B5CF6]'
                  }`}></div>
                  
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-start mb-6 gap-2">
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Return ID</p>
                          <p className="font-mono font-bold text-gray-200">{ret.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border ${
                            ret.status === 'Requested' ? 'bg-[#3B82F6]/20 text-[#60A5FA] border-[#3B82F6]/30' :
                            ret.status === 'Approved' ? 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/30' :
                            ret.status === 'Picked Up' ? 'bg-[#F59E0B]/20 text-[#FBBF24] border-[#F59E0B]/30' : 
                            'bg-[#8B5CF6]/20 text-[#A78BFA] border-[#8B5CF6]/30'
                          }`}>
                            {ret.status}
                          </span>
                          {ret.fraudFlag && (
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border shadow-[0_0_10px_currentColor] ${
                              ret.fraudFlag === 'Risky' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/50'
                            }`}>
                              {ret.fraudFlag === 'Risky' ? `⚠ ${t.risky}` : `✔ ${t.verified}`}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-black/30 p-4 rounded-xl border border-white/5 mb-6 shadow-inner">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Customer Reason</p>
                        <p className="text-gray-300 font-medium italic drop-shadow-sm">"{ret.reason}"</p>
                      </div>

                      {ret.proofImage && (
                        <div className="mb-6">
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Proof Image</p>
                          <img src={`http://localhost:5000${ret.proofImage}`} alt="Proof" className="h-40 object-cover rounded-xl border border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer hover:opacity-90 hover:scale-105 transition-all" />
                        </div>
                      )}
                    </div>
                    
                    <div className="md:w-64 flex flex-col justify-center gap-3 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 text-center">Actions</p>
                      
                      <button 
                        onClick={() => handleUpdateStatus(ret.id, 'Approved')} 
                        disabled={ret.status !== 'Requested'}
                        className={`py-3 px-4 rounded-xl font-bold transition-all ${ret.status === 'Requested' ? 'bg-white/10 border border-[#10B981]/50 text-[#34D399] hover:bg-[#10B981]/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105' : 'bg-white/5 text-gray-600 cursor-not-allowed border-transparent'}`}
                      >
                        {t.approveReturn}
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(ret.id, 'Picked Up')} 
                        disabled={ret.status !== 'Approved'}
                        className={`py-3 px-4 rounded-xl font-bold transition-all ${ret.status === 'Approved' ? 'bg-white/10 border border-[#F59E0B]/50 text-[#FBBF24] hover:bg-[#F59E0B]/20 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105' : 'bg-white/5 text-gray-600 cursor-not-allowed border-transparent'}`}
                      >
                        {t.markPickedUp}
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(ret.id, 'Refunded')} 
                        disabled={ret.status !== 'Picked Up'}
                        className={`py-3 px-4 rounded-xl font-bold transition-all ${ret.status === 'Picked Up' ? 'bg-white/10 border border-[#8B5CF6]/50 text-[#A78BFA] hover:bg-[#8B5CF6]/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-105' : 'bg-white/5 text-gray-600 cursor-not-allowed border-transparent'}`}
                      >
                        {t.issueRefund}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;

import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReturnProgress from '../components/ReturnProgress';
import { AppContext } from '../context/AppContext';

const ReturnPage = () => {
  const { orderId, productId } = useParams();
  const [returnReq, setReturnReq] = useState(null);
  const [reason, setReason] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
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

    axios.get(`https://refund-system.onrender.com/returns/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const existing = res.data.find(r => r.orderId === orderId && r.productId === productId);
        if (existing) {
          setReturnReq(existing);
        }
      })
      .catch(err => console.error(err));
  }, [orderId, productId, navigate]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      
      // Simulate AI Validation
      setIsAnalyzing(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', selectedFile);
      try {
        const res = await axios.post('https://refund-system.onrender.com/api/ai-validate', formData, { headers: { Authorization: `Bearer ${token}` } });
        setAiResult(res.data);
      } catch (err) {
        console.error('AI validation failed', err);
      }
      setIsAnalyzing(false);
    } else {
      setPreview(null);
      setAiResult(null);
    }
  };

  const handleInstantRefund = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('https://refund-system.onrender.com/returns/instant-refund', { returnId: returnReq.id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReturnReq(res.data);
      alert('⚡ Instant Refund Processed Successfully!');
    } catch (err) {
      console.error(err);
      alert('Instant Refund failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('productId', productId);
    formData.append('reason', reason);
    if (file) formData.append('proofImage', file);

    try {
      const res = await axios.post('https://refund-system.onrender.com/returns/request', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setReturnReq(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to submit return request');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10 text-center animate-fade-in-up">
        <h1 className="text-4xl font-black tracking-tight mb-2 text-white drop-shadow-md">Return Center</h1>
        <p className="text-gray-400 font-medium">Hassle-free returns and automated refunds.</p>
      </div>

      <div className="glass-card p-8 md:p-12 relative overflow-hidden bg-white/10 shadow-2xl shadow-purple-500/10 animate-fade-in-up border-white/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-pink-500/20 to-transparent rounded-bl-full opacity-60 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-10 pb-6 border-b border-white/10 relative z-10">
          <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/10 shadow-inner">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Order Number</p>
            <p className="font-mono font-bold text-gray-200 break-all">{orderId}</p>
          </div>
          <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/10 shadow-inner">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Product ID</p>
            <p className="font-mono font-bold text-gray-200 break-all">{productId}</p>
          </div>
        </div>

        {returnReq ? (
          <div className="relative z-10 animate-fade-in-up">
            
            {/* AI Decision Panel */}
            {aiResult && returnReq.status === 'Requested' && (
              <div className="mb-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 rounded-3xl border border-purple-500/30 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-purple-300 drop-shadow-sm">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  AI Decision Panel
                </h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-gray-300">Confidence Score</span>
                      <span className="text-sm font-black text-purple-400">{aiResult.confidence}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.8)]" style={{ width: `${aiResult.confidence}%` }}></div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Risk Level</p>
                    <span className="inline-flex items-center gap-2 text-green-300 font-bold bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full w-max text-sm shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.8)]"></span> Safe
                    </span>
                  </div>
                </div>
                <div className="mt-4 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
                  <p className="text-sm text-gray-300 font-medium italic">"User eligible for instant refund. AI analysis confirms item condition matches description."</p>
                </div>
              </div>
            )}

            <div className="mb-12">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-center text-white drop-shadow-md">Live Status Tracking</h3>
                {user && user.trustScore >= 90 && returnReq.status !== 'Refunded' && (
                  <button onClick={handleInstantRefund} className="bg-gradient-to-r from-[#FDE047] to-[#F59E0B] text-yellow-900 px-5 py-2 rounded-full font-black shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-yellow-300">
                    ⚡ {t.instantRefund}
                  </button>
                )}
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-inner">
                <ReturnProgress status={returnReq.status} />
              </div>
            </div>
            
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 shadow-inner flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h4 className="font-black text-lg mb-4 flex items-center gap-2 text-white drop-shadow-sm">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Request Details
                </h4>
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5 shadow-inner">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Reason provided</p>
                  <p className="text-gray-300 font-medium italic">"{returnReq.reason}"</p>
                </div>
              </div>
              
              {returnReq.proofImage && (
                <div className="flex-1">
                  <h4 className="font-black text-lg mb-4 flex items-center gap-2 text-white drop-shadow-sm">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Proof Image
                  </h4>
                  <div className="rounded-2xl overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <img src={`https://refund-system.onrender.com${returnReq.proofImage}`} alt="Proof" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500 cursor-pointer opacity-90 hover:opacity-100" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10 animate-fade-in-up">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Why are you returning this item?</label>
              <select className="w-full bg-white/10 border border-white/20 text-white p-4 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner mb-4 outline-none backdrop-blur-md">
                <option value="defective" className="bg-slate-900">Item is defective or doesn't work</option>
                <option value="wrong_item" className="bg-slate-900">Received wrong item</option>
                <option value="not_needed" className="bg-slate-900">No longer needed</option>
                <option value="description_mismatch" className="bg-slate-900">Item doesn't match description</option>
              </select>
              
              <textarea 
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner resize-none outline-none backdrop-blur-md" 
                rows="4" 
                value={reason} 
                onChange={e => setReason(e.target.value)} 
                required
                placeholder="Please provide details about the issue..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">{t.uploadEvidence}</label>
              <div className="flex items-center justify-center w-full">
                <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${preview ? 'border-purple-400 bg-purple-500/10' : 'border-gray-500 bg-white/5 hover:bg-white/10 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]'}`}>
                  {preview ? (
                    <div className="relative w-full h-full p-2 flex flex-col items-center justify-center">
                      <img src={preview} alt="Preview" className="h-24 object-contain rounded-xl mb-2 shadow-lg" />
                      {isAnalyzing ? (
                        <div className="flex items-center gap-2 text-purple-300 font-bold bg-black/60 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.4)] animate-pulse border border-purple-500/50 backdrop-blur-md">
                          <svg className="w-5 h-5 animate-spin text-purple-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          {t.aiAnalyzing}
                        </div>
                      ) : aiResult ? (
                        <div className="flex items-center gap-2 text-green-300 font-bold bg-green-900/60 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(74,222,128,0.3)] border border-green-500/50 backdrop-blur-md">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          {t.aiApproved} - {aiResult.confidence}%
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 mb-3 text-purple-400 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-400 font-medium"><span className="font-bold text-purple-400">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            </div>
            
            <button type="submit" className="btn-gradient py-4 rounded-2xl font-bold text-lg mt-4 w-full flex justify-center items-center gap-2">
              {t.submitReturn}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReturnPage;

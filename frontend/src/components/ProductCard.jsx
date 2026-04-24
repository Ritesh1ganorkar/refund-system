import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ProductCard = ({ product, onBuy }) => {
  const { t } = useContext(AppContext);
  const isFastRefund = product.price < 50;
  const isLowReturn = product.price > 100;
  const rating = Math.floor(Math.random() * 2) + 4; // Mock rating 4-5

  return (
    <div className="glass-card p-5 group flex flex-col h-full cursor-pointer overflow-hidden relative transition-all duration-400 ease-out border-white/20 shadow-lg shadow-purple-500/20 hover:scale-105 hover:shadow-pink-500/30">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#8B5CF6]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="relative rounded-2xl overflow-hidden mb-5 aspect-[4/3] flex items-center justify-center transition-all border border-white/10 group-hover:border-[#EC4899]/50 shadow-inner group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] bg-gradient-to-br from-[#8B5CF6]/10 to-[#EC4899]/10">
        {product.imageUrl && product.imageUrl.startsWith('data:image') ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out mix-blend-overlay opacity-90 group-hover:opacity-100" />
        ) : product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out mix-blend-overlay opacity-90 group-hover:opacity-100" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out opacity-80 group-hover:opacity-100">
            <svg className="w-16 h-16 text-[#22D3EE] drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          {isFastRefund && (
            <div className="bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] px-3 py-1 rounded-full text-[10px] font-black text-blue-950 shadow-[0_0_10px_rgba(34,211,238,0.5)] flex items-center gap-1 uppercase tracking-wider">
              ⚡ {t.instantEligible}
            </div>
          )}
          {isLowReturn && (
            <div className="bg-gradient-to-r from-[#34D399] to-[#10B981] px-3 py-1 rounded-full text-[10px] font-black text-emerald-950 shadow-[0_0_10px_rgba(16,185,129,0.5)] uppercase tracking-wider flex items-center gap-1">
              🛡️ {t.lowReturn}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col flex-grow relative z-10">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          ))}
          <span className="text-xs font-bold text-gray-300 ml-1">({rating}.0)</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#EC4899] group-hover:to-[#8B5CF6] transition-all drop-shadow-md">{product.name}</h3>
        <p className="text-gray-400 text-sm flex-grow mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Price</span>
            <span className="text-2xl font-black text-[#22D3EE] drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">${product.price}</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onBuy(product); }} 
            className="bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] text-white transition-all hover:scale-105"
          >
            {t.buyNow}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

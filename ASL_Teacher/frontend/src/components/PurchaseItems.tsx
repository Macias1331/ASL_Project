import React, { useState } from 'react';

// --- Types ---
type PurchaseType = 'asl-master' | 'battle-pass' | 'featured';

interface ProductConfig {
  title: string;
  subtitle: string;
  edition: string;
  price: string;
  originalPrice: string;
  cta: string;
  emoji: string;
  colors: {
    primary: string;    // Used for text/glow
    gradient: string;   // Used for the card top
    btnGlow: string;    // Used for button hover
    badge: string;      // Used for the top badge
  };
}

// --- Config Object ---
const CONFIGS: Record<PurchaseType, ProductConfig> = {
  'asl-master': {
    title: 'ASL MASTER',
    subtitle: 'Unlock Total Sign Language Omniscience',
    edition: 'GOD KING EDITION',
    price: '$49.99',
    originalPrice: '$1,000,000',
    cta: 'CLAIM DIVINE POWER',
    emoji: '🤟',
    colors: {
      primary: 'text-yellow-500',
      gradient: 'from-yellow-600 via-red-500 to-fuchsia-600',
      btnGlow: 'from-yellow-400 to-orange-500',
      badge: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
    }
  },
  'battle-pass': {
    title: 'BATTLE PASS',
    subtitle: 'Elite Seasonal Progression & Gear',
    edition: 'SEASON 01 PRESTIGE',
    price: '$12.99',
    originalPrice: '$25.00',
    cta: 'ASCEND NOW',
    emoji: '⚡',
    colors: {
      primary: 'text-indigo-400',
      gradient: 'from-indigo-600 via-purple-500 to-pink-500',
      btnGlow: 'from-indigo-400 to-purple-500',
      badge: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    }
  },
  'featured': {
    title: 'FEATURED SHOP',
    subtitle: 'Instant Access to the Global Gallery',
    edition: 'ULTRA RARE UNLOCK',
    price: '$9.99',
    originalPrice: '$19.99',
    cta: 'BREAK THE LOCK',
    emoji: '💎',
    colors: {
      primary: 'text-red-500',
      gradient: 'from-red-600 via-rose-500 to-orange-500',
      btnGlow: 'from-red-400 to-rose-500',
      badge: 'bg-red-500/10 border-red-500/30 text-red-500',
    }
  }
};

const Sparkle = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute w-1 h-1 bg-white rounded-full animate-ping opacity-70" style={style} />
);

// --- The Main Dynamic Component ---
export default function OutrageousPurchase() {
  const [activeType, setActiveType] = useState<PurchaseType>('asl-master');
  const product = CONFIGS[activeType];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] p-10 overflow-hidden">
      
      {/* Switcher for Demo Purposes */}
      <div className="mb-12 flex gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 z-50">
        {(Object.keys(CONFIGS) as PurchaseType[]).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-6 py-2 rounded-xl font-black text-xs uppercase transition-all ${activeType === type ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
          >
            {type.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="relative group cursor-pointer">
        
        {/* Dynamic Extreme Background Glow */}
        <div className={`absolute -inset-12 bg-gradient-to-r ${product.colors.gradient} rounded-[3rem] blur-[100px] opacity-20 group-hover:opacity-50 transition-all duration-700 animate-pulse`} />

        {/* Outer Border Glow */}
        <div className={`absolute -inset-1 bg-gradient-to-b from-white/20 via-white/5 to-white/20 rounded-[2.5rem] opacity-100 shadow-2xl`} />

        {/* Main Card */}
        <div className="relative w-[400px] h-[600px] bg-black rounded-[2.4rem] overflow-hidden flex flex-col items-center border border-white/10">
          
          {/* Top Section */}
          <div className="relative w-full h-[45%] bg-[#080808] overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black z-10`} />
            
            {/* Animated Light Source */}
            <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br ${product.colors.gradient} blur-3xl opacity-40 animate-pulse`} />
            
            {/* Center Symbol */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
               <div className="relative">
                  <div className={`absolute inset-0 w-32 h-32 border-2 border-white/20 rounded-full animate-[ping_3s_linear_infinite]`} />
                  <div className={`w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] border-4 border-black group-hover:rotate-[360deg] transition-transform duration-1000`}>
                    <span className="text-6xl select-none">{product.emoji}</span>
                  </div>
               </div>
            </div>

            <Sparkle style={{ top: '20%', left: '30%' }} />
            <Sparkle style={{ top: '40%', left: '80%' }} />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-between p-8 pt-2 w-full text-center z-30">
            <div>
              <span className={`inline-block px-4 py-1 ${product.colors.badge} text-[10px] font-black uppercase tracking-[0.4em] rounded-full mb-4`}>
                {product.edition}
              </span>
              <h2 className="text-5xl font-black text-white tracking-tighter leading-none mb-3 italic">
                {product.title}
              </h2>
              <p className="text-gray-400 text-xs font-medium tracking-wide uppercase opacity-60">
                {product.subtitle}
              </p>
            </div>

            {/* Price & CTA */}
            <div className="w-full space-y-6">
              <div className="flex flex-col items-center">
                <span className="text-gray-600 text-sm line-through font-bold decoration-red-500/50 decoration-2 mb-1">
                  {product.originalPrice}
                </span>
                <span className="text-6xl font-black text-white tracking-tighter italic shadow-white/20 drop-shadow-xl">
                  {product.price}
                </span>
              </div>

              <button className="relative w-full group/btn">
                <div className={`absolute -inset-1 bg-gradient-to-r ${product.colors.btnGlow} rounded-2xl blur opacity-30 group-hover/btn:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative bg-white h-16 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95">
                  <span className="text-black font-black text-lg uppercase tracking-tighter italic">
                    {product.cta}
                  </span>
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>

              <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">
                NO REFUNDS • PERMANENT UNLOCK • VOID WHERE PROHIBITED
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}
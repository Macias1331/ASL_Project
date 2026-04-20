import React from 'react';

// --- Reusable SVG Icons ---
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-amber-500">
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
  </svg>
);

const HandIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075-7.425V4.575a1.575 1.575 0 013.15 0V8.25m-3.15-3.675V3c0-.828.705-1.5 1.575-1.5s1.575.672 1.575 1.5v2.25m-3.15 0V10.5M10.05 4.575V3a1.575 1.575 0 00-3.15 0v1.5M6.9 4.575V1.5a1.575 1.575 0 00-3.15 0v12.75a6.75 6.75 0 1013.5 0V8.25m-13.5 0V4.575" />
  </svg>
);

const BackArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

// --- Sub-Components ---
const RewardCard = ({ isPremium, children, label }) => (
  <div className={`
    group relative flex flex-col items-center justify-center w-full h-28 rounded-2xl border-2 transition-all duration-300
    ${isPremium 
      ? 'bg-gradient-to-b from-indigo-600/40 to-indigo-900/60 border-indigo-400/30 hover:border-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
      : 'bg-white/5 border-white/10 hover:border-white/20'
    }
  `}>
    {children}
    {label && <span className="absolute bottom-2 text-[10px] font-bold uppercase tracking-widest opacity-60">{label}</span>}
  </div>
);

const TrackHeader = ({ type, isLocked }) => (
  <div className={`
    flex flex-col items-center justify-center w-full h-full p-4 border-r-2 border-white/5
    ${isLocked ? 'bg-amber-500/10' : 'bg-white/5'}
  `}>
    {isLocked && <LockIcon />}
    <HandIcon className={`w-10 h-10 mb-1 ${isLocked ? 'text-amber-500' : 'text-slate-400'}`} />
    <span className={`text-xs font-black uppercase tracking-tighter ${isLocked ? 'text-amber-500' : 'text-slate-400'}`}>
      {type}
    </span>
  </div>
);

// --- Main Component ---
export default function BattlePass() {
  const tiers = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="bg-[#050816] min-h-screen text-slate-200 font-sans p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        
        {/* Tier Header */}
        <div className="flex items-end gap-4 mb-2">
          <div className="bg-white/10 px-6 py-2 rounded-t-2xl border-x border-t border-white/20">
            <h2 className="text-3xl font-black italic tracking-tighter">TIER 01</h2>
          </div>
          <div className="mb-2 text-sm font-bold text-slate-500 uppercase tracking-widest">Season 1: The Awakening</div>
        </div>

        {/* Main Pass Container */}
        <div className="bg-[#0A0F24] rounded-[2.5rem] rounded-tl-none border border-white/10 shadow-2xl overflow-hidden">
          
          <div className="grid grid-cols-[120px_1fr]">
            
            {/* Left Sidebar Headers */}
            <div className="grid grid-rows-[50px_1fr_1fr] border-r border-white/10">
              <div className="bg-black/20" /> {/* Spacer */}
              <TrackHeader type="Free" />
              <TrackHeader type="Premium" isLocked />
            </div>

            {/* Right Rewards Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[800px] grid grid-rows-[50px_1fr_1fr] grid-cols-7">
                
                {/* Numbers Row */}
                {tiers.map(t => (
                  <div key={t} className="flex items-center justify-center border-b border-white/5 font-black text-white/20 text-xl">
                    {t}
                  </div>
                ))}

                {/* Free Rewards Row */}
                {tiers.map(t => (
                  <div key={t} className="p-3 border-b border-white/5 flex items-center justify-center">
                    {t % 2 !== 0 ? (
                      <RewardCard label="Common">
                        <div className="w-10 h-10 bg-slate-500 rounded-lg rotate-3" />
                      </RewardCard>
                    ) : <div className="w-1 h-1 bg-white/10 rounded-full" />}
                  </div>
                ))}

                {/* Premium Rewards Row */}
                {tiers.map(t => (
                  <div key={t} className="p-3 bg-indigo-500/5 flex items-center justify-center">
                    <RewardCard isPremium label="Epic Item">
                      <div className="w-12 h-12 bg-indigo-400 rounded-full animate-pulse blur-sm absolute" />
                      <div className="w-10 h-10 bg-white rounded-xl rotate-12 z-10" />
                    </RewardCard>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="p-8 bg-black/40 border-t border-white/10 flex items-center gap-8">
            <button className="bg-amber-500 hover:bg-amber-400 p-4 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-transform active:scale-90">
              <BackArrow />
            </button>

            <div className="flex-1">
              <div className="flex justify-between mb-2 px-1">
                <span className="text-xs font-black uppercase text-amber-500 tracking-widest">Progress to Tier 2</span>
                <span className="text-xs font-black text-slate-400">1,250 / 5,000 XP</span>
              </div>
              <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-300 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                  style={{ width: '25%' }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
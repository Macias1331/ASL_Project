import React from 'react';
import { useNavigate } from 'react-router-dom';

// --- Interfaces ---

interface IconProps {
  className?: string;
}

interface RewardCardProps {
  isPremium?: boolean;
  children: ReactNode;
  label?: string;
}

interface TrackHeaderProps {
  type: 'Free' | 'Premium'; // Restricting to these two strings
  isLocked?: boolean;
}

// --- Reusable SVG Icons ---
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-amber-500">
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
  </svg>
);

const HandIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075-7.425V4.575a1.575 1.575 0 013.15 0V8.25m-3.15-3.675V3c0-.828.705-1.5 1.575-1.5s1.575.672 1.575 1.5v2.25m-3.15 0V10.5M10.05 4.575V3a1.575 1.575 0 00-3.15 0v1.5M6.9 4.575V1.5a1.575 1.575 0 00-3.15 0v12.75a6.75 6.75 0 1013.5 0V8.25m-13.5 0V4.575" />
  </svg>
);

const BackArrow = () => {
 
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
};

const RewardCard: React.FC<RewardCardProps> = ({ isPremium = false, children, label }) => (
  <div className={`
    group relative flex flex-col items-center justify-center w-full h-full min-h-[140px] rounded-[2rem] border-2 transition-all duration-300
    ${isPremium 
      ? 'bg-gradient-to-b from-indigo-600/30 to-indigo-900/50 border-indigo-400/20 hover:border-indigo-300 shadow-xl' 
      : 'bg-white/5 border-white/10 hover:border-white/20'
    }
  `}>
    {children}
    {label && <span className="absolute bottom-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{label}</span>}
  </div>
);

const TrackHeader: React.FC<TrackHeaderProps> = ({ type, isLocked = false }) => (
  <div className={`
    flex flex-col items-center justify-center w-full h-full p-6 border-r border-white/10
    ${isLocked ? 'bg-amber-500/5' : 'bg-white/[0.02]'}
  `}>
    {isLocked && <div className="mb-2"><LockIcon /></div>}
    <HandIcon className={`w-14 h-14 mb-2 ${isLocked ? 'text-amber-500' : 'text-slate-500'}`} />
    <span className={`text-sm font-black uppercase tracking-widest ${isLocked ? 'text-amber-500' : 'text-slate-400'}`}>
      {type}
    </span>
  </div>
);

export default function BattlePass() {
  const tiers = [1, 2, 3, 4, 5, 6, 7];
  const navigate = useNavigate();
  
  return (
    <div className="bg-[#03050c] min-h-screen text-slate-200 font-sans flex items-center justify-center p-6 lg:p-12">
      <div className="w-full h-full max-w-[1600px] flex flex-col">
        
        {/* Tier Header */}
        <div className="flex items-end gap-6 mb-0 ml-4">
          <div className="bg-[#0A0F24] px-10 py-4 rounded-t-[2.5rem] border-x border-t border-white/10 shadow-lg">
            <h2 className="text-5xl font-black italic tracking-tighter text-white">TIER 01</h2>
          </div>
          <div className="mb-4">
            <span className="text-sm font-bold text-indigo-400 uppercase tracking-[0.3em]">Season 01: Origins</span>
          </div>
        </div>

        {/* Main Pass Container */}
        <div className="flex-1 bg-[#0A0F24] rounded-[3rem] rounded-tl-none border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
          
          <div className="flex-1 grid grid-cols-[180px_1fr]">
            
            {/* Left Sidebar Headers */}
            <div className="grid grid-rows-[70px_1fr_1fr] border-r border-white/10">
              <div className="bg-black/20" /> 
              <TrackHeader type="Free" isLocked={false}/>
              <TrackHeader type="Premium" isLocked />
            </div>

            {/* Right Rewards Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[1000px] h-full grid grid-rows-[70px_1fr_1fr] grid-cols-7">
                
                {/* Numbers Row */}
                {tiers.map(t => (
                  <div key={t} className="flex items-center justify-center border-b border-white/5 font-black text-white/10 text-3xl">
                    {t < 10 ? `0${t}` : t}
                  </div>
                ))}

                {/* Free Rewards Row */}
                {tiers.map(t => (
                  <div key={t} className="p-4 border-b border-white/5 flex items-center justify-center">
                    {t % 2 !== 0 ? (
                      <RewardCard label="Free Pack">
                        <div className="w-14 h-14 bg-slate-600 rounded-2xl rotate-6 shadow-lg" />
                      </RewardCard>
                    ) : <div className="w-2 h-2 bg-white/10 rounded-full" />}
                  </div>
                ))}

                {/* Premium Rewards Row */}
                {tiers.map(t => (
                  <div key={t} className="p-4 bg-indigo-500/[0.02] flex items-center justify-center">
                    <RewardCard isPremium label="Premium Item">
                      {/* Glow Effect */}
                      <div className="w-20 h-20 bg-indigo-500/20 rounded-full blur-3xl absolute group-hover:bg-indigo-500/40 transition-all" />
                      <div className="w-16 h-16 bg-white rounded-[1.25rem] rotate-12 z-10 shadow-2xl" />
                    </RewardCard>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="p-10 bg-black/40 border-t border-white/10 flex items-center gap-12">
            <button onClick={() => navigate('/menu')} className="bg-amber-500 hover:bg-amber-400 p-6 rounded-[1.5rem] shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all active:scale-95 group">
              <BackArrow />
            </button>

            <div className="flex-1">
              <div className="flex justify-between mb-3 px-2">
                <span className="text-sm font-black uppercase text-amber-500 tracking-widest">Global Progression</span>
                <span className="text-sm font-black text-slate-400 tracking-tighter">1,250 / 5,000 XP UNTIL TIER 02</span>
              </div>
              <div className="h-8 bg-black/50 rounded-full overflow-hidden border border-white/10 p-1.5 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-200 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] relative overflow-hidden" 
                  style={{ width: '25%' }}
                >
                  {/* Sheen effect on progress bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Background Decorative Element */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full z-[-1]" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/5 blur-[120px] rounded-full z-[-1]" />
    </div>
  );
}
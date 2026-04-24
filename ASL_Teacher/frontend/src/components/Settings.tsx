import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "./mini/Header";
import Body from "./mini/Body";
import { useAuth } from "./authContext";
import { pauseMusic, resumeMusic, setVolume } from "../music";

function SettingsScreen() {
  const navigate = useNavigate();
  const { username, token } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [musicOn, setMusicOn] = useState(() => localStorage.getItem('music') !== 'off');
  const [volume, setVolumeState] = useState(() => Number(localStorage.getItem('volume') ?? 90));
  const [showVolume, setShowVolume] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [accountData, setAccountData] = useState<{ username: string; email: string; created_at: string } | null>(null);
  const [showTos, setShowTos] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    setVolume(volume / 100);
  }, []);

  async function openAccountDetails() {
    setShowAccount(true);
    if (accountData) return;
    try {
      const res = await fetch('http://localhost:8001/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setAccountData(await res.json());
    } catch {}
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    setVolumeState(val);
    localStorage.setItem('volume', String(val));
    setVolume(val / 100);
  }

  function toggleMusic() {
    const next = !musicOn;
    setMusicOn(next);
    localStorage.setItem('music', next ? 'on' : 'off');
    if (next) resumeMusic(); else pauseMusic();
  }

  function toggleDarkMode() {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  }

  return (
    <>
      <Header />
      <Body tailwind="flex flex-col items-center justify-between h-[calc(100vh-100px)] p-4 md:p-6 w-full">
        
        <div className="bg-[#fce17a] text-black font-bold text-3xl px-16 py-4 rounded-2xl shadow-md shrink-0 mt-4 md:mt-8">
          Hello, {username}!
        </div>

        <div className="flex flex-col justify-center items-center flex-1 gap-16 md:gap-24 w-full max-w-7xl py-10">
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 w-full">
            <div className="relative flex flex-col items-center">
              <button
                onClick={() => setShowVolume(v => !v)}
                className="bg-[#6b6161] border-2 border-[#9b8e8e] text-white px-8 py-4 md:py-6 rounded-full font-bold text-xl md:text-2xl min-w-[220px] md:min-w-[280px] hover:scale-105 transition-transform"
              >
                Volume: {volume}%
              </button>
              {showVolume && (
                <div className="absolute top-full mt-3 bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center gap-3 z-10 w-[280px]">
                  <p className="font-bold text-black text-lg">Music Volume</p>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-[#1C3F5C]"
                  />
                  <p className="text-black font-semibold">{volume}%</p>
                </div>
              )}
            </div>

            <button
              onClick={toggleMusic}
              className="bg-[#fce17a] text-black px-8 py-4 md:py-6 rounded-full font-bold text-xl md:text-2xl flex items-center justify-center gap-5 min-w-[220px] md:min-w-[280px] hover:scale-105 transition-transform"
            >
              Music
              <span className={`${musicOn ? 'bg-[#4ade80]' : 'bg-red-500'} border-2 border-black text-black text-base md:text-lg font-black rounded-full h-9 w-9 md:h-10 md:w-10 flex items-center justify-center`}>
                {musicOn ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 w-full">
            <button
              onClick={toggleDarkMode}
              className="bg-black border-2 border-white text-white px-8 py-4 md:py-6 rounded-full font-bold text-xl md:text-2xl flex items-center gap-4 hover:scale-105 transition-transform"
            >
              Dark Mode
              <span className={`${darkMode ? 'bg-[#4ade80]' : 'bg-red-500'} text-black rounded-full h-9 w-9 flex items-center justify-center font-bold text-base`}>
                {darkMode ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={openAccountDetails}
              className="bg-[#fce17a] text-black px-8 py-4 md:py-6 rounded-full font-bold text-xl md:text-2xl min-w-[220px] md:min-w-[280px] hover:scale-105 transition-transform"
            >
              Account Details
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 w-full">
            <button
              onClick={() => setShowTos(true)}
              className="bg-[#fce17a] text-black px-8 py-4 md:py-6 rounded-2xl font-bold text-xl md:text-2xl min-w-[200px] md:min-w-[240px] hover:scale-105 transition-transform"
            >
              Terms of Service
            </button>

            <button
              onClick={() => setShowCredits(true)}
              className="bg-[#fce17a] text-black px-8 py-4 md:py-6 rounded-2xl font-bold text-xl md:text-2xl min-w-[200px] md:min-w-[240px] hover:scale-105 transition-transform"
            >
              Credits
            </button>
          </div>
        </div>

        <div className="w-full max-w-7xl flex justify-between items-center shrink-0 pt-4 pb-6">
          
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#fce17a] text-black h-16 w-24 md:h-20 md:w-32 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 14 4 9l5-5"/>
              <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>
            </svg>
          </button>

          <button 
            onClick={() => navigate('/')} 
            className="bg-[#c8201a] border-2 border-white text-white px-10 py-4 md:py-6 rounded-2xl font-bold text-xl md:text-2xl hover:bg-red-700 transition-colors"
          >
            Log Out
          </button>
          
        </div>
      </Body>

      {showAccount && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
          onClick={() => setShowAccount(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-6 min-w-[380px] max-w-[500px] w-full"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-center text-[#1C3F5C]">Account Details</h2>
            {accountData ? (
              <>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Username</span>
                  <span className="text-2xl font-bold text-black">{accountData.username}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Email</span>
                  <span className="text-2xl font-bold text-black">{accountData.email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Member Since</span>
                  <span className="text-2xl font-bold text-black">
                    {new Date(accountData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500">Loading...</p>
            )}
            <button
              onClick={() => setShowAccount(false)}
              className="mt-2 bg-[#1C3F5C] text-white font-bold py-3 rounded-2xl hover:bg-[#081520] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showTos && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
          onClick={() => setShowTos(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-5 max-w-[560px] w-full"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-center text-[#1C3F5C]">Terms of Service</h2>
            <div className="flex flex-col gap-3 text-gray-700 text-base leading-relaxed">
              <p>By using SignQuest, you agree to the following terms:</p>
              <p><strong>1. Use of Service:</strong> SignQuest is intended for educational purposes only. You agree to use this platform responsibly and not for any unlawful activity.</p>
              <p><strong>2. Account:</strong> You are responsible for maintaining the confidentiality of your account credentials. You must be at least 13 years old to use this service.</p>
              <p><strong>3. Content:</strong> All ASL content and learning materials provided are for personal, non-commercial use only.</p>
              <p><strong>4. Privacy:</strong> We collect only the data necessary to operate the service. Your data will not be shared with third parties without your consent.</p>
              <p><strong>5. Changes:</strong> We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>
            </div>
            <button
              onClick={() => setShowTos(false)}
              className="mt-2 bg-[#1C3F5C] text-white font-bold py-3 rounded-2xl hover:bg-[#081520] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showCredits && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
          onClick={() => setShowCredits(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-6 max-w-[500px] w-full"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-center text-[#1C3F5C]">Credits</h2>
            <div className="flex flex-col gap-2 text-center text-gray-800">
              <p className="text-xl font-bold">Senior Design Project</p>
              <p className="text-2xl font-extrabold text-[#1C3F5C]">Sign Quest</p>
              <div className="mt-4 flex flex-col gap-1 text-base font-semibold">
                <p className="text-gray-500 uppercase tracking-wide text-sm mb-1">Built by</p>
                <p>Dhakal B.</p>
                <p>Tran Christopher</p>
                <p>Macias N.</p>
                <p>Truong A.</p>
                <p>Lopez J.</p>
                <p>Tran Cong</p>
                <p>To M.</p>
              </div>
              <div className="mt-4">
                <p className="text-gray-500 uppercase tracking-wide text-sm">Advisor</p>
                <p className="font-bold text-lg">Chenxi Wang</p>
              </div>
            </div>
            <button
              onClick={() => setShowCredits(false)}
              className="mt-2 bg-[#1C3F5C] text-white font-bold py-3 rounded-2xl hover:bg-[#081520] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsScreen;
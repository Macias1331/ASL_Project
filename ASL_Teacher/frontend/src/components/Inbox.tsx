import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "./mini/Header";
import Body from "./mini/Body";

function InboxScreen() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 1,
      title: "🔥 21 Day Streak!",
      content: "Impressive! You've practiced every day for 3 weeks. Here is a special bonus for your dedication.",
      isUnread: true,
      hasReward: true,
      rewardType: "250 Coins",
      date: "10 mins ago"
    },
    {
      id: 2,
      title: "🆕 New Level Unlocked",
      content: "Congratulations! You've mastered 'Basic Greetings.' Level 2: 'Common Phrases' is now available in Learning Mode.",
      isUnread: true,
      hasReward: false,
      date: "2 hours ago"
    },
    {
      id: 3,
      title: "⚔️ Friend Challenge",
      content: "HacksNoAim has challenged you to a 'Free For All' match! Are you ready to compete?",
      isUnread: false,
      hasReward: false,
      date: "Yesterday"
    },
    {
      id: 4,
      title: "🛍️ Store Sale: 50% Off",
      content: "Limited time offer! All legendary character skins are half-price in the Store for the next 24 hours.",
      isUnread: false,
      hasReward: false,
      date: "2 days ago"
    },
    {
      id: 5,
      title: "🛡️ Season 1 Battle Pass",
      content: "The new Battle Pass is here. Complete daily goals to earn exclusive emotes and star badges.",
      isUnread: false,
      hasReward: false,
      date: "4 days ago"
    }
  ]);

  return (
    <>
      <Header />
      <Body tailwind="flex flex-col items-center justify-between h-[calc(100vh-100px)] p-4 md:p-6 w-full">
    
        <div className="bg-[#fce17a] text-black font-bold text-xl px-12 py-1 md:py-2 rounded-xl shadow-md shrink-0 mt-4 md:mt-8">
          Inbox
        </div>

       
        <div className="flex-1 w-full max-w-4xl bg-black/30 border-2 border-[#6b6161]/50 rounded-2xl p-4 md:p-6 mt-6 mb-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border-2 transition-all ${
                msg.isUnread ? 'bg-[#2a3a4d] border-[#fce17a]' : 'bg-[#1a2533] border-transparent'
              }`}
            >
           
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-1">
                  {msg.isUnread && (
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                  )}
                  <h3 className="text-white font-bold text-lg">
                    {msg.title}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {msg.content}
                </p>
              </div>

             
              <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-2 shrink-0 mt-4 md:mt-0 pt-3 border-t border-white/10 md:border-t-0 md:pt-0">
                <span className="text-gray-500 text-xs font-medium">
                  {msg.date}
                </span>
                
                {msg.hasReward ? (
                  <button className="bg-[#4ade80] hover:bg-green-500 text-black px-5 py-1.5 rounded-lg font-black text-sm uppercase tracking-wider transition-transform hover:scale-105">
                    Claim {msg.rewardType}
                  </button>
                ) : (
                  <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-1.5 rounded-lg font-semibold text-sm transition-colors">
                    View
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full max-w-6xl flex justify-start items-center shrink-0 pt-2 pb-4">
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#fce17a] text-black h-10 w-14 md:h-12 md:w-16 rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 14 4 9l5-5"/>
              <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>
            </svg>
          </button>
        </div>
        
      </Body>
    </>
  );
}

export default InboxScreen;
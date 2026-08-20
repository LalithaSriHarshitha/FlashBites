import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, Navigation } from 'lucide-react';

interface GeminiNavAssistantProps {
  apiKey?: string;
  onNavigateToCategory?: (category: string) => void;
  onSearchDish?: (query: string) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export default function GeminiNavAssistant({
  apiKey = import.meta.env.VITE_GEMINI_API_KEY || '',
  onNavigateToCategory,
  onSearchDish
}: GeminiNavAssistantProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Namaste! 🙏 I am your FlashBites Gemini AI Navigation Assistant. How can I help you find hot Guntur canteens, recommend dishes, or track orders today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateSmartLocalResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('account') || q.includes('login') || q.includes('password') || q.includes('credential')) {
      return `🔑 Active Accounts for Guntur City:
- Customer: customer1@flashbites.com | pass123
- Kitchens (5): udipi@flashbites.com, saravana@flashbites.com, paradise@flashbites.com, mtr@flashbites.com, anandbhavan@flashbites.com (pass123)
- Drivers (8): driver1@flashbites.com to driver8@flashbites.com (pass123)`;
    }

    if (q.includes('dosa') || q.includes('karam') || q.includes('udipi')) {
      if (onSearchDish) onSearchDish('dosa');
      return `🥞 Highly recommended: "Guntur Karam Masala Dosa" at Sri Udipi Grand (Arundelpet 14th Line, Guntur) for ₹120!`;
    }

    if (q.includes('biryani') || q.includes('paradise') || q.includes('chicken')) {
      if (onSearchDish) onSearchDish('biryani');
      return `🍛 Recommended: "Royal Hyderabadi Chicken Dum Biryani" at Hyderabadi Paradise Biryani (RTC Bus Stand Road, Guntur) for ₹290!`;
    }

    if (q.includes('track') || q.includes('order') || q.includes('status') || q.includes('map')) {
      return `📍 To track your live order: Click the pink "Track Order Status 📍" button at the top of your dashboard. You will see live Haversine GPS distance & driver ETA in Guntur City!`;
    }

    if (q.includes('coffee') || q.includes('mtr') || q.includes('drink')) {
      if (onSearchDish) onSearchDish('coffee');
      return `☕ Try authentic "Degree Filter Coffee" at MTR (Lakshmipuram Main Road) for ₹45!`;
    }

    return `✨ FlashBites Guntur Navigation Tip:
You can order from 5 top South Indian canteens:
1. Sri Udipi Grand (Arundelpet)
2. Saravana Bhavan Express (Brodipet)
3. Hyderabadi Paradise Biryani (RTC Bus Stand)
4. MTR (Lakshmipuram)
5. Anand Bhavan Tiffin Center (Kothapet)

Type any dish name (e.g. "dosa", "biryani", "coffee") or ask for live tracking assistance!`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are the FlashBites AI Navigation Assistant for a South Indian food delivery platform in Guntur City, AP.
Help the user discover food, navigate canteens (Sri Udipi Grand, Saravana Bhavan, Hyderabadi Paradise Biryani, MTR, Anand Bhavan), track orders, or view login credentials.
Keep response concise (< 4 sentences) and friendly.
User query: "${query}"`
              }
            ]
          }
        ]
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (aiText) {
          const aiMsg: Message = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: aiText.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsLoading(false);
          return;
        }
      }

      const fallbackText = generateSmartLocalResponse(query);
      const fallbackMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);

    } catch (error) {
      const fallbackText = generateSmartLocalResponse(query);
      const fallbackMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickChips = [
    { label: '🥞 Find Guntur Dosa', action: () => handleSendMessage('Recommend best Guntur Karam Dosa') },
    { label: '🍛 Find Biryani', action: () => handleSendMessage('Show Hyderabadi Biryani options') },
    { label: '📍 How to track order?', action: () => handleSendMessage('How to track my live order status?') },
    { label: '🔑 Accounts List', action: () => handleSendMessage('Show all login accounts') }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[9999] font-sans">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center space-x-2.5 px-5 py-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white animate-bounce"
        >
          <Sparkles className="w-5 h-5 text-amber-200 animate-spin" />
          <span className="font-extrabold text-xs tracking-wider uppercase">AI Nav Assistant</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white"></span>
        </button>
      )}

      {/* Chat Window Container */}
      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[380px] h-[520px] rounded-3xl border-2 border-rose-400 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs leading-none">FlashBites Gemini AI</h4>
                <p className="text-[10px] text-emerald-400 mt-0.5 font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                  <span>Guntur Navigator Online</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Chips */}
          <div className="bg-slate-50 p-2.5 border-b border-slate-100 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            {quickChips.map((chip, idx) => (
              <button
                type="button"
                key={idx}
                onClick={chip.action}
                className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-xl text-[11px] font-bold border border-slate-200 whitespace-nowrap transition-all shadow-xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 shadow-xs">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[78%] p-3 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-rose-600 text-white font-medium rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none font-normal'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[9px] block mt-1 text-right font-semibold ${msg.sender === 'user' ? 'text-rose-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 shadow-xs">
                    👤
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-slate-500">
                <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-[10px]">
                  🤖
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center space-x-1.5 text-xs text-rose-600 font-bold">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-rose-500" />
                  <span>Thinking & Navigating...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask AI Assistant (e.g. recommend dosa)..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl shadow-md transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}

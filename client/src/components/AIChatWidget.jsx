import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';

const AIChatWidget = ({ developerName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: `Hi! I'm ${developerName || 'the developer'}'s AI Assistant. Ask me anything about projects, tech stack, or availability!`,
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', text: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', {
        message: userMsg.text,
        history: messages.slice(1), // Initial greeting එක හැර chat history එක
      });
      setMessages([...updatedMessages, { role: 'model', text: data.reply }]);
    } catch {
      setMessages([
        ...updatedMessages,
        { role: 'model', text: 'Sorry, I am momentarily busy. Please try again or use the contact form!' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-1">
                  AI Portfolio Assistant <Sparkles className="w-3.5 h-3.5" />
                </h3>
                <p className="text-[11px] text-indigo-100">Powered by Gemini AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-950/60">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-400 text-xs px-3.5 py-2.5 rounded-2xl rounded-bl-none animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask about skills or projects..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2 rounded-xl cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-auto flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3.5 rounded-full shadow-lg shadow-indigo-600/30 transition transform hover:scale-105 cursor-pointer"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
        {!isOpen && <span className="text-sm font-medium pr-1">Ask AI</span>}
      </button>
    </div>
  );
};

export default AIChatWidget;
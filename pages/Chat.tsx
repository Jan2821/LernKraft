import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { geminiService } from '../services/geminiService';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';

interface ChatProps {
  user: User;
}

export const ChatArea: React.FC<ChatProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'teacher'>('ai');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial welcome message for AI
  useEffect(() => {
    if (activeTab === 'ai' && messages.length === 0) {
      setMessages([{
        id: 'init',
        senderId: 'ai',
        senderName: 'LernKraft KI',
        content: 'Hallo! Ich bin dein persönlicher KI-Tutor. Ich kann dir bei Mathe, Deutsch und Englisch helfen. Was möchtest du heute üben?',
        timestamp: Date.now(),
        isAi: true
      }]);
    }
  }, [activeTab]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.fullName,
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setLoading(true);

    if (activeTab === 'ai') {
      // Build history for Gemini
      const history = messages.map(m => ({
        role: m.isAi ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      // Add current message
      history.push({ role: 'user', parts: [{ text: newUserMsg.content }] });

      const response = await geminiService.chatWithTutor(newUserMsg.content, history);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'ai',
        senderName: 'LernKraft KI',
        content: response,
        timestamp: Date.now(),
        isAi: true
      };
      setMessages(prev => [...prev, aiMsg]);
    } else {
      // Simulation of teacher delay
      setTimeout(() => {
        const teacherMsg: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'teacher-1',
          senderName: 'Herr Müller',
          content: 'Danke für deine Nachricht! Ich schaue mir das später an und melde mich bei dir.',
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, teacherMsg]);
      }, 1000);
    }

    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col max-w-5xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 flex-1 flex flex-col overflow-hidden">
        
        {/* Header Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => { setActiveTab('ai'); setMessages([]); }}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center transition-colors ${
              activeTab === 'ai' 
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Bot className="w-5 h-5 mr-2" />
            KI Tutor (Soforthilfe)
          </button>
          <button
            onClick={() => { setActiveTab('teacher'); setMessages([]); }}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center transition-colors ${
              activeTab === 'teacher' 
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <UserIcon className="w-5 h-5 mr-2" />
            Lehrer Chat
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map((msg) => {
            const isMe = msg.senderId === user.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-xs font-bold ${isMe ? 'text-blue-100' : 'text-slate-500'}`}>
                      {msg.senderName}
                    </span>
                    <span className={`text-[10px] ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-sm border border-slate-200 flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                <span className="text-xs text-slate-400">Schreibt...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={activeTab === 'ai' ? "Frag den KI Tutor etwas..." : "Nachricht an den Lehrer..."}
              className="flex-1 px-4 py-3 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
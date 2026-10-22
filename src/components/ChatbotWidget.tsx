import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';
import { api } from '../services/api';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'bot',
      text: 'Namaste! I am SPOT FIX AI Assistant. How can I help you today? Ask me how to report an issue, how the AI works, or provide your Report ID (e.g., SF-2026-000101) to check status!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const replyText = await api.sendChatMessage(text);
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: 'bot',
          text: 'Thank you for reaching out! SPOT FIX allows citizens to report potholes, garbage dumps, open drains, and streetlights with 1-click photo uploads.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 rounded-full bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] font-bold text-xs flex items-center space-x-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer group shadow-theme"
        >
          <div className="relative">
            <Bot className="w-4 h-4" />
          </div>
          <span>SPOT FIX AI Assistant</span>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="bg-[var(--brand-card)] rounded-3xl border border-[var(--brand-border)] shadow-2xl w-80 sm:w-96 h-[480px] flex flex-col overflow-hidden my-2 shadow-theme animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[var(--brand-accent)]" />
              </div>
              <div>
                <h4 className="font-bold text-xs leading-none">SPOT FIX Chatbot</h4>
                <p className="text-[10px] opacity-80 mt-0.5">Real-time Inquiry & Report Status</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[var(--brand-bg)]/80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] rounded-br-none shadow-xs'
                      : 'bg-[var(--brand-card)] text-[var(--brand-text-main)] border border-[var(--brand-border)] rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <span
                    className={`text-[9px] mt-1 block text-right opacity-70`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[var(--brand-card)] p-3 rounded-2xl border border-[var(--brand-border)] rounded-bl-none text-[var(--brand-text-muted)] flex items-center space-x-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--brand-primary)]" />
                  <span>AI thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-[var(--brand-card)] border-t border-[var(--brand-border)] flex items-center space-x-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleQuickPrompt('Check status of SF-2026-000101')}
              className="px-3 py-1 rounded-full bg-[var(--brand-surface)] text-[var(--brand-text-main)] font-semibold shrink-0 hover:bg-[var(--brand-border)] border border-[var(--brand-border-subtle)]"
            >
              Check SF-2026-000101
            </button>
            <button
              onClick={() => handleQuickPrompt('How does AI detect potholes?')}
              className="px-3 py-1 rounded-full bg-[var(--brand-surface)] text-[var(--brand-text-main)] font-semibold shrink-0 hover:bg-[var(--brand-border)] border border-[var(--brand-border-subtle)]"
            >
              How AI Works?
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[var(--brand-card)] border-t border-[var(--brand-border)] flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question or enter Report ID..."
              className="flex-1 px-4 py-2 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-text-main)] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] font-bold transition-all cursor-pointer hover:opacity-90 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

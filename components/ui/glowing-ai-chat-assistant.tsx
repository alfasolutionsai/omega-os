import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Link, Code, Mic, Send, Info, X, Database, Bot, AlertCircle } from 'lucide-react';

const GlowingAiChatAssistant = () => {
 const [message, setMessage] = useState('');
 const [charCount, setCharCount] = useState(0);
 const maxChars = 2000;
 
 const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
 const value = e.target.value;
 setMessage(value);
 setCharCount(value.length);
 };

 const handleSend = () => {
 if (message.trim()) {
 console.log('Sending message:', message);
 setMessage('');
 setCharCount(0);
 }
 };

 const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
 if (e.key === 'Enter' && !e.shiftKey) {
 e.preventDefault();
 handleSend();
 }
 };

 return (
 <div className="flex flex-col h-[calc(100vh-12rem)] w-full max-w-5xl mx-auto gap-6">
 {/* Main Interface */}
 <div className="relative flex flex-col rounded-3xl bg-zinc-900/50 border border-zinc-800 shadow-2xl backdrop-blur-xl overflow-hidden flex-1">
 
 {/* Header */}
 <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/80">
 <div className="flex items-center gap-3">
 <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
 <span className="text-sm font-medium text-zinc-200">OMEGA Intelligence</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="px-2.5 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center gap-1.5">
 <Database className="w-3 h-3" /> RAG Active
 </span>
 <span className="px-2.5 py-1 text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-full flex items-center gap-1.5">
 <Bot className="w-3 h-3" /> GPT-4o
 </span>
 </div>
 </div>

 {/* Messages Area (Placeholder for now) */}
 <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-gradient-to-b from-zinc-900/0 to-zinc-950/30">
 <div className="flex flex-col gap-4 text-zinc-400 text-center mt-20">
 <Bot className="w-12 h-12 mx-auto text-zinc-700" />
 <p>Comment puis-je vous aider aujourd'hui, Samuel ?</p>
 </div>
 </div>

 {/* Input Section */}
 <div className="p-4 bg-zinc-900/80 border-t border-zinc-800/50">
 <div className="relative overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-800/30 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all">
 <textarea
 value={message}
 onChange={handleInputChange}
 onKeyDown={handleKeyDown}
 rows={3}
 className="w-full px-5 py-4 bg-transparent border-none outline-none resize-none text-sm font-normal leading-relaxed min-h-[80px] text-zinc-100 placeholder-zinc-500 custom-scrollbar"
 placeholder="Interrogez votre base de connaissances ou contrôlez vos agents..."
 />
 </div>

 {/* Controls Section */}
 <div className="flex items-center justify-between mt-3">
 <div className="flex items-center gap-2">
 {/* Attachment Group */}
 <div className="flex items-center gap-1 p-1 bg-zinc-800/40 rounded-xl border border-zinc-700/50">
 <button className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/50 rounded-lg transition-all">
 <Paperclip className="w-4 h-4" />
 </button>
 <button className="p-2 text-zinc-500 hover:text-indigo-400 hover:bg-zinc-700/50 rounded-lg transition-all">
 <Link className="w-4 h-4" />
 </button>
 <button className="p-2 text-zinc-500 hover:text-green-400 hover:bg-zinc-700/50 rounded-lg transition-all">
 <Code className="w-4 h-4" />
 </button>
 <button className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-700/50 rounded-lg transition-all">
 <Mic className="w-4 h-4" />
 </button>
 </div>
 </div>

 <div className="flex items-center gap-4">
 <div className="text-xs font-medium text-zinc-600">
 {charCount}/{maxChars}
 </div>
 <button 
 onClick={handleSend}
 disabled={!message.trim()}
 className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
 >
 <Send className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Status Bar */}
 <div className="flex items-center justify-between px-2 text-xs text-zinc-500">
 <div className="flex items-center gap-4">
 <span className="flex items-center gap-1.5"><Info className="w-3 h-3" /> Shift + Enter pour sauter une ligne</span>
 <span className="flex items-center gap-1.5 text-emerald-500/80"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Tous les systèmes opérationnels</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="px-2 py-0.5 rounded bg-zinc-800/50 border border-zinc-800 text-zinc-400">v1.0.4</span>
 </div>
 </div>
 </div>
 );
};

export { GlowingAiChatAssistant };
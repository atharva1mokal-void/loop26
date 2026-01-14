'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Paperclip, Smile, MoreHorizontal } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other' | 'ai';
    timestamp: Date;
    author?: string;
}

interface ChatBoxProps {
    isWidget?: boolean;
}

export default function ChatBox({ isWidget = false }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Welcome to the Nexus Team Chat. How's the progress on the dashboard?",
            sender: 'other',
            author: 'RedVoid',
            timestamp: new Date(Date.now() - 1000 * 60 * 60)
        },
        {
            id: '2',
            text: "I've just finished the Neural Core integration.",
            sender: 'user',
            timestamp: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
            id: '3',
            text: "Excellent. The AI analyzer is reporting healthy velocity.",
            sender: 'ai',
            author: 'NEXUS AI',
            timestamp: new Date(Date.now() - 1000 * 60 * 5)
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages([...messages, newMessage]);
        setInputValue('');

        // Simulate AI response
        if (inputValue.toLowerCase().includes('help') || inputValue.toLowerCase().includes('status')) {
            setTimeout(() => {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "I'm analyzing the latest project data. Everything seems to be on track. Need anything specific?",
                    sender: 'ai',
                    author: 'NEXUS AI',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMessage]);
            }, 1000);
        }
    };

    return (
        <div className={`flex flex-col h-full ${isWidget ? '' : 'max-w-4xl mx-auto border border-white/10 rounded-3xl overflow-hidden glass-panel shadow-2xl'}`}>
            {/* Chat Header */}
            {!isWidget && (
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Bot className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Team Communication</h2>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs text-slate-400 font-medium">4 team members online</span>
                            </div>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                        <MoreHorizontal className="text-slate-400" />
                    </button>
                </div>
            )}

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
                style={{ maxHeight: isWidget ? '400px' : 'calc(100vh - 300px)' }}
            >
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-600' :
                                        msg.sender === 'ai' ? 'bg-purple-600' : 'bg-slate-700'
                                    }`}>
                                    {msg.sender === 'user' ? <User size={14} /> : msg.sender === 'ai' ? <Bot size={14} /> : <User size={14} />}
                                </div>
                                <div className="space-y-1">
                                    {(msg.author && msg.sender !== 'user') && (
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                                            {msg.author}
                                        </div>
                                    )}
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10'
                                            : msg.sender === 'ai'
                                                ? 'bg-purple-900/30 border border-purple-500/20 text-purple-100'
                                                : 'bg-white/5 border border-white/10 text-slate-200'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <div className={`text-[10px] text-slate-500 px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className={`p-6 bg-white/5 border-t border-white/5 ${isWidget ? '' : 'backdrop-blur-md'}`}>
                <div className="relative flex items-center gap-3">
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400">
                        <Paperclip size={20} />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-12 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                        />
                        <button className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                            <Smile size={20} />
                        </button>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors"
                    >
                        <Send size={20} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

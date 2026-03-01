"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useChat } from 'ai/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Flame, AlertTriangle, Wind, Users, Loader2 } from 'lucide-react';

interface FirefighterChatProps {
    className?: string;
}

const QUICK_ACTIONS = [
    { label: 'MAYDAY Protocol', icon: AlertTriangle, prompt: 'What is the standard MAYDAY protocol and what information should I transmit?' },
    { label: 'Rescue Tactics', icon: Users, prompt: 'What are the best rescue tactics for a victim found in a smoke-filled room?' },
    { label: 'Ventilation', icon: Wind, prompt: 'When should I initiate ventilation and what type is best for this situation?' },
    { label: 'Flashover Signs', icon: Flame, prompt: 'What are the warning signs of an imminent flashover?' },
];

export const FirefighterChat: React.FC<FirefighterChatProps> = ({ className = "" }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [showQuickActions, setShowQuickActions] = useState(true);

    const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
        api: '/api/firefighter-chat',
        onFinish: () => {
            scrollToBottom();
        },
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (messages.length > 0) {
            setShowQuickActions(false);
        }
    }, [messages.length]);

    const handleQuickAction = (prompt: string) => {
        setInput(prompt);
        // Small delay to ensure input is set before submitting
        setTimeout(() => {
            inputRef.current?.form?.requestSubmit();
        }, 50);
    };

    return (
        <div className={`flex flex-col h-full bg-transparent ${className}`}>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <AnimatePresence>
                    {showQuickActions && messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3"
                        >
                            {/* Welcome Message */}
                            <div className="text-center py-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/40 mb-3">
                                    <Flame className="w-6 h-6 text-orange-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-200 mb-1">AEGIS AI Assistant</h3>
                                <p className="text-xs text-gray-500">Tactical support for structure fire operations</p>
                            </div>

                            {/* Quick Actions Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                {QUICK_ACTIONS.map((action, idx) => (
                                    <motion.button
                                        key={idx}
                                        onClick={() => handleQuickAction(action.prompt)}
                                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 
                               hover:bg-gray-700/50 hover:border-orange-500/30 transition-all group"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <action.icon className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
                                        <span className="text-xs text-gray-400 group-hover:text-gray-200 text-center transition-colors">
                                            {action.label}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chat Messages */}
                {messages.map((message, idx) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${message.role === 'user'
                                ? 'bg-orange-500/20 border border-orange-500/40 text-gray-100'
                                : 'bg-gray-800/70 border border-gray-700/50 text-gray-200'
                                }`}
                        >
                            {message.role === 'assistant' && (
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Flame className="w-3 h-3 text-orange-400" />
                                    <span className="text-xs font-semibold text-orange-400">AEGIS</span>
                                </div>
                            )}
                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>
                    </motion.div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-gray-800/70 border border-gray-700/50 px-3 py-2 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
                                <span className="text-xs text-gray-400">AEGIS analyzing...</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-800/50 bg-gray-900/30">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask AEGIS for tactical guidance..."
                        className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-200 
                       placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20
                       transition-all"
                    />
                    <motion.button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 
                       hover:bg-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Send className="w-4 h-4" />
                    </motion.button>
                </form>
            </div>
        </div>
    );
};

'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

// SVG Icons
const ChatBotIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const BotAvatarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

// Constants
const MAX_HISTORY_MESSAGES = 10;

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/mixkit-message-pop-alert-2354.mp3');
  }, []);

  // Fungsi untuk mengirim pesan ke AI API
  const sendMessageToAI = async (userMessage: string): Promise<string> => {
    try {
      // Siapkan history untuk context
      const history = messages.slice(-MAX_HISTORY_MESSAGES).map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mendapatkan response');
      }

      return data.message;
    } catch (error) {
      console.error('Error calling AI:', error);
      return 'Maaf, terjadi kesalahan. Coba lagi ya! 😅';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hari ini';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Kemarin';
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const savedMessages = localStorage.getItem('putra_bot_messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (e) {
        initWelcomeMessage();
      }
    } else {
      initWelcomeMessage();
    }
  }, []);

  const initWelcomeMessage = () => {
    const welcomeMsg: Message = {
      id: '1',
      text: "Halo! Saya adalah Putra Bot, asisten virtual Andi Putra. Senang bertemu dengan kamu! Ada yang bisa saya bantu hari ini?",
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
  };

  useEffect(() => {
    if (isMounted && messages.length > 0) {
      localStorage.setItem('putra_bot_messages', JSON.stringify(messages));
    }
  }, [messages, isMounted]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto scroll to bottom when opening chat
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userInput,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const typingMessage: Message = {
      id: 'typing',
      text: 'Putra Bot sedang mengetik',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    // Panggil AI API
    const aiResponse = await sendMessageToAI(userInput);

    // Hapus typing indicator
    setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      sender: 'bot',
      timestamp: new Date(),
    };

    // Play notification sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    initWelcomeMessage();
    localStorage.removeItem('putra_bot_messages');
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const dateStr = msg.timestamp.toDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  if (!isMounted) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl shadow-black/20 dark:shadow-white/20 hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group animate-glow"
      >
        <span className={`group-hover:scale-110 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChatBotIcon />
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 left-2 right-2 sm:left-auto sm:right-6 sm:w-[420px] h-[70vh] sm:h-[580px] max-h-[600px] bg-white dark:bg-black backdrop-blur-xl border border-neutral-300 dark:border-neutral-700 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/20 dark:shadow-white/10 flex flex-col z-50 animate-scale-in overflow-hidden font-sans antialiased">
          {/* Header */}
          <div className="bg-black dark:bg-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 dark:bg-black/10 rounded-2xl flex items-center justify-center text-white dark:text-black">
                <ChatBotIcon />
              </div>
              <div>
                <h3 className="text-white dark:text-black font-bold text-lg">Putra Bot</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-neutral-400 dark:text-neutral-600 text-xs">Online - Siap membantu</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 dark:text-neutral-600 hover:text-white dark:hover:text-black w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-neutral-800 dark:hover:bg-neutral-100"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50 dark:bg-neutral-950 scroll-smooth">
            {Object.entries(groupedMessages).map(([dateStr, msgs]) => (
              <div key={dateStr}>
                <div className="flex items-center gap-2 my-4">
                  <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
                  <span className="text-xs text-neutral-500 px-3 py-1 bg-white dark:bg-neutral-900 rounded-full border border-neutral-200 dark:border-neutral-700">
                    {formatDate(new Date(dateStr))}
                  </span>
                  <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
                </div>

                {msgs.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2 mb-3`}>
                    {msg.sender === 'bot' && !msg.isTyping && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
                        <BotAvatarIcon />
                      </div>
                    )}

                    <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[75%]`}>
                      {msg.isTyping ? (
                        <div className="px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-bl-md border border-neutral-200 dark:border-neutral-700 flex items-center gap-3">
                          <span className="text-neutral-600 dark:text-neutral-400 text-sm">{msg.text}</span>
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            className={`px-4 py-2.5 rounded-2xl break-words transition-all duration-200 ${msg.sender === 'user'
                              ? 'bg-black dark:bg-white text-white dark:text-black rounded-br-md'
                              : 'bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-bl-md'
                              }`}
                          >
                            {msg.sender === 'bot' ? (
                              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:my-2">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                              </div>
                            ) : (
                              msg.text
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 px-1">
                            <span className="text-xs text-neutral-500">
                              {formatTime(msg.timestamp)}
                            </span>
                            {msg.sender === 'bot' && (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(msg.text);
                                  setCopiedId(msg.id);
                                  setTimeout(() => setCopiedId(null), 2000);
                                }}
                                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                                title="Copy response"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <CheckIcon />
                                    <span className="text-green-500">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <CopyIcon />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {msg.sender === 'user' && !msg.isTyping && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
                        <UserIcon />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-black">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tulis pesan..."
                rows={1}
                className="flex-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-black dark:text-white placeholder-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition-all duration-200 resize-none text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
              >
                <SendIcon />
              </button>
            </div>
            <div className="flex items-center justify-end mt-2">
              <button
                onClick={clearChat}
                className="text-xs text-neutral-600 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Hapus chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {/* {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )} */}
    </>
  );
}

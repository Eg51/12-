"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";

interface ChatMessage {
  id?: string;
  _id?: string;
  senderId: string;
  message: string;
  timestamp?: string;
  createdAt?: string;
}

// 🟢 Strictly typed Framer Motion variants to eliminate red underlines
const messageVariants: Variants = {
  hidden: (isMe: boolean) => ({ opacity: 0, x: isMe ? 20 : -20, y: 10 }),
  visible: { opacity: 1, x: 0, y: 0, transition: { type: "tween", duration: 0.2, ease: "easeOut" } },
};

export default function UserSupportPage() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const authToken = localStorage.getItem('auth_token');
    setCurrentUserId(userData._id || null);
    setToken(authToken || null);
  }, []);

  useEffect(() => {
    if (!token) return;
    const createRoom = async () => {
      const res = await fetch('/api/chats/rooms', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId: "admin" }) 
      });
      
      if (!res.ok) {
        console.error("Server error:", res.status);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setRoomId(data.data.id);
      }
    };
    createRoom();
  }, [token]);

  useEffect(() => {
    if (!roomId || !token) return;
    
    const fetchMessages = async () => {
        try {
          const res = await fetch(`/api/chats/rooms/${roomId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) {
            setMessages([]); 
            return;
          }
          const data = await res.json();
          setMessages(data.data || []);
          scrollToBottom();
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          setMessages([]);
        }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [roomId, token]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !roomId || !token) return;
    await fetch('/api/chats/messages', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ roomId, message: inputMessage })
    });
    setInputMessage("");
  };

  if (currentUserId === null || token === null || !roomId) {
    return <div className="min-h-screen bg-[#C4F8FD] p-6 flex items-center justify-center">Connecting to support...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-[#C4F8FD] p-2 sm:p-6 lg:p-8"
    >
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100dvh-6rem)] sm:h-[85vh] bg-white/40 rounded-2xl shadow-xl border-none overflow-hidden relative">
        
        <div className="p-4 border-b border-cyan-200/30 flex items-center gap-3 bg-white/20 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()} 
            className="flex items-center justify-center p-1 rounded-full transition-colors text-cyan-700"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <span className="font-semibold text-cyan-900 truncate">Admin Support</span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2 min-h-0">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isMe = msg.senderId === currentUserId; 
              return (
                <motion.div 
                  custom={isMe}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  key={msg.id || msg._id || index} 
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl shadow-sm relative ${
                    isMe 
                      ? 'bg-[#C4F8FD] text-cyan-900 border border-cyan-200/50 rounded-tr-sm' // SENDER (Right)
                      : 'bg-white text-cyan-900 rounded-tl-sm' // RECEIVER (Left)
                  }`}>
                    <p className="text-sm break-words">{msg.message}</p>
                    <p className="text-[10px] text-cyan-600 mt-1 text-right">
                      {new Date(msg.timestamp || msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-cyan-200/30 bg-white/10 backdrop-blur-sm flex gap-3 flex-shrink-0">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask for support..."
            className="flex-1 rounded-full bg-white/70 px-4 py-3 text-sm text-cyan-900 placeholder:text-cyan-700/50 focus:outline-none border-none shadow-inner resize-none h-10 sm:h-auto"
            rows={1}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage} 
            className="bg-[#C4F8FD] border border-cyan-200/50 text-cyan-700 p-3 rounded-full shadow-lg hover:bg-white transition-all flex-shrink-0"
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
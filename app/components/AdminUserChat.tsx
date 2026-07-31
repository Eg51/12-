// "use client";

// import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   collection, addDoc, query, orderBy, onSnapshot, serverTimestamp,
//   doc, updateDoc, setDoc, deleteDoc, Timestamp, FieldValue
// } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { db, storage, auth } from "@/lib/firebase";
// import { Send, Check, Image as ImageIcon, Trash2, Loader2, Users } from "lucide-react";

// interface Message {
//   id: string;
//   text: string;
//   imageUrl?: string;
//   senderId: string;
//   senderName: string;
//   createdAt: Timestamp;
//   deleted?: boolean;
// }

// interface ChatProps {
//   isAdmin: boolean;
//   adminUid: string; // FIXED: was a string-literal type, rejecting any real UID passed to it
// }

// export default function AdminUserChat({ isAdmin, adminUid }: ChatProps) {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [otherTyping, setOtherTyping] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [lastRead, setLastRead] = useState<Record<string, Timestamp>>({});
//   const [uploading, setUploading] = useState(false);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [userList, setUserList] = useState<any[]>([]);
//   const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
//   const typingTimeout = useRef<NodeJS.Timeout | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   const currentUserId = auth.currentUser?.uid;
//   const currentUserName = isAdmin ? "Admin" : "Guest";

//   const otherId = isAdmin ? activeChatUserId : adminUid;
//   const chatId = isAdmin && activeChatUserId ? `chat_${adminUid}_${activeChatUserId}` : `chat_${adminUid}_${currentUserId}`;
//   const otherName = isAdmin ? "User" : "Support";

//   // 1. Admin: load all users who chatted
//   useEffect(() => {
//     if (!isAdmin) return;
//     const q = query(collection(db, "chats"));
//     return onSnapshot(q, (snap) => {
//       const users = snap.docs
//         .filter(d => d.data().members?.includes(adminUid))
//         .map(d => {
//           const members = d.data().members;
//           const userId = members.find((id: string) => id !== adminUid);
//           return { id: userId, chatId: d.id, lastMessage: d.data().lastMessage }
//         });
//       setUserList(users);
//     });
//   }, [isAdmin, adminUid]);

//   // 2. Listen messages
//   useEffect(() => {
//     if (!chatId || !currentUserId) return;
//     const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
//     return onSnapshot(q, (snap) =>
//       setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)))
//     );
//   }, [chatId, currentUserId]);

//   // 3. Listen typing + lastRead
//   useEffect(() => {
//     if (!chatId || !otherId) return;
//     const unsubTyping = onSnapshot(doc(db, "chats", chatId, "typing", otherId), (snap) => {
//       setOtherTyping(snap.data()?.isTyping || false);
//     });
//     const unsubChat = onSnapshot(doc(db, "chats", chatId), (snap) => {
//       setLastRead(snap.data()?.lastRead || {});
//     });
//     return () => { unsubTyping(); unsubChat(); };
//   }, [chatId, otherId]);

//   // 4. Auto scroll + mark read
//   useEffect(() => {
//     if (!chatId || !currentUserId) return;
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });

//     const markAsRead = async () => {
//       await updateDoc(doc(db, "chats", chatId), {
//         [`lastRead.${currentUserId}`]: serverTimestamp() as FieldValue
//       });
//     };
//     markAsRead();
//   }, [messages, chatId, currentUserId]);

//   // 5. Typing
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setInput(e.target.value);
//     if (!isTyping && chatId && currentUserId) {
//       setIsTyping(true);
//       setDoc(doc(db, "chats", chatId, "typing", currentUserId), { isTyping: true, updatedAt: serverTimestamp() });
//     }
//     if (typingTimeout.current) clearTimeout(typingTimeout.current);
//     typingTimeout.current = setTimeout(() => {
//       setIsTyping(false);
//       if (chatId && currentUserId) deleteDoc(doc(db, "chats", chatId, "typing", currentUserId));
//     }, 2000);
//   };

//   // 6. Image
//   const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) setPreviewImage(URL.createObjectURL(file));
//   };

//   const uploadAndSendImage = async () => {
//     const file = fileInputRef.current?.files?.[0];
//     if (!file || !chatId) return;
//     setUploading(true);
//     const imageRef = ref(storage, `chats/${chatId}/${Date.now()}_${file.name}`);
//     const snap = await uploadBytes(imageRef, file);
//     const url = await getDownloadURL(snap.ref);

//     await addDoc(collection(db, "chats", chatId, "messages"), {
//       imageUrl: url, text: "", senderId: currentUserId, senderName: currentUserName, createdAt: serverTimestamp()
//     });
//     setUploading(false);
//     setPreviewImage(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   }

//   // 7. Delete
//   const handleDelete = async (messageId: string) => {
//     if (!chatId) return;
//     await updateDoc(doc(db, "chats", chatId, "messages", messageId), {
//       deleted: true, text: "This message was deleted", imageUrl: null
//     });
//   }

//   // 8. Send
//   const handleSend = async (e: FormEvent) => {
//     e.preventDefault();
//     if ((!input.trim() && !fileInputRef.current?.files?.[0]) || !chatId || !otherId || !currentUserId) return;

//     await setDoc(doc(db, "chats", chatId), {
//       members: [adminUid, isAdmin ? activeChatUserId : currentUserId],
//       createdAt: serverTimestamp()
//     }, { merge: true });

//     if (fileInputRef.current?.files?.[0]) {
//       await uploadAndSendImage();
//     } else {
//       await addDoc(collection(db, "chats", chatId, "messages"), {
//         text: input, senderId: currentUserId, senderName: currentUserName, createdAt: serverTimestamp()
//       });
//     }

//     await updateDoc(doc(db, "chats", chatId), {
//       lastMessage: input || "📷 Photo",
//       lastMessageAt: serverTimestamp()
//     });
//     setInput("");
//     deleteDoc(doc(db, "chats", chatId, "typing", currentUserId));
//     setIsTyping(false);
//   };

//   const isMessageSeen = (msg: Message) => {
//     if (!otherId) return false;
//     const otherLastRead = lastRead[otherId];
//     return otherLastRead && msg.createdAt && otherLastRead.toMillis() >= msg.createdAt.toMillis();
//   }

//   // Admin sidebar
//   if (isAdmin && !activeChatUserId) {
//     return (
//       <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
//         <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Users size={18} /> Support Inbox</h2>
//         {userList.length === 0 && <p className="text-sm text-slate-500">No chats yet</p>}
//         <div className="space-y-2">
//           {userList.map(u => (
//             <button key={u.id} onClick={() => setActiveChatUserId(u.id)}
//               className="w-full rounded-lg bg-slate-100 p-3 text-left hover:bg-slate-200">
//               <p className="font-medium">User: {u.id.slice(0, 6)}...</p>
//               <p className="text-xs text-slate-500 truncate">{u.lastMessage || "New chat"}</p>
//             </button>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex h-[600px] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
//       <div className="border-b p-3 font-semibold">Chat with {otherName}</div>
//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         <AnimatePresence initial={false}>
//           {messages.map((msg) => {
//             const isMe = msg.senderId === currentUserId;
//             const seen = isMe && isMessageSeen(msg);
//             return (
//               <motion.div key={msg.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//                 className={`group relative flex ${isMe ? "justify-end" : "justify-start"}`}>
//                 <div className="flex flex-col items-end gap-1">
//                   <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMe ? "rounded-br-sm bg-cyan-600 text-white" : "rounded-bl-sm bg-slate-100 text-slate-900"
//                     }`}>
//                     {msg.imageUrl && !msg.deleted && <img src={msg.imageUrl} alt="chat" className="mb-2 max-w-[200px] rounded-lg" />}
//                     <p className={`break-words ${msg.deleted ? "italic opacity-70" : ""}`}>{msg.text}</p>
//                   </div>
//                   {isMe && !msg.deleted && (
//                     <button onClick={() => handleDelete(msg.id)}
//                       className="absolute -top-2 -right-2 hidden rounded-full bg-slate-800 p-1 text-white opacity-0 transition group-hover:flex group-hover:opacity-100">
//                       <Trash2 size={12} />
//                     </button>
//                   )}
//                   {isMe && <div>{seen ? <Check size={14} className="text-cyan-600" /> : <Check size={14} className="text-slate-400" />}</div>}
//                 </div>
//               </motion.div>
//             );
//           })}
//         </AnimatePresence>
//         <AnimatePresence>
//           {otherTyping && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-slate-500">Typing...</motion.div>}
//         </AnimatePresence>
//         <div ref={bottomRef} />
//       </div>

//       <form onSubmit={handleSend} className="flex items-center gap-2 border-t p-3">
//         <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
//         <button type="button" onClick={() => fileInputRef.current?.click()}><ImageIcon size={20} /></button>
//         <input value={input} onChange={handleInputChange} placeholder="Type a message..." className="flex-1 rounded-full border px-4 py-2.5 text-sm" />
//         <button type="submit" disabled={uploading} className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-white">
//           {uploading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
//         </button>
//       </form>
//     </div>
//   );
// }
"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Send,
  Image as ImageIcon,
  Video as VideoIcon,
  Paperclip,
  Loader2,
  FileText,
  Download,
  Users,
  ArrowLeft,
} from "lucide-react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../../lib/firebase";

// ---- Types ----------------------------------------------------------------

interface Attachment {
  url: string;
  kind: "image" | "video" | "file";
  name: string;
}

interface Message {
  id: string;
  text: string;
  attachment?: Attachment | null;
  senderId: string;
  senderName: string;
  createdAt: Timestamp | null;
}

interface ChatSummary {
  id: string;
  otherUserId: string;
  lastMessage?: string;
  lastMessageAt?: Timestamp;
}

// ---- Component --------------------------------------------------------------

export default function AdminChatPanel() {
  const [admin, setAdmin] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const adminUid = admin?.uid;
  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  // ---- Auth: confirm an admin is logged in (real login, not anonymous) ----
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAdmin(user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // ---- Load every chat this admin is a member of -----------------------------
  useEffect(() => {
    if (!adminUid) return;
    const q = query(
      collection(db, "chats"),
      where("members", "array-contains", adminUid)
    );
    return onSnapshot(q, (snap) => {
      const list: ChatSummary[] = snap.docs.map((d) => {
        const data = d.data();
        const members: string[] = data.members ?? [];
        const otherUserId = members.find((id) => id !== adminUid) ?? "";
        return {
          id: d.id,
          otherUserId,
          lastMessage: data.lastMessage,
          lastMessageAt: data.lastMessageAt,
        };
      });
      list.sort(
        (a, b) =>
          (b.lastMessageAt?.toMillis() ?? 0) - (a.lastMessageAt?.toMillis() ?? 0)
      );
      setChats(list);
    });
  }, [adminUid]);

  // ---- Listen for messages in the active chat --------------------------------
  useEffect(() => {
    if (!activeChatId) return;
    const q = query(
      collection(db, "chats", activeChatId, "messages"),
      orderBy("createdAt", "asc")
    );
    return onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message)));
    });
  }, [activeChatId]);

  // ---- Auto-scroll to newest message --------------------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- Send a text reply --------------------------------------------------
  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeChatId || !adminUid) return;

    await addDoc(collection(db, "chats", activeChatId, "messages"), {
      text: input,
      attachment: null,
      senderId: adminUid,
      senderName: "Admin",
      createdAt: serverTimestamp(),
    });
    await setDoc(
      doc(db, "chats", activeChatId),
      { lastMessage: input, lastMessageAt: serverTimestamp() },
      { merge: true }
    );
    setInput("");
  }

  // ---- Upload + send an image / video / file ----------------------------------
  async function handleFileUpload(
    e: ChangeEvent<HTMLInputElement>,
    kind: Attachment["kind"]
  ) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !activeChatId || !adminUid) return;

    setUploading(true);
    try {
      const storageRef = ref(
        storage,
        `chats/${activeChatId}/${Date.now()}_${file.name}`
      );
      const snap = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snap.ref);

      const attachment: Attachment = { url, kind, name: file.name };
      const label =
        kind === "image" ? "📷 Photo" : kind === "video" ? "🎥 Video" : `📎 ${file.name}`;

      await addDoc(collection(db, "chats", activeChatId, "messages"), {
        text: "",
        attachment,
        senderId: adminUid,
        senderName: "Admin",
        createdAt: serverTimestamp(),
      });
      await setDoc(
        doc(db, "chats", activeChatId),
        { lastMessage: label, lastMessageAt: serverTimestamp() },
        { merge: true }
      );
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  // ---- Guard states -------------------------------------------------------

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <Loader2 size={20} className="animate-spin text-slate-500" />
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-600">
        You need to be logged in as an admin to view support chats.
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-100">
      {/* Sidebar */}
      <div
        className={`w-full flex-col border-r border-slate-300 bg-white md:flex md:w-80 ${
          activeChatId ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
          <Users size={18} className="text-slate-700" />
          <h2 className="text-sm font-semibold text-slate-900">Support Inbox</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-slate-500">
              No conversations yet
            </p>
          )}
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`flex w-full flex-col items-start gap-0.5 border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                activeChatId === chat.id ? "bg-cyan-50" : ""
              }`}
            >
              <p className="text-sm font-medium text-slate-900">
                Visitor {chat.otherUserId.slice(0, 6)}
              </p>
              <p className="w-full truncate text-xs text-slate-500">
                {chat.lastMessage || "New conversation"}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat panel */}
      <div
        className={`flex-1 flex-col ${activeChat ? "flex" : "hidden md:flex"}`}
      >
        {!activeChat ? (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
            Select a conversation to start replying
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-slate-300 bg-white px-4 py-3.5">
              <button
                onClick={() => setActiveChatId(null)}
                className="rounded-full p-1 text-slate-600 hover:bg-slate-100 md:hidden"
                aria-label="Back to conversations"
              >
                <ArrowLeft size={18} />
              </button>
              <p className="text-sm font-semibold text-slate-900">
                Visitor {activeChat.otherUserId.slice(0, 6)}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-2.5 overflow-y-auto bg-slate-50 px-4 py-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isMe = msg.senderId === adminUid;
                  return (
                    <motion.div
                      key={msg.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-sm ${
                          isMe
                            ? "rounded-br-sm bg-cyan-600 text-white"
                            : "rounded-bl-sm bg-white text-slate-900 shadow-sm"
                        }`}
                      >
                        <MessageBody msg={msg} />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {uploading && (
              <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
                <Loader2 size={13} className="animate-spin" />
                Uploading...
              </div>
            )}

            {/* Input row */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-slate-300 bg-white px-3 py-3"
            >
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={(e) => handleFileUpload(e, "image")}
                className="hidden"
              />
              <input
                type="file"
                accept="video/*"
                ref={videoInputRef}
                onChange={(e) => handleFileUpload(e, "video")}
                className="hidden"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e, "file")}
                className="hidden"
              />

              <button
                type="button"
                disabled={uploading}
                onClick={() => imageInputRef.current?.click()}
                aria-label="Attach image"
                className="shrink-0 rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
              >
                <ImageIcon size={18} />
              </button>
              <button
                type="button"
                disabled={uploading}
                onClick={() => videoInputRef.current?.click()}
                aria-label="Attach video"
                className="shrink-0 rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
              >
                <VideoIcon size={18} />
              </button>
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                aria-label="Attach file"
                className="shrink-0 rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
              >
                <Paperclip size={18} />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Reply to visitor..."
                className="min-w-0 flex-1 rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={uploading || !input.trim()}
                aria-label="Send reply"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-white transition-colors hover:bg-cyan-500 disabled:opacity-50"
              >
                <Send size={16} />
              </motion.button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ---- Subcomponents ----------------------------------------------------------

function MessageBody({ msg }: { msg: Message }) {
  if (msg.attachment?.kind === "image") {
    return (
      <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer">
        <img
          src={msg.attachment.url}
          alt={msg.attachment.name}
          className="max-w-[220px] rounded-lg"
        />
      </a>
    );
  }

  if (msg.attachment?.kind === "video") {
    return (
      <video
        src={msg.attachment.url}
        controls
        className="max-w-[240px] rounded-lg"
      />
    );
  }

  if (msg.attachment?.kind === "file") {
    return (
      <a
        href={msg.attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 underline underline-offset-2"
      >
        <FileText size={15} className="shrink-0" />
        <span className="truncate">{msg.attachment.name}</span>
        <Download size={13} className="shrink-0" />
      </a>
    );
  }

  return <p className="break-words">{msg.text}</p>;
}

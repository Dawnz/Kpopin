'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle, Search } from 'lucide-react';
import { cn, timeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Fan {
  id: string;
  name: string | null;
  username: string | null;
  groupMembers: { group: { name: string } }[];
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: { id?: string; name: string | null };
  senderId: string;
}

interface Chat {
  id: string;
  members: { user: { id: string; name: string | null; username: string | null } }[];
  messages: { content: string; sender: { name: string | null } }[];
}

interface Props {
  chats: Chat[];
  similarFans: Fan[];
  currentUserId: string;
}

export function ChatLayout({ chats, similarFans, currentUserId }: Props) {
  const [activeChatId, setActiveChatId] = useState<string | null>(chats[0]?.id ?? null);
  const [messages, setMessages]         = useState<Message[]>([]);
  const [text, setText]                 = useState('');
  const [loading, setLoading]           = useState(false);
  const [tab, setTab]                   = useState<'chats' | 'discover'>('chats');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeChatId) return;
    fetch(`/api/chat/${activeChatId}/messages`)
      .then((r) => r.json())
      .then((data) => setMessages(data.messages ?? []));
  }, [activeChatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!text.trim() || !activeChatId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/chat/${activeChatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setText('');
    } catch {
      toast.error('Failed to send');
    } finally {
      setLoading(false);
    }
  }

  async function startChat(userId: string) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: userId }),
    });
    const data = await res.json();
    setActiveChatId(data.chatId);
    setTab('chats');
  }

  const activeChat = chats.find((c) => c.id === activeChatId);
  const chatPartner = activeChat?.members.find((m) => m.user.id !== currentUserId)?.user;

  return (
    <div className="flex h-screen">
      {/* Left panel */}
      <div className="w-72 border-r border-kpop-border flex flex-col">
        <div className="p-4 border-b border-kpop-border">
          <h1 className="font-display text-lg font-700 mb-3">Messages</h1>
          <div className="flex gap-2">
            <button onClick={() => setTab('chats')} className={cn('flex-1 py-1.5 rounded-lg text-xs font-medium transition-all', tab === 'chats' ? 'bg-kpop-pink/10 text-kpop-pink' : 'text-kpop-muted hover:text-white')}>
              <MessageCircle size={13} className="inline mr-1" />Chats
            </button>
            <button onClick={() => setTab('discover')} className={cn('flex-1 py-1.5 rounded-lg text-xs font-medium transition-all', tab === 'discover' ? 'bg-kpop-pink/10 text-kpop-pink' : 'text-kpop-muted hover:text-white')}>
              <Users size={13} className="inline mr-1" />Discover
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === 'chats' && (
            chats.length === 0
              ? <p className="text-kpop-muted text-sm text-center p-6">No conversations yet. Discover fans!</p>
              : chats.map((chat) => {
                  const partner = chat.members.find((m) => m.user.id !== currentUserId)?.user;
                  const lastMsg = chat.messages[0];
                  return (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={cn('w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left', activeChatId === chat.id && 'bg-kpop-pink/5 border-r-2 border-kpop-pink')}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-kpop-pink to-kpop-purple flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {partner?.name?.[0]?.toUpperCase() ?? 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{partner?.name ?? 'Unknown'}</p>
                        {lastMsg && <p className="text-xs text-kpop-muted truncate">{lastMsg.sender.name}: {lastMsg.content}</p>}
                      </div>
                    </button>
                  );
                })
          )}

          {tab === 'discover' && (
            <div className="p-3 space-y-2">
              <p className="text-xs text-kpop-muted px-1 mb-3">Fans who share your group interests</p>
              {similarFans.length === 0
                ? <p className="text-kpop-muted text-sm text-center py-4">Follow some groups first!</p>
                : similarFans.map((fan) => (
                  <div key={fan.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-kpop-cyan to-kpop-purple flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {fan.name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{fan.name}</p>
                      <p className="text-xs text-kpop-muted truncate">
                        {fan.groupMembers.map((gm) => gm.group.name).join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => startChat(fan.id)}
                      className="text-xs px-2 py-1 rounded-lg bg-kpop-pink/10 text-kpop-pink border border-kpop-pink/20 hover:bg-kpop-pink/20 transition-colors flex-shrink-0"
                    >
                      Chat
                    </button>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      {activeChatId ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-kpop-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-kpop-pink to-kpop-purple flex items-center justify-center text-sm font-bold">
              {chatPartner?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="font-medium text-sm">{chatPartner?.name ?? 'Chat'}</p>
              {chatPartner?.username && <p className="text-xs text-kpop-muted">@{chatPartner.username}</p>}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-xs px-4 py-2.5 rounded-2xl text-sm', isMe ? 'bg-gradient-to-br from-kpop-pink to-kpop-purple text-white rounded-br-sm' : 'bg-kpop-card border border-kpop-border rounded-bl-sm')}>
                    <p>{msg.content}</p>
                    <p className={cn('text-xs mt-1', isMe ? 'text-white/60' : 'text-kpop-muted')}>{timeAgo(msg.createdAt)}</p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-kpop-border flex items-center gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-kpop-dark border border-kpop-border rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-kpop-pink/50 transition-colors placeholder:text-kpop-muted"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !text.trim()}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-kpop-pink to-kpop-purple flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageCircle size={40} className="text-kpop-muted mx-auto mb-3" />
            <p className="text-kpop-muted">Select a conversation or discover fans</p>
          </div>
        </div>
      )}
    </div>
  );
}

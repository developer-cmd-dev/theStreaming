"use client";

import { IconChevronDown, IconSend } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { chatMessages, type ChatMessage } from "@/lib/mock-data";

const EXTRA_MESSAGES = [
  { username: "RandomUser", color: "#FF6B9D", message: "W stream 🔥" },
  { username: "CoolCat", color: "#6BCBFF", message: "gg" },
  { username: "FanBoy99", color: "#FFD740", message: "PogChamp" },
  { username: "Chatter", color: "#69F0AE", message: "how long you streaming?" },
];

export default function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  const [input, setInput] = useState("");
  const [showNewMessages, setShowNewMessages] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgCounter = useRef(chatMessages.length);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "instant" });
    setShowNewMessages(false);
    setIsAtBottom(true);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setIsAtBottom(atBottom);
    if (atBottom) setShowNewMessages(false);
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, [scrollToBottom]);

  useEffect(() => {
    const interval = setInterval(() => {
      const extra = EXTRA_MESSAGES[Math.floor(Math.random() * EXTRA_MESSAGES.length)];
      msgCounter.current += 1;
      const newMsg: ChatMessage = {
        id: `live-${msgCounter.current}`,
        username: extra.username,
        color: extra.color,
        message: extra.message,
      };
      setMessages((prev) => [...prev.slice(-40), newMsg]);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    } else {
      setShowNewMessages(true);
    }
  }, [messages, isAtBottom, scrollToBottom]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    msgCounter.current += 1;
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${msgCounter.current}`,
        username: "You",
        color: "#CCF300",
        message: input.trim(),
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-xl border border-border bg-surface lg:min-h-0">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-text-primary">Chat</h3>
        <span className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="size-1.5 rounded-full bg-brand animate-pulse-live" />
          {messages.length} messages
        </span>
      </div>

      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto px-3 py-2"
        >
          {messages.map((msg) => (
            <p key={msg.id} className="mb-1.5 text-[13px] leading-relaxed break-words">
              <span className="font-semibold" style={{ color: msg.color }}>
                {msg.username}
              </span>
              <span className="text-text-muted">: </span>
              <span className="text-text-primary/90">{msg.message}</span>
            </p>
          ))}
        </div>

        {showNewMessages && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground shadow-lg"
          >
            New messages
            <IconChevronDown size={12} />
          </motion.button>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="flex shrink-0 gap-2 border-t border-border p-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message..."
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand/50 focus:ring-1 focus:ring-brand/20"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground transition-shadow hover:shadow-[0_0_16px_rgba(204,243,0,0.25)]"
          aria-label="Send message"
        >
          <IconSend size={16} />
        </motion.button>
      </form>
    </div>
  );
}

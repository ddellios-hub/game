"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@sandbox/ui";
import type { ChatMessage } from "@sandbox/game-core";
import type { Socket } from "socket.io-client";
import { createRoomSocket } from "@/lib/socketClient";
import { api } from "@/lib/api";

interface RoomChatProps {
  roomId: string;
  userId: string;
  userName?: string;
}

export function RoomChat({ roomId, userId, userName = "Player" }: RoomChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [flagged, setFlagged] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = createRoomSocket(roomId);
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  useEffect(() => {
    async function loadHistory() {
      const res = await api.get(`/api/chat/${roomId}`);
      setMessages(res.data);
    }
    loadHistory();
  }, [roomId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit("join_room", { roomId, userId, name: userName });
    socket.on("chat_message", ({ message, flagged: isFlagged }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          roomId,
          userId: "remote",
          message,
          createdAt: new Date().toISOString()
        }
      ]);
      if (!isFlagged?.clean) {
        setFlagged(true);
      }
    });
    socket.on("report_confirmed", () => setFlagged(false));
    return () => {
      socket.off("chat_message");
      socket.off("report_confirmed");
    };
  }, [roomId, userId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;
    const res = await api.post("/api/chat", { roomId, userId, message: input });
    socketRef.current?.emit("chat_message", { message: input });
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), roomId, userId, message: res.data.message.message, createdAt: new Date().toISOString() }
    ]);
    if (!res.data.flagged.clean) {
      setFlagged(true);
    }
    setInput("");
  }

  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white/80 p-4" aria-label="Room chat">
      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.map((message) => (
          <p key={message.id} className="text-sm text-slate-700">
            <span className="font-semibold">{message.userId === userId ? "You" : "Player"}:</span> {message.message}
          </p>
        ))}
      </div>
      <form className="mt-3 flex gap-2" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="chat-input">
          Message
        </label>
        <input
          id="chat-input"
          className="flex-1 rounded-md border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none"
          placeholder="Message"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
      {flagged && <p className="mt-2 text-xs text-danger">We filtered some words. Keep the chat friendly!</p>}
    </section>
  );
}

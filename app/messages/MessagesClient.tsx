"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Message = {
  id: string;
  item_id: string | null;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
};

type Profile = {
  user_id: string;
  name: string | null;
  picture: string | null;
};

type MessagesClientProps = {
  messages: Message[];
  currentUserId: string;
  profiles: Profile[];
};

export default function MessagesClient({
  messages,
  currentUserId,
  profiles,
}: MessagesClientProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState(messages);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;

          const belongsToConversation =
            (newMessage.sender_id === currentUserId &&
              newMessage.receiver_id === selectedUserId) ||
            (newMessage.sender_id === selectedUserId &&
              newMessage.receiver_id === currentUserId);

          if (belongsToConversation) {
            setMessageList((prev) => {
              if (prev.some((msg) => msg.id === newMessage.id)) {
                return prev;
              }

              return [...prev, newMessage];
            });
          }
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, selectedUserId]);

  const selectedProfile = profiles.find(
    (profile) => profile.user_id === selectedUserId,
  );

  const conversations = useMemo(() => {
    const users = new Map<string, Message>();

    for (const msg of messages) {
      const otherUserId =
        msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;

      users.set(otherUserId, msg);
    }

    return Array.from(users.entries()).reverse();
  }, [messages, currentUserId]);

  const selectedMessages = messageList.filter((msg) => {
    if (!selectedUserId) return false;

    return (
      (msg.sender_id === currentUserId && msg.receiver_id === selectedUserId) ||
      (msg.sender_id === selectedUserId && msg.receiver_id === currentUserId)
    );
  });

  async function handleSend() {
    if (!message.trim() || !selectedUserId) return;

    setSending(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: selectedUserId,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to send message");
        return;
      }
      setMessageList((prev) => [...prev, data.message]);
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex h-[650px] flex-col md:flex-row">
        {/* Conversations */}
        <aside className="w-full shrink-0 border-b border-gray-200 bg-gray-50 md:w-[280px] md:border-b-0 md:border-r lg:w-[320px]">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Conversations
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your recent conversations
            </p>
          </div>

          <div className="overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-gray-500">No conversations yet.</p>
              </div>
            ) : (
              conversations.map(([userId, latestMessage]) => {
                const profile = profiles.find(
                  (profile) => profile.user_id === userId,
                );

                return (
                  <button
                    key={userId}
                    onClick={() => setSelectedUserId(userId)}
                    className={`flex w-full gap-3 border-b border-gray-200 px-5 py-4 text-left transition ${
                      selectedUserId === userId ? "bg-white" : "hover:bg-white"
                    }`}
                  >
                    {/* Avatar */}
                    {profile?.picture ? (
                      <img
                        src={profile.picture}
                        alt={profile.name ?? "User"}
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                        {profile?.name?.charAt(0).toUpperCase() ?? "U"}
                      </div>
                    )}

                    {/* Conversation preview */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-gray-900">
                        {profile?.name ?? "User"}
                      </p>

                      <p className="mt-1 truncate text-sm text-gray-500">
                        {latestMessage.message}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Chat */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          {!selectedUserId ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                💬
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                Your messages
              </h2>

              <p className="mt-2 max-w-sm text-sm text-gray-500">
                Select a conversation from the left to start chatting.
              </p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
                {selectedProfile?.picture ? (
                  <img
                    src={selectedProfile.picture}
                    alt={selectedProfile.name ?? "User"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                    {selectedProfile?.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                )}

                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedProfile?.name ?? "User"}
                  </h2>

                  <p className="text-xs text-gray-500">Conversation</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-6">
                <div className="space-y-3">
                  {selectedMessages.map((msg) => {
                    const isMine = msg.sender_id === currentUserId;

                    return (
                      <div
                        key={msg.id}
                        className={`flex w-full ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                            isMine
                              ? "rounded-br-md bg-black text-white"
                              : "rounded-bl-md bg-white text-gray-900 shadow-sm"
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Message input */}
              <div className="border-t border-gray-200 bg-white p-4">
                <div className="flex items-end gap-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Write a message..."
                    rows={1}
                    className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  />

                  <button
                    onClick={handleSend}
                    disabled={sending || !message.trim()}
                    className="shrink-0 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>

                <p className="mt-2 px-1 text-xs text-gray-400">
                  Press Enter to send · Shift + Enter for a new line
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

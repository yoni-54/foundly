"use client";

import { useMemo, useState } from "react";

type Message = {
  id: string;
  item_id: string | null;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
};

type MessagesClientProps = {
  messages: Message[];
  currentUserId: string;
};

export default function MessagesClient({
  messages,
  currentUserId,
}: MessagesClientProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const conversations = useMemo(() => {
    const users = new Map<string, Message>();

    for (const msg of messages) {
      const otherUserId =
        msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;

      users.set(otherUserId, msg);
    }

    return Array.from(users.entries()).reverse();
  }, [messages, currentUserId]);

  const selectedMessages = messages.filter((msg) => {
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

      setMessage("");

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex h-[650px]">
        {/* Conversations */}
        <aside className="w-[320px] border-r border-gray-200 bg-gray-50">
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
              conversations.map(([userId, latestMessage]) => (
                <button
                  key={userId}
                  onClick={() => setSelectedUserId(userId)}
                  className={`flex w-full gap-3 border-b border-gray-200 px-5 py-4 text-left transition ${
                    selectedUserId === userId ? "bg-white" : "hover:bg-white"
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                    U
                  </div>

                  {/* Conversation preview */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">User</p>

                    <p className="mt-1 truncate text-sm text-gray-500">
                      {latestMessage.message}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat */}
        <section className="flex min-w-0 flex-1 flex-col">
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
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  U
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">User</h2>

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
                        className={`flex ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-6 ${
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
                    className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
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

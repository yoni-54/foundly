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

      if (!users.has(otherUserId)) {
        users.set(otherUserId, msg);
      }
    }

    return Array.from(users.entries());
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
    <div className="flex h-[600px] overflow-hidden rounded-xl border bg-white">
      {/* Conversations */}
      <div className="w-1/3 border-r">
        <div className="border-b p-4">
          <h2 className="font-semibold text-gray-900">Conversations</h2>
        </div>

        <div>
          {conversations.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No conversations yet.</p>
          ) : (
            conversations.map(([userId, latestMessage]) => (
              <button
                key={userId}
                onClick={() => setSelectedUserId(userId)}
                className={`w-full border-b p-4 text-left hover:bg-gray-50 ${
                  selectedUserId === userId ? "bg-gray-100" : ""
                }`}
              >
                <p className="font-medium text-gray-900">{userId}</p>

                <p className="mt-1 truncate text-sm text-gray-500">
                  {latestMessage.message}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="flex flex-1 flex-col">
        {!selectedUserId ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-gray-500">
              Select a conversation to view messages.
            </p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="border-b p-4">
              <h2 className="font-semibold text-gray-900">{selectedUserId}</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-6">
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
                      className={`max-w-[70%] rounded-lg px-4 py-3 ${
                        isMine
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border px-4 py-2 text-gray-900 outline-none focus:border-gray-500"
                />

                <button
                  onClick={handleSend}
                  disabled={sending || !message.trim()}
                  className="rounded-lg bg-black px-5 py-2 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

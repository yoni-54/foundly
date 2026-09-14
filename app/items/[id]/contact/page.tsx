"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ContactPage() {
  const { id } = useParams();

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!message.trim()) return;

    setSending(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_id: id,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to send message");
        return;
      }

      alert("Message sent!");
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/items/${id}`}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back to item
        </Link>

        <div className="mt-8 rounded-xl border border-gray-700 bg-gray-900 p-8">
          <h1 className="text-3xl font-bold">Contact Poster</h1>

          <p className="mt-2 text-gray-400">
            Send a message to the person who posted this item.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">Message</label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
                rows={6}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

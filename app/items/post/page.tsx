"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function PostItemPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const form = event.currentTarget;

  setLoading(true);
  setMessage("");

  const formData = new FormData(form);

  const type = formData.get("type") as "LOST" | "FOUND";
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const date = formData.get("date") as string;
  const image = formData.get("image") as File;

  let imageUrl: string | null = null;

  // Upload image if one was selected
  if (image && image.size > 0) {
    const fileName = `${Date.now()}-${image.name}`;

    const { error: uploadError } = await supabase.storage
      .from("item-images")
      .upload(fileName, image);

    if (uploadError) {
      console.error(uploadError);
      setMessage("Image upload failed.");
      setLoading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("item-images")
      .getPublicUrl(fileName);

    imageUrl = publicUrlData.publicUrl;
  }

  const { error } = await supabase.from("items").insert({
    type,
    title,
    category,
    description,
    location,
    date_lost_found: date,
    image_url: imageUrl,
  });

  if (error) {
    console.error(error);
    setMessage("Something went wrong. Please try again.");
  } else {
    setMessage("Item posted successfully!");
    form.reset();
  }

  setLoading(false);
}

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/items"
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back to items
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Post an Item</h1>

        <p className="mt-2 text-gray-400">
          Tell the Foundly community about a lost or found item.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Item Status
            </label>

            <select
              name="type"
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white"
            >
              <option value="LOST">I lost this item</option>
              <option value="FOUND">I found this item</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Item Name
            </label>

            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Samsung Galaxy S24"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <select
              name="category"
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white"
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="documents">Documents</option>
              <option value="wallet">Wallet</option>
              <option value="bags">Bags</option>
              <option value="keys">Keys</option>
              <option value="jewelry">Jewelry</option>
              <option value="clothing">Clothing</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              name="description"
              required
              rows={5}
              placeholder="Describe the item..."
              className="w-full resize-none rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Location
            </label>

            <input
              type="text"
              name="location"
              required
              placeholder="e.g. Bole, Addis Ababa"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Date Lost / Found
            </label>

            <input
              type="date"
              name="date"
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Photo
            </label>

            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-6 py-3 font-semibold text-black disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Item"}
          </button>

          {message && (
            <p className="text-center text-sm text-gray-300">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
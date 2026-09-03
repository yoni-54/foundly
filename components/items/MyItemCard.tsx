"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type MyItemCardProps = {
  id: string;
  title: string;
  location: string;
  type: "LOST" | "FOUND";
  image_url: string | null;
};

export default function MyItemCard({
  id,
  title,
  location,
  type,
  image_url,
}: MyItemCardProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?",
    );

    if (!confirmed) return;

    setDeleting(true);

    const response = await fetch(`/api/items/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Failed to delete item.");
      setDeleting(false);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <Link href={`/items/${id}`}>
        <div className="h-48 bg-gray-800">
          {image_url ? (
            <Image
              src={image_url}
              alt={title}
              width={600}
              height={400}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        <div className="p-5">
          <span
            className={`text-sm font-semibold ${
              type === "LOST" ? "text-red-600" : "text-green-600"
            }`}
          >
            {type}
          </span>

          <h2 className="mt-2 text-lg font-semibold text-black">{title}</h2>

          <p className="mt-1 text-sm text-gray-500">📍 {location}</p>
        </div>
      </Link>

      <div className="flex gap-3 border-t p-4">
        <Link
          href={`/items/${id}/edit`}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Edit
        </Link>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

"use client";

import ItemCard from "@/components/items/ItemCard";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type Item = {
  id: string;
  title: string;
  location: string;
  type: "LOST" | "FOUND";
  image_url: string | null;
};

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedType, setSelectedType] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItems() {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setItems(data || []);
      }

      setLoading(false);
    }

    loadItems();
  }, []);

  const filteredItems =
    selectedType === "ALL"
      ? items
      : items.filter((item) => item.type === selectedType);

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">Browse Items</h1>

        <p className="mt-2 text-gray-400">
          Browse recently reported lost and found items.
        </p>

        <div className="mt-6 flex gap-3">
          {["ALL", "LOST", "FOUND"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                selectedType === type
                  ? "bg-white text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-10 text-gray-400">Loading items...</p>
        ) : filteredItems.length === 0 ? (
          <p className="mt-10 text-gray-400">
            No {selectedType === "ALL" ? "" : selectedType.toLowerCase()} items
            found.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                location={item.location}
                type={item.type}
                image_url={item.image_url}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

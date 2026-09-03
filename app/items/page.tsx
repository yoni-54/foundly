import ItemCard from "@/components/items/ItemCard";
import { supabase } from "@/lib/supabase/client";
import { auth0 } from "@/lib/auth0";

export default async function ItemsPage() {
  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-gray-400">Could not load items.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">Browse Items</h1>

        <p className="mt-2 text-gray-400">
          Browse recently reported lost and found items.
        </p>

        {items.length === 0 ? (
          <p className="mt-10 text-gray-400">No items have been posted yet.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
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

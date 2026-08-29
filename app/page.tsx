import Link from "next/link";
import ItemCard from "@/components/items/ItemCard";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase/client";

export default async function HomePage() {
  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error(error);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white">
        {/* Hero */}
        <section className="px-6 py-20 text-center">
          <h1 className="text-5xl font-bold">
            Lost something? Find it again.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            Foundly helps people report lost and found items
            and reconnect them with their owners.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/items"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
            >
              Browse Items
            </Link>

            <Link
              href="/items/post"
              className="rounded-lg border border-gray-600 px-6 py-3 font-semibold text-white hover:bg-gray-900"
            >
              Post an Item
            </Link>
          </div>
        </section>

        {/* Recent Items */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                Recently Posted
              </h2>

              <p className="mt-2 text-gray-400">
                The latest lost and found items.
              </p>
            </div>

            <Link
              href="/items"
              className="text-sm text-gray-300 hover:text-white"
            >
              View all →
            </Link>
          </div>

          {items && items.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  location={item.location}
                  type={item.type}
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-gray-400">
              No items have been posted yet.
            </p>
          )}
        </section>
      </main>
    </>
  );
}
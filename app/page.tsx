import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import ItemCard from "@/components/items/ItemCard";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <section className="text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Lost something? Find it again.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Foundly helps people report lost and found items and reconnect
            them with their owners.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/items/post"
              className="rounded-lg bg-white px-6 py-3 font-medium text-black"
            >
              Post an Item
            </Link>

            <Link
              href="/items"
              className="rounded-lg bg-gray-600 border px-6 py-3 font-medium"
            >
              Browse Items
            </Link>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recently Posted</h2>

            <Link href="/items" className="text-sm font-medium">
              View all →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ItemCard
              title="Samsung Galaxy Phone"
              location="Bole"
              type="LOST"
            />

            <ItemCard
              title="Black Backpack"
              location="Piassa"
              type="FOUND"
            />

            <ItemCard
              title="Set of Keys"
              location="Megenagna"
              type="LOST"
            />
          </div>
        </section>
      </main>
    </>
  );
}
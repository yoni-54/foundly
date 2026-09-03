import { auth0 } from "@/lib/auth0";
import { supabase } from "@/lib/supabase/client";
import MyItemCard from "@/components/items/MyItemCard";

export default async function ProfilePage() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          You are not logged in
        </h1>
      </main>
    );
  }

  const user = session.user;

  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", user.sub)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>

        <p className="mt-2 text-gray-400">{user.email}</p>

        <h2 className="mt-10 text-2xl font-bold">My Items</h2>

        {error ? (
          <p className="mt-4 text-red-400">Could not load your items.</p>
        ) : items.length === 0 ? (
          <p className="mt-4 text-gray-400">
            You haven&apos;t posted any items yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <MyItemCard
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

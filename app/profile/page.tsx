import { auth0 } from "@/lib/auth0";
import { createClient } from "@supabase/supabase-js";
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

  const idToken = session.tokenSet.idToken;

  if (!idToken) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Authentication token not found
        </h1>
      </main>
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      accessToken: async () => idToken,
    },
  );

  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", user.sub)
    .order("created_at", { ascending: false });

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("receiver_id", user.sub)
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
        <h2 className="mt-12 text-2xl font-bold">Messages</h2>

        {messagesError ? (
          <p className="mt-4 text-red-400">Could not load your messages.</p>
        ) : !messages || messages.length === 0 ? (
          <p className="mt-4 text-gray-400">You have no messages yet.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="rounded-xl border border-gray-700 bg-gray-900 p-5"
              >
                <p className="text-gray-200">{message.message}</p>

                <p className="mt-3 text-sm text-gray-500">
                  Received {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

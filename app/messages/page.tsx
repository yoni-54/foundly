import { auth0 } from "@/lib/auth0";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import MessagesClient from "./MessagesClient";

export default async function MessagesPage() {
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

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Authentication token not found
        </h1>
      </main>
    );
  }

  const userId = session.user.sub;

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Messages</h1>

        {error ? (
          <p className="text-red-500">Could not load messages.</p>
        ) : (
          <MessagesClient messages={messages ?? []} currentUserId={userId} />
        )}
      </div>
    </main>
  );
}

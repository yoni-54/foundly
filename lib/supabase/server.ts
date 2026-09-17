import { createClient } from "@supabase/supabase-js";
import { auth0 } from "@/lib/auth0";

export async function createServerSupabaseClient() {
  const session = await auth0.getSession();

  if (!session) {
    return null;
  }

  const idToken = session.tokenSet.idToken;

  if (!idToken) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      accessToken: async () => idToken,
    }
  );
}
import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { createClient } from "@supabase/supabase-js";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 }
    );
  }

  const idToken = session.tokenSet.idToken;

  if (!idToken) {
    return NextResponse.json(
      { error: "No Auth0 ID token found." },
      { status: 401 },
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      accessToken: async () => idToken,
    },
  );

  const { id } = await params;

  const { data, error } = await supabase
    .from("items")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.sub)
    .select("id");

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete item." },
      { status: 500 },
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "Item was not found or you do not have permission to delete it." },
      { status: 403 },
    );
  }

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { createClient } from "@supabase/supabase-js";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  request: Request,
  { params }: RouteContext
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
    { status: 401 }
  );
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {
    global: {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    },
  }
);

  const { id } = await params;

  const { data, error } = await supabase
    .from("items")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.sub)
    .select();

  console.log("DELETE DATA:", data);
  console.log("DELETE ERROR:", error);

  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete item." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
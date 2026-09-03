import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { supabase } from "@/lib/supabase/client";

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

  const { id } = await params;

  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.sub);

  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete item." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
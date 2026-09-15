import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
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
      accessToken: async () => idToken,
    }
  );

  const { item_id, message } = await request.json();

  if (!item_id || !message?.trim()) {
    return NextResponse.json(
      { error: "Item and message are required." },
      { status: 400 }
    );
  }

  const senderId = session.user.sub;

  const { data: item, error: itemError } = await supabase
    .from("items")
    .select("user_id")
    .eq("id", item_id)
    .single();

  if (itemError || !item) {
    return NextResponse.json(
      { error: "Item not found." },
      { status: 404 }
    );
  }

  if (item.user_id === senderId) {
    return NextResponse.json(
      { error: "You cannot contact yourself." },
      { status: 400 }
    );
  }

  const { error: messageError } = await supabase
    .from("messages")
    .insert({
      item_id,
      sender_id: senderId,
      receiver_id: item.user_id,
      message: message.trim(),
    });

  if (messageError) {
    console.error("MESSAGE ERROR:", messageError);

    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Message sent successfully.",
  });
}
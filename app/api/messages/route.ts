import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 }
    );
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Authentication token not found." },
      { status: 401 }
    );
  }

  const { item_id, receiver_id, message } = await request.json();

  if ((!item_id && !receiver_id) || !message?.trim()) {
    return NextResponse.json(
      { error: "Recipient and message are required." },
      { status: 400 }
    );
  }

  const senderId = session.user.sub;

  let receiverId = receiver_id;

  // Contact Poster flow
  if (item_id) {
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

    receiverId = item.user_id;
  }

  if (receiverId === senderId) {
    return NextResponse.json(
      { error: "You cannot message yourself." },
      { status: 400 }
    );
  }

  const { error: messageError } = await supabase
    .from("messages")
    .insert({
      item_id: item_id || null,
      sender_id: senderId,
      receiver_id: receiverId,
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

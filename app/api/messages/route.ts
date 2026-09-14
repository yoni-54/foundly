import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();

    if (!session?.user?.sub) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const senderId = session.user.sub;

    const { item_id, message } = await request.json();

    if (!item_id || !message?.trim()) {
      return NextResponse.json(
        { error: "Item and message are required." },
        { status: 400 }
      );
    }

    // Find the poster of the item
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

    // Prevent users from messaging themselves
    if (item.user_id === senderId) {
      return NextResponse.json(
        { error: "You cannot contact yourself." },
        { status: 400 }
      );
    }

    // Save the message
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
  } catch (error) {
    console.error("POST /api/messages ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

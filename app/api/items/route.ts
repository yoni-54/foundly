import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: Request) {
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 }
    );
  }

  const body = await request.json();

  const { type, title, description, category, location, date, image_url, } = body;

  const { data, error } = await supabase
    .from("items")
    .insert({
      type,
      title,
      description,
      category,
      location,
      date_lost_found: date,
      image_url,
      user_id: session.user.sub,
    })
    .select()
    .single();

  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create item." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
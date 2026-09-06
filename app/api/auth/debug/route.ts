import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function GET() {
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json({
      loggedIn: false,
    });
  }

  const idToken = session.tokenSet.idToken;

  if (!idToken) {
    return NextResponse.json({
      loggedIn: true,
      idTokenExists: false,
    });
  }

  const payload = JSON.parse(
    Buffer.from(idToken.split(".")[1], "base64url").toString()
  );

  return NextResponse.json({
    loggedIn: true,
    sub: payload.sub,
    role: payload.role,
  });
}
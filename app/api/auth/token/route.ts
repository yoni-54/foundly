import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function GET() {
  const session = await auth0.getSession();
  console.log(
  "Has refresh token:",
  Boolean(session?.tokenSet?.refreshToken)
);

  if (!session?.tokenSet?.idToken) {
    return NextResponse.json(
      { error: "No ID token" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    idToken: session.tokenSet.idToken,
  });
}
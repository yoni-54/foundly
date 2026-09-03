import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import PostItemForm from "./PostItemForm";

export default async function PostItemPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return <PostItemForm />;
}

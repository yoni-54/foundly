import { auth0 } from "@/lib/auth0";

export default async function ProfilePage() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          You are not logged in
        </h1>
      </main>
    );
  }

  const user = session.user;

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>

      <p className="mt-2 text-gray-600">{user.email}</p>
    </main>
  );
}

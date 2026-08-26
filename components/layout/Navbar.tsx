import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Foundly
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-black">
            Home
          </Link>

          <Link href="/items" className="text-gray-700 hover:text-black">
            Browse
          </Link>

          <Link
            href="/items/post"
            className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            Post Item
          </Link>
        </div>
      </div>
    </nav>
  );
}
import Link from "next/link";
import ItemCard from "@/components/items/ItemCard";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase/client";

export default async function HomePage() {
  const { data: items, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Failed to load recent items:", error);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F7F8FA] text-[#172033]">
        {/* Hero New hero page starting from here */}
        <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#101D2F] via-[#172B45] to-[#263B55] px-7 py-16 text-white sm:px-12 sm:py-20 lg:px-16">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border-[50px] border-white/5" />
            <div className="pointer-events-none absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />A
                  community-powered lost & found
                </span>

                <h1 className="mt-7 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  Lost something?
                  <span className="mt-2 block text-amber-400">
                    Find it again.
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-base leading-8 text-slate-300 sm:text-lg">
                  Lost something or found something that belongs to someone
                  else? Foundly helps bring people and their belongings back
                  together.
                </p>

                <div className="mt-9 flex flex-wrap gap-4">
                  <Link
                    href="/items"
                    className="rounded-xl bg-amber-400 px-7 py-3.5 font-semibold text-[#101D2F] shadow-lg shadow-amber-400/10 transition hover:-translate-y-0.5 hover:bg-amber-300"
                  >
                    Browse Items →
                  </Link>

                  <Link
                    href="/items/post"
                    className="rounded-xl border border-white/25 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/15"
                  >
                    + Post an Item
                  </Link>
                </div>
              </div>

              {/* Decorative hero illustration */}
              <div className="relative hidden min-h-[300px] items-center justify-center lg:flex">
                <div className="absolute h-64 w-64 rounded-full border border-white/10" />
                <div className="absolute h-48 w-48 rounded-full border border-white/10" />

                <div className="relative w-full max-w-sm rotate-2 rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-widest text-amber-300">
                      FOUNDLY
                    </span>
                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-300">
                      Reconnecting people
                    </span>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/10 p-5">
                      <div className="text-3xl">⌕</div>
                      <p className="mt-3 font-semibold">Lost</p>
                      <p className="mt-1 text-xs text-slate-300">
                        Looking for something?
                      </p>
                    </div>

                    <div className="rounded-2xl bg-amber-400 p-5 text-[#101D2F]">
                      <div className="text-3xl">✦</div>
                      <p className="mt-3 font-semibold">Found</p>
                      <p className="mt-1 text-xs text-[#101D2F]/70">
                        Help someone find it.
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 text-center text-sm text-slate-300">
                    Every lost item has a story.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recently Posted */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-amber-600">
                Discover
              </span>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Recently Posted
              </h2>

              <p className="mt-3 text-slate-500">
                The latest lost and found items from the community.
              </p>
            </div>

            <Link
              href="/items"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#172033] transition hover:bg-white hover:text-amber-600"
            >
              View all items →
            </Link>
          </div>

          {items && items.length > 0 ? (
            <div className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  location={item.location}
                  type={item.type}
                  image_url={item.image_url}
                />
              ))}
            </div>
          ) : (
            <div className="mt-9 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="text-4xl">🔎</div>
              <h3 className="mt-4 text-lg font-semibold">
                No items posted yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Be the first to post a lost or found item.
              </p>
              <Link
                href="/items/post"
                className="mt-6 inline-block rounded-xl bg-[#101D2F] px-6 py-3 font-semibold text-white transition hover:bg-[#263B55]"
              >
                Post an Item
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

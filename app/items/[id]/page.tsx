import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

type ItemDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ItemDetailsPage({
  params,
}: ItemDetailsPageProps) {
  const { id } = await params;

  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/items" className="text-sm text-gray-400 hover:text-white">
          ← Back to items
        </Link>

        <div className="mt-8 overflow-hidden rounded-xl border border-gray-700 bg-gray-900">
          <div className="h-80 bg-gray-800">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.title}
                width={600}
                height={400}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>

          <div className="p-8">
            <span
              className={`text-sm font-semibold ${
                item.type === "LOST" ? "text-red-400" : "text-green-400"
              }`}
            >
              {item.type}
            </span>

            <h1 className="mt-3 text-4xl font-bold">{item.title}</h1>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-gray-200">{item.category}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-gray-200">{item.location}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date Lost / Found</p>
                <p className="text-gray-200">{item.date_lost_found}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="leading-7 text-gray-200">{item.description}</p>
              </div>
            </div>

            <button className="mt-8 w-full rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200">
              Contact Poster
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

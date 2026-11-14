import Image from "next/image";
import Link from "next/link";

type ItemCardProps = {
  id: string;
  title: string;
  location: string;
  type: "LOST" | "FOUND";
  image_url: string | null;
};

export default function ItemCard({
  id,
  title,
  location,
  type,
  image_url,
}: ItemCardProps) {
  const isLost = type === "LOST";

  return (
    <Link
      href={`/items/${id}`}
      className="group block h-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_-18px_rgba(16,29,47,0.35)] transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_22px_45px_-22px_rgba(16,29,47,0.42)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#172B45] to-[#314764]">
          {image_url ? (
            <Image
              src={image_url}
              alt={title}
              width={600}
              height={400}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-white/60">
              <svg aria-hidden="true" viewBox="0 0 48 48" fill="none" className="h-12 w-12">
                <rect x="7" y="9" width="34" height="30" rx="5" stroke="currentColor" strokeWidth="2" />
                <circle cx="18" cy="20" r="3" stroke="currentColor" strokeWidth="2" />
                <path d="m10 34 10-9 6 5 5-4 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-medium">Photo coming soon</span>
            </div>
          )}

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide shadow-sm backdrop-blur-md ${
                isLost ? "bg-rose-50/95 text-rose-700" : "bg-emerald-50/95 text-emerald-700"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isLost ? "bg-rose-500" : "bg-emerald-500"}`} />
              {isLost ? "LOST ITEM" : "FOUND ITEM"}
            </span>
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#172033] shadow-sm transition group-hover:bg-amber-400"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 17 17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h2 className="line-clamp-2 text-xl font-bold leading-snug tracking-tight text-[#172033] transition-colors group-hover:text-amber-700">
            {title}
          </h2>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 shrink-0 text-amber-600"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="2.2" />
            </svg>
            <span className="truncate">{location}</span>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-[#172B45]">
            <span>View item details</span>
            <span aria-hidden="true" className="text-amber-600 transition-transform group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

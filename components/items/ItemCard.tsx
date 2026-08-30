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
  return (
    <Link href={`/items/${id}`}>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="h-48 bg-gray-800">
          {image_url ? (
            <Image
              src={image_url}
              alt={title}
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

        <div className="p-5">
          <span
            className={`text-sm font-semibold ${
              type === "LOST" ? "text-red-600" : "text-green-600"
            }`}
          >
            {type}
          </span>

          <h2 className="mt-2 text-lg font-semibold text-black">{title}</h2>

          <p className="mt-1 text-sm text-gray-500">📍 {location}</p>
        </div>
      </div>
    </Link>
  );
}

type ItemCardProps = {
  title: string;
  location: string;
  type: "LOST" | "FOUND";
};

export default function ItemCard({
  title,
  location,
  type,
}: ItemCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex h-48 items-center justify-center bg-gray-100">
        <span className="text-gray-400">No image</span>
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

        <p className="mt-1 text-sm text-gray-500">
          📍 {location}
        </p>
      </div>
    </div>
  );
}
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product, onDelete }) {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 p-3 sm:hidden">
      <Image
        src={product.thumbnail}
        alt={product.title}
        width={56}
        height={56}
        className="h-14 w-14 flex-shrink-0 rounded-md object-cover"
        unoptimized
      />
      <div className="min-w-0 flex-1">
        <Link href={`/products/${product.id}`} className="block truncate font-medium text-ink">
          {product.title}
        </Link>
        <p className="text-xs capitalize text-slate-500">{product.category}</p>

        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-600">
          <span>${product.price}</span>
          <span>★ {product.rating?.toFixed?.(1) ?? product.rating}</span>
          <span>Stock: {product.stock}</span>
        </div>

        <div className="mt-2 flex gap-4">
          <Link href={`/products/${product.id}?edit=1`} className="text-xs font-medium text-brand-600">
            Edit
          </Link>
          <button type="button" onClick={() => onDelete(product)} className="text-xs font-medium text-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

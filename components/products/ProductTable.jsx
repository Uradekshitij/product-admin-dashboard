import Link from "next/link";
import Image from "next/image";

export default function ProductTable({ products, onDelete }) {
  return (
    <table className="hidden w-full table-auto text-left text-sm sm:table">
      <thead>
        <tr className="border-b border-slate-200 text-slate-500">
          <th className="py-2 pr-4 font-medium">Image</th>
          <th className="py-2 pr-4 font-medium">Title</th>
          <th className="py-2 pr-4 font-medium">Category</th>
          <th className="py-2 pr-4 font-medium">Price</th>
          <th className="py-2 pr-4 font-medium">Rating</th>
          <th className="py-2 pr-4 font-medium">Stock</th>
          <th className="py-2 pr-4 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-b border-slate-100 last:border-0">
            <td className="py-3 pr-4">
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={40}
                height={40}
                className="h-10 w-10 rounded-md object-cover"
                unoptimized
              />
            </td>
            <td className="py-3 pr-4">
              <Link href={`/products/${product.id}`} className="font-medium text-ink hover:text-brand-600">
                {product.title}
              </Link>
            </td>
            <td className="py-3 pr-4 capitalize text-slate-600">{product.category}</td>
            <td className="py-3 pr-4 text-slate-600">${product.price}</td>
            <td className="py-3 pr-4 text-slate-600">{product.rating?.toFixed?.(1) ?? product.rating}</td>
            <td className="py-3 pr-4 text-slate-600">{product.stock}</td>
            <td className="py-3 pr-4 text-right">
              <div className="flex justify-end gap-3">
                <Link
                  href={`/products/${product.id}`}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

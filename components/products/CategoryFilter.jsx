"use client";

export default function CategoryFilter({ categories, value, onChange, disabled }) {
  return (
    <div className="w-full sm:w-48">
      <label htmlFor="category-filter" className="sr-only">
        Filter by category
      </label>
      <select
        id="category-filter"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        title={disabled ? "Category filter is ignored while searching" : undefined}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}

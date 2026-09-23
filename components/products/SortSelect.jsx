"use client";

const SORT_OPTIONS = [
  { value: "", label: "Default order" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-asc", label: "Rating: low to high" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "title-asc", label: "Title: A to Z" },
  { value: "title-desc", label: "Title: Z to A" },
];

export default function SortSelect({ sortBy, order, onChange }) {
  const currentValue = sortBy ? `${sortBy}-${order}` : "";

  function handleChange(e) {
    const val = e.target.value;
    if (!val) {
      onChange({ sortBy: "", order: "" });
      return;
    }
    const [field, direction] = val.split("-");
    onChange({ sortBy: field, order: direction });
  }

  return (
    <div className="w-full sm:w-52">
      <label htmlFor="sort-select" className="sr-only">
        Sort products
      </label>
      <select
        id="sort-select"
        value={currentValue}
        onChange={handleChange}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

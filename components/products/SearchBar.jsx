"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Controlled text input with its own local state so every keystroke feels
 * instant, but it only reports the value upward (which triggers the API
 * call + URL update) after the user pauses typing for 400ms.
 */
export default function SearchBar({ value, onChange }) {
  const [text, setText] = useState(value);
  const debouncedText = useDebounce(text, 400);

  // Keep local text in sync if the URL search param changes externally
  // (e.g. browser back/forward).
  useEffect(() => {
    setText(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (debouncedText !== value) {
      onChange(debouncedText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500"
      />
    </div>
  );
}

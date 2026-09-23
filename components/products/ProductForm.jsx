"use client";

import { useEffect, useState } from "react";
import { fetchCategories } from "@/services/productApi";
import { validateProductForm, hasErrors } from "@/utils/validation";

const EMPTY_VALUES = {
  title: "",
  category: "",
  price: "",
  stock: "",
  brand: "",
  description: "",
};

export default function ProductForm({ initialValues, onSubmit, submitLabel = "Save" }) {
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return; // guard against repeated Save clicks

    const validationErrors = validateProductForm(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setSubmitError("");
    setSubmitting(true);
    try {
      await onSubmit({
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
      });
    } catch (err) {
      setSubmitError(err?.friendlyMessage || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field label="Title" error={errors.title}>
        <input
          type="text"
          value={values.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Category" error={errors.category}>
          <input
            type="text"
            list="category-options"
            value={values.category}
            onChange={(e) => handleChange("category", e.target.value)}
            placeholder="e.g. beauty"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500"
          />
          <datalist id="category-options">
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug} />
            ))}
          </datalist>
        </Field>

        <Field label="Brand">
          <input
            type="text"
            value={values.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Price ($)" error={errors.price}>
          <input
            type="number"
            step="0.01"
            value={values.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500"
          />
        </Field>

        <Field label="Stock" error={errors.stock}>
          <input
            type="number"
            value={values.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500"
          />
        </Field>
      </div>

      <Field label="Description" error={errors.description}>
        <textarea
          rows={4}
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500"
        />
      </Field>

      {submitError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

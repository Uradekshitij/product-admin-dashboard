// Small, dependency-free validation for the Add/Edit product form.
// Returns an object of { fieldName: "error message" } - empty object means valid.

export function validateProductForm(values) {
  const errors = {};

  if (!values.title || values.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }

  if (!values.category || values.category.trim() === "") {
    errors.category = "Category is required.";
  }

  const price = Number(values.price);
  if (values.price === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Price must be a number greater than 0.";
  }

  const stock = Number(values.stock);
  if (values.stock === "" || Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    errors.stock = "Stock must be a whole number of 0 or more.";
  }

  if (values.description && values.description.length > 2000) {
    errors.description = "Description is too long (max 2000 characters).";
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

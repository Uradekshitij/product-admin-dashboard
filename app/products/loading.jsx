import Loader from "@/components/common/Loader";

// Shown automatically by Next.js while app/products/page.jsx (a server
// component) is being prepared for the first navigation to this route.
export default function ProductsLoading() {
  return <Loader label="Loading products..." />;
}

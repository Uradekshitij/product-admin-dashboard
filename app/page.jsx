"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The root route has nothing of its own to show - it just sends the
// visitor to the product list (middleware will bounce them to /login
// if they aren't authenticated).
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/products");
  }, [router]);

  return null;
}

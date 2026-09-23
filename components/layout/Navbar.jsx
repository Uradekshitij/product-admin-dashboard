"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/products" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-500 text-sm font-semibold text-white">
            P
          </span>
          <span className="text-sm font-semibold text-ink">Product Admin</span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden text-sm text-slate-500 sm:inline">
              Signed in as <span className="font-medium text-ink">{user.username}</span>
            </span>
          )}
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Layout({ children, user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-xl font-semibold text-sky-600"
              >
                DashX
              </Link>
              <div className="hidden sm:flex items-center text-sm text-gray-600">
                <Link href="/dashboard" className="px-2 hover:text-sky-600">
                  Home
                </Link>
                <Link
                  href="/example/fetchprivateapi"
                  className="px-2 hover:text-sky-600"
                >
                  Private Weather
                </Link>
                <Link
                  href="/example/fetchpublicapi"
                  className="px-2 hover:text-sky-600"
                >
                  Public Weather
                </Link>
                <Link
                  href="/example/role-based-route"
                  className="px-2 hover:text-sky-600"
                >
                  Role Base Route
                </Link>
                <Link href="/about" className="px-2 hover:text-sky-600">
                  About
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <input
                  aria-label="Search"
                  className="px-3 py-1 border rounded-md text-sm"
                  placeholder="Search..."
                />
              </div>

              <div className="relative" ref={ref}>
                <button
                  onClick={() => setOpen((s) => !s)}
                  className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-50"
                >
                  <span className="text-sm">{user?.username || "Guest"}</span>
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-20">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <div className="border-t" />
                    <form method="POST" action="/api/logout">
                      <button
                        type="submit"
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-4 space-y-6"> {children}</main>
    </div>
  );
}

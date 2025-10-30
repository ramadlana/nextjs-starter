import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Layout({ children, user }) {
  const [openProfile, setOpenProfile] = useState(false);
  const [openDocs, setOpenDocs] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const refProfile = useRef();
  const refDocs = useRef();
  const refAdmin = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        refProfile.current &&
        !refProfile.current.contains(e.target) &&
        refDocs.current &&
        !refDocs.current.contains(e.target) &&
        refAdmin.current &&
        !refAdmin.current.contains(e.target)
      ) {
        setOpenProfile(false);
        setOpenDocs(false);
        setOpenAdmin(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            {/* Left section */}
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-xl font-semibold text-sky-600"
              >
                DashX
              </Link>

              <div className="hidden sm:flex items-center text-sm text-gray-600 gap-1">
                <Link href="/dashboard" className="px-2 hover:text-sky-600">
                  Home
                </Link>

                {/* 📘 Docs Dropdown */}
                <div className="relative" ref={refDocs}>
                  <button
                    onClick={() => {
                      setOpenDocs((s) => !s);
                      setOpenAdmin(false);
                      setOpenProfile(false);
                    }}
                    className="flex items-center gap-1 px-2 hover:text-sky-600"
                  >
                    Example
                    <svg
                      className="w-4 h-4 text-gray-500"
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
                  {openDocs && (
                    <div className="absolute mt-2 w-44 bg-white border rounded-md shadow-lg z-20">
                      <Link
                        href="/example/fetchprivateapi"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Private Weather
                      </Link>
                      <Link
                        href="/example/fetchpublicapi"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Public Weather
                      </Link>
                      <Link
                        href="/example/uploadfiles"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        File Upload
                      </Link>
                    </div>
                  )}
                </div>

                {/* ⚙️ Admin Dropdown */}
                {user?.role === "ADMIN" && (
                  <div className="relative" ref={refAdmin}>
                    <button
                      onClick={() => {
                        setOpenAdmin((s) => !s);
                        setOpenDocs(false);
                        setOpenProfile(false);
                      }}
                      className="flex items-center gap-1 px-2 hover:text-sky-600"
                    >
                      Admin
                      <svg
                        className="w-4 h-4 text-gray-500"
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
                    {openAdmin && (
                      <div className="absolute mt-2 w-48 bg-white border rounded-md shadow-lg z-20">
                        <Link
                          href="/admin/users"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          User Management
                        </Link>
                        <Link
                          href="/admin/logs"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          System Logs
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <input
                  aria-label="Search"
                  className="px-3 py-1 border rounded-md text-sm"
                  placeholder="Search..."
                />
              </div>

              {/* Profile dropdown */}
              <div className="relative" ref={refProfile}>
                <button
                  onClick={() => {
                    setOpenProfile((s) => !s);
                    setOpenDocs(false);
                    setOpenAdmin(false);
                  }}
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

                {openProfile && (
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
      <main className="max-w-7xl mx-auto p-4 space-y-6">{children}</main>
    </div>
  );
}

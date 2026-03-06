import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

// Icons as components for consistent sizing
function IconHome({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}
function IconLayout({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}
function IconAdmin({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function IconUser({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
function IconChevronLeft({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}
function IconChevronRight({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
function IconMenu({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export default function Layout({ children, user }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored !== null) setCollapsed(stored === "true");
  }, [mounted]);

  // Close mobile drawer on route change
  useEffect(() => {
    const handleRouteChange = () => setMobileOpen(false);
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router.events]);

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (mounted) localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
  };

  async function handleLogout(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) window.location.href = "/login";
      else alert("Logout failed. Please try again.");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Something went wrong during logout.");
    }
  }

  const isActive = (path) => router.pathname === path || router.pathname.startsWith(path + "/");

  // Page title for navbar (friendly label for current route)
  const pageTitles = {
    "/dashboard": "Dashboard",
    "/profile": "Profile",
    "/settings": "Settings",
    "/example/ssr": "SSR (Server-Side)",
    "/example/csr": "CSR (Client-Side)",
    "/example/server-proxy": "Server proxy",
    "/example/client-public-api": "Public API",
    "/example/uploadfiles": "File Upload",
    "/example/role-based-route": "Role-based Route",
    "/admin/users": "User Management",
    "/admin/logs": "System Logs",
  };
  const pageTitle =
    pageTitles[router.pathname] ||
    (router.pathname === "/" ? "Home" : router.pathname.split("/").filter(Boolean).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" » "));

  const navLinkClass = (path) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
      isActive(path)
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    );

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-sidebar-border px-3">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <IconLayout className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="truncate text-base font-semibold text-sidebar-foreground">
              Starter Kit
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-auto p-2">
        <Link href="/dashboard" className={navLinkClass("/dashboard")} title="Home">
          <IconHome className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Home</span>}
        </Link>

        {collapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  router.pathname.startsWith("/example") || router.pathname.startsWith("/admin")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title="Examples"
              >
                <IconLayout className="h-5 w-5 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-52">
              <DropdownMenuItem asChild>
                <Link href="/example/ssr">SSR (Server-Side)</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/example/csr">CSR (Client-Side)</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/example/server-proxy">Server proxy (API key)</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/example/client-public-api">Public API (direct)</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/example/uploadfiles">File Upload</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/example/role-based-route">Role-based Route</Link>
              </DropdownMenuItem>
              {user?.role === "ADMIN" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/users">User Management</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/logs">System Logs</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <div className="px-3 pt-3 pb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Examples
              </span>
            </div>
            <Link href="/example/ssr" className={navLinkClass("/example/ssr")}>
              <IconLayout className="h-5 w-5 shrink-0" />
              <span>SSR</span>
            </Link>
            <Link href="/example/csr" className={navLinkClass("/example/csr")}>
              <IconLayout className="h-5 w-5 shrink-0" />
              <span>CSR</span>
            </Link>
            <Link href="/example/server-proxy" className={navLinkClass("/example/server-proxy")}>
              <IconLayout className="h-5 w-5 shrink-0" />
              <span>Server proxy</span>
            </Link>
            <Link href="/example/client-public-api" className={navLinkClass("/example/client-public-api")}>
              <IconLayout className="h-5 w-5 shrink-0" />
              <span>Public API</span>
            </Link>
            <Link href="/example/uploadfiles" className={navLinkClass("/example/uploadfiles")}>
              <IconLayout className="h-5 w-5 shrink-0" />
              <span>File Upload</span>
            </Link>
            <Link href="/example/role-based-route" className={navLinkClass("/example/role-based-route")}>
              <IconLayout className="h-5 w-5 shrink-0" />
              <span>Role-based</span>
            </Link>
            {user?.role === "ADMIN" && (
              <>
                <div className="px-3 pt-4 pb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Admin
                  </span>
                </div>
                <Link href="/admin/users" className={navLinkClass("/admin/users")}>
                  <IconAdmin className="h-5 w-5 shrink-0" />
                  <span>Users</span>
                </Link>
                <Link href="/admin/logs" className={navLinkClass("/admin/logs")}>
                  <IconAdmin className="h-5 w-5 shrink-0" />
                  <span>Logs</span>
                </Link>
              </>
            )}
          </>
        )}

        {collapsed && user?.role === "ADMIN" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  router.pathname.startsWith("/admin")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title="Admin"
              >
                <IconAdmin className="h-5 w-5 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/admin/users">User Management</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/logs">System Logs</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>

      {/* Collapse toggle — bottom left corner */}
      <div className="mt-auto border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full rounded-lg text-muted-foreground hover:text-foreground",
            collapsed ? "flex-col gap-0.5 py-2 px-1 h-auto" : "justify-start gap-2 px-3"
          )}
          onClick={toggleSidebar}
          title={collapsed ? "Expand sidebar" : "Minimize sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Minimize sidebar"}
        >
          {collapsed ? (
            <>
              <IconChevronRight className="h-4 w-4 shrink-0" />
              <span className="text-[10px] font-medium leading-tight text-center">Show sidebar</span>
            </>
          ) : (
            <>
              <IconChevronLeft className="h-4 w-4 shrink-0" />
              <span className="text-xs font-medium">Minimize sidebar</span>
            </>
          )}
        </Button>
      </div>
    </>
  );

  const userMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted min-w-0"
          title={user?.username || "Guest"}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <IconUser className="h-4 w-4" />
          </div>
          <span className="hidden truncate sm:inline max-w-[8rem]">{user?.username || "Guest"}</span>
          <svg className="h-4 w-4 shrink-0 text-muted-foreground hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-in-out lg:flex",
          collapsed ? "w-[4.5rem]" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-hidden
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Main */}
      <div className={cn("flex flex-1 flex-col min-w-0", collapsed ? "lg:pl-[4.5rem]" : "lg:pl-64")}>
        {/* Top bar: mobile menu + optional breadcrumb */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <IconMenu className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0 flex justify-center">
            <h1 className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs" title={pageTitle}>
              {pageTitle}
            </h1>
          </div>
          <div className="shrink-0">{userMenu}</div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

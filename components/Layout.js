import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  Home,
  LayoutGrid,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  Server,
  Monitor,
  Key,
  Globe,
  Upload,
  Shield,
  FileText,
  Users,
  ScrollText,
  BookOpen,
  PenSquare,
  Lock,
} from "lucide-react";
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

// Single source of truth for sidebar menu (avoids defining links twice for collapsed vs expanded)
const EXAMPLE_LINKS = [
  { href: "/example/ssr", label: "SSR (Server-Side)", short: "SSR", Icon: Server },
  { href: "/example/csr", label: "CSR (Client-Side)", short: "CSR", Icon: Monitor },
  { href: "/example/server-proxy", label: "Server proxy (API key)", short: "Server proxy", Icon: Key },
  { href: "/example/client-public-api", label: "Public API (direct)", short: "Public API", Icon: Globe },
  { href: "/example/uploadfiles", label: "File Upload", short: "File Upload", Icon: Upload },
  { href: "/example/role-based-route", label: "Role-based Route", short: "Role-based", Icon: Shield },
  { href: "/example/markdown", label: "Markdown", short: "Markdown", Icon: FileText },
];
const ADMIN_LINKS = [
  { href: "/admin/users", label: "User Management", short: "Users", Icon: Users },
  { href: "/admin/logs", label: "System Logs", short: "Logs", Icon: ScrollText },
];
const CMS_LINKS = [
  { href: "/cms", label: "Content Management", short: "CMS", Icon: PenSquare },
];
const MEMBER_LINKS = [
  { href: "/member-area/articles", label: "Member Articles", short: "Articles", Icon: Lock },
];

const iconClass = "shrink-0";

export default function Layout({ children, user, fullWidth = false }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (router.pathname.startsWith("/member-area/articles")) {
      setCollapsed(true);
    } else {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (stored !== null) setCollapsed(stored === "true");
    }
  }, [mounted, router.pathname]);

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

  // Page title for navbar — derived from link arrays (single source of truth)
  const pageTitlesFromLinks = Object.fromEntries([
    ...EXAMPLE_LINKS.map(({ href, label }) => [href, label]),
    ...ADMIN_LINKS.map(({ href, label }) => [href, label]),
    ...CMS_LINKS.map(({ href, label }) => [href, label]),
    ...MEMBER_LINKS.map(({ href, label }) => [href, label]),
  ]);
  const pageTitles = {
    "/dashboard": "Dashboard",
    "/profile": "Profile",
    "/settings": "Settings",
    "/user-guide": "User Guide",
    "/cms": "Content Management",
    "/cms/editor": "Editor",
    "/member-area": "Member Area",
    "/member-area/articles": "Member Articles",
    ...pageTitlesFromLinks,
  };
  const getPageTitle = () => {
    if (pageTitles[router.pathname]) return pageTitles[router.pathname];
    if (router.pathname === "/") return "Home";
    // Handle catch-all routes (e.g. /member-area/articles/[[...slug]] -> "Member Articles")
    if (router.pathname.startsWith("/member-area/articles")) return "Member Articles";
    const segments = router.pathname
      .split("/")
      .filter(Boolean)
      .filter((s) => !s.startsWith("[") && !s.startsWith("(")); // skip dynamic segments
    return segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" » ") || "Page";
  };
  const pageTitle = getPageTitle();

  const navLinkClass = (path) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
      collapsed && "justify-center px-0",
      isActive(path)
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    );

  const sidebarContent = (
    <>
      {/* Brand */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-sidebar-border",
          collapsed ? "justify-center px-0" : "gap-3 px-3"
        )}
      >
        <Link href="/dashboard" className={cn("flex items-center overflow-hidden", collapsed ? "justify-center" : "gap-3")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutGrid className="h-5 w-5" aria-hidden />
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
          <Home className={cn("h-5 w-5", iconClass)} aria-hidden />
          {!collapsed && <span>Home</span>}
        </Link>

        <Link href="/user-guide" className={navLinkClass("/user-guide")} title="User Guide">
          <BookOpen className={cn("h-5 w-5", iconClass)} aria-hidden />
          {!collapsed && <span>User Guide</span>}
        </Link>

        <Link href="/member-area/articles" className={navLinkClass("/member-area")} title="Member Articles">
          <Lock className={cn("h-5 w-5", iconClass)} aria-hidden />
          {!collapsed && <span>Member Articles</span>}
        </Link>

        {(user?.role === "ADMIN" || user?.role === "EDITOR") && (
          <Link href="/cms" className={navLinkClass("/cms")} title="Content Management">
            <PenSquare className={cn("h-5 w-5", iconClass)} aria-hidden />
            {!collapsed && <span>CMS</span>}
          </Link>
        )}

        {collapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center justify-center rounded-lg px-0 py-2.5 text-sm font-medium transition-colors",
                  router.pathname.startsWith("/example") ||
                  router.pathname.startsWith("/admin") ||
                  router.pathname.startsWith("/cms")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title="Examples"
                aria-label="Examples menu"
              >
                <LayoutGrid className={cn("h-5 w-5", iconClass)} aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-52">
              {EXAMPLE_LINKS.map(({ href, label, Icon }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link href={href} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
              {MEMBER_LINKS.map(({ href, label, Icon }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link href={href} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
              {(user?.role === "ADMIN" || user?.role === "EDITOR") &&
                CMS_LINKS.map(({ href, label, Icon }) => (
                  <DropdownMenuItem key={href} asChild>
                    <Link href={href} className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              {user?.role === "ADMIN" && (
                <>
                  <DropdownMenuSeparator />
                  {ADMIN_LINKS.map(({ href, label, Icon }) => (
                    <DropdownMenuItem key={href} asChild>
                      <Link href={href} className="flex items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0" aria-hidden />
                        {label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
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
            {EXAMPLE_LINKS.map(({ href, short, Icon }) => (
              <Link key={href} href={href} className={navLinkClass(href)}>
                <Icon className={cn("h-5 w-5", iconClass)} aria-hidden />
                <span>{short}</span>
              </Link>
            ))}
            {(user?.role === "ADMIN" || user?.role === "EDITOR") && (
              <>
                <div className="px-3 pt-4 pb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Content
                  </span>
                </div>
                {CMS_LINKS.map(({ href, short, Icon }) => (
                  <Link key={href} href={href} className={navLinkClass(href)}>
                    <Icon className={cn("h-5 w-5", iconClass)} aria-hidden />
                    <span>{short}</span>
                  </Link>
                ))}
              </>
            )}
            {user?.role === "ADMIN" && (
              <>
                <div className="px-3 pt-4 pb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Admin
                  </span>
                </div>
                {ADMIN_LINKS.map(({ href, short, Icon }) => (
                  <Link key={href} href={href} className={navLinkClass(href)}>
                    <Icon className={cn("h-5 w-5", iconClass)} aria-hidden />
                    <span>{short}</span>
                  </Link>
                ))}
              </>
            )}
          </>
        )}

        {collapsed && user?.role === "ADMIN" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center justify-center rounded-lg px-0 py-2.5 text-sm font-medium transition-colors",
                  router.pathname.startsWith("/admin")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title="Admin"
                aria-label="Admin menu"
              >
                <Settings className={cn("h-5 w-5", iconClass)} aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-48">
              {ADMIN_LINKS.map(({ href, label, Icon }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link href={href} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
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
            collapsed ? "flex-col gap-0.5 py-2 px-1 h-auto items-center justify-center" : "justify-start gap-2 px-3"
          )}
          onClick={toggleSidebar}
          title={collapsed ? "Expand sidebar" : "Minimize sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Minimize sidebar"}
        >
          {collapsed ? (
            <>
              <ChevronRight className={cn("h-4 w-4", iconClass)} aria-hidden />
              <span className="text-[10px] font-medium leading-tight text-center">Show sidebar</span>
            </>
          ) : (
            <>
              <ChevronLeft className={cn("h-4 w-4", iconClass)} aria-hidden />
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
          aria-label={`User menu: ${user?.username || "Guest"}`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <User className="h-4 w-4" aria-hidden />
          </div>
          <span className="hidden truncate sm:inline max-w-[8rem]">{user?.username || "Guest"}</span>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground hidden sm:block")} aria-hidden />
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
            <Menu className="h-5 w-5" aria-hidden />
          </Button>
          <div className="flex-1 min-w-0 flex justify-center">
            <h1 className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs" title={pageTitle}>
              {pageTitle}
            </h1>
          </div>
          <div className="shrink-0">{userMenu}</div>
        </header>

        <main className={cn("flex-1", fullWidth ? "p-0" : "p-4 sm:p-6 lg:p-8")}>
          <div className={cn(fullWidth ? "w-full" : "mx-auto max-w-6xl")}>{children}</div>
        </main>
      </div>
    </div>
  );
}

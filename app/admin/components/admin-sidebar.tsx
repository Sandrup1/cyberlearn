"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  match: (pathname: string) => boolean;
};

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    match: (pathname) => isActive(pathname, "/admin"),
  },
  {
    label: "Manage Users",
    href: "/admin/users",
    match: (pathname) => isActive(pathname, "/admin/users"),
  },
  {
    label: "Manage Quizzes",
    href: "/admin/quizzes",
    match: (pathname) => isActive(pathname, "/admin/quizzes"),
  },
  {
    label: "Manage Courses",
    href: "/admin/courses",
    match: (pathname) => isActive(pathname, "/admin/courses"),
  },
  {
    label: "Manage Theory & Labs",
    href: "/admin/labs",
    match: (pathname) => isActive(pathname, "/admin/labs"),
  },
  {
    label: "Settings",
    href: "/settings",
    match: (pathname) => isActive(pathname, "/settings"),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 shrink-0 border-r border-gray-200 bg-white">
      <div className="px-6 py-6">
        <div className="text-sm font-extrabold uppercase tracking-widest text-gray-900">
          CyberLearn AI
        </div>
        <div className="mt-1 text-xs font-semibold text-gray-500">
          Admin Panel
        </div>
      </div>

      <nav className="px-3 pb-6">
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "block rounded-lg px-4 py-3 text-sm font-bold transition",
                  active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}


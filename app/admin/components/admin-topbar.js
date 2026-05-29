"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { clearUserProfile, getProfileInitials, useUserProfile } from "../../lib/user-profile";

function getTitleFromPath(pathname) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/users")) return "Manage Users";
  if (pathname.startsWith("/admin/quizzes")) return "Manage Quizzes";
  if (pathname.startsWith("/admin/courses")) return "Manage Courses";
  if (pathname.startsWith("/admin/labs")) return "Manage Theory & Labs";
  return "Admin";
}

export default function AdminTopbar() {
  const pathname = usePathname();
  const title = getTitleFromPath(pathname);
  const profile = useUserProfile();
  const initials = getProfileInitials(profile);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  function handleLogout() {
    clearUserProfile();
    setOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-950">{title}</h1>
          <p className="mt-0.5 text-xs font-semibold text-gray-500">
            Admin workspace
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
          >
            View Site
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={open}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
            >
              <span className="hidden max-w-[180px] truncate sm:block">
                {profile.name}
              </span>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 bg-cover bg-center text-xs font-extrabold text-white"
                style={
                  profile.photoDataUrl
                    ? { backgroundImage: `url(${profile.photoDataUrl})` }
                    : undefined
                }
                aria-hidden="true"
              >
                {!profile.photoDataUrl && initials}
              </span>
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
              >
                <div className="border-b border-gray-100 px-4 py-3">
                  <div className="text-sm font-extrabold text-gray-950">
                    {profile.name}
                  </div>
                  <div className="mt-0.5 truncate text-xs font-semibold text-gray-500">
                    {profile.email}
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    href="/profile"
                    className="block rounded-lg px-3 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block rounded-lg px-3 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    Edit Profile
                  </Link>
                  <Link
                    href="/login"
                    className="mt-1 block rounded-lg px-3 py-2 text-sm font-extrabold text-red-600 transition hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


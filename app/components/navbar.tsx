"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./navbar.css";
import { clearUserProfile, getProfileInitials, useUserProfile } from "../lib/user-profile";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profile = useUserProfile();
  const pathname = usePathname();

  const initials = getProfileInitials(profile);
  const isHome = pathname === "/dashboard" || pathname === "/";

  function handleLogout() {
    clearUserProfile();
    setOpen(false);
  }

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <h2 className="navbar-title">{isHome ? "Home" : "Welcome"}</h2>

      <div className="navbar-right">
        <Link href="/dashboard" className="navbar-link hover:bg-blue-500 rounded-lg">
          Home
        </Link>
        <Link href="/learn" className="navbar-link hover:bg-blue-500 rounded-lg">
          Learn
        </Link>

        {/* Profile Dropdown */}
        <div className="profile-container" ref={dropdownRef}>
          <button
            type="button"
            className="profile-trigger"
            onClick={() => setOpen(!open)}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <span className="profile-name">{profile.name}</span>
            <span
              className="profile"
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
            <div className="dropdown" role="menu">
              <div className="dropdown-user">
                <strong>{profile.name}</strong>
                <span>{profile.email}</span>
              </div>
              <Link href="/profile" className="dropdown-item">
                My Profile
              </Link>

              <Link href="/settings" className="dropdown-item">
                Settings
              </Link>
              <Link href="/login" className="dropdown-item logout" onClick={handleLogout}>
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

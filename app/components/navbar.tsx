"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import "./navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      <h2 className="navbar-title">Welcome</h2>

      <div className="navbar-right">
        <Link href="/learn" className="navbar-link hover:bg-blue-500 rounded-lg">
          Learn
        </Link>

        {/* Profile Dropdown */}
        <div className="profile-container" ref={dropdownRef}>
          <div className="profile" onClick={() => setOpen(!open)}>
            AB
          </div>

          {open && (
            <div className="dropdown">
              <Link href="/profile" className="dropdown-item">
                My Profile
              </Link>

              <Link href="/settings" className="dropdown-item">
                Settings
              </Link>
              <Link href="/login" className="dropdown-item logout">
                Logout
              </Link>

          
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
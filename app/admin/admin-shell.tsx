"use client";

import AdminSidebar from "./components/admin-sidebar";
import AdminTopbar from "./components/admin-topbar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}

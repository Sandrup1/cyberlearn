"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [labsCount, setLabsCount] = useState(0);

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsersCount(data.length));

    fetch("/api/labs")
      .then(res => res.json())
      .then(data => setLabsCount(data.length));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <div className="mt-4 flex gap-4">
        <div className="p-4 bg-gray-200 rounded">
          Total Users: {usersCount}
        </div>

        <div className="p-4 bg-gray-200 rounded">
          Total Labs: {labsCount}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <a href="/admin/users" className="block p-3 bg-gray-300 rounded">
          Manage Users
        </a>

        <a href="/admin/labs" className="block p-3 bg-gray-300 rounded">
          Manage Labs
        </a>
      </div>
    </div>
  );
}
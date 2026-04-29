"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const deleteUser = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    fetchUsers(); // refresh list after delete
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Users</h1>

      <ul className="mt-4">
        {users.map((user: any) => (
          <li
            key={user._id?.toString()}
            className="border p-2 mb-2 flex justify-between items-center"
          >
            <span>
              Username: {user.name} - Email: {user.email}
            </span>

            <button
              onClick={() => deleteUser(user._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
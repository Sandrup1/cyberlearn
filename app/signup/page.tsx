"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if fields are filled
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      //Send data to backend API
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      //Show response message
      alert(data.message);

      //Redirect if success
      if (res.ok) {
        router.push("/login");
      }

    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Full Name"
            className="border p-3 rounded-md text-black"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-md text-black"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-md text-black"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button className="bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}
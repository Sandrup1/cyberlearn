"use client";

import { useRouter } from "next/navigation";

export default function SettingsPage() {

  const router=useRouter();
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-semibold group"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="group-hover:-translate-x-1 transition-transform"
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back
      </button>

      {/* Header */}
      <div>
        
        <h1 className="text-gray-600 text-lg">Manage your account preferences</h1>
      </div>

      {/* Change Name */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">

        <h3 className="font-semibold text-black">Update Profile</h3>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 rounded-lg"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded-lg"
        />

        <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
          Save Changes
        </button>

      </div>

      {/* Change Password */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">

        <h3 className="font-semibold text-black">Change Password</h3>

        <input
          type="password"
          placeholder="Current Password"
          className="w-full border p-2 rounded-lg"
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 rounded-lg"
        />

        <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
          Update Password
        </button>

      </div>

    </div>
  );
}
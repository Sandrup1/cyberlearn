"use client";

export default function SettingsPage() {
  return (
    <div className="space-y-6">

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
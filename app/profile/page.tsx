"use client";

export default function ProfilePage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">Profile</h1>
        <p className="text-gray-600 text-sm">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-6">

        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">
          S
        </div>

        {/* Info */}
        <div>
          <h2 className="text-lg font-semibold">Sandrup Maibangsa</h2>
          <p className="text-gray-600 text-sm">sandrup@email.com</p>
          <p className="text-gray-500 text-xs mt-1">Cybersecurity Learner</p>
        </div>

      </div>

      {/* Details */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">

        <h3 className="font-semibold text-black">Account Details</h3>

        <div className="grid grid-cols-2 gap-4 text-sm">

          <div>
            <p className="text-gray-500">Full Name</p>
            <p className="font-medium">Sandrup Maibangsa</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">sandrup@email.com</p>
          </div>

          <div>
            <p className="text-gray-500">Role</p>
            <p className="font-medium">Student</p>
          </div>

          <div>
            <p className="text-gray-500">Joined</p>
            <p className="font-medium">2025</p>
          </div>

        </div>

      </div>

    </div>
  );
}
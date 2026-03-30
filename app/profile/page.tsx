"use client";

import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-4xl pl-8">
      
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
        <h1 className="text-3xl font-bold text-black">Profile</h1>
        <p className="text-gray-400 font-medium">Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-8 w-full">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">
          S
        </div>

        {/* Info */}
        <div>
          <h2 className="text-2xl font-bold text-black">Sandrup Maibangsa</h2>
          <p className="text-gray-500 font-medium">sandrup@email.com</p>
          <div className="mt-2 inline-block bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Cybersecurity Learner
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-8 w-full">
        <h3 className="text-lg font-bold text-black">Account Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
          <div className="border-b border-gray-50 pb-4">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Full Name</p>
            <p className="font-bold text-gray-900 text-lg">Sandrup Maibangsa</p>
          </div>

          <div className="border-b border-gray-50 pb-4">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Email</p>
            <p className="font-bold text-gray-900 text-lg">sandrup@email.com</p>
          </div>

          <div className="border-b border-gray-50 pb-4">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Role</p>
            <p className="font-bold text-gray-900 text-lg">Student</p>
          </div>

          <div className="border-b border-gray-50 pb-4">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Member Since</p>
            <p className="font-bold text-gray-900 text-lg">2025</p>
          </div>
        </div>
      </div>

    </div>
  );
}
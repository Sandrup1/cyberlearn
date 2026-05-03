"use client";

import { ChangeEvent, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getProfileInitials,
  saveUserProfile,
  useUserProfile,
} from "../lib/user-profile";

export default function ProfilePage() {
  const router = useRouter();
  const profile = useUserProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoMessage, setPhotoMessage] = useState("");

  const initials = getProfileInitials(profile);

  function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPhotoMessage("Please choose an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoMessage("Choose an image under 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      saveUserProfile({ photoDataUrl: reader.result as string });
      setPhotoMessage("Profile photo updated.");
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    saveUserProfile({ photoDataUrl: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPhotoMessage("Profile photo removed.");
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-8 text-gray-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
        >
          <span aria-hidden="true">‹</span>
          Back
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Account
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950">Profile</h1>
            <p className="mt-1 text-gray-500">
              Manage your identity and learning account information.
            </p>
          </div>

          <Link
            href="/settings"
            className="inline-flex items-center justify-center rounded-lg bg-gray-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            Edit Settings
          </Link>
        </div>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div
              className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-blue-600 bg-cover bg-center text-3xl font-bold text-white ring-4 ring-blue-50"
              style={
                profile.photoDataUrl
                  ? { backgroundImage: `url(${profile.photoDataUrl})` }
                  : undefined
              }
              aria-label={`${profile.name} profile photo`}
            >
              {!profile.photoDataUrl && initials}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="break-words text-2xl font-bold text-gray-950">
                {profile.name}
              </h2>
              <p className="break-words text-gray-500">{profile.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                  {profile.title}
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Active learner
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
              >
                Upload Photo
              </button>
              {profile.photoDataUrl && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>

          {photoMessage && (
            <p className="mt-4 text-sm font-medium text-gray-500">{photoMessage}</p>
          )}
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            ["Full Name", profile.name],
            ["Email", profile.email],
            ["Role", profile.role],
            ["Organization", profile.organization],
            ["Timezone", profile.timezone],
            ["Member Since", profile.memberSince],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {label}
              </p>
              <p className="mt-2 break-words text-lg font-bold text-gray-950">
                {value}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

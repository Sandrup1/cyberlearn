"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  clearUserProfile,
  saveUserProfile,
  useUserProfile,
} from "../lib/user-profile";

export default function SettingsPage() {
  const router = useRouter();
  const profile = useUserProfile();
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function handleProfileSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    saveUserProfile({
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      title: String(formData.get("title") || ""),
      organization: String(formData.get("organization") || ""),
      timezone: String(formData.get("timezone") || ""),
    });
    setMessage("Account settings saved.");
  }

  function handleToggle(field, value) {
    saveUserProfile({ [field]: value });
  }

  function handlePasswordSubmit(event) {
    event.preventDefault();

    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage("Use at least 8 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordMessage("Password preferences saved.");
  }

  function handleResetProfile() {
    clearUserProfile();
    setMessage("Local profile data reset.");
  }

  const accountFormKey = [
    profile.name,
    profile.email,
    profile.title,
    profile.organization,
    profile.timezone,
  ].join("|");

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-8 text-gray-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
        >
          <span aria-hidden="true">‹</span>
          Back
        </button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Preferences
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950">Settings</h1>
            <p className="mt-1 max-w-2xl text-gray-500">
              Keep your CyberLearn profile, notifications, and account security
              current.
            </p>
          </div>

          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
          >
            View Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-950">Account</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update the information shown across your learning workspace.
                </p>
              </div>

              <form
                key={accountFormKey}
                onSubmit={handleProfileSubmit}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-gray-700">
                      Full Name
                    </span>
                    <input
                      name="name"
                      type="text"
                      defaultValue={profile.name}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-gray-700">Email</span>
                    <input
                      name="email"
                      type="email"
                      defaultValue={profile.email}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-gray-700">Title</span>
                    <input
                      name="title"
                      type="text"
                      defaultValue={profile.title}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-gray-700">
                      Organization
                    </span>
                    <input
                      name="organization"
                      type="text"
                      defaultValue={profile.organization}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-bold text-gray-700">Timezone</span>
                  <select
                    name="timezone"
                    defaultValue={profile.timezone}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Asia/Calcutta">Asia/Calcutta</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="Asia/Singapore">Asia/Singapore</option>
                  </select>
                </label>

                <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-gray-500">{message}</p>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-950">Security</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Maintain strong access controls for your account.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    placeholder="Current password"
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        currentPassword: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    placeholder="New password"
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        newPassword: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    placeholder="Confirm password"
                    onChange={(event) =>
                      setPasswordForm((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <ToggleRow
                  title="Two-factor authentication"
                  description="Require an additional verification step at sign in."
                  checked={profile.twoFactorEnabled}
                  onChange={(checked) => handleToggle("twoFactorEnabled", checked)}
                />

                <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    {passwordMessage}
                  </p>
                  <button
                    type="submit"
                    className="rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-950">Notifications</h2>
              <div className="mt-5 space-y-4">
                <ToggleRow
                  title="Email updates"
                  description="Receive important account and course messages."
                  checked={profile.emailNotifications}
                  onChange={(checked) =>
                    handleToggle("emailNotifications", checked)
                  }
                />
                <ToggleRow
                  title="Lab reminders"
                  description="Get nudges for unfinished hands-on labs."
                  checked={profile.labReminders}
                  onChange={(checked) => handleToggle("labReminders", checked)}
                />
                <ToggleRow
                  title="Weekly digest"
                  description="Summarize progress and next recommended modules."
                  checked={profile.weeklyDigest}
                  onChange={(checked) => handleToggle("weeklyDigest", checked)}
                />
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-950">Profile Photo</h2>
              <p className="mt-2 text-sm text-gray-500">
                Your photo is managed from your profile page.
              </p>
              <Link
                href="/profile"
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
              >
                Manage Photo
              </Link>
            </section>

            <section className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-red-700">Account Controls</h2>
              <p className="mt-2 text-sm text-gray-500">
                Reset locally saved profile, photo, and preferences on this device.
              </p>
              <button
                type="button"
                onClick={handleResetProfile}
                className="mt-5 w-full rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
              >
                Reset Local Profile
              </button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-4">
      <span>
        <span className="block text-sm font-bold text-gray-900">{title}</span>
        <span className="mt-1 block text-sm text-gray-500">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 shrink-0 accent-blue-600"
      />
    </label>
  );
}

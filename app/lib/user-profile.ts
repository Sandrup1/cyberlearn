"use client";

import { useSyncExternalStore } from "react";

export type UserProfile = {
  name: string;
  email: string;
  role: string;
  title: string;
  organization: string;
  timezone: string;
  memberSince: string;
  photoDataUrl?: string;
  emailNotifications: boolean;
  labReminders: boolean;
  weeklyDigest: boolean;
  twoFactorEnabled: boolean;
};

export const profileStorageKey = "cyberlearn:user-profile";
export const profileUpdatedEvent = "cyberlearn:user-profile-updated";

export const defaultUserProfile: UserProfile = {
  name: "CyberLearn Student",
  email: "student@cyberlearn.local",
  role: "Student",
  title: "Cybersecurity Learner",
  organization: "CyberLearn AI",
  timezone: "Asia/Calcutta",
  memberSince: new Date().getFullYear().toString(),
  emailNotifications: true,
  labReminders: true,
  weeklyDigest: true,
  twoFactorEnabled: false,
};

let cachedRawProfile: string | null | undefined;
let cachedProfile: UserProfile = defaultUserProfile;

function removeEmptyValues(profile: Partial<UserProfile>) {
  return Object.fromEntries(
    Object.entries(profile).filter(([, value]) => value !== undefined)
  ) as Partial<UserProfile>;
}

function normalizeProfile(profile: Partial<UserProfile>): UserProfile {
  const cleanProfile = removeEmptyValues(profile);

  return {
    ...defaultUserProfile,
    ...cleanProfile,
    name: cleanProfile.name?.trim() || defaultUserProfile.name,
    email: cleanProfile.email?.trim() || defaultUserProfile.email,
  };
}

export function readUserProfile(): UserProfile {
  if (typeof window === "undefined") {
    return defaultUserProfile;
  }

  const rawProfile = window.localStorage.getItem(profileStorageKey);

  if (rawProfile === cachedRawProfile && cachedProfile) {
    return cachedProfile;
  }

  try {
    cachedRawProfile = rawProfile;

    if (!rawProfile) {
      cachedProfile = defaultUserProfile;
      return cachedProfile;
    }

    cachedProfile = normalizeProfile(
      JSON.parse(rawProfile) as Partial<UserProfile>
    );
    return cachedProfile;
  } catch {
    cachedProfile = defaultUserProfile;
    return cachedProfile;
  }
}

export function saveUserProfile(profile: Partial<UserProfile>): UserProfile {
  const nextProfile = normalizeProfile({
    ...readUserProfile(),
    ...profile,
  });

  const serializedProfile = JSON.stringify(nextProfile);
  cachedRawProfile = serializedProfile;
  cachedProfile = nextProfile;

  window.localStorage.setItem(profileStorageKey, serializedProfile);
  window.dispatchEvent(
    new CustomEvent<UserProfile>(profileUpdatedEvent, { detail: nextProfile })
  );

  return nextProfile;
}

export function clearUserProfile() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(profileStorageKey);
  cachedRawProfile = null;
  cachedProfile = defaultUserProfile;
  window.dispatchEvent(
    new CustomEvent<UserProfile>(profileUpdatedEvent, {
      detail: defaultUserProfile,
    })
  );
}

export function getProfileInitials(profile: Pick<UserProfile, "name" | "email">) {
  const source = profile.name || profile.email || "User";
  const parts = source
    .replace(/@.*/, "")
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function useUserProfile() {
  return useSyncExternalStore(
    subscribeToProfile,
    readUserProfile,
    () => defaultUserProfile
  );
}

function subscribeToProfile(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === profileStorageKey) {
      onStoreChange();
    }
  }

  window.addEventListener(profileUpdatedEvent, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(profileUpdatedEvent, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

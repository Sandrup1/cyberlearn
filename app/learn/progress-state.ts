"use client";

import { useMemo, useSyncExternalStore } from "react";

const progressStorageKey = "cyberlearn:module-progress";
const progressUpdatedEvent = "cyberlearn:module-progress-updated";

const moduleAliases: Record<string, string> = {
  "sqli-module": "sqli",
};

const legacyLabKeys: Record<string, Record<string, string>> = {
  csrf: {
    lab1: "cyberlearn:csrf-lab1-solved",
  },
};

export const moduleProgressRequirements: Record<string, { labIds: string[] }> = {
  sqli: { labIds: ["lab1", "lab2", "lab3", "lab4"] },
  xss: { labIds: ["lab1", "lab2"] },
  csrf: { labIds: ["lab1", "lab2", "lab3"] },
  xxe: { labIds: ["lab1", "lab2"] },
};

type StoredModuleProgress = {
  quiz?: {
    score: number;
    total: number;
    completed: boolean;
    updatedAt: string;
  };
  labs?: Record<string, boolean>;
};

type StoredProgress = Record<string, StoredModuleProgress>;

export type ModuleProgress = {
  percent: number;
  completedItems: number;
  totalItems: number;
  quizCompleted: boolean;
  quizScore: number | null;
  quizTotal: number | null;
  solvedLabs: number;
  totalLabs: number;
};

function normalizeModuleId(moduleId: string) {
  return moduleAliases[moduleId] || moduleId;
}

function readStoredProgress(): StoredProgress {
  if (typeof window === "undefined") return {};

  try {
    const rawProgress = window.localStorage.getItem(progressStorageKey);
    return rawProgress ? JSON.parse(rawProgress) : {};
  } catch {
    return {};
  }
}

function writeStoredProgress(progress: StoredProgress) {
  window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
  window.dispatchEvent(new Event(progressUpdatedEvent));
}

function readLegacyLabSolved(moduleId: string, labId: string) {
  if (typeof window === "undefined") return false;

  const key = legacyLabKeys[moduleId]?.[labId];
  return key ? window.localStorage.getItem(key) === "true" : false;
}

function subscribeToProgress(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("focus", callback);
  window.addEventListener(progressUpdatedEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("focus", callback);
    window.removeEventListener(progressUpdatedEvent, callback);
  };
}

function readProgressVersion() {
  if (typeof window === "undefined") return "";

  const legacyValues = Object.values(legacyLabKeys)
    .flatMap((labs) => Object.values(labs))
    .map((key) => `${key}:${window.localStorage.getItem(key) || ""}`)
    .join("|");

  return `${window.localStorage.getItem(progressStorageKey) || ""}|${legacyValues}`;
}

function emptyModuleProgress(moduleId: string): ModuleProgress {
  const totalLabs = moduleProgressRequirements[moduleId]?.labIds.length || 0;
  const totalItems = totalLabs + 1;

  return {
    percent: 0,
    completedItems: 0,
    totalItems,
    quizCompleted: false,
    quizScore: null,
    quizTotal: null,
    solvedLabs: 0,
    totalLabs,
  };
}

export function getModuleProgress(moduleId: string): ModuleProgress {
  const resolvedModuleId = normalizeModuleId(moduleId);
  const requirements = moduleProgressRequirements[resolvedModuleId];

  if (!requirements) return emptyModuleProgress(resolvedModuleId);

  const moduleProgress = readStoredProgress()[resolvedModuleId] || {};
  const labs = moduleProgress.labs || {};
  const solvedLabs = requirements.labIds.filter(
    (labId) => labs[labId] || readLegacyLabSolved(resolvedModuleId, labId)
  ).length;
  const quizCompleted = Boolean(moduleProgress.quiz?.completed);
  const completedItems = solvedLabs + (quizCompleted ? 1 : 0);
  const totalItems = requirements.labIds.length + 1;

  return {
    percent: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
    completedItems,
    totalItems,
    quizCompleted,
    quizScore: moduleProgress.quiz?.score ?? null,
    quizTotal: moduleProgress.quiz?.total ?? null,
    solvedLabs,
    totalLabs: requirements.labIds.length,
  };
}

export function saveModuleQuizResult(moduleId: string, score: number, total: number) {
  const resolvedModuleId = normalizeModuleId(moduleId);
  const progress = readStoredProgress();
  const existingModuleProgress = progress[resolvedModuleId] || {};
  const existingScore = existingModuleProgress.quiz?.score ?? -1;
  const bestScore = Math.max(existingScore, score);

  progress[resolvedModuleId] = {
    ...existingModuleProgress,
    quiz: {
      score: bestScore,
      total,
      completed: bestScore > 6,
      updatedAt: new Date().toISOString(),
    },
  };

  writeStoredProgress(progress);
}

export function markModuleLabSolved(moduleId: string, labId: string) {
  const resolvedModuleId = normalizeModuleId(moduleId);
  const progress = readStoredProgress();
  const existingModuleProgress = progress[resolvedModuleId] || {};

  progress[resolvedModuleId] = {
    ...existingModuleProgress,
    labs: {
      ...existingModuleProgress.labs,
      [labId]: true,
    },
  };

  writeStoredProgress(progress);
}

export function useModuleProgress(moduleId: string) {
  const version = useSyncExternalStore(
    subscribeToProgress,
    readProgressVersion,
    () => ""
  );

  return useMemo(() => {
    if (version === "") {
      return emptyModuleProgress(normalizeModuleId(moduleId));
    }

    return getModuleProgress(moduleId);
  }, [moduleId, version]);
}

export function useModuleLabSolved(moduleId: string, labId: string) {
  const version = useSyncExternalStore(
    subscribeToProgress,
    readProgressVersion,
    () => ""
  );

  return useMemo(() => {
    if (version === "") {
      return false;
    }

    const resolvedModuleId = normalizeModuleId(moduleId);
    const moduleProgress = readStoredProgress()[resolvedModuleId];
    return Boolean(
      moduleProgress?.labs?.[labId] || readLegacyLabSolved(resolvedModuleId, labId)
    );
  }, [moduleId, labId, version]);
}

export function useOverallProgress(moduleIds: string[]) {
  const version = useSyncExternalStore(
    subscribeToProgress,
    readProgressVersion,
    () => ""
  );

  return useMemo(() => {
    const moduleProgress = moduleIds.map((moduleId) => {
      if (version === "") {
        return emptyModuleProgress(normalizeModuleId(moduleId));
      }

      return getModuleProgress(moduleId);
    });
    const completedItems = moduleProgress.reduce(
      (total, progress) => total + progress.completedItems,
      0
    );
    const totalItems = moduleProgress.reduce(
      (total, progress) => total + progress.totalItems,
      0
    );
    const completedModules = moduleProgress.filter(
      (progress) => progress.completedItems === progress.totalItems
    ).length;

    return {
      percent: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
      completedItems,
      totalItems,
      completedModules,
      totalModules: moduleIds.length,
    };
  }, [moduleIds, version]);
}

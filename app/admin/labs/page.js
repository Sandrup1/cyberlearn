"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultCourseContents,
  moduleIds,
} from "../../lib/course-content";

function createDraft(content) {
  return {
    title: content.title,
    shortTitle: content.shortTitle,
    description: content.description,
    labPath: content.labPath,
    quizPath: content.quizPath,
    published: content.published,
    sectionsJson: JSON.stringify(content.sections, null, 2),
    labsJson: JSON.stringify(content.labs, null, 2),
  };
}

const initialDrafts = moduleIds.reduce((drafts, moduleId) => {
  drafts[moduleId] = createDraft(defaultCourseContents[moduleId]);
  return drafts;
}, {});

export default function AdminLabsPage() {
  const [selectedModuleId, setSelectedModuleId] = useState("sqli");
  const [drafts, setDrafts] = useState(initialDrafts);
  const [status, setStatus] = useState("Loading saved content...");
  const [saving, setSaving] = useState(false);

  const draft = drafts[selectedModuleId];

  useEffect(() => {
    let active = true;

    async function loadContents() {
      try {
        const res = await fetch("/api/admin/content", { cache: "no-store" });
        const data = await res.json();

        if (!active || !res.ok) {
          return;
        }

        const nextDrafts = { ...initialDrafts };
        data.forEach((content) => {
          nextDrafts[content.moduleId] = createDraft(content);
        });

        setDrafts(nextDrafts);
        setStatus("Saved content loaded.");
      } catch {
        if (active) {
          setStatus("Using default content. Save a module to write it to MongoDB.");
        }
      }
    }

    loadContents();

    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(() => {
    try {
      return {
        sections: JSON.parse(draft.sectionsJson).length,
        labs: JSON.parse(draft.labsJson).length,
      };
    } catch {
      return { sections: 0, labs: 0 };
    }
  }, [draft.labsJson, draft.sectionsJson]);

  function updateDraft(field, value) {
    setDrafts((current) => ({
      ...current,
      [selectedModuleId]: {
        ...current[selectedModuleId],
        [field]: value,
      },
    }));
  }

  async function saveContent() {
    setSaving(true);
    setStatus("");

    try {
      const sections = JSON.parse(draft.sectionsJson);
      const labs = JSON.parse(draft.labsJson);

      if (!Array.isArray(sections) || !Array.isArray(labs)) {
        setStatus("Sections and labs must both be JSON arrays.");
        return;
      }

      const res = await fetch(`/api/admin/content/${selectedModuleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          shortTitle: draft.shortTitle,
          description: draft.description,
          labPath: draft.labPath,
          quizPath: draft.quizPath,
          published: draft.published,
          sections,
          labs,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Unable to save content.");
        return;
      }

      setDrafts((current) => ({
        ...current,
        [selectedModuleId]: createDraft(data.content),
      }));
      setStatus(`${draft.shortTitle} content saved to MongoDB.`);
    } catch {
      setStatus("Invalid JSON. Check sections and labs before saving.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-8 text-gray-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950">
              Theory & Lab Content
            </h1>
            <p className="mt-1 max-w-3xl text-gray-500">
              Edit learner-facing module theory and lab metadata. Saving writes
              the selected module to the MongoDB courseContents collection.
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={saveContent}
            className="rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
          >
            {saving ? "Saving..." : "Save to MongoDB"}
          </button>
        </div>

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {moduleIds.map((moduleId) => (
                <button
                  key={moduleId}
                  type="button"
                  onClick={() => setSelectedModuleId(moduleId)}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                    selectedModuleId === moduleId
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {defaultCourseContents[moduleId].shortTitle}
                </button>
              ))}
            </div>

            <div className="text-sm font-semibold text-gray-500">
              {counts.sections} sections / {counts.labs} labs
            </div>
          </div>

          {status && <p className="mt-4 text-sm font-medium text-gray-500">{status}</p>}
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
          <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-gray-950">Module Settings</h2>

            <label className="block space-y-2">
              <span className="text-sm font-bold text-gray-700">Title</span>
              <input
                value={draft.title}
                onChange={(event) => updateDraft("title", event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-bold text-gray-700">Short Title</span>
              <input
                value={draft.shortTitle}
                onChange={(event) => updateDraft("shortTitle", event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-bold text-gray-700">Description</span>
              <textarea
                value={draft.description}
                onChange={(event) => updateDraft("description", event.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-bold text-gray-700">Lab Path</span>
              <input
                value={draft.labPath}
                onChange={(event) => updateDraft("labPath", event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-bold text-gray-700">Quiz Path</span>
              <input
                value={draft.quizPath}
                onChange={(event) => updateDraft("quizPath", event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
              <span>
                <span className="block text-sm font-bold text-gray-900">
                  Published
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  Public pages read published content.
                </span>
              </span>
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(event) => updateDraft("published", event.target.checked)}
                className="h-5 w-5 accent-blue-600"
              />
            </label>
          </section>

          <section className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-950">
                  Theory Sections JSON
                </h2>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Editable
                </span>
              </div>
              <textarea
                value={draft.sectionsJson}
                onChange={(event) => updateDraft("sectionsJson", event.target.value)}
                rows={18}
                spellCheck={false}
                className="w-full rounded-lg border border-gray-300 bg-gray-950 px-4 py-3 font-mono text-sm leading-6 text-green-200 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-950">Labs JSON</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Editable
                </span>
              </div>
              <textarea
                value={draft.labsJson}
                onChange={(event) => updateDraft("labsJson", event.target.value)}
                rows={16}
                spellCheck={false}
                className="w-full rounded-lg border border-gray-300 bg-gray-950 px-4 py-3 font-mono text-sm leading-6 text-green-200 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

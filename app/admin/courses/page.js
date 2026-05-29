"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  defaultCourseContents,
  getDefaultCourseContent,
} from "../../lib/course-content";

function cloneContent(content) {
  return JSON.parse(JSON.stringify(content));
}

function emptySection(id) {
  return {
    id,
    label: "New section",
    heading: "New section",
    body: "",
  };
}

function cardToneLabel(tone) {
  return tone === "green"
    ? "Green"
    : tone === "blue"
    ? "Blue"
    : tone === "amber"
    ? "Amber"
    : "Red";
}

export default function AdminCourses() {
  const [contents, setContents] = useState(() => {
    const initial = {};
    Object.values(defaultCourseContents).forEach((content) => {
      initial[content.moduleId] = cloneContent(content);
    });
    return initial;
  });

  const [selectedModuleId, setSelectedModuleId] = useState("sqli");
  const [activeSectionId, setActiveSectionId] = useState("");

  const [draft, setDraft] = useState(() => {
    const fallback = getDefaultCourseContent(selectedModuleId);
    return fallback ? cloneContent(fallback) : null;
  });

  const [loadState, setLoadState] = useState("loading");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createModuleId, setCreateModuleId] = useState("");
  const [createTitle, setCreateTitle] = useState("");
  const [createShortTitle, setCreateShortTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createPublished, setCreatePublished] = useState(true);

  const moduleList = useMemo(() => {
    return Object.keys(contents).sort();
  }, [contents]);

  useEffect(() => {
    let active = true;

    async function loadContents() {
      setLoadState("loading");
      setStatus("Loading saved content…");

      try {
        const res = await fetch("/api/admin/content", { cache: "no-store" });
        const data = await res.json();

        if (!active || !res.ok) {
          throw new Error("Failed to load course content");
        }

        const next = {};
        data.forEach((content) => {
          next[content.moduleId] = cloneContent(content);
        });

        setContents(next);
        setLoadState("ready");
        setStatus("Saved content loaded.");
        const firstModuleId = data[0]?.moduleId;
        if (firstModuleId) {
          setSelectedModuleId(firstModuleId);
        }
      } catch {
        if (!active) return;
        setLoadState("error");
        setStatus("Using default content (unable to load saved content).");
        const fallbackIds = Object.keys(defaultCourseContents);
        const fallbackFirst = fallbackIds[0];
        if (fallbackFirst) {
          setSelectedModuleId(fallbackFirst);
        }
      }
    }

    loadContents();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const next = contents[selectedModuleId] || getDefaultCourseContent(selectedModuleId);
    setDraft(next ? cloneContent(next) : null);
    setActiveSectionId(next?.sections?.[0]?.id || "");
  }, [contents, selectedModuleId]);

  async function createModule() {
    const moduleId = createModuleId.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(moduleId)) {
      setStatus("Module id must be lowercase and contain only a-z, 0-9, and hyphens.");
      return;
    }

    if (!createTitle.trim()) {
      setStatus("Title is required.");
      return;
    }

    if (contents[moduleId]) {
      setStatus("A module with that id already exists.");
      return;
    }

    const now = new Date().toISOString();
    const payload = {
      moduleId,
      title: createTitle.trim(),
      shortTitle: createShortTitle.trim() || createTitle.trim(),
      description: createDescription.trim(),
      labPath: `/learn/${moduleId}/lablist`,
      quizPath: `/quiz/${moduleId}`,
      published: createPublished,
      sections: [
        {
          id: "intro",
          label: "Introduction",
          heading: "Introduction",
          body: "",
        },
      ],
      labs: [],
      updatedAt: now,
    };

    setSaving(true);
    setStatus("");

    try {
      const res = await fetch(`/api/admin/content/${moduleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus(data?.error || "Failed to create module.");
        return;
      }

      setContents((prev) => ({
        ...prev,
        [moduleId]: cloneContent(payload),
      }));
      setSelectedModuleId(moduleId);
      setCreateOpen(false);
      setCreateModuleId("");
      setCreateTitle("");
      setCreateShortTitle("");
      setCreateDescription("");
      setCreatePublished(true);
      setStatus("Module created.");
    } catch {
      setStatus("Failed to create module.");
    } finally {
      setSaving(false);
    }
  }

  const activeSection = useMemo(() => {
    if (!draft) return null;
    return draft.sections.find((section) => section.id === activeSectionId) || null;
  }, [activeSectionId, draft]);

  function updateDraft(patch) {
    if (!draft) return;
    setDraft({ ...draft, ...patch });
  }

  function updateSection(sectionId, patch) {
    if (!draft) return;
    const nextSections = draft.sections.map((section) =>
      section.id === sectionId ? { ...section, ...patch } : section
    );
    setDraft({ ...draft, sections: nextSections });
  }

  function addSection() {
    if (!draft) return;
    const base = `section-${draft.sections.length + 1}`;
    const id =
      draft.sections.some((section) => section.id === base) ? `${base}-${Date.now()}` : base;
    const next = [...draft.sections, emptySection(id)];
    setDraft({ ...draft, sections: next });
    setActiveSectionId(id);
  }

  function removeSection(sectionId) {
    if (!draft) return;
    const next = draft.sections.filter((section) => section.id !== sectionId);
    setDraft({ ...draft, sections: next });
    setActiveSectionId(next[0]?.id || "");
  }

  function moveSection(sectionId, direction) {
    if (!draft) return;
    const index = draft.sections.findIndex((section) => section.id === sectionId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= draft.sections.length) return;

    const nextSections = [...draft.sections];
    const [removed] = nextSections.splice(index, 1);
    nextSections.splice(nextIndex, 0, removed);
    setDraft({ ...draft, sections: nextSections });
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    setStatus("");

    try {
      const res = await fetch(`/api/admin/content/${draft.moduleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          shortTitle: draft.shortTitle,
          description: draft.description,
          labPath: draft.labPath,
          quizPath: draft.quizPath,
          published: draft.published,
          sections: draft.sections,
          labs: draft.labs ?? [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Unable to save.");
        return;
      }

      setContents((current) => ({
        ...current,
        [draft.moduleId]: cloneContent(data.content),
      }));

      setStatus(`${draft.shortTitle} saved.`);
    } catch {
      setStatus("Unable to save (network/server error).");
    } finally {
      setSaving(false);
    }
  }

  if (!draft) {
    return (
      <main className="min-h-screen bg-gray-100 p-10 text-gray-900">
        <p className="font-semibold">No module content available.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950">
              Manage Module Content
            </h1>
            <p className="mt-1 text-gray-500">
              Edit module sections with a form UI. Learner pages use only{" "}
              <span className="font-semibold">Published</span> content.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              ← Back
            </Link>
            <button
              type="button"
              disabled={saving}
              onClick={save}
              className="rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {status && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">
            {status}
            {loadState === "loading" && (
              <span className="ml-2 text-gray-400">(loading)</span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-950">Modules</h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose a module to edit.
              </p>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen((open) => !open)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50"
                >
                  {createOpen ? "Close" : "+ New module"}
                </button>
              </div>

              {createOpen && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="grid grid-cols-1 gap-3">
                    <label className="block space-y-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        Module ID
                      </span>
                      <input
                        value={createModuleId}
                        onChange={(event) => setCreateModuleId(event.target.value)}
                        placeholder="e.g. idor"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        Title
                      </span>
                      <input
                        value={createTitle}
                        onChange={(event) => setCreateTitle(event.target.value)}
                        placeholder="e.g. Insecure Direct Object References"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        Short Title
                      </span>
                      <input
                        value={createShortTitle}
                        onChange={(event) => setCreateShortTitle(event.target.value)}
                        placeholder="e.g. IDOR"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        Description
                      </span>
                      <textarea
                        value={createDescription}
                        onChange={(event) => setCreateDescription(event.target.value)}
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                    </label>

                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={createPublished}
                        onChange={(event) => setCreatePublished(event.target.checked)}
                      />
                      Published (visible to learners)
                    </label>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={createModule}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      Create module
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2">
                {moduleList.length === 0 ? (
                  <p className="text-sm text-gray-500">No modules found.</p>
                ) : (
                  moduleList.map((moduleId) => {
                    const content = contents[moduleId];
                    const selected = selectedModuleId === moduleId;
                  return (
                    <button
                      key={moduleId}
                      type="button"
                      onClick={() => setSelectedModuleId(moduleId)}
                      className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                        selected
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-gray-950">
                            {content?.shortTitle || moduleId.toUpperCase()}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {content?.description || "No description yet"}
                          </p>
                        </div>
                        <span
                          className={`mt-0.5 rounded-full px-2 py-1 text-xs font-bold ${
                            content?.published
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {content?.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs font-semibold text-gray-400">
                        <span>{content?.sections?.length || 0} sections</span>
                        <span className="font-mono">{moduleId}</span>
                      </div>
                    </button>
                  );
                  })
                )}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-950">Module Settings</h2>

              <div className="mt-4 space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-bold text-gray-700">Title</span>
                  <input
                    value={draft.title}
                    onChange={(event) => updateDraft({ title: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-bold text-gray-700">
                    Short Title (sidebar)
                  </span>
                  <input
                    value={draft.shortTitle}
                    onChange={(event) =>
                      updateDraft({ shortTitle: event.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-bold text-gray-700">
                    Description (dashboard card)
                  </span>
                  <textarea
                    value={draft.description}
                    onChange={(event) =>
                      updateDraft({ description: event.target.value })
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-gray-700">Lab Path</span>
                    <input
                      value={draft.labPath}
                      onChange={(event) => updateDraft({ labPath: event.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-gray-700">Quiz Path</span>
                    <input
                      value={draft.quizPath}
                      onChange={(event) => updateDraft({ quizPath: event.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                </div>

                <label className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
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
                    onChange={(event) => updateDraft({ published: event.target.checked })}
                    className="h-5 w-5 accent-blue-600"
                  />
                </label>

                <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">
                  Labs are edited in{" "}
                  <Link href="/admin/labs" className="font-semibold text-blue-600 hover:underline">
                    Manage Theory & Labs
                  </Link>
                  .
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-950">Sections</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Build the left sidebar and main content.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addSection}
                  className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  + Add Section
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <div className="space-y-2">
                    {draft.sections.map((section, index) => {
                      const selected = section.id === activeSectionId;
                      return (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => setActiveSectionId(section.id)}
                          className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                            selected
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-gray-950">
                                {section.label || "Untitled"}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                #{section.id} • {index === 0 ? "H1" : "H2"}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  moveSection(section.id, -1);
                                }}
                                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-50"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  moveSection(section.id, 1);
                                }}
                                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-50"
                              >
                                ↓
                              </button>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-7">
                  {!activeSection ? (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
                      Select a section to edit.
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-base font-bold text-gray-950">
                          Edit Section
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeSection(activeSection.id)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="block space-y-2">
                          <span className="text-sm font-bold text-gray-700">ID</span>
                          <input
                            value={activeSection.id}
                            onChange={(event) => {
                              const nextId = event.target.value.trim();
                              if (!nextId) return;
                              if (draft.sections.some((s) => s.id === nextId && s.id !== activeSection.id)) {
                                return;
                              }
                              const nextSections = draft.sections.map((s) =>
                                s.id === activeSection.id ? { ...s, id: nextId } : s
                              );
                              setDraft({ ...draft, sections: nextSections });
                              setActiveSectionId(nextId);
                            }}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                          />
                          <p className="text-xs text-gray-500">
                            Used in the URL hash (e.g. <span className="font-mono">#intro</span>).
                          </p>
                        </label>

                        <label className="block space-y-2">
                          <span className="text-sm font-bold text-gray-700">Sidebar Label</span>
                          <input
                            value={activeSection.label}
                            onChange={(event) =>
                              updateSection(activeSection.id, { label: event.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                          />
                        </label>
                      </div>

                      <label className="block space-y-2">
                        <span className="text-sm font-bold text-gray-700">Heading</span>
                        <input
                          value={activeSection.heading}
                          onChange={(event) =>
                            updateSection(activeSection.id, { heading: event.target.value })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="text-sm font-bold text-gray-700">Body</span>
                        <textarea
                          value={activeSection.body || ""}
                          onChange={(event) =>
                            updateSection(activeSection.id, { body: event.target.value })
                          }
                          rows={4}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                      </label>

                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="text-sm font-bold text-gray-900">Bullets</h4>
                          <button
                            type="button"
                            onClick={() =>
                              updateSection(activeSection.id, {
                                items: [...(activeSection.items || []), { title: "", body: "" }],
                              })
                            }
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-bold text-gray-700 hover:bg-gray-50"
                          >
                            + Add
                          </button>
                        </div>

                        {(activeSection.items || []).length === 0 ? (
                          <p className="text-sm text-gray-500">
                            Add bullet items (Title + Body).
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {(activeSection.items || []).map((item, idx) => (
                              <div key={idx} className="rounded-lg border border-gray-200 bg-white p-3">
                                <div className="mb-2 flex items-center justify-between">
                                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Item {idx + 1}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = [...(activeSection.items || [])];
                                      next.splice(idx, 1);
                                      updateSection(activeSection.id, { items: next });
                                    }}
                                    className="text-xs font-bold text-red-600 hover:underline"
                                  >
                                    Remove
                                  </button>
                                </div>
                                <input
                                  value={item.title}
                                  onChange={(event) => {
                                    const next = [...(activeSection.items || [])];
                                    next[idx] = { ...next[idx], title: event.target.value };
                                    updateSection(activeSection.id, { items: next });
                                  }}
                                  placeholder="Title"
                                  className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                                <textarea
                                  value={item.body}
                                  onChange={(event) => {
                                    const next = [...(activeSection.items || [])];
                                    next[idx] = { ...next[idx], body: event.target.value };
                                    updateSection(activeSection.id, { items: next });
                                  }}
                                  placeholder="Body"
                                  rows={2}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h4 className="text-sm font-bold text-gray-900">Code Block</h4>
                        <div className="mt-3 space-y-3">
                          <input
                            value={activeSection.codeLabel || ""}
                            onChange={(event) =>
                              updateSection(activeSection.id, { codeLabel: event.target.value })
                            }
                            placeholder="Optional label (e.g. -- Injected query)"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                          />
                          <textarea
                            value={activeSection.code || ""}
                            onChange={(event) =>
                              updateSection(activeSection.id, { code: event.target.value })
                            }
                            placeholder="Code content"
                            rows={4}
                            spellCheck={false}
                            className="w-full rounded-md border border-gray-300 bg-gray-950 px-3 py-2 font-mono text-sm text-green-200 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>

                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h4 className="text-sm font-bold text-gray-900">Cards</h4>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            Small callout cards (tone + title + body).
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              updateSection(activeSection.id, {
                                cards: [
                                  ...(activeSection.cards || []),
                                  { title: "", body: "", tone: "blue" },
                                ],
                              })
                            }
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-bold text-gray-700 hover:bg-gray-50"
                          >
                            + Add
                          </button>
                        </div>

                        {(activeSection.cards || []).length > 0 && (
                          <div className="mt-3 space-y-3">
                            {(activeSection.cards || []).map((card, idx) => (
                              <div key={idx} className="rounded-lg border border-gray-200 bg-white p-3">
                                <div className="mb-2 flex items-center justify-between">
                                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Card {idx + 1}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = [...(activeSection.cards || [])];
                                      next.splice(idx, 1);
                                      updateSection(activeSection.id, { cards: next });
                                    }}
                                    className="text-xs font-bold text-red-600 hover:underline"
                                  >
                                    Remove
                                  </button>
                                </div>

                                <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                  <input
                                    value={card.title}
                                    onChange={(event) => {
                                      const next = [...(activeSection.cards || [])];
                                      next[idx] = { ...next[idx], title: event.target.value };
                                      updateSection(activeSection.id, { cards: next });
                                    }}
                                    placeholder="Title"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                  />
                                  <select
                                    value={card.tone}
                                    onChange={(event) => {
                                      const next = [...(activeSection.cards || [])];
                                      next[idx] = {
                                        ...next[idx],
                                        tone: event.target.value,
                                      };
                                      updateSection(activeSection.id, { cards: next });
                                    }}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                  >
                                    {["green", "blue", "amber", "red"].map((tone) => (
                                      <option key={tone} value={tone}>
                                        {cardToneLabel(tone)}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <textarea
                                  value={card.body}
                                  onChange={(event) => {
                                    const next = [...(activeSection.cards || [])];
                                    next[idx] = { ...next[idx], body: event.target.value };
                                    updateSection(activeSection.id, { cards: next });
                                  }}
                                  placeholder="Body"
                                  rows={2}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h4 className="text-sm font-bold text-gray-900">Video</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Paste an embeddable URL (e.g. YouTube embed link).
                        </p>
                        <input
                          value={activeSection.videoUrl || ""}
                          onChange={(event) =>
                            updateSection(activeSection.id, { videoUrl: event.target.value })
                          }
                          placeholder="https://www.youtube.com/embed/..."
                          className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="text-sm font-bold text-gray-900">Quick Check</h4>
                          <button
                            type="button"
                            onClick={() =>
                              updateSection(activeSection.id, {
                                quizOptions: [...(activeSection.quizOptions || []), ""],
                              })
                            }
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-bold text-gray-700 hover:bg-gray-50"
                          >
                            + Option
                          </button>
                        </div>

                        <label className="block space-y-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            Question
                          </span>
                          <textarea
                            value={activeSection.quizQuestion || ""}
                            onChange={(event) =>
                              updateSection(activeSection.id, { quizQuestion: event.target.value })
                            }
                            rows={2}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                          />
                        </label>

                        {(activeSection.quizOptions || []).length > 0 && (
                          <div className="mt-3 space-y-2">
                            {(activeSection.quizOptions || []).map((option, idx) => (
                              <div key={idx} className="flex gap-2">
                                <input
                                  value={option}
                                  onChange={(event) => {
                                    const next = [...(activeSection.quizOptions || [])];
                                    next[idx] = event.target.value;
                                    updateSection(activeSection.id, { quizOptions: next });
                                  }}
                                  placeholder={`Option ${idx + 1}`}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...(activeSection.quizOptions || [])];
                                    next.splice(idx, 1);
                                    updateSection(activeSection.id, { quizOptions: next });
                                  }}
                                  className="rounded-md bg-red-50 px-3 text-sm font-bold text-red-700 hover:bg-red-100"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

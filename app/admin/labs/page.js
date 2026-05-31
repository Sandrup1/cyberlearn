"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultCourseContents,
  moduleIds,
} from "../../lib/course-content";
import "../admin.css";

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
    <main className="admin-main">
      <div className="admin-container">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p className="admin-card-pre">
                Admin
              </p>
              <h1 className="admin-card-title" style={{ marginTop: "0.5rem" }}>
                Theory & Lab Content
              </h1>
              <p className="admin-card-desc">
                Edit learner-facing module theory and lab metadata. Saving writes
                the selected module to the MongoDB courseContents collection.
              </p>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={saveContent}
              className="admin-btn primary"
            >
              {saving ? "Saving..." : "Save to MongoDB"}
            </button>
          </div>
        </div>

        <section className="admin-aside-card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {moduleIds.map((moduleId) => (
                <button
                  key={moduleId}
                  type="button"
                  onClick={() => setSelectedModuleId(moduleId)}
                  className="admin-btn"
                  style={{
                    backgroundColor: selectedModuleId === moduleId ? "#2563eb" : "#f3f4f6",
                    color: selectedModuleId === moduleId ? "#ffffff" : "#374151",
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem"
                  }}
                >
                  {defaultCourseContents[moduleId].shortTitle}
                </button>
              ))}
            </div>

            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#6b7280" }}>
              {counts.sections} sections / {counts.labs} labs
            </div>
          </div>

          {status && <p style={{ marginTop: "1rem", marginBottom: 0, fontSize: "0.875rem", fontWeight: 500, color: "#4b5563" }}>{status}</p>}
        </section>

        <div className="admin-grid-12">
          <section className="lg-col-4 admin-aside-card" style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "fit-content" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Module Settings</h2>

            <label className="admin-input-group">
              <span className="admin-label">Title</span>
              <input
                value={draft.title}
                onChange={(event) => updateDraft("title", event.target.value)}
                className="admin-input"
              />
            </label>

            <label className="admin-input-group">
              <span className="admin-label">Short Title</span>
              <input
                value={draft.shortTitle}
                onChange={(event) => updateDraft("shortTitle", event.target.value)}
                className="admin-input"
              />
            </label>

            <label className="admin-input-group">
              <span className="admin-label">Description</span>
              <textarea
                value={draft.description}
                onChange={(event) => updateDraft("description", event.target.value)}
                rows={4}
                className="admin-textarea"
              />
            </label>

            <label className="admin-input-group">
              <span className="admin-label">Lab Path</span>
              <input
                value={draft.labPath}
                onChange={(event) => updateDraft("labPath", event.target.value)}
                className="admin-input"
              />
            </label>

            <label className="admin-input-group">
              <span className="admin-label">Quiz Path</span>
              <input
                value={draft.quizPath}
                onChange={(event) => updateDraft("quizPath", event.target.value)}
                className="admin-input"
              />
            </label>

            <label className="admin-checkbox-label" style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", justifyContent: "space-between", backgroundColor: "#f9fafb" }}>
              <span>
                <span style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#111827" }}>
                  Published
                </span>
                <span style={{ display: "block", fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem", fontWeight: 400 }}>
                  Public pages read published content.
                </span>
              </span>
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(event) => updateDraft("published", event.target.checked)}
                style={{ height: "1.25rem", width: "1.25rem" }}
              />
            </label>
          </section>

          <section className="lg-col-8" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="admin-aside-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                  Theory Sections JSON
                </h2>
                <span className="admin-card-pre" style={{ color: "#9ca3af" }}>
                  Editable
                </span>
              </div>
              <textarea
                value={draft.sectionsJson}
                onChange={(event) => updateDraft("sectionsJson", event.target.value)}
                rows={18}
                spellCheck={false}
                className="admin-textarea mono"
              />
            </div>

            <div className="admin-aside-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Labs JSON</h2>
                <span className="admin-card-pre" style={{ color: "#9ca3af" }}>
                  Editable
                </span>
              </div>
              <textarea
                value={draft.labsJson}
                onChange={(event) => updateDraft("labsJson", event.target.value)}
                rows={16}
                spellCheck={false}
                className="admin-textarea mono"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

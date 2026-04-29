"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { markModuleLabSolved, useModuleLabSolved } from "../../progress-state";

const labTitles: Record<string, string> = {
  lab1: "XXE using a file disclosure payload",
  lab2: "XXE through a document upload parser",
};

export default function XxeLabPage() {
  const params = useParams<{ labId: string }>();
  const labId = params.labId;
  const solved = useModuleLabSolved("xxe", labId);
  const title = labTitles[labId] || "XXE practice lab";

  return (
    <div className="min-h-screen bg-white px-6 py-10 text-black">
      <main className="mx-auto max-w-3xl rounded-lg border border-gray-200 p-8 shadow-sm">
        <Link href="/learn/xxe/lablist" className="mb-6 inline-block text-sm font-semibold text-gray-500 hover:text-black">
          Back to XXE labs
        </Link>

        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Fake Lab</p>
        <h1 className="mb-4 text-3xl font-bold">{title}</h1>
        <p className="mb-8 text-gray-600">
          This placeholder lab is complete when you submit it.
        </p>

        <button
          onClick={() => markModuleLabSolved("xxe", labId)}
          className="rounded-lg bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
        >
          {solved ? "Submitted" : "Submit Lab"}
        </button>

        {solved && (
          <p className="mt-4 font-semibold text-green-700">Lab submitted and marked as solved.</p>
        )}
      </main>
    </div>
  );
}

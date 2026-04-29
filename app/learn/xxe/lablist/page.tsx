"use client";

import Link from "next/link";
import { useModuleLabSolved } from "../../progress-state";

const labs = [
  {
    id: "lab1",
    title: "XXE using a file disclosure payload",
    level: "Beginner",
  },
  {
    id: "lab2",
    title: "XXE through a document upload parser",
    level: "Beginner",
  },
];

export default function XxeLabListPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 text-black md:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/learn/xxe" className="mb-6 inline-block text-sm font-semibold text-gray-500 hover:text-black">
          Back to XXE
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">XXE Labs</h1>
          <p className="mt-2 text-gray-500">Submit each fake lab to count it toward progress.</p>
        </div>

        <div className="space-y-4">
          {labs.map((lab) => (
            <LabListItem key={lab.id} lab={lab} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LabListItem({ lab }: { lab: { id: string; title: string; level: string } }) {
  const solved = useModuleLabSolved("xxe", lab.id);

  return (
    <Link href={`/learn/xxe/${lab.id}`} className="block">
      <div className="flex min-h-[92px] items-center justify-between overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
        <div className="min-w-0 px-5 py-4">
          <span className="mb-2 inline-flex rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-800">
            {lab.level}
          </span>
          <h2 className="text-base font-semibold text-gray-800">{lab.title}</h2>
        </div>

        <div className="pr-4">
          <span
            className={`inline-flex rounded px-5 py-2 text-sm font-semibold ${
              solved ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {solved ? "Solved" : "Not solved"}
          </span>
        </div>
      </div>
    </Link>
  );
}

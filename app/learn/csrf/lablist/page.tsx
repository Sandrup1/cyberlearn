"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCsrfLab1Solved } from "../lab-state";

export default function CsrfLabsPage() {
  const router = useRouter();
  const lab1Solved = useCsrfLab1Solved();

  const labs = [
    {
      id: "lab1",
      title: "CSRF vulnerability in an email change feature with no defenses",
      status: lab1Solved ? "Solved" : "Not solved",
      level: "APPRENTICE",
    },
    {
      id: "lab2",
      title: "CSRF where token validation depends on request method",
      status: "Locked",
      level: "APPRENTICE",
    },
    {
      id: "lab3",
      title: "CSRF where token is not tied to the user session",
      status: "Locked",
      level: "PRACTITIONER",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 text-black md:px-10">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm font-semibold text-gray-500 hover:text-black"
        >
          &larr; Back
        </button>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">CSRF Labs</h1>
          <p className="mt-2 text-gray-500">
            Practice forged requests, missing tokens, and cookie-backed sessions.
          </p>
        </div>

        <div className="space-y-4">
          {labs.map((lab) => (
            <Link
              key={lab.id}
              href={`/learn/csrf/${lab.id}`}
              className="block"
            >
              <div className="flex min-h-[92px] items-center justify-between overflow-hidden border border-gray-200 bg-white transition-shadow hover:shadow-md">
                <div className="flex min-w-0 items-center">
                  <div className="flex self-stretch bg-black px-5 font-semibold text-white">
                    <span className="self-center">LAB</span>
                  </div>

                  <div className="min-w-0 px-5 py-4">
                    <span
                      className={`mb-2 inline-flex px-2 py-1 text-xs font-bold ${
                        lab.level === "APPRENTICE"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {lab.level}
                    </span>
                    <h2 className="text-base font-semibold text-gray-800">
                      {lab.title} &rarr;
                    </h2>
                  </div>
                </div>

                <div className="pr-4">
                  <span
                    className={`inline-flex px-5 py-2 text-sm font-semibold ${
                      lab.status === "Solved"
                        ? "bg-green-600 text-white"
                        : lab.status === "Not solved"
                        ? "bg-gray-200 text-gray-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {lab.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

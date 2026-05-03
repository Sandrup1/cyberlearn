"use client";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import Link from "next/link";
import { useModuleProgress } from "./progress-state";
import { useEffect, useState } from "react";

export default function Dashboard() {

  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setTopics(
          data.map((course: any) => ({
            id: course.moduleId,
            title: course.shortTitle || course.title,
            desc: course.description,
            link: `/learn/${course.moduleId}`,
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <Sidebar />

      {/* Main */}
      <div className="flex-1">

        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">

          {loading ? (
            <p className="text-gray-500">Loading courses...</p>
          ) : topics.length === 0 ? (
            <p className="text-gray-500">No courses available.</p>
          ) : (
            topics.map((item) => <ModuleCard key={item.id} item={item} />)
          )}

        </div>
      </div>
    </div>
  );
}

type Topic = {
  id: string;
  title: string;
  desc: string;
  link: string;
};

function ModuleCard({ item }: { item: Topic }) {
  const progress = useModuleProgress(item.id);

  return (
    <Link href={item.link} className="block">

      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer">

        <h2 className="font-semibold text-lg mb-2">
          {item.title}
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          {item.desc}
        </p>

        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{progress.percent}%</span>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-black h-2 rounded-full transition-all"
            style={{ width: `${progress.percent}%` }}
          ></div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-500">
          <span>
            Quiz: {progress.quizCompleted ? "Complete" : "Incomplete"}
          </span>
          <span className="text-right">
            Labs: {progress.solvedLabs}/{progress.totalLabs}
          </span>
        </div>
      </div>

    </Link>
  );
}

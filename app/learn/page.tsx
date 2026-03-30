"use client";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import Link from "next/link";

export default function Dashboard() {

  const topics = [
    {
      title: "SQLi",
      desc: "SQL Injection attacks manipulate database queries through user input.",
      link: "/learn/sqli",
    },
    {
      title: "XSS",
      desc: "Cross-Site Scripting (XSS) attacks manipulate user input.",
      link: "/learn/xss",
    },
    {
      title: "CSRF",
      desc: "Cross-Site Request Forgery tricks users into executing unwanted actions.",
      link: "/learn/csrf",
    },
    {
      title: "XXE",
      desc: "XML External Entity attacks exploit sensitive data.",
      link: "/learn/xxe",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <Sidebar />

      {/* Main */}
      <div className="flex-1">

        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">

          {topics.map((item, i) => (
            <Link key={i} href={item.link} className="block">

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer">

                <h2 className="font-semibold text-lg mb-2">
                  {item.title}
                </h2>

                <p className="text-gray-600 text-sm mb-6">
                  {item.desc}
                </p>

                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>67%</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-black h-2 rounded-full w-2/3"></div>
                </div>

              </div>

            </Link>
          ))}

        </div>
      </div>
    </div>
  );
}
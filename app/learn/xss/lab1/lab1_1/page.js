"use client";
import { useState } from "react";

export default function XSSLabPage() {
  const [query, setQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [solved, setSolved] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchValue(query);

    // Detect XSS payload
    if (query.trim() === "<script>alert(1)</script>") {
      setSolved(true);
      alert("Lab Solved ✅");
    }
  };

  return (
    <div className="bg-white min-h-screen text-black">

      {/* Top Bar */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="font-bold">Web Security Academy</h1>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold border border-black px-2 py-1 uppercase">
            LAB
          </span>

          <span className={`text-xs font-bold px-3 py-1 border ${
            solved ? "border-black text-black" : "border-gray-300 text-gray-400"
          }`}>
            {solved ? "Solved" : "Not solved"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex justify-center p-10">
        <div className="w-full max-w-3xl">

          {/* Title */}
          <h2 className="text-3xl font-bold mb-6 text-center">
            Reflected XSS Lab
          </h2>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex gap-2 mb-10"
          >
            <input
              type="text"
              placeholder="Search the blog..."
              className="flex-1 border border-black p-3 focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button
              type="submit"
              className="bg-black text-white px-6 font-bold hover:bg-gray-800"
            >
              Search
            </button>
          </form>

          {/* Reflected Output (VULNERABLE) */}
          {searchValue && (
            <div className="mb-6 border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-2">Search results for:</p>

              {/* ⚠️ Intentionally vulnerable */}
              <div
                dangerouslySetInnerHTML={{ __html: searchValue }}
              />
            </div>
          )}

          {/* Blog Post */}
          <div className="border border-gray-200 p-6">
            <h3 className="text-xl font-bold mb-2">Identity Theft</h3>
            <p className="text-gray-700 text-sm">
              I'm guessing all the people that used to steal people's identities
              are probably very lazy now...
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

"use client";

import { useState } from "react";

export default function StoredXSSLab() {
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [solved, setSolved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT website validation
    const websiteRegex = /^http:\/\/www\.[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

    if (!websiteRegex.test(website)) {
      setError("Website must be in format: http://www.example.com");
      return;
    }

    setError("");

    const newComment = {
      text: comment,
      name,
      email,
      website,
    };

    setComments([...comments, newComment]);

    // Solve immediately after posting payload
    if (comment.trim() === "<script>alert(1)</script>") {
      setSolved(true);
    }

    // Reset fields
    setComment("");
    setName("");
    setEmail("");
    setWebsite("");
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

          <span
            className={`text-xs font-bold px-3 py-1 border ${
              solved ? "border-black text-black" : "border-gray-300 text-gray-400"
            }`}
          >
            {solved ? "Solved" : "Not solved"}
          </span>
        </div>
      </div>

      {/* Success Banner */}
      {solved && (
        <div className="bg-black text-white text-center py-2 font-bold">
          Congratulations, you solved the lab!
        </div>
      )}

      {/* Content */}
      <div className="flex justify-center p-10">
        <div className="max-w-3xl w-full">

          {/* Blog Image */}
          <div className="mb-6 bg-gray-200 h-64 flex items-center justify-center">
            <span className="text-gray-500">Blog Image</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-2">A Perfect World</h2>
          <p className="text-sm text-gray-500 mb-6">
            Fred Time | 08 April 2026
          </p>

          {/* Content */}
          <p className="text-gray-700 text-sm mb-8 leading-relaxed">
            As the fight against crime is failing miserably, experiments are being conducted...
          </p>

          {/* Comments */}
          <h3 className="text-lg font-bold mb-4">Comments</h3>

          <div className="space-y-4 mb-10">
            {comments.map((c, index) => (
              <div key={index} className="border border-gray-200 p-4">

                {/* ⚠️ Stored XSS vulnerability */}
                <div
                  dangerouslySetInnerHTML={{ __html: c.text }}
                />

                <p className="text-xs text-gray-500 mt-2">
                  — {c.name}
                </p>
              </div>
            ))}
          </div>

          {/* Comment Form */}
          <h3 className="text-lg font-bold mb-4">Leave a comment</h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <textarea
              placeholder="Comment"
              className="border border-black p-3 h-32 focus:outline-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <input
              type="text"
              placeholder="Name"
              className="border border-black p-3 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Email"
              className="border border-black p-3 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="text"
              placeholder="Website"
              className="border border-black p-3 focus:outline-none"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-sm font-semibold">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="bg-black text-white py-3 font-bold hover:bg-gray-800"
            >
              Post Comment
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
"use client"

import Image from "next/image";


import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{topic: string; score: number}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch("http://localhost:8000/check_similarity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: input })
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      // Filter results >= 70%
      setResults(data.filter((r: {score: number}) => r.score >= 70));
    } catch (e: any) {
      setError(e.message || "Error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 to-blue-100 min-h-screen">
      <main>
        <section className="flex flex-col items-center justify-center text-center min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-purple-700">Project Topic Similarity Checker</h1>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter your project topic..."
            className="mb-4 w-[80%] max-w-xl placeholder:text-neutral-400 border-2 border-neutral-300 p-3 rounded-xl shadow focus:border-purple-500 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 transition text-white font-bold rounded-xl shadow disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check Similarity"}
          </button>
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {results.length > 0 && (
            <div className="mt-8 w-full max-w-2xl bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-purple-600">Similar Topics (≥ 70%)</h2>
              <ul className="space-y-3">
                {results.map((r, i) => (
                  <li key={i} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                    <span className="text-left text-gray-700">{r.topic}</span>
                    <span className="text-purple-700 font-bold">{r.score}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results.length === 0 && !loading && input.trim() && !error && (
            <div className="mt-8 text-gray-500">No similar topics found above 70%.</div>
          )}
        </section>
      </main>
    </div>
  );
}

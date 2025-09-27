import React, { useState } from "react";
import { api } from "@shared/api";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/button";

export default function GlobalSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    const res = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
    if (res.success) setResults(res.results);
    setOpen(true);
  }

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search content, lessons, users..."
          className="border px-2 py-1 rounded-l w-48"
          aria-label="Global search"
        />
        <Button type="submit" aria-label="Search">🔎</Button>
      </form>
      <Modal open={open} onClose={() => setOpen(false)} title="Search Results">
        <ul>
          {results.map(r => (
            <li key={r.id} className="py-1 border-b last:border-b-0">
              <span className="font-bold">{r.type}</span>: <span>{r.title || r.name}</span>
              {r.link && (
                <a href={r.link} className="ml-2 text-mindboost-green underline" target="_blank" rel="noopener noreferrer">View</a>
              )}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
"use client";

import React, { useState } from "react";

const rawData = [
  { precinct: "10030001", position: "MAYOR of BATANGAS - BALAYAN", candidate: "ERMITA, LISA (NPC)", votes: 295 },
  { precinct: "10030001", position: "MAYOR of BATANGAS - BALAYAN", candidate: "FRONDA, LESLEE (NP)", votes: 225 },
  { precinct: "10030002", position: "MAYOR of BATANGAS - BALAYAN", candidate: "ERMITA, LISA (NPC)", votes: 312 },
  { precinct: "10030002", position: "MAYOR of BATANGAS - BALAYAN", candidate: "FRONDA, LESLEE (NP)", votes: 201 },
];

export default function Page() {
  const positions = Array.from(new Set(rawData.map((d) => d.position))).filter(
    (p) => !p.includes("SENATOR") && !p.includes("PARTY LIST")
  );
  const candidates = Array.from(new Set(rawData.map((d) => d.candidate)));

  const [selectedPositions, setSelectedPositions] = useState(new Set(positions));
  const [selectedCandidates, setSelectedCandidates] = useState(new Set(candidates));

  const toggle = (item, set, current) => {
    const newSet = new Set(current);
    newSet.has(item) ? newSet.delete(item) : newSet.add(item);
    set(newSet);
  };

  const filtered = rawData.filter(
    (d) => selectedPositions.has(d.position) && selectedCandidates.has(d.candidate)
  );

  const pivoted = {};
  filtered.forEach(({ precinct, candidate, votes }) => {
    if (!pivoted[precinct]) pivoted[precinct] = {};
    pivoted[precinct][candidate] = votes;
  });

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-2">Filter by Position</h2>
          {positions.map((p) => (
            <label key={p} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPositions.has(p)}
                onChange={() => toggle(p, setSelectedPositions, selectedPositions)}
              />
              {p}
            </label>
          ))}
        </div>
        <div>
          <h2 className="font-semibold mb-2">Filter by Candidate</h2>
          {candidates.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCandidates.has(c)}
                onChange={() => toggle(c, setSelectedCandidates, selectedCandidates)}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="table-auto w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-left">Precinct</th>
              {[...selectedCandidates].map((c) => (
                <th key={c} className="border px-2 py-1 text-left">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(pivoted).map(([precinct, row]) => (
              <tr key={precinct}>
                <td className="border px-2 py-1">{precinct}</td>
                {[...selectedCandidates].map((c) => (
                  <td key={c} className="border px-2 py-1">{row[c] ?? 0}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

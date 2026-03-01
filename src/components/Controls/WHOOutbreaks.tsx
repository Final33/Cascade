"use client";

import { useEffect, useState } from "react";
import { fetchWHOOutbreaks } from "@/lib/api";

interface WHOOutbreak {
  Id: string;
  Title: string;
  PublicationDate: string;
  Summary?: string;
}

interface WHOOutbreaksProps {
  onSelect: (outbreak: WHOOutbreak) => void;
}

export default function WHOOutbreaks({ onSelect }: WHOOutbreaksProps) {
  const [outbreaks, setOutbreaks] = useState<WHOOutbreak[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const loadOutbreaks = async () => {
    if (outbreaks.length > 0) {
      setExpanded(!expanded);
      return;
    }
    setLoading(true);
    try {
      const data = (await fetchWHOOutbreaks()) as any;
      const items = data?.value || [];
      setOutbreaks(items.slice(0, 10));
      setExpanded(true);
    } catch {
      setOutbreaks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={loadOutbreaks}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10
          text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
      >
        <span className="flex items-center gap-2">
          <span className="text-base">🌍</span>
          WHO Disease Outbreak News
        </span>
        <span className="text-[10px] text-slate-600">
          {loading ? "Loading..." : expanded ? "Hide" : "Show"}
        </span>
      </button>

      {expanded && outbreaks.length > 0 && (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {outbreaks.map((ob) => (
            <button
              key={ob.Id}
              onClick={() => onSelect(ob)}
              className="w-full text-left px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5
                hover:bg-white/[0.05] hover:border-white/10 transition-all group"
            >
              <div className="text-[11px] text-slate-300 group-hover:text-white line-clamp-2">
                {ob.Title}
              </div>
              <div className="text-[9px] text-slate-600 mt-0.5">
                {ob.PublicationDate
                  ? new Date(ob.PublicationDate).toLocaleDateString()
                  : ""}
              </div>
            </button>
          ))}
        </div>
      )}

      {expanded && outbreaks.length === 0 && !loading && (
        <div className="text-[10px] text-slate-600 px-3">
          Unable to fetch WHO data. Backend may be offline.
        </div>
      )}
    </div>
  );
}

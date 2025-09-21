// src/components/FeaturesBlock.jsx
import React, { useMemo } from "react";

/**
 * FeaturesBlock
 * - Accepts an array of raw features with unknown shape.
 * - Normalizes names, maps common codes to friendly labels, and deduplicates.
 * - Examples of accepted item shapes:
 *    { name: "wifi" } | { title: "WiFi" } | { label: "air_conditioning" } | { code: "ac" } | "smart_tv"
 *
 * Props:
 *  - features: any[] (required)
 *  - renderTitle: boolean (default: true) -> whether to render the "Features" heading
 */
export default function FeaturesBlock({ features = [], renderTitle = true }) {
  // --- Helpers --------------------------------------------------------------

  // Extract a raw string from arbitrary feature objects
  function extractRaw(item) {
    if (item == null) return "";
    if (typeof item === "string") return item;
    if (typeof item === "object") {
      // Try common field candidates
      return (
        item.name ??
        item.title ??
        item.label ??
        item.code ??
        item.key ??
        ""
      );
    }
    return String(item ?? "");
  }

  // Normalize into a canonical key for dedupe and mapping
  function toKey(raw) {
    return String(raw || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, ""); // keep alnum/underscore only
  }

  // Map common keys/synonyms to a single canonical key
  const KEY_SYNONYMS = {
    // Air Conditioning
    ac: "air_conditioning",
    airconditioning: "air_conditioning",
    air_conditioner: "air_conditioning",
    a_c: "air_conditioning",

    // WiFi
    wifi: "wifi",
    wi_fi: "wifi",
    internet: "wifi",

    // Smart TV
    smarttv: "smart_tv",
    smart_tv: "smart_tv",
    tv_smart: "smart_tv",

    // Breakfast
    breakfast: "breakfast",
    desayuno: "breakfast",
  };

  // Human labels by canonical key
  const KEY_LABELS = {
    air_conditioning: "Air Conditioning",
    wifi: "WiFi",
    smart_tv: "Smart TV",
    breakfast: "Breakfast",
  };

  // Title-case fallback with exceptions (WiFi, TV, AC)
  function toTitleCaseWithAcronyms(s) {
    const base = String(s || "")
      .trim()
      .replace(/\s+/g, " ");
    if (!base) return "";

    // Title case words
    const words = base
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1));

    let out = words.join(" ");

    // Acronym/exceptions pass
    // Replace standalone "Wifi" -> "WiFi", "Tv" -> "TV", "Ac" (only when used alone) -> "AC"
    out = out.replace(/\bWifi\b/g, "WiFi").replace(/\bTv\b/g, "TV");

    // If the whole string is just "Ac", upgrade to "AC". If appears inside (e.g., "Ac Unit"), keep title case.
    if (/^Ac$/.test(out)) out = "AC";

    return out;
  }

  // Compute clean list once
  const clean = useMemo(() => {
    const map = new Map();

    for (const it of features) {
      const raw = extractRaw(it);
      if (!raw) continue;

      // Build a normalized key
      const rawKey = toKey(raw);
      const canonicalKey = KEY_SYNONYMS[rawKey] ?? rawKey;

      // Choose human label: mapped label OR title-case fallback
      const label =
        KEY_LABELS[canonicalKey] ??
        toTitleCaseWithAcronyms(
          // Try to render from original text (better), otherwise from canonical key
          String(raw)
            .replace(/[_-]+/g, " ")
            .trim()
        );

      const finalKey = canonicalKey || toKey(label);
      if (!finalKey) continue;

      // Deduplicate by key
      if (!map.has(finalKey)) {
        map.set(finalKey, { key: finalKey, label });
      }
    }

    // Sort alphabetically by label for stable UI
    return Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [features]);

  if (!clean.length) {
    return (
      <div className="text-sm text-slate-600">
        No features available.
      </div>
    );
  }

  return (
    <section>
      {renderTitle && (
        <h3 className="text-lg font-semibold mb-2">Features</h3>
      )}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {clean.map((f) => (
          <li
            key={f.key}
            className="flex items-center gap-2 text-slate-800"
          >
            {/* Simple bullet/icon */}
            <span
              aria-hidden="true"
              className="inline-flex h-2 w-2 rounded-full bg-emerald-600"
            />
            <span className="text-sm">{f.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

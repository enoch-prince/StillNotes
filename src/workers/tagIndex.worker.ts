/// <reference lib="webworker" />

import { TagIndex } from "@/utils/tagIndex";


let index: TagIndex | null = null;
let pendingTags: string[] = [];
const REBUILD_THRESHOLD = 500; // tune based on your dataset

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  switch (type) {
    case "build":
      index = new TagIndex(payload.tags, { buildSubstringIndex: true });
      pendingTags = [];
      self.postMessage({ type: "ready" });
      break;

    case "addTags":
      pendingTags.push(...payload.tags);

      // Update Set + Trie incrementally
      if (index) {
        for (const t of payload.tags) {
          index.addTag(t); // we'll add this helper in TagIndex
        }
      }

      // If enough tags accumulate, trigger background rebuild
      if (pendingTags.length >= REBUILD_THRESHOLD) {
        const allTags = [...index!.getAllTags(), ...pendingTags];
        pendingTags = [];
        index = new TagIndex(allTags, { buildSubstringIndex: true });
        self.postMessage({ type: "rebuilt" });
      }
      break;

    case "searchSubstring":
      if (!index) {
        self.postMessage({ type: "error", payload: "Index not built yet" });
        return;
      }

      const results = [
        ...index.searchSubstring(payload.query, payload.limit),
        ...pendingTags.filter(t => t.includes(payload.query)), // search pending
      ];
      self.postMessage({ type: "results", payload: Array.from(new Set(results)) });
      break;

    case "searchPrefix":
      if (!index) {
        self.postMessage({ type: "error", payload: "Index not built yet" });
        return;
      }
      const prefixResults = index.searchPrefix(payload.query, payload.limit);
      self.postMessage({ type: "results", payload: prefixResults });
      break;

    case "hasExact":
      if (!index) {
        self.postMessage({ type: "error", payload: "Index not built yet" });
        return;
      }
      const exists = index.hasExact(payload.query) || pendingTags.includes(payload.query);
      self.postMessage({ type: "result", payload: exists });
      break;
  }
};

// src/composables/useTagWorker.ts
import { Tags } from "@/utils/utils";
import { ref, onMounted, onUnmounted } from "vue";

export function useTagWorker() {
  const isReady = ref(false);
  const results = ref<string[]>([]);
  const exactMatch = ref<boolean | null>(null);

  // Instantiate worker
  const worker = new Worker(new URL("../workers/tagIndex.worker.ts", import.meta.url), {
    type: "module",
  });

  onMounted(() => {
    worker.onmessage = (e: MessageEvent) => {
      const { type, payload } = e.data;
      switch (type) {
        case "ready":
          isReady.value = true;
          break;
        case "rebuilt":
          console.log("Index rebuilt with new tags");
          break;
        case "results":
          results.value = payload;
          break;
        case "result":
          exactMatch.value = payload;
          break;
        case "error":
          console.error("Worker error:", payload);
          break;
      }
    };

    // Build initial index
    worker.postMessage({
      type: "build",
      payload: { tags: Tags },
    });
  });

  onUnmounted(() => {
    worker.terminate();
  });

  // Expose helper functions
  function searchSubstring(query: string, limit = 50) {
    worker.postMessage({ type: "searchSubstring", payload: { query, limit } });
  }

  function searchPrefix(query: string, limit = 50) {
    worker.postMessage({ type: "searchPrefix", payload: { query, limit } });
  }

  function hasExact(query: string) {
    worker.postMessage({ type: "hasExact", payload: { query } });
  }

  function addTags(tags: string[]) {
    worker.postMessage({ type: "addTags", payload: { tags } });
  }

  return {
    isReady,
    results,
    exactMatch,
    searchSubstring,
    searchPrefix,
    hasExact,
    addTags,
  };
}
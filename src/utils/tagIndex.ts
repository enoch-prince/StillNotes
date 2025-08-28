/* ============================================================
 * TagIndex: exact + prefix + substring search (TypeScript)
 * Scales to 1e5+ tags, memory-conscious, Unicode-friendly.
 * ============================================================
 */

type TagIndexOptions = {
  caseInsensitive?: boolean;    // default true
  normalize?: boolean;          // default true (NFKC)
  buildSubstringIndex?: boolean;// default true (build suffix array)
};

function normalizeText(s: string, caseInsensitive = true, doNormalize = true): string {
  let t = doNormalize ? s.normalize("NFKC") : s;
  return caseInsensitive ? t.toLowerCase() : t;
}

/* ---------- Exact: Set ---------- */
class ExactIndex {
  private set: Set<string>;
  constructor(tags: string[]) {
    this.set = new Set(tags);
  }
  has(tag: string): boolean {
    return this.set.has(tag);
  }
}

/* ---------- Prefix: Trie ---------- */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  end = false;
}
class Trie {
  private root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      let nxt = node.children.get(ch);
      if (!nxt) {
        nxt = new TrieNode();
        node.children.set(ch, nxt);
      }
      node = nxt;
    }
    node.end = true;
  }

  // Collect words under the node reached by prefix.
  searchPrefix(prefix: string, limit = Infinity): string[] {
    let node = this.root;
    for (const ch of prefix) {
      const nxt = node.children.get(ch);
      if (!nxt) return [];
      node = nxt;
    }
    const out: string[] = [];
    this.dfs(node, prefix, out, limit);
    return out;
  }

  private dfs(node: TrieNode, path: string, out: string[], limit: number): void {
    if (out.length >= limit) return;
    if (node.end) out.push(path);
    if (out.length >= limit) return;
    for (const [ch, nxt] of node.children) {
      if (out.length >= limit) break;
      this.dfs(nxt, path + ch, out, limit);
    }
  }
}

/* ---------- Substring: Suffix Array (doubling) ---------- */
class SuffixArray {
  private s: string;
  private sa: Int32Array;  // suffix indices
  // optional: LCP can be added if needed for advanced use-cases

  constructor(concatenated: string) {
    this.s = concatenated;
    this.sa = this.buildSA(concatenated);
  }

  // O(n log n) "prefix-doubling" construction; memory-safe (ints only).
  private buildSA(s: string): Int32Array {
    const n = s.length;
    const sa = new Int32Array(n);
    const rnk = new Int32Array(n);
    const tmp = new Int32Array(n);

    for (let i = 0; i < n; i++) {
      sa[i] = i;
      rnk[i] = s.charCodeAt(i); // initial rank by char code
    }

    for (let k = 1; k < n; k <<= 1) {
      // sort by (rnk[i], rnk[i+k])
      sa.sort((i, j) => {
        if (rnk[i] !== rnk[j]) return rnk[i] - rnk[j];
        const ri = i + k < n ? rnk[i + k] : -1;
        const rj = j + k < n ? rnk[j + k] : -1;
        return ri - rj;
      });
      tmp[sa[0]] = 0;
      for (let i = 1; i < n; i++) {
        const a = sa[i - 1], b = sa[i];
        const same = rnk[a] === rnk[b] &&
          (a + k < n ? rnk[a + k] : -1) === (b + k < n ? rnk[b + k] : -1);
        tmp[b] = tmp[a] + (same ? 0 : 1);
      }
      for (let i = 0; i < n; i++) rnk[i] = tmp[i];
      if (rnk[sa[n - 1]] === n - 1) break; // all ranks unique, done
    }
    return sa;
  }

  // Compare query with s[idx..] up to query.length, without allocating substrings.
  private cmpAt(idx: number, q: string): number {
    const n = this.s.length;
    for (let i = 0; i < q.length; i++) {
      const a = idx + i < n ? this.s.charCodeAt(idx + i) : -1;
      const b = q.charCodeAt(i);
      if (a !== b) return a - b;
    }
    return 0; // all matched up to q.length
  }

  // Lower bound: first suffix >= query by prefix
  private lowerBound(q: string): number {
    let lo = 0, hi = this.sa.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      const cmp = this.cmpAt(this.sa[mid], q);
      if (cmp < 0) lo = mid + 1; else hi = mid;
    }
    return lo;
  }

  // Upper bound: first suffix > query by prefix (treat as query + \uFFFF)
  private upperBound(q: string): number {
    let lo = 0, hi = this.sa.length;
    // Use sentinel larger than any char to get prefix upper bound
    const qHi = q + String.fromCharCode(0xFFFF);
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      const cmp = this.cmpAt(this.sa[mid], qHi);
      if (cmp < 0) lo = mid + 1; else hi = mid;
    }
    return lo;
  }

  // Return SA interval [L, R) where suffixes start with query
  matchRange(q: string): [number, number] {
    const L = this.lowerBound(q);
    const R = this.upperBound(q);
    return [L, R];
  }

  suffixAt(i: number): number {
    return this.sa[i];
  }

  get text(): string {
    return this.s;
  }
}

/* ---------- TagIndex: puts it all together ---------- */
export class TagIndex {
  private originalTags: string[];
  private tags: string[];             // normalized
  private exact: ExactIndex;
  private trie: Trie;
  private suffix?: SuffixArray;
  private sep: string;
  private concatText: string;
  private opts: Required<TagIndexOptions>;

  constructor(tags: string[], opts: TagIndexOptions = {}) {
    this.opts = {
      caseInsensitive: opts.caseInsensitive ?? true,
      normalize: opts.normalize ?? true,
      buildSubstringIndex: opts.buildSubstringIndex ?? true,
    };

    // Normalize all tags once
    this.originalTags = tags.slice();
    this.tags = tags.map(t => normalizeText(t, this.opts.caseInsensitive, this.opts.normalize));

    // Exact
    this.exact = new ExactIndex(this.tags);

    // Prefix
    this.trie = new Trie();
    for (const t of this.tags) this.trie.insert(t);

    // Safe separator that doesn’t appear in tags (try NUL, then SOH, then fallback)
    const candidates = ["\u0000", "\u0001", "\u241F"]; // NUL, SOH, "Unit Separator" symbol
    this.sep = candidates.find(c => !this.tags.some(t => t.includes(c))) ?? "|";

    // Concatenate once (memory-lean vs arrays-of-suffixes)
    this.concatText = this.tags.join(this.sep) + this.sep;

    if (this.opts.buildSubstringIndex) {
      this.suffix = new SuffixArray(this.concatText);
    }
  }

  /* ----- Exact ----- */
  hasExact(tag: string): boolean {
    const q = normalizeText(tag, this.opts.caseInsensitive, this.opts.normalize);
    return this.exact.has(q);
  }

  /* ----- Prefix (autocomplete) ----- */
  searchPrefix(prefix: string, limit = 50): string[] {
    const p = normalizeText(prefix, this.opts.caseInsensitive, this.opts.normalize);
    const hits = this.trie.searchPrefix(p, limit);
    return hits.slice(0, limit);
  }

  /* ----- Substring (contains) via suffix array ----- */
  searchSubstring(needle: string, limit = 100): string[] {
    if (!this.suffix) return [];
    const q = normalizeText(needle, this.opts.caseInsensitive, this.opts.normalize);
    if (!q.length) return [];

    const [L, R] = this.suffix.matchRange(q);
    if (L >= R) return [];

    const seen = new Set<string>();
    const out: string[] = [];
    const s = this.suffix.text;
    const sep = this.sep;

    // Map suffix positions back to the full tag by expanding to separators.
    for (let i = L; i < R && out.length < limit; i++) {
      const start = this.suffix.suffixAt(i);

      // Find token boundaries without allocating big substrings
      const left = s.lastIndexOf(sep, start);
      const right = s.indexOf(sep, start);
      const tag = s.slice(left + sep.length, right);

      if (!seen.has(tag)) {
        seen.add(tag);
        out.push(tag);
      }
    }
    return out;
  }

  addTag(tag: string): void {
    const norm = normalizeText(tag, this.opts.caseInsensitive, this.opts.normalize);
    if (this.tags.includes(norm)) return; // avoid duplicates

    this.originalTags.push(tag);
    this.tags.push(norm);

    this.exact = new ExactIndex(this.tags); // re-wrap exact
    this.trie.insert(norm);                 // incremental update
    // NOTE: suffix array is NOT incrementally updated here
  }

  getAllTags(): string[] {
    return [...this.tags];
  }
}

/* ===================== Example ===================== */
// const tags = ["AI", "Airflow", "Robotics", "Safety", "Autonomous", "AutoML"];
// const index = new TagIndex(tags, { buildSubstringIndex: true });
// console.log(index.hasExact("robotics"));       // true (case-insensitive by default)
// console.log(index.searchPrefix("au"));        // ["autonomous", "automl"]
// console.log(index.searchSubstring("bot"));    // ["robotics"]

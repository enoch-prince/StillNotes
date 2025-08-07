<script setup lang="ts">
import { useRecentScriptureStore } from '@/stores/counter';
import ScriptureBar from './ScriptureBar.vue';
import { computed, watch } from 'vue';

const props = defineProps<{scriptureSearch: string}>()

const recentScriptureStore = useRecentScriptureStore();

const bible = {
  "newTestament": [
    {
      "book": "1 John",
      "chapter-verse": {
        "1": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "2": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
        "3": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        "4": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
        "5": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
      }
    },
    {
      "book": "2 John",
      "chapter-verse": {
        "1": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
      }
    },
    {
      "book": "3 John",
      "chapter-verse": {
        "1": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      }
    },
    {
      "book": "Jude",
      "chapter-verse": {
        "1": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
      }
    }
  ]
}

function searchBible(jsonData: { newTestament: any[]; }, options: { bookName: string; chapter?: any; verse?: any; }) {
  const { bookName, chapter, verse } = options;

  // 1. Find the book in New Testament
  const book = jsonData.newTestament.find(b => 
    b.book.toLowerCase() === bookName.toLowerCase()
  );

  if (!book) {
    return { error: "Book not found" };
  }

  // 2. Filter by chapter if specified
  const chapterData = book["chapter-verse"];
  if (chapter) {
    const versesInChapter = chapterData[String(chapter)];
    if (!versesInChapter) {
      return { error: "Chapter not found" };
    }

    // 3. Filter by verse(s) if specified
    if (verse) {
      if (Array.isArray(verse)) {
        // Multiple verses (e.g., [1, 3, 5])
        const requestedVerses = verse.filter(v => versesInChapter.includes(v));
        return {
          book: book.book,
          chapter,
          verses: requestedVerses.length ? requestedVerses : null,
        };
      } else if (typeof verse === 'number') {
        // Single verse (e.g., 3)
        return versesInChapter.includes(verse) 
          ? { book: book.book, chapter, verse } 
          : { error: "Verse not found" };
      }
    }

    // Return full chapter if no verse filter
    return { book: book.book, chapter, verses: versesInChapter };
  }

  // Return entire book if no chapter/verse filter
  return book;
}

function generateId(bookName: string, chapterNum = null, verseNum = null) {
  // Convert book name to a standardized ID (e.g., "1 John" → "1jn")
  const bookId = bookName.toLowerCase()
    .replace(/\s+/g, '')       // Remove spaces ("1john")
    .replace(/^(\d+)([a-z]+)/, '$1$2'); // "1john" → "1jn"

  if (chapterNum === null) {
    return bookId;  // Return book ID (e.g., "1jn")
  } else if (verseNum === null) {
    return `${bookId}-${chapterNum}`;  // Chapter ID (e.g., "1jn-2")
  } else {
    return `${bookId}-${chapterNum}-${verseNum}`; // Verse ID (e.g., "1jn-2-15")
  }
}

const searched = computed(() => { return searchBible(bible, {bookName: props.scriptureSearch})})

watch(searched, (newSearched) => {
    if (!newSearched.error) {
        console.log(newSearched.book)
        recentScriptureStore.addToRecent({
            id: generateId(newSearched.book),
            label: newSearched.book,
            timestamp: new Date()
        })
    }
})

</script>

<template>
    <div class="px-4">
        <div style="margin-bottom: 1.25rem; width: 100%;">
            <p class="is-family-secondary is-size-7" style="color: #C8C5CB;">RECENT SEARCHES</p>
        </div>
        <div>Searched Scripture: <strong> {{ searched }} </strong></div>
        <div>
            <!-- Add a ScriptureBar component -->
             <ScriptureBar v-for="scripture in recentScriptureStore.getNMostRecent" :key="scripture.id" :label="scripture.label"/>
        </div>
    </div>
</template>

<style lang="css" scoped>

</style>
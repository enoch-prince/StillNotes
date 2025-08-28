export const Bible = {
  newTestament: [
    {
      book: '1 John',
      chapterData: {
        '1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        '2': [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
          26, 27, 28, 29,
        ],
        '3': [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        ],
        '4': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
        '5': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
      },
    },
    {
      book: '2 John',
      chapterData: {
        '1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      },
    },
    {
      book: '3 John',
      chapterData: {
        '1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      },
    },
    {
      book: 'Jude',
      chapterData: {
        '1': [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        ],
      },
    },
  ],
}

export function searchBible(jsonData: { newTestament: any[] }, bookName: string) {
  // 1. Find the book in New Testament
  const book = jsonData.newTestament.find((b) => b.book.toLowerCase() === bookName.toLowerCase())

  if (!book) {
    return { error: 'Book not found' }
  }

  // Return entire book
  return book
}

export function generateId(bookName: string, chapterNum:number|null = null, verseNum:number|null = null) {
  // Convert book name to a standardized ID (e.g., "1 John" → "1jn")
  const bookId = bookName
    .toLowerCase()
    .replace(/\s+/g, '') // Remove spaces ("1john")
    .replace(/^(\d+)([a-z]+)/, '$1$2') // "1john" → "1jn"

  if (chapterNum === null) {
    return bookId // Return book ID (e.g., "1jn")
  } else if (verseNum === null) {
    return `${bookId}-${chapterNum}` // Chapter ID (e.g., "1jn-2")
  } else {
    return `${bookId}-${chapterNum}-${verseNum}` // Verse ID (e.g., "1jn-2-15")
  }
}



export function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}


export const Hours = Array.from({ length: 12 }, (_, i) => i + 1)
export const Minutes = Array.from({ length: 60 }, (_, i) => i)

export const Tags = ["Walk", "Purpose", "Faith", "Consecration", "Hope", "Love"]
export function searchTag(tagData:string[], tagName: string) {
  const found = tagData.find((t) => t.toLocaleLowerCase() === tagName.toLocaleLowerCase())
}
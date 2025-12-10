export interface Scripture {
  id?: string
  book: string
  chapter: number
  verse: number
}

export interface BibleBook {
  book: string | null
  chapterData: {
    [key: string]: number[]
  } | null
}

export interface INoteSettings {
  public: boolean
  reminder: Date
}

export interface INote {
  id?: string
  title: string
  content: string
  color: string
  font: string
  scripture: Scripture[]
  tags: sting[]
  public: boolean
  timestamp?: number
}


export interface IRecent {
  id: string
  label: string
  timestamp: number
  data?: BibleBook
}

export interface ITag {
  id?: string
  label: string
}
export interface Scripture {
  book: string
  chapter: number
  verse: number
}

export interface INote {
  id?: string
  title: string
  content: string
  color: string
  font: string
  scripture: Scripture[]
}


export interface IRecent {
  id: string
  label: string
  timestamp: DateTime
}
interface User {
  object: string
  id: string
}

interface Tag {
  id: string
  name: string
  color: string
}

interface MultiSelectOption {
  id: string
  name: string
  color: string
}

interface RichTextContent {
  type: string
  text: {
    content: string
    link: any // This could be a string or null
  }
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
  plain_text: string
  href: any // This could be a string or null
}

type PageProperty = Record<
string,
{
  id: string
  type: string
  select?: Tag
  multi_select?: MultiSelectOption[]
  created_time?: string
  date?: {
    start: string
    end: string | null
    time_zone: string | null
  }
  rich_text?: RichTextContent[]
  title?: RichTextContent[]
}
>

export interface Page {
  object: string
  id: string
  created_time: string
  last_edited_time: string
  created_by: User
  last_edited_by: User
  cover: any // This could be an object or null
  icon: any // This could be an object or null
  parent: {
    type: string
    database_id: string
  }
  archived: boolean
  in_trash: boolean
  properties: PageProperty
  url: string
  public_url: any // This could be a string or null
}

export interface PageList {
  object: string
  results: Page[]
  next_cursor: string | null
  has_more: boolean
  type: string
  page_or_database: any // This could be an object or null
  request_id: string
}

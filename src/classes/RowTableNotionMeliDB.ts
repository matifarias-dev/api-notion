import { NOTION_MELI_DB } from '../utils/env'
import PropertiesNotionDBMeli from './PropertiesNotionDBMelil'

interface Parent {
  type: string
  database_id: string
}

export default class RowTableNotionMeliDB {
  private cover: string | null = null

  private icon: string | null = null

  private readonly parent = {
    type: 'database_id',
    database_id: NOTION_MELI_DB
  }

  private properties = new PropertiesNotionDBMeli()

  getParent (): Parent {
    return this.parent
  }

  setCover (url: string): void {
    this.cover = url
  }

  getCover (): string | null {
    return this.cover
  }

  setIcon (url: string): void {
    this.icon = url
  }

  getIcon (): string | null {
    return this.icon
  }

  setProperties (properties: PropertiesNotionDBMeli): void {
    this.properties = properties
  }

  getProperties (): PropertiesNotionDBMeli {
    return this.properties
  }
}

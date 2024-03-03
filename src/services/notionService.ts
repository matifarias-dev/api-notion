import { Client } from '@notionhq/client'
import { type QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { NOTION_TOKEN } from '../utils/env'

export interface NotionServiceInterface {
  getDataBasePrueba: () => Promise<QueryDatabaseResponse>
}

const notionService = (): NotionServiceInterface => {
  async function getDataBasePrueba (): Promise<QueryDatabaseResponse> {
    const notion = new Client({
      auth: NOTION_TOKEN
    })
    console.log(NOTION_TOKEN)

    const response = await notion.databases.query({
      database_id: '54f40b25f1b9445b9571947c28289469'
    })
    return response
  }
  return {
    getDataBasePrueba
  }
}

export default notionService

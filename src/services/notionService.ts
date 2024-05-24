import { Client } from '@notionhq/client'
import { type QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { NOTION_SECRET } from '../utils/env'

export default class NotionService {
  async getDataBaseMeli (): Promise<QueryDatabaseResponse> {
    const notion = new Client({
      auth: NOTION_SECRET
    })
    console.log(NOTION_SECRET)

    const response = await notion.databases.query({
      database_id: '2adb6860d9e54753888d60e778c94138'
    })
    return response
  }
}

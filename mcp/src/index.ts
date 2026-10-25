import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool
} from '@modelcontextprotocol/sdk/types.js'
import axios from 'axios'
import { randomUUID } from 'crypto'
import http from 'http'
import https from 'https'

const BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000'
const MCP_HOST = process.env.MCP_HOST ?? '0.0.0.0'
const MCP_PORT = Number(process.env.MCP_PORT ?? 4000)
const MCP_PATH = process.env.MCP_PATH ?? '/mcp'

const httpsAgent =
  process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0'
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined

const api = axios.create({ baseURL: BASE_URL, httpsAgent })

const tools: Tool[] = [
  {
    name: 'health_check',
    description: 'Check the health and version of the api-notion service.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'meli_get_auth_url',
    description:
      'Get the MercadoLibre OAuth authorization URL. Open this URL in a browser to start the authentication flow. After granting access, MercadoLibre redirects to the callback URL with a `code` query parameter — copy that value and pass it to `meli_exchange_code`.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'meli_exchange_code',
    description:
      'Exchange a MercadoLibre OAuth authorization code for an access token and persist it. Use after completing the browser flow from `meli_get_auth_url`. The code comes from the `code` query param in the redirect URL.',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Authorization code from the OAuth redirect URL.'
        }
      },
      required: ['code']
    }
  },
  {
    name: 'meli_get_token',
    description:
      'Get the current stored MercadoLibre access token. Automatically refreshes if within 30 minutes of expiry.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'meli_get_token_time_left',
    description:
      'Get the number of seconds remaining until the current MercadoLibre access token expires.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'meli_search_orders',
    description: 'Search MercadoLibre orders with optional filters.',
    inputSchema: {
      type: 'object',
      properties: {
        item: { type: 'string', description: 'Filter by item ID.' },
        tags: {
          type: 'string',
          description:
            'Filter by tag. Known values: not_delivered, no_shipping, mshop, paid, pack_order.'
        },
        order_status: {
          type: 'string',
          description:
            'Filter by order status. Known values: paid, confirmed, payment_required, cancelled.'
        },
        date_from: {
          type: 'string',
          description: 'ISO date — include orders created from this datetime.'
        },
        date_to: {
          type: 'string',
          description: 'ISO date — include orders created until this datetime.'
        },
        sort: {
          type: 'string',
          description: 'Sort order (e.g. "date_desc").'
        },
        limit: { type: 'string', description: 'Max number of results.' }
      }
    }
  },
  {
    name: 'meli_get_order_details',
    description: 'Get full details of a specific MercadoLibre order by ID.',
    inputSchema: {
      type: 'object',
      properties: {
        orderId: { type: 'number', description: 'The MercadoLibre order ID.' }
      },
      required: ['orderId']
    }
  },
  {
    name: 'meli_get_order_shipments',
    description: 'Get shipping/logistics details for a specific MercadoLibre order.',
    inputSchema: {
      type: 'object',
      properties: {
        orderId: { type: 'number', description: 'The MercadoLibre order ID.' }
      },
      required: ['orderId']
    }
  },
  {
    name: 'meli_get_item_details',
    description: 'Get listing details for a specific MercadoLibre item.',
    inputSchema: {
      type: 'object',
      properties: {
        itemId: {
          type: 'string',
          description: 'The MercadoLibre item ID (e.g. "MLA123456789").'
        }
      },
      required: ['itemId']
    }
  },
  {
    name: 'meli_get_today_orders',
    description:
      'Get all paid, undelivered MercadoLibre orders from the last 3 days, enriched with buyer, shipping, and item image data. This is the source for the Notion sync.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'notion_get_meli_db',
    description: 'Query all rows from the Notion MercadoLibre orders database.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'notion_get_meli_db_properties',
    description:
      'Get the column/property schema of the Notion MercadoLibre orders database.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'notion_write_today_orders',
    description:
      "Fetch today's paid MercadoLibre orders and write them as new pages to the Notion database. This calls meli_get_today_orders internally then creates one Notion page per order.",
    inputSchema: { type: 'object', properties: {} }
  }
]

const createServer = (): Server => {
  const server = new Server(
    { name: 'api-notion-mcp', version: '1.0.0' },
    { capabilities: { tools: {} } }
  )

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }))

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params

  const ok = (data: unknown) => ({
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }]
  })

  const fail = (message: string) => ({
    content: [{ type: 'text' as const, text: `Error: ${message}` }],
    isError: true as const
  })

  try {
    switch (name) {
      case 'health_check': {
        const { data } = await api.get('/healthCheck')
        return ok(data)
      }

      case 'meli_get_auth_url': {
        try {
          await api.get('/meli/login', { maxRedirects: 0 })
          return fail('Unexpected non-redirect response from /meli/login')
        } catch (e) {
          if (axios.isAxiosError(e) && e.response?.status === 302) {
            return ok({ authUrl: e.response.headers['location'] })
          }
          throw e
        }
      }

      case 'meli_exchange_code': {
        const { data } = await api.get('/meli/auth-success', {
          params: { code: args['code'] }
        })
        return ok(data)
      }

      case 'meli_get_token': {
        const { data } = await api.get('/meli/auth-token')
        return ok(data)
      }

      case 'meli_get_token_time_left': {
        const { data } = await api.get('/meli/auth-time-left')
        const raw = String(data)
        const seconds = parseInt(raw.split(': ')[1])
        return ok({ secondsLeft: isNaN(seconds) ? raw : seconds })
      }

      case 'meli_search_orders': {
        const filter = {
          item: args['item'] ?? null,
          tags: args['tags'] ?? null,
          'order.status': args['order_status'] ?? null,
          'order.date_created.from': args['date_from'] ?? null,
          'order.date_created.to': args['date_to'] ?? null,
          sort: args['sort'] ?? null,
          limit: args['limit'] ?? null
        }
        const { data } = await api.post('/meli/orders', filter)
        return ok(data)
      }

      case 'meli_get_order_details': {
        const { data } = await api.get(`/meli/orders/${args['orderId']}`)
        return ok(data)
      }

      case 'meli_get_order_shipments': {
        const { data } = await api.get(`/meli/orders/${args['orderId']}/shipments`)
        return ok(data)
      }

      case 'meli_get_item_details': {
        const { data } = await api.get(`/meli/item/${args['itemId']}`)
        return ok(data)
      }

      case 'meli_get_today_orders': {
        const { data } = await api.get('/meli/todayOrders')
        return ok(data)
      }

      case 'notion_get_meli_db': {
        const { data } = await api.get('/notion/getDBMeli')
        return ok(data)
      }

      case 'notion_get_meli_db_properties': {
        const { data } = await api.get('/notion/getDBMeliProperties')
        return ok(data)
      }

      case 'notion_write_today_orders': {
        const { data } = await api.get('/notion/writeDataOnMeliDB')
        return ok(data)
      }

      default:
        return fail(`Unknown tool: ${name}`)
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const msg = e.response?.data?.message ?? e.response?.data ?? e.message
      return fail(String(msg))
    }
    return fail(e instanceof Error ? e.message : String(e))
  }
  })

  return server
}

const readRequestBody = async (request: http.IncomingMessage): Promise<unknown> => {
  const chunks: Buffer[] = []
  let size = 0

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > 1024 * 1024) {
      throw new Error('Request body exceeds the 1 MB limit')
    }
    chunks.push(buffer)
  }

  if (chunks.length === 0) return undefined
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

const sendJson = (
  response: http.ServerResponse,
  statusCode: number,
  body: unknown
): void => {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id',
    'Access-Control-Expose-Headers': 'Mcp-Session-Id'
  })
  response.end(JSON.stringify(body))
}

type McpSession = {
  server: Server
  transport: StreamableHTTPServerTransport
}

const sessions = new Map<string, McpSession>()

const httpServer = http.createServer(async (request, response) => {
  if (request.url === '/health') {
    sendJson(response, 200, { status: 'OK' })
    return
  }

  if (request.url !== MCP_PATH) {
    sendJson(response, 404, { error: 'Not found' })
    return
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
    })
    response.end()
    return
  }

  if (!['GET', 'POST', 'DELETE'].includes(request.method ?? '')) {
    response.setHeader('Allow', 'GET, POST, DELETE, OPTIONS')
    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  try {
    const body = request.method === 'POST'
      ? await readRequestBody(request)
      : undefined
    const sessionId = request.headers['mcp-session-id']
    let session = typeof sessionId === 'string' ? sessions.get(sessionId) : undefined

    if (session == null) {
      const isInitializeRequest =
        request.method === 'POST' &&
        typeof body === 'object' &&
        body != null &&
        'method' in body &&
        body.method === 'initialize'

      if (!isInitializeRequest) {
        sendJson(response, sessionId == null ? 400 : 404, {
          error: sessionId == null
            ? 'Mcp-Session-Id is required after initialize'
            : 'Unknown MCP session'
        })
        return
      }

      session = {
        server: createServer(),
        transport: new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID()
        })
      }
      await session.server.connect(session.transport)
    }

    await session.transport.handleRequest(request, response, body)

    if (session.transport.sessionId != null) {
      if (request.method === 'DELETE') {
        sessions.delete(session.transport.sessionId)
      } else {
        sessions.set(session.transport.sessionId, session)
      }
    }
  } catch (error) {
    if (!response.headersSent) {
      sendJson(response, 400, {
        error: error instanceof Error ? error.message : String(error)
      })
    } else {
      response.end()
    }
  }
})

void (async () => {
  httpServer.listen(MCP_PORT, MCP_HOST, () => {
    console.error(`api-notion MCP listening on http://${MCP_HOST}:${MCP_PORT}${MCP_PATH}`)
    console.error(`API base URL: ${BASE_URL}`)
  })
})()

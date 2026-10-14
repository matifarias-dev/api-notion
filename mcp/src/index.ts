import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool
} from '@modelcontextprotocol/sdk/types.js'
import axios from 'axios'
import https from 'https'

const BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000'

const httpsAgent =
  process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0'
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined

const api = axios.create({ baseURL: BASE_URL, httpsAgent })

const server = new Server(
  { name: 'api-notion-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

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

void (async () => {
  const transport = new StdioServerTransport()
  await server.connect(transport)
})()

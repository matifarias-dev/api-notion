# api-notion MCP Server

MCP server that exposes all api-notion endpoints as tools for AI assistants.

## Setup

```bash
npm install
npm run build
```

Copy `.env.example` to `.env` and adjust as needed.

## Tools

| Tool | Description |
|---|---|
| `health_check` | API health and version |
| `meli_get_auth_url` | Get MercadoLibre OAuth URL (open in browser) |
| `meli_exchange_code` | Exchange OAuth code for token |
| `meli_get_token` | Get current access token |
| `meli_get_token_time_left` | Seconds until token expiry |
| `meli_search_orders` | Search orders with filters |
| `meli_get_order_details` | Full order details by ID |
| `meli_get_order_shipments` | Shipping details by order ID |
| `meli_get_item_details` | Item/listing details by ID |
| `meli_get_today_orders` | Paid undelivered orders (last 3 days) |
| `notion_get_meli_db` | Query Notion orders database |
| `notion_get_meli_db_properties` | Notion DB column schema |
| `notion_write_today_orders` | Sync today's orders to Notion |

## Claude Desktop config

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "api-notion": {
      "command": "node",
      "args": ["/absolute/path/to/api-notion/mcp/build/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:3000",
        "NODE_TLS_REJECT_UNAUTHORIZED": "0"
      }
    }
  }
}
```

## Dev

```bash
npm run dev   # run with tsx (no build needed)
```

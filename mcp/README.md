# api-notion MCP Server

HTTP MCP server that exposes all api-notion endpoints as tools for AI assistants and n8n.

## Setup

```bash
npm install
npm run build
```

Copy `.env.example` to `.env` and adjust as needed. The server uses the official Streamable HTTP transport and exposes MCP at `/mcp`.

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

## Run locally

Start the API first, then run the MCP server:

```bash
cp .env.example .env
npm install
npm run build
npm start
```

The MCP endpoint is:

```text
http://localhost:4000/mcp
```

Health check:

```bash
curl http://localhost:4000/health
```

The MCP server calls the API through `API_BASE_URL`, which defaults to `http://localhost:3000`.

## n8n

Configure the MCP client node with:

```text
http://<host>:4000/mcp
```

If n8n runs in Docker on the same host, use a hostname reachable from its network, such as `host.docker.internal` for local development or the internal Docker service name in a shared Compose network.

For production, expose this endpoint through the central Nginx/Cloudflare layer and protect it with the infrastructure authentication layer before making it public.

## Claude Desktop config

The current server uses HTTP, so clients that support remote MCP can use:

```text
http://localhost:4000/mcp
```

Clients that only support stdio require a separate stdio adapter; this project no longer starts in stdio mode.

## Dev

```bash
npm run dev   # run with tsx (no build needed)
```

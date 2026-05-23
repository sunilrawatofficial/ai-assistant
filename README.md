# ai-assistant

Express backend for a **multi-assistant RAG API**. Powers portfolio Q&A (Peter) with retrieval over resume data and a weather demo assistant using OpenAI tool calling.

## Features

- **Portfolio assistant (`portfolio`)** — Peter answers questions about Sunil’s background, skills, projects, and contact info using grounded retrieval (no guessing).
- **Weather assistant (`weather`)** — Demo assistant that calls OpenWeather via a tool.
- **Dual retrieval** — Pinecone vector search or in-memory cosine similarity on startup documents.
- **PDF ingest** — Upload a resume PDF; chunks are embedded and stored in Pinecone alongside `documents.js`.
- **Streaming** — Optional Server-Sent Events (SSE) for token-by-token responses.

## Tech stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js (CommonJS) |
| HTTP | Express 5 |
| LLM | OpenAI (`gpt-4o-mini`, `text-embedding-3-small`) |
| Vector DB | Pinecone v7 (optional) |
| PDF | Multer, pdf-parse |

## Architecture

```
Client
  → POST /open-ai/rag     → routes → controllers → agentService
  → POST /pdf/upload      → routes → controllers → pineconeIngestionService

agentService
  → assistant prompt + tools (OpenAI)
  → tool handler (e.g. getPortfolioInfo)
  → retrievalService → local or Pinecone repository
  → second LLM completion → answer
```

**Layering:** `routes` → `controllers` → `services` → `repositories` | `assistants/*/toolHandlers`

## Project structure

```
src/
├── app.js                 # Entry; indexes documents on startup
├── config/                # OpenAI, Pinecone, constants
├── routes/                # HTTP routes
├── controllers/           # Thin request handlers
├── middleware/            # Multer (PDF upload)
├── services/
│   ├── ai/                # llmService, agentService, retrievalService
│   └── integrations/      # Pinecone upsert, weather API
├── repositories/          # localContextRepository | pineconeContextRepository
├── assistants/
│   ├── portfolio/         # Peter — prompt, getPortfolioInfo tool
│   └── weather/           # Weather tool demo
└── data/documents.js      # Startup knowledge (upserted on boot)
```

## Getting started

### Prerequisites

- Node.js 18+
- [OpenAI API key](https://platform.openai.com/)
- [Pinecone](https://www.pinecone.io/) index (only if `USE_PINECONE=true`)

### Install and run

```bash
git clone git@github.com:sunilrawatofficial/ai-assistant.git
cd ai-assistant
cp .env.example .env
npm install
npm run dev
```

Server runs at `http://localhost:3001` by default.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Chat completions and embeddings |
| `USE_PINECONE` | No | `true` = Pinecone retrieval + PDF ingest; unset/false = local in-memory RAG |
| `PINECONE_API_KEY` | If Pinecone | Pinecone API key |
| `PINECONE_INDEX_NAME` | If Pinecone | Index name |
| `PINECONE_INDEX_HOST` | If Pinecone | Index host URL |
| `PORT` | No | HTTP port (default `3001`) |

On startup:

- **`USE_PINECONE=true`** — Embeds and upserts `src/data/documents.js` into namespace `portfolio` (`doc-0`, `doc-1`, …).
- **`USE_PINECONE` off** — Embeds `documents.js` in memory for local cosine similarity (PDF upload not supported in this mode).

## API

### `POST /open-ai/rag`

Ask an assistant a question.

**Body (JSON):**

```json
{
  "assistantType": "portfolio",
  "question": "What are Sunil's skills?",
  "stream": false
}
```

| Field | Type | Description |
|-------|------|-------------|
| `assistantType` | string | `portfolio` or `weather` |
| `question` | string | User message |
| `stream` | boolean | Optional. `true` = SSE stream of `{ token }`, `{ status }`, `{ done: true }` |

**Response (non-streaming):**

```json
{ "answer": "..." }
```

**Errors:** `400` missing fields · `500` `{ "error": "RAG failed" }`

#### Examples

```bash
# Portfolio Q&A
curl -X POST http://localhost:3001/open-ai/rag \
  -H "Content-Type: application/json" \
  -d '{"assistantType":"portfolio","question":"What are Sunil'\''s skills?"}'

# Contact info
curl -X POST http://localhost:3001/open-ai/rag \
  -H "Content-Type: application/json" \
  -d '{"assistantType":"portfolio","question":"Share Sunil'\''s contact information"}'

# Weather demo
curl -X POST http://localhost:3001/open-ai/rag \
  -H "Content-Type: application/json" \
  -d '{"assistantType":"weather","question":"What is the weather in London?"}'

# Streaming
curl -N -X POST http://localhost:3001/open-ai/rag \
  -H "Content-Type: application/json" \
  -d '{"assistantType":"portfolio","question":"Tell me about Sunil","stream":true}'
```

### `POST /pdf/upload`

Upload a PDF resume for Pinecone indexing. **Requires `USE_PINECONE=true`.**

**Request:** `multipart/form-data` with field `file` (PDF).

**Response:**

```json
{ "message": "...", "result": { "chunks": 12, "upserted": 12 } }
```

```bash
curl -X POST http://localhost:3001/pdf/upload \
  -F "file=@/path/to/resume.pdf"
```

Vectors are stored as `pdf-0`, `pdf-1`, … in the `portfolio` namespace (metadata field `text`, ~500-char chunks).

## Assistants

| `assistantType` | Persona | Tool | Knowledge |
|-----------------|---------|------|-----------|
| `portfolio` | Peter — Sunil’s portfolio assistant | `getPortfolioInfo` | RAG over `documents.js` + PDF chunks |
| `weather` | Weather helper | `getWeatherInfo` | OpenWeather API |

**Agent flow:** First OpenAI call may invoke one tool → handler runs → second completion produces the final answer.

## Knowledge base

1. **`src/data/documents.js`** — Curated snippets (skills, projects, contact, etc.). Re-indexed on every server start.
2. **Uploaded PDF** — Optional resume via `/pdf/upload`; chunked and embedded into the same Pinecone namespace.

Retrieval uses embedding similarity (`SIMILARITY_THRESHOLD=0.2`, top 5 matches in Pinecone). Answers are limited to retrieved context so the model does not invent facts.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon |
| `npm start` | Start with node |

## Adding an assistant

1. Create `src/assistants/<name>/` with `prompt.js`, `getX.js`, and `index.js` (`toolDefinitions`, `toolHandlers`).
2. Register in `src/assistants/index.js`.
3. `agentService` picks up tools from the assistant module automatically.

## Out of scope

- Authentication and user sessions
- Chat history persistence
- Database / ORM

## License

ISC

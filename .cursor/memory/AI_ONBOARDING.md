# AI onboarding — ai-assistant backend

Quick orientation for Cursor agents working in this repo.

## What this project is
Express backend for a **multi-assistant RAG API**: portfolio Q&A (resume/PDF + Pinecone) and a weather demo assistant with OpenAI tool calling.

## Run locally
```bash
cp .env.example .env   # fill OPENAI_API_KEY, Pinecone vars if used
npm install
npm run dev            # nodemon → src/app.js, default PORT 3001
```

## Env flags
| Variable | Purpose |
|----------|---------|
| `USE_PINECONE=true` | Startup upserts `data/documents.js` to Pinecone; retrieval uses Pinecone |
| `USE_PINECONE` unset/false | Embeds documents in memory; local cosine similarity |
| `PINECONE_*` | Pinecone client + index |
| `OPENAI_API_KEY` | Chat + embeddings |

## Main API
**POST `/open-ai/rag`**
```json
{ "assistantType": "portfolio", "question": "What are Sunil's skills?" }
```
Response: `{ "answer": "..." }`

**POST `/pdf/upload`** — multipart field `file` (PDF). Requires Pinecone path; chunks into namespace `portfolio` as `pdf-{i}`.

## Assistant types
| `assistantType` | Tools | Knowledge |
|-----------------|-------|-----------|
| `portfolio` | `getPortfolioInfo` | RAG (local or Pinecone) |
| `weather` | `getWeatherInfo` | OpenWeather API |

## Test & ops
```bash
# Portfolio RAG
curl -X POST http://localhost:3001/open-ai/rag \
  -H "Content-Type: application/json" \
  -d '{"assistantType":"portfolio","question":"What are Sunil skills?"}'

# Weather
curl -X POST http://localhost:3001/open-ai/rag \
  -H "Content-Type: application/json" \
  -d '{"assistantType":"weather","question":"weather in London"}'

# PDF ingest (USE_PINECONE=true)
curl -X POST http://localhost:3001/pdf/upload -F "file=@/path/to/resume.pdf"
```

| Goal | Action |
|------|--------|
| Pinecone mode | `USE_PINECONE=true`, valid Pinecone env, restart |
| Offline mode | `USE_PINECONE` unset/false, restart — `data/documents.js` only |

**Debug agent issues:** `assistantType` in `assistants/index.js`; tool names match `toolDefinitions`; for RAG gaps check Pinecone namespace `portfolio` and threshold `0.2`; contact/email needs `tool_calls` — see `assistants/portfolio/prompt.js`.

## Where to read more
- Diagrams, folder map, naming: `.cursor/memory/reference.md`
- Design rationale (ADRs): `.cursor/memory/decisions.md`
- Enforced rules: `.cursor/rules/backend.mdc`

## Out of scope (unless asked)
Auth, users DB, chat history persistence, multi-namespace per project (roadmap in `documents.js` only).

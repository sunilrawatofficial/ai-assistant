# Reference — architecture & conventions

Layering and agent/RAG rules live in `.cursor/rules/backend.mdc` (always applied). This file adds diagrams, folder map, naming, and API patterns.

## Request flow

```
Client → Express (app.js)
  → /open-ai/rag  → ragRoutes → ragController → agentService
  → /pdf/upload   → pdfRoutes  → pdfController → pineconeIngestionService
```

## Agent + RAG flow

```
processAgentQuery({ assistantType, question })
  → assistants[assistantType]
  → generateChatCompletion (llmService) — may return tool_calls
  → assistant.toolHandlers[toolName] (assistants/<name>/getX.js)
  → second completion with tool result → final content
```

## Folder map

```
src/
├── app.js, config/, routes/, controllers/, middleware/
├── services/ai/          # llmService, retrievalService, agentService
├── services/integrations/# pineconeIngestionService, weatherService
├── repositories/         # local | pinecone
├── assistants/ (prompt + tool handlers per assistant), data/documents.js, utils/
```

## Retrieval dual mode

| Mode | Trigger | Storage |
|------|---------|---------|
| Local | `USE_PINECONE !== "true"` | In-memory embeddings; cosine vs `documents.js` |
| Pinecone | `USE_PINECONE === "true"` | Namespace `portfolio`; top 3 above threshold |

`retrievalService` branches; repositories stay provider-specific. Boot: upsert or embed `documents.js` in `app.js`.

## Naming

| Kind | Pattern | Example |
|------|---------|---------|
| Files | camelCase | `agentService.js` |
| Functions | camelCase verbs | `processAgentQuery` |
| Constants | UPPER_SNAKE in `constants.js` | `CHAT_MODEL` |
| Assistant folders | lowercase | `portfolio/` |

## Module & API

- CommonJS: `require` / `module.exports = { fn }`.
- Success: `{ answer }` or `{ message, result }`. Error: `{ error: "..." }` with 4xx/5xx.
- Validation: manual in routes/controllers (no Joi/Zod).
- Secrets in `.env`; models/namespace in `src/config/constants.js`.
- Logs: bracket prefixes, e.g. `[assistantType received]`.

## Errors

- Routes/controllers: `try/catch`, generic client message (`"RAG failed"`).
- Services: log and `throw` for fatal startup errors.
- Tools: friendly fallbacks (`"No relevant information found."`).

## Add assistant (checklist)

1. `src/assistants/<name>/prompt.js` + `getX.js` + `index.js` (`toolDefinitions`, `toolHandlers`) → `assistants/index.js`
2. `agentService.js` resolves tools from the assistant module (no global tool registry)

## Not in repo

Auth, DB, Redis, queues, WebSockets, shared validation library.

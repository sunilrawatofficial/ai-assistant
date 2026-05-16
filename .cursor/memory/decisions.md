# Architecture decisions

Recorded choices in this codebase — extend, do not replace without explicit request.

## Layered Express backend
**Decision**: routes → controllers → services → repositories/tools.  
**Why**: Keeps HTTP, AI orchestration, and vector storage separable; allows swapping Pinecone vs local without touching agents.

## Dual retrieval via env flag
**Decision**: `USE_PINECONE` toggles `retrievalService` between `pineconeContextRepository` and `localContextRepository`.  
**Why**: Local dev without Pinecone; production-like path with same tool API (`getPortfolioInfo`).

## Assistant registry pattern
**Decision**: Each assistant = `prompt` + `tools[]` in `src/assistants/`, keyed by `assistantType` string.  
**Why**: Add assistants without changing route contract; `agentService` filters tools per assistant.

## Two-step LLM agent (not full ReAct loop)
**Decision**: One tool round — first completion may call tools; only `tool_calls[0]` executed; second completion produces final answer.  
**Why**: Simplicity for portfolio demo; sufficient for single-tool queries.  
**Limitation**: Multiple parallel tool calls from model are ignored after the first.

## Tool registry in agentService
**Decision**: OpenAI `toolDefinitions` and `toolRegistry` map live in `agentService.js`.  
**Why**: Single place wiring model function names to JS implementations.

## Pinecone metadata schema
**Decision**: `metadata.text` only; IDs `doc-{i}` / `pdf-{i}`; single namespace `portfolio`.  
**Why**: Minimal schema; combined top-3 chunks above `SIMILARITY_THRESHOLD` (0.2).

## Startup document upsert
**Decision**: `app.js` upserts/embeds `data/documents.js` on every boot when using Pinecone/local respectively.  
**Why**: Guarantees baseline knowledge without separate ingest CLI.  
**Tradeoff**: Re-upserts on restart; PDF vectors persist separately.

## PDF pipeline
**Decision**: Multer disk upload → extract → 500-char chunks → embed → upsert. Temp file deleted in `extractTextFromPDF`.  
**Why**: Simple resume ingestion path for portfolio RAG.

## No auth / no DB
**Decision**: Public API, stateless requests, no conversation history store.  
**Why**: Portfolio/ demo scope; reduces operational complexity.

## Models (constants.js)
- Chat: `gpt-4o-mini`
- Embeddings: `text-embedding-3-small`

## Intentional non-goals (current)
- Session memory / thread IDs
- Per-project Pinecone namespaces (mentioned in seed docs only)
- `tool_choice: required` for forced retrieval
- Shared request validation library

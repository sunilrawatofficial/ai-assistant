const documents = [
  "Professional Summary: Sunil Rawat is a full-stack developer focused on AI-powered applications using Node.js, Express, OpenAI APIs, and Pinecone. He builds production-ready assistants with clean architecture, modular services, and retrieval-based grounding.",
  "Core Strengths: API design, backend architecture, RAG pipelines, prompt engineering, vector search integration, and practical debugging for real-world deployments.",
  "Project Deep Dive - AI Assistant: Built an AI assistant backend with Express routes, controller-service-repository layering, and tool-enabled agent orchestration. Added PDF ingestion, chunking, embeddings, and Pinecone retrieval to improve grounded responses.",
  "Architecture Decision: Kept retrieval orchestration separate from provider-specific repository logic to allow future flexibility between local retrieval and Pinecone retrieval without changing business-level tool flows.",
  "RAG Design Approach: Uses embedding generation, similarity thresholding, and contextual retrieval before LLM response generation. Prioritizes relevant context and fallback behavior when confidence is low.",
  "PDF Ingestion Pipeline: Upload -> text extraction -> chunking -> embeddings -> vector upsert. Designed to support both startup document indexing and runtime PDF uploads.",
  "Code Quality Focus: Refactors code for modularity, reusable services, clear naming, and thin controllers. Prefers maintainable folder structures and separation of concerns over quick hacks.",
  "Problem Solving Style: Breaks tasks into small verifiable steps, validates import paths, checks linting after refactors, and uses compatibility wrappers during migration to avoid regressions.",
  "Backend Stack: Node.js, Express.js, OpenAI SDK, Pinecone, Multer, dotenv, CORS. Uses JavaScript CommonJS with service-first backend organization.",
  "AI Product Mindset: Designs assistants for practical use cases like portfolio Q&A and weather/resume tools, with emphasis on relevance, reliability, and future extensibility.",
  "Collaboration: Works iteratively with feedback, improves naming conventions, and balances immediate feature needs with long-term maintainability.",
  "Future Roadmap: Domain-aware retrieval namespaces, stronger tool-call validation, better retrieval observability, and cleaner AI service boundaries for scaling features.",
  "Contact Information: Sunil Rawat public portfolio contact — Email: sunilrawatofficial@gmail.com, Phone: +91 7503095374, Location: India, Website: sunilrawatcode.com, LinkedIn: https://www.linkedin.com/in/sunil-rawat-0059861ab/"
];

module.exports = { documents };
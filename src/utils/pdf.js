const fs = require("fs");
const pdfParseModule = require("pdf-parse");
const { PDFParse } = pdfParseModule;

async function extractTextFromPDF(filePath) {
  try {
    // 1. Check if path is provided
    if (!filePath) {
      throw new Error("File path is required");
    }

    // 2. Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found at given path");
    }

    const dataBuffer = fs.readFileSync(filePath);

    const parseFn =
      typeof pdfParseModule === "function"
        ? pdfParseModule
        : typeof pdfParseModule?.default === "function"
          ? pdfParseModule.default
          : null;

    const data = parseFn
      ? await parseFn(dataBuffer)
      : await (async () => {
          if (typeof PDFParse !== "function") {
            throw new Error("Unsupported pdf-parse export format");
          }
          const parser = new PDFParse({ data: dataBuffer });
          try {
            return await parser.getText();
          } finally {
            await parser.destroy();
          }
        })();

    if (!data.text || !data.text.trim()) {
      throw new Error("PDF contains no readable text");
    }
    fs.unlinkSync(filePath);
    return data.text;

  } catch (err) {
    // Re-throw clean error for controller
    throw new Error(`PDF processing failed: ${err.message}`);
  }
}

function chunkText(text, chunkSize = 400) {
  // return fixedChunk(text, chunkSize);
  return fixedChunkWithOverlap(text, chunkSize, Math.floor(chunkSize * 0.15));
  // return sentenceChunk(text, chunkSize);
  // return paragraphChunk(text);
  // return recursiveChunk(text, chunkSize);
  // return slidingWindowChunk(text, chunkSize, Math.floor(chunkSize / 2));
  // return semanticChunk(text);
}


//1. Fixed Size
function fixedChunk(text, chunkSize = 500) {
   const chunks = [];

   for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
   }
   console.log("✅ [pdf.fixedChunk] chunked with fixedChunk strategy");
   return chunks;
}

//2.Fixed Size with Overlap ⭐⭐⭐ (Most Common)
function fixedChunkWithOverlap(text, chunkSize = 500, overlap = 100) {
   const chunks = [];

   let start = 0;

   while (start < text.length) {
      chunks.push(text.slice(start, start + chunkSize));

      start += chunkSize - overlap;
   }

  console.log("✅ [pdf.fixedChunkWithOverlap] chunked with fixedChunkWithOverlap strategy");
   return chunks;
}

//3. Sentence-based Chunking
function sentenceChunk(text, maxChunkLength = 500) {
   const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

   const chunks = [];

   let current = "";

   for (const sentence of sentences) {
      if ((current + sentence).length <= maxChunkLength) {
         current += sentence;
      } else {
         chunks.push(current.trim());
         current = sentence;
      }
   }

   if (current) {
      chunks.push(current.trim());
   }

   console.log("✅ [pdf.sentenceChunk] chunked with sentenceChunk strategy");
   return chunks;
}

//4. Paragraph Chunking
function paragraphChunk(text) {
   console.log("✅ [pdf.paragraphChunk] chunked with paragraphChunk strategy");
   return text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
}
//5. Recursive Chunking ⭐⭐⭐⭐⭐
function recursiveChunk(text, chunkSize = 500) {
   if (text.length <= chunkSize) return [text];

   // Paragraphs
   let parts = text.split(/\n\s*\n/);

   if (parts.every((p) => p.length <= chunkSize)) return parts;

   // Sentences
   parts = text.match(/[^.!?]+[.!?]+/g);

   if (parts && parts.every((s) => s.length <= chunkSize)) return parts;

   // Words
   const words = text.split(" ");

   const chunks = [];

   let current = "";

   for (const word of words) {
      if ((current + word).length < chunkSize) {
         current += word + " ";
      } else {
         chunks.push(current.trim());
         current = word + " ";
      }
   }

   if (current) chunks.push(current.trim());

   console.log("✅ [pdf.recursiveChunk] chunked with recursiveChunk strategy");
   return chunks;
}
//6. Sliding Window
function slidingWindowChunk(text, windowSize = 500, step = 250) {
   const chunks = [];

   for (let i = 0; i < text.length; i += step) {
      chunks.push(text.slice(i, i + windowSize));
   }

   console.log("✅ [pdf.slidingWindowChunk] chunked with slidingWindowChunk strategy");
   return chunks;
}

//9. Semantic Chunking (Simplified)
function semanticChunk(text) {
   console.log("✅ [pdf.semanticChunk] chunked with semanticChunk strategy");
   return text
      .split(/\n(?=#)|\n\s*\n/)
      .map((c) => c.trim())
      .filter(Boolean);
}


module.exports = { extractTextFromPDF, chunkText };
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

function chunkText(text, chunkSize = 500) {
  const chunks = [];
  
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
}


module.exports = { extractTextFromPDF, chunkText };
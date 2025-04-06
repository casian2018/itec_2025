import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import pdfParse from 'pdf-parse';

type ResponseData = {
  summary?: string;
  error?: string;
};

// Helper function to format the summary response
function formatSummary(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n?\s*•\s*/g, "\n• ")
    .replace(/\n?\s*\*\s*/g, "\n• ")
    .trim();
}

// Helper function to extract text from PDF using pdf-parse library
async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text || "No text content found in PDF";
  } catch (error: any) {
    console.error(`Error parsing PDF: ${error.message}`);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

// Helper function to determine file type and extract text
async function extractTextFromFile(filePath: string): Promise<string> {
  const readFile = promisify(fs.readFile);
  const ext = path.extname(filePath).toLowerCase();
  
  try {
    if (ext === '.pdf') {
      return await extractTextFromPDF(filePath);
    } else if (['.txt', '.md', '.json', '.js', '.ts', '.html', '.css'].includes(ext)) {
      const buffer = await readFile(filePath);
      return buffer.toString('utf8');
    } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      // For image files, we'll just return a note that it's an image
      return `[This is an image file: ${path.basename(filePath)}]`;
    } else {
      return `[Unsupported file type: ${ext}]`;
    }
  } catch (error: any) {
    console.error(`Error reading file: ${error.message}`);
    throw new Error(`Failed to read file: ${error.message}`);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { filePath } = req.body;
  
  if (!filePath) {
    return res.status(400).json({ error: "File path is required" });
  }

  try {
    // Build the full path to the file in the public/uploads directory
    const fullFilePath = path.join(process.cwd(), 'public', 'uploads', filePath);
    
    // Check if file exists
    if (!fs.existsSync(fullFilePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Extract text content from the file
    const fileContent = await extractTextFromFile(fullFilePath);

    // Generate a summary using Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Prepare the prompt for summarization
    const prompt = `Please provide a comprehensive but concise summary of the following content. 
    Focus on key points, main ideas, and important details. 
    Be concise and avoid unnecessary elaboration.
    Limit the summary to 5-10 sentences if possible.
    Format the summary in clear sections with bullet points where appropriate:
    
    ${fileContent}`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = formatSummary(response.text());

    res.status(200).json({ summary });
  } catch (error: any) {
    console.error("Error in summarizeFile API:", error);
    res.status(500).json({ error: error.message || "Failed to summarize file" });
  }
}
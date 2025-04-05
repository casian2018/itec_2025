import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";

type ResponseData = {
  reply?: string;
  error?: string;
};

function formatResponse(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/: /g, ":\n") 
    .replace(/\n?\s*•\s*/g, "\n• ")
    .replace(/\n?\s*\*\s*/g, "\n• ")
    .replace(/(When to Seek Medical Attention|Treatment Options)/g, "\n\n<strong>$1</strong>\n")
    .trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(message);
    const response = result.response;
    const text = formatResponse(response.text());

    res.status(200).json({ reply: text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

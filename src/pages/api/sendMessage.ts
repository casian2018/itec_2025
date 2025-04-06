// pages/api/sendMessage.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/pages/api/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { text, channelName } = req.body;

  if (!text || !channelName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const messagesRef = collection(db, "chats", channelName, "messages");
    await addDoc(messagesRef, {
      text,
      timestamp: serverTimestamp(),
    });

    res.status(200).json({ message: "Message sent" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

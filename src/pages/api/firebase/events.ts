// /pages/api/firebase/events.ts
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/pages/api/firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { doc_id, date, title, description } = req.body;

    if (!doc_id || !date || !title || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const origin = req.headers.origin || "http://localhost:3000";
      const videoCallLink = `/dashboard/meet/${doc_id}`;

      const docRef = doc(db, "events", doc_id);
      await setDoc(docRef, {
        date,
        title,
        description,
        videoCallLink,
        createdAt: serverTimestamp(),
      });

      return res.status(200).json({
        message: "Event saved successfully",
        videoCallLink,
      });
    } catch (error) {
      console.error("Error saving event:", error);
      return res.status(500).json({ message: "Failed to save the event" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

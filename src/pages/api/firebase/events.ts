import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/pages/api/firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { doc_id, date, title, description } = req.body;

        if (!doc_id || !date || !title || !description) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const docRef = doc(db, "events", doc_id);
            await setDoc(docRef, {
                date,
                title,
                description,
                createdAt: serverTimestamp(),
            });

            return res.status(200).json({ message: "Event saved successfully" });
        } catch (error) {
            console.error("Error saving event:", error);
            return res.status(500).json({ error: "Failed to save the event" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

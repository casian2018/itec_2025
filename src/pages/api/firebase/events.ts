/**
 * Events API Handler
 * 
 * Manages event creation and management operations for the academic platform.
 * Currently supports POST operations to create new events.
 */
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/pages/api/firebase/firebase";
import { doc, setDoc, serverTimestamp, DocumentData } from "firebase/firestore";

// Type definitions for better type safety
interface EventRequest {
  doc_id: string;
  date: string;
  title: string;
  description: string;
  location?: string;
  organizer?: string;
}

interface EventResponse {
  message: string;
  videoCallLink?: string;
  eventId?: string;
  success: boolean;
}

/**
 * Handler for events API endpoint
 * 
 * @param req - Next.js API request object
 * @param res - Next.js API response object
 * @returns JSON response with operation status
 */
export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<EventResponse | { message: string }>
) {
  // Only allow POST method for this endpoint
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ 
      message: `Method ${req.method} not allowed`,
      success: false 
    });
  }

  // Extract and validate request data
  const { doc_id, date, title, description, location, organizer }: EventRequest = req.body;

  // Validate required fields
  if (!doc_id || !date || !title || !description) {
    return res.status(400).json({ 
      message: "Missing required fields. Please provide doc_id, date, title, and description.",
      success: false 
    });
  }

  try {
    // Generate video call link using the document ID
    const videoCallLink = `/dashboard/meet/${doc_id}`;

    // Prepare event data
    const eventData: DocumentData = {
      date,
      title,
      description,
      videoCallLink,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add optional fields if provided
    if (location) eventData.location = location;
    if (organizer) eventData.organizer = organizer;

    // Save event to Firestore
    const docRef = doc(db, "events", doc_id);
    await setDoc(docRef, eventData);

    // Return success response
    return res.status(200).json({
      message: "Event created successfully",
      videoCallLink,
      eventId: doc_id,
      success: true
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating event:", error);
    return res.status(500).json({ 
      message: "An error occurred while creating the event. Please try again later.",
      success: false
    });
  }
}
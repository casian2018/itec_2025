// /pages/api/getUserEvents.js

import { db } from "@/pages/api/firebase/firebase"; // Import your Firestore setup

export async function getUserEvents(email) {
  try {
    const userRef = db.collection("users").doc(email); // Get the user document by email
    const doc = await userRef.get();
    
    if (!doc.exists) {
      throw new Error("User not found");
    }

    const userData = doc.data();
    return userData.events_attended || []; // Return the user's attended events
  } catch (error) {
    console.error("Error fetching user events: ", error);
    throw new Error("Error fetching user events");
  }
}

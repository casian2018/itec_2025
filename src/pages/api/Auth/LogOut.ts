// /pages/api/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // You don't actually need to do anything here since js-cookie handles cookies client-side
  return res.status(200).json({ message: "Client logout triggered" });
}

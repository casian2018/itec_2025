import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, since we're using formidable
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure the upload directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing the files' });
        return;
      }

      // Here you can move the files to a permanent location or process them as needed
      res.status(200).json({ fields, files });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

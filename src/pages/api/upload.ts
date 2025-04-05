import { IncomingForm } from 'formidable';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: any, res: any) {
  const uploadDir = path.join(process.cwd(), 'public/uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    multiples: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const uploaded = Array.isArray(files.file) ? files.file : [files.file];
    const fileList = uploaded.map((f) => ({
      originalFilename: f?.originalFilename ?? 'unknown',
      newFilename: path.basename(f?.filepath ?? ''),
    }));

    res.status(200).json({ files: fileList });
  });
}

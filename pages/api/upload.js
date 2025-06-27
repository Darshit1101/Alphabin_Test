import { createRouter } from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPEG and PNG allowed'), false);
    }
    cb(null, true);
  },
});

const apiRoute = createRouter({
  onError(error, req, res) {
    console.error('Upload error:', error.message);
    res.status(500).json({ error: error.message });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  },
});

apiRoute.use(upload.single('image'));

apiRoute.post((req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file received');
    }

    console.log('Uploaded file:', req.file);
    res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error('Upload failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default apiRoute.handler(); 

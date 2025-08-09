import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import auth from '../middleware/auth.js';
import { uploadMedia } from '../controllers/mediaController.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'backend', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/', 'video/'];
  if (allowed.some(p => file.mimetype.startsWith(p))) return cb(null, true);
  cb(null, false);
};

const upload = multer({ storage, fileFilter });

router.post('/upload', auth, upload.single('file'), uploadMedia);

export default router;



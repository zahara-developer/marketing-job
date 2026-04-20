import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadRoot = path.resolve(__dirname, '..', 'uploads', 'resumes');

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const allowedMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

const allowedExtensions = new Set(['.pdf', '.doc', '.docx']);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadRoot);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    const safeBaseName = path
      .basename(file.originalname || 'resume', extension)
      .replace(/[^a-z0-9_-]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'resume';

    callback(null, `${Date.now()}-${safeBaseName}${extension}`);
  }
});

const fileFilter = (_req, file, callback) => {
  const extension = path.extname(file.originalname || '').toLowerCase();
  const hasAllowedMimeType = allowedMimeTypes.has(file.mimetype);
  const hasAllowedExtension = allowedExtensions.has(extension);

  if (!hasAllowedMimeType && !hasAllowedExtension) {
    callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'resume'));
    return;
  }

  callback(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter
});

export const uploadResume = upload.single('resume');

export const handleResumeUpload = (req, res, next) => {
  uploadResume(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ message: 'Resume must be 5MB or smaller.' });
        return;
      }

      res.status(400).json({ message: 'Only PDF, DOC, and DOCX files are allowed for resumes.' });
      return;
    }

    next(error);
  });
};

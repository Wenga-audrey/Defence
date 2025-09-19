import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Configure storage for different file types
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    let uploadPath = '';
    
    if (file.fieldname === 'document') {
      uploadPath = 'uploads/documents';
    } else if (file.fieldname === 'video') {
      uploadPath = 'uploads/videos';
    } else if (file.fieldname === 'avatar') {
      uploadPath = 'uploads/avatars';
    } else {
      uploadPath = 'uploads/misc';
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter for different content types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'document') {
    // Allow PDF, PPT, PPTX, DOC, DOCX
    const allowedTypes = /pdf|ppt|pptx|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, PPT, PPTX, DOC, and DOCX files are allowed for documents'));
    }
  } else if (file.fieldname === 'video') {
    // Allow MP4, AVI, MOV, WMV
    const allowedTypes = /mp4|avi|mov|wmv|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only MP4, AVI, MOV, WMV, and MKV files are allowed for videos'));
    }
  } else if (file.fieldname === 'avatar') {
    // Allow images
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, GIF, and WEBP files are allowed for avatars'));
    }
  } else {
    cb(null, true);
  }
};

// Configure multer with size limits
export const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: {
      document: 10 * 1024 * 1024, // 10MB for documents
      video: 100 * 1024 * 1024,   // 100MB for videos
      avatar: 2 * 1024 * 1024,    // 2MB for avatars
    } as any
  }
});

// Specific upload configurations
export const documentUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single('document');

export const videoUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
}).single('video');

export const avatarUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
}).single('avatar');

// Multiple file upload for lesson content
export const lessonContentUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB per file
}).fields([
  { name: 'document', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

// Utility functions
export function getFileUrl(filename: string, type: 'document' | 'video' | 'avatar'): string {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/uploads/${type}s/${filename}`;
}

export function deleteFile(filename: string, type: 'document' | 'video' | 'avatar'): boolean {
  try {
    const filePath = path.join(`uploads/${type}s`, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

export function validateFileSize(file: Express.Multer.File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

export function generateSecureFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  
  // Sanitize filename
  const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
  
  return `${safeName}_${timestamp}_${random}${ext}`;
}

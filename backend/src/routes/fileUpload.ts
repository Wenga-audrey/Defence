import express from 'express';
import { documentUpload, videoUpload, lessonContentUpload, getFileUrl, deleteFile } from '../lib/fileUploadService';
import { authenticate, requireRole } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Upload document for lesson
router.post('/lesson/:lessonId/document', 
  authenticate, 
  requireRole(['TEACHER', 'PREP_ADMIN']), 
  documentUpload,
  async (req, res) => {
    try {
      const { lessonId } = req.params;
      const userId = (req as any).user.id;

      if (!req.file) {
        return res.status(400).json({ error: 'No document file provided' });
      }

      // Verify teacher has access to this lesson
      const lesson = await prisma.lesson.findFirst({
        where: { 
          id: lessonId,
          chapter: {
            subject: {
              class: {
                teachers: {
                  some: { teacherId: userId }
                }
              }
            }
          }
        }
      });

      if (!lesson) {
        return res.status(403).json({ error: 'Access denied to this lesson' });
      }

      const documentUrl = getFileUrl(req.file.filename, 'document');

      // Update lesson with document URL
      const updatedLesson = await prisma.lesson.update({
        where: { id: lessonId },
        data: { documentUrl }
      });

      res.json({
        message: 'Document uploaded successfully',
        documentUrl,
        lesson: updatedLesson
      });

    } catch (error) {
      console.error('Document upload error:', error);
      res.status(500).json({ error: 'Failed to upload document' });
    }
  }
);

// Upload video for lesson
router.post('/lesson/:lessonId/video',
  authenticate,
  requireRole(['TEACHER', 'PREP_ADMIN']),
  videoUpload,
  async (req, res) => {
    try {
      const { lessonId } = req.params;
      const userId = (req as any).user.id;

      if (!req.file) {
        return res.status(400).json({ error: 'No video file provided' });
      }

      // Verify teacher has access to this lesson
      const lesson = await prisma.lesson.findFirst({
        where: { 
          id: lessonId,
          chapter: {
            subject: {
              class: {
                teachers: {
                  some: { teacherId: userId }
                }
              }
            }
          }
        }
      });

      if (!lesson) {
        return res.status(403).json({ error: 'Access denied to this lesson' });
      }

      const videoUrl = getFileUrl(req.file.filename, 'video');

      // Update lesson with video URL
      const updatedLesson = await prisma.lesson.update({
        where: { id: lessonId },
        data: { videoUrl }
      });

      res.json({
        message: 'Video uploaded successfully',
        videoUrl,
        lesson: updatedLesson
      });

    } catch (error) {
      console.error('Video upload error:', error);
      res.status(500).json({ error: 'Failed to upload video' });
    }
  }
);

// Upload both document and video for lesson
router.post('/lesson/:lessonId/content',
  authenticate,
  requireRole(['TEACHER', 'PREP_ADMIN']),
  lessonContentUpload,
  async (req, res) => {
    try {
      const { lessonId } = req.params;
      const userId = (req as any).user.id;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Verify teacher has access to this lesson
      const lesson = await prisma.lesson.findFirst({
        where: { 
          id: lessonId,
          chapter: {
            subject: {
              class: {
                teachers: {
                  some: { teacherId: userId }
                }
              }
            }
          }
        }
      });

      if (!lesson) {
        return res.status(403).json({ error: 'Access denied to this lesson' });
      }

      const updateData: any = {};

      if (files.document && files.document[0]) {
        updateData.documentUrl = getFileUrl(files.document[0].filename, 'document');
      }

      if (files.video && files.video[0]) {
        updateData.videoUrl = getFileUrl(files.video[0].filename, 'video');
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No files provided' });
      }

      // Update lesson with new content URLs
      const updatedLesson = await prisma.lesson.update({
        where: { id: lessonId },
        data: updateData
      });

      res.json({
        message: 'Content uploaded successfully',
        uploadedFiles: updateData,
        lesson: updatedLesson
      });

    } catch (error) {
      console.error('Content upload error:', error);
      res.status(500).json({ error: 'Failed to upload content' });
    }
  }
);

// Delete lesson content
router.delete('/lesson/:lessonId/content/:type',
  authenticate,
  requireRole(['TEACHER', 'PREP_ADMIN']),
  async (req, res) => {
    try {
      const { lessonId, type } = req.params;
      const userId = (req as any).user.id;

      if (!['document', 'video'].includes(type)) {
        return res.status(400).json({ error: 'Invalid content type' });
      }

      // Verify teacher has access
      const lesson = await prisma.lesson.findFirst({
        where: { 
          id: lessonId,
          chapter: {
            subject: {
              class: {
                teachers: {
                  some: { teacherId: userId }
                }
              }
            }
          }
        }
      });

      if (!lesson) {
        return res.status(403).json({ error: 'Access denied to this lesson' });
      }

      const urlField = type === 'document' ? 'documentUrl' : 'videoUrl';
      const currentUrl = (lesson as any)[urlField];

      if (currentUrl) {
        // Extract filename from URL and delete file
        const filename = currentUrl.split('/').pop();
        deleteFile(filename, type as 'document' | 'video');
      }

      // Update lesson to remove URL
      const updatedLesson = await prisma.lesson.update({
        where: { id: lessonId },
        data: { [urlField]: null }
      });

      res.json({
        message: `${type} deleted successfully`,
        lesson: updatedLesson
      });

    } catch (error) {
      console.error('Content deletion error:', error);
      res.status(500).json({ error: 'Failed to delete content' });
    }
  }
);

// Get lesson content info
router.get('/lesson/:lessonId/content',
  authenticate,
  async (req, res) => {
    try {
      const { lessonId } = req.params;

      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: {
          id: true,
          title: true,
          documentUrl: true,
          videoUrl: true,
          isPublished: true
        }
      });

      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      res.json({
        lesson,
        hasDocument: !!lesson.documentUrl,
        hasVideo: !!lesson.videoUrl,
        contentComplete: !!(lesson.documentUrl || lesson.videoUrl)
      });

    } catch (error) {
      console.error('Error fetching lesson content:', error);
      res.status(500).json({ error: 'Failed to fetch lesson content' });
    }
  }
);

export default router;

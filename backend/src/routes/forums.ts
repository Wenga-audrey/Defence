import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { sendForumNotifications } from "../lib/email.js";
import { getWebSocketService } from "../lib/websocket.js";

const router = Router();
const prisma = new PrismaClient();

// Get all forum topics with pagination
router.get("/", async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    
    if (category && category !== "all") {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { content: { contains: search as string, mode: "insensitive" } }
      ];
    }

    const [topics, total] = await Promise.all([
      prisma.forumTopic.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true
            }
          },
          replies: {
            select: { id: true },
            take: 1
          },
          _count: {
            select: {
              replies: true,
              likes: true
            }
          }
        },
        orderBy: [
          { isPinned: "desc" },
          { updatedAt: "desc" }
        ],
        skip,
        take: Number(limit)
      }),
      prisma.forumTopic.count({ where })
    ]);

    const formattedTopics = topics.map(topic => ({
      id: topic.id,
      title: topic.title,
      content: topic.content,
      category: topic.category,
      author: `${topic.author.firstName} ${topic.author.lastName}`,
      authorRole: topic.author.role,
      replies: topic._count.replies,
      likes: topic._count.likes,
      views: topic.views,
      isPinned: topic.isPinned,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
      hasNewReplies: topic.replies.length > 0
    }));

    res.json({
      success: true,
      data: {
        topics: formattedTopics,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single topic with replies
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // Increment view count
    await prisma.forumTopic.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    const topic = await prisma.forumTopic.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            avatar: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                avatar: true
              }
            },
            _count: {
              select: { likes: true }
            }
          },
          orderBy: { createdAt: "asc" }
        },
        _count: {
          select: {
            replies: true,
            likes: true
          }
        }
      }
    });

    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const formattedTopic = {
      id: topic.id,
      title: topic.title,
      content: topic.content,
      category: topic.category,
      author: `${topic.author.firstName} ${topic.author.lastName}`,
      authorRole: topic.author.role,
      authorAvatar: topic.author.avatar,
      replies: topic._count.replies,
      likes: topic._count.likes,
      views: topic.views,
      isPinned: topic.isPinned,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
      repliesData: topic.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        author: `${reply.author.firstName} ${reply.author.lastName}`,
        authorRole: reply.author.role,
        authorAvatar: reply.author.avatar,
        likes: reply._count.likes,
        createdAt: reply.createdAt,
        isInstructor: reply.author.role === "TEACHER"
      }))
    };

    res.json({
      success: true,
      data: formattedTopic
    });
  } catch (error) {
    next(error);
  }
});

// Create new topic
router.post("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { title, content, category } = req.body;
    const userId = req.user!.id;

    if (!title || !content || !category) {
      return res.status(400).json({ error: "Title, content, and category are required" });
    }

    const newTopic = await prisma.forumTopic.create({
      data: {
        title,
        content,
        category,
        authorId: userId,
        isPinned: false
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        _count: {
          select: {
            replies: true,
            likes: true
          }
        }
      }
    });

    // Send email notifications for new topic
    await sendForumNotifications('newTopic', {
      topicId: newTopic.id,
      topicTitle: newTopic.title,
      authorId: newTopic.authorId,
      authorName: `${newTopic.author.firstName} ${newTopic.author.lastName}`,
      category: newTopic.category
    });

    // Broadcast new topic via WebSocket
    try {
      const wsService = getWebSocketService();
      wsService.broadcastNewForumTopic({
        id: newTopic.id,
        title: newTopic.title,
        category: newTopic.category,
        author: newTopic.author,
        createdAt: newTopic.createdAt
      });
    } catch (error) {
      console.error('WebSocket broadcast failed:', error);
    }

    res.status(201).json({
      success: true,
      data: newTopic
    });
  } catch (error) {
    next(error);
  }
});

// Add reply to topic
router.post("/:id/replies", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    // Check if topic exists
    const topic = await prisma.forumTopic.findUnique({ where: { id } });
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const newReply = await prisma.forumReply.create({
      data: {
        content,
        topicId: id,
        authorId: userId
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            avatar: true
          }
        }
      }
    });

    // Update topic's updatedAt timestamp
    const updatedTopic = await prisma.forumTopic.update({
      where: { id },
      data: { updatedAt: new Date() },
      select: { title: true }
    });

    // Send email notifications for new reply
    await sendForumNotifications('newReply', {
      topicId: id,
      topicTitle: updatedTopic.title,
      authorId: userId,
      authorName: `${newReply.author.firstName} ${newReply.author.lastName}`,
      content: content
    });

    // Broadcast new reply via WebSocket
    try {
      const wsService = getWebSocketService();
      wsService.broadcastNewForumReply(id, {
        id: newReply.id,
        content: newReply.content,
        author: newReply.author,
        createdAt: newReply.createdAt
      });
    } catch (error) {
      console.error('WebSocket broadcast failed:', error);
    }

    res.status(201).json({
      success: true,
      data: newReply
    });
  } catch (error) {
    next(error);
  }
});

// Like/unlike topic
router.post("/:id/like", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if already liked
    const existingLike = await prisma.forumLike.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId: id
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.forumLike.delete({
        where: { id: existingLike.id }
      });
      res.json({ success: true, liked: false });
    } else {
      // Like
      await prisma.forumLike.create({
        data: {
          userId,
          topicId: id
        }
      });
      res.json({ success: true, liked: true });
    }
  } catch (error) {
    next(error);
  }
});

// Like/unlike reply
router.post("/replies/:replyId/like", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { replyId } = req.params;
    const userId = req.user!.id;

    // Check if already liked
    const existingLike = await prisma.forumLike.findUnique({
      where: {
        userId_replyId: {
          userId,
          replyId
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.forumLike.delete({
        where: { id: existingLike.id }
      });
      res.json({ success: true, liked: false });
    } else {
      // Like
      await prisma.forumLike.create({
        data: {
          userId,
          replyId
        }
      });
      res.json({ success: true, liked: true });
    }
  } catch (error) {
    next(error);
  }
});

// Create a study group
router.post("/study-groups", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { name, description, maxMembers, classId } = req.body;
    const userId = req.user!.id;

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" });
    }

    const studyGroup = await (prisma as any).studyGroup.create({
      data: {
        name,
        description,
        maxMembers: maxMembers || 10,
        classId,
        createdById: userId,
        members: {
          create: {
            userId,
            role: "ADMIN"
          }
        }
      },
      include: {
        members: true,
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: studyGroup
    });
  } catch (error) {
    next(error);
  }
});

// Get study groups
router.get("/study-groups", async (req, res, next) => {
  try {
    const { classId } = req.query;

    const where: any = {};
    if (classId) {
      where.classId = classId;
    }

    const studyGroups = await (prisma as any).studyGroup.findMany({
      where,
      include: {
        members: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true }
            }
          }
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true }
        },
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: studyGroups
    });
  } catch (error) {
    next(error);
  }
});

// Join a study group
router.post("/study-groups/:groupId/join", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user!.id;

    const studyGroup = await (prisma as any).studyGroup.findUnique({
      where: { id: groupId },
      include: { members: true }
    });

    if (!studyGroup) {
      return res.status(404).json({ error: "Study group not found" });
    }

    if (studyGroup.members.length >= studyGroup.maxMembers) {
      return res.status(400).json({ error: "Study group is full" });
    }

    await (prisma as any).studyGroupMember.create({
      data: {
        userId,
        studyGroupId: groupId,
        role: "MEMBER"
      }
    });

    res.json({
      success: true,
      message: "Joined study group successfully"
    });
  } catch (error) {
    next(error);
  }
});

// Leave a study group
router.post("/study-groups/:groupId/leave", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user!.id;

    await (prisma as any).studyGroupMember.deleteMany({
      where: {
        userId,
        studyGroupId: groupId
      }
    });

    res.json({
      success: true,
      message: "Left study group successfully"
    });
  } catch (error) {
    next(error);
  }
});

export default router;

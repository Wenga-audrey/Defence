import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export class WebSocketService {
  private io: SocketIOServer;
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket: any, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        });

        if (!user) {
          return next(new Error('User not found'));
        }

        socket.userId = user.id;
        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User ${socket.user?.firstName} ${socket.user?.lastName} connected`);
      
      // Store user connection
      if (socket.userId) {
        this.connectedUsers.set(socket.userId, socket.id);
      }

      // Join forum rooms
      socket.on('join-forum', (forumId: string) => {
        socket.join(`forum-${forumId}`);
        console.log(`User ${socket.userId} joined forum ${forumId}`);
      });

      // Leave forum rooms
      socket.on('leave-forum', (forumId: string) => {
        socket.leave(`forum-${forumId}`);
        console.log(`User ${socket.userId} left forum ${forumId}`);
      });

      // Join course rooms for teacher-student communication
      socket.on('join-course', (courseId: string) => {
        socket.join(`course-${courseId}`);
        console.log(`User ${socket.userId} joined course ${courseId}`);
      });

      // Leave course rooms
      socket.on('leave-course', (courseId: string) => {
        socket.leave(`course-${courseId}`);
        console.log(`User ${socket.userId} left course ${courseId}`);
      });

      // Handle typing indicators for forums
      socket.on('typing-start', (data: { forumId: string; topicId?: string }) => {
        socket.to(`forum-${data.forumId}`).emit('user-typing', {
          userId: socket.userId,
          userName: `${socket.user?.firstName} ${socket.user?.lastName}`,
          topicId: data.topicId
        });
      });

      socket.on('typing-stop', (data: { forumId: string; topicId?: string }) => {
        socket.to(`forum-${data.forumId}`).emit('user-stopped-typing', {
          userId: socket.userId,
          topicId: data.topicId
        });
      });

      // Handle private messages between teachers and students
      socket.on('send-private-message', async (data: {
        recipientId: string;
        message: string;
        courseId?: string;
      }) => {
        try {
          // Save message to database
          const message = await prisma.privateMessage.create({
            data: {
              senderId: socket.userId!,
              recipientId: data.recipientId,
              content: data.message,
              courseId: data.courseId
            },
            include: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true
                }
              }
            }
          });

          // Send to recipient if online
          const recipientSocketId = this.connectedUsers.get(data.recipientId);
          if (recipientSocketId) {
            this.io.to(recipientSocketId).emit('new-private-message', {
              id: message.id,
              content: message.content,
              sender: message.sender,
              createdAt: message.createdAt,
              courseId: message.courseId
            });
          }

          // Confirm to sender
          socket.emit('message-sent', {
            id: message.id,
            tempId: data.tempId // For client-side message matching
          });
        } catch (error) {
          socket.emit('message-error', { error: 'Failed to send message' });
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`User ${socket.user?.firstName} ${socket.user?.lastName} disconnected`);
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
        }
      });
    });
  }

  // Broadcast new forum topic to all users in forum
  public broadcastNewForumTopic(topicData: {
    id: string;
    title: string;
    category: string;
    author: {
      id: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    createdAt: Date;
  }) {
    this.io.emit('new-forum-topic', topicData);
  }

  // Broadcast new forum reply to users in specific topic
  public broadcastNewForumReply(topicId: string, replyData: {
    id: string;
    content: string;
    author: {
      id: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    createdAt: Date;
  }) {
    this.io.to(`forum-topic-${topicId}`).emit('new-forum-reply', {
      topicId,
      reply: replyData
    });
  }

  // Broadcast forum like/unlike
  public broadcastForumLike(topicId: string, likeData: {
    userId: string;
    userName: string;
    liked: boolean;
    totalLikes: number;
  }) {
    this.io.emit('forum-like-update', {
      topicId,
      ...likeData
    });
  }

  // Send notification to specific user
  public sendNotificationToUser(userId: string, notification: {
    type: 'forum' | 'course' | 'assessment' | 'message';
    title: string;
    message: string;
    data?: any;
  }) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('notification', notification);
    }
  }

  // Broadcast to course members (teachers and enrolled students)
  public broadcastToCourse(courseId: string, event: string, data: any) {
    this.io.to(`course-${courseId}`).emit(event, data);
  }

  // Get online users count
  public getOnlineUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get online users in a specific room
  public async getOnlineUsersInRoom(room: string): Promise<string[]> {
    const sockets = await this.io.in(room).fetchSockets();
    return sockets.map(socket => (socket as any).userId).filter(Boolean);
  }
}

let webSocketService: WebSocketService;

export function initializeWebSocket(server: HTTPServer): WebSocketService {
  webSocketService = new WebSocketService(server);
  return webSocketService;
}

export function getWebSocketService(): WebSocketService {
  if (!webSocketService) {
    throw new Error('WebSocket service not initialized');
  }
  return webSocketService;
}

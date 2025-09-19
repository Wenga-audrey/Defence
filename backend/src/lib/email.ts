import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email credentials not configured. Email not sent.');
      return false;
    }

    await transporter.sendMail({
      from: `"Mindboost Learning" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Forum notification templates
export const forumEmailTemplates = {
  newReply: (topicTitle: string, replyAuthor: string, replyContent: string, topicUrl: string) => ({
    subject: `New reply in "${topicTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Mindboost Learning</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">New Reply in Forum Discussion</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #667eea; margin-top: 0;">${topicTitle}</h3>
            <p style="color: #666; margin-bottom: 15px;"><strong>${replyAuthor}</strong> replied:</p>
            <div style="background: #f1f3f4; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea;">
              ${replyContent.substring(0, 200)}${replyContent.length > 200 ? '...' : ''}
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${topicUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              View Discussion
            </a>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>You're receiving this because you're following this discussion.</p>
          <p>© 2024 Mindboost Learning Platform</p>
        </div>
      </div>
    `,
    text: `New reply in "${topicTitle}"\n\n${replyAuthor} replied:\n${replyContent}\n\nView the full discussion: ${topicUrl}`
  }),

  newTopic: (topicTitle: string, topicAuthor: string, category: string, topicUrl: string) => ({
    subject: `New discussion: "${topicTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Mindboost Learning</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">New Forum Discussion</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <span style="background: #667eea; color: white; padding: 4px 12px; border-radius: 15px; font-size: 12px; margin-right: 10px;">${category}</span>
              <span style="color: #666;">by ${topicAuthor}</span>
            </div>
            <h3 style="color: #333; margin: 0;">${topicTitle}</h3>
          </div>
          
          <div style="text-align: center;">
            <a href="${topicUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Join Discussion
            </a>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>You're receiving this because you're subscribed to ${category} discussions.</p>
          <p>© 2024 Mindboost Learning Platform</p>
        </div>
      </div>
    `,
    text: `New discussion in ${category}: "${topicTitle}" by ${topicAuthor}\n\nJoin the discussion: ${topicUrl}`
  })
};

// Send forum notifications
export async function sendForumNotifications(
  type: 'newReply' | 'newTopic',
  data: {
    topicId: string;
    topicTitle: string;
    authorId: string;
    authorName: string;
    content?: string;
    category?: string;
  }
) {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const topicUrl = `${baseUrl}/forum/${data.topicId}`;

    let recipients: string[] = [];

    if (type === 'newReply') {
      // Get topic author and other participants
      const topic = await prisma.forumTopic.findUnique({
        where: { id: data.topicId },
        include: {
          author: { select: { email: true } },
          replies: {
            include: {
              author: { select: { email: true } }
            }
          }
        }
      });

      if (topic) {
        recipients = [topic.author.email];
        // Add unique reply authors
        topic.replies.forEach(reply => {
          if (!recipients.includes(reply.author.email) && reply.author.email !== data.authorName) {
            recipients.push(reply.author.email);
          }
        });
      }

      const template = forumEmailTemplates.newReply(
        data.topicTitle,
        data.authorName,
        data.content || '',
        topicUrl
      );

      // Send to all recipients
      for (const email of recipients) {
        await sendEmail({
          to: email,
          subject: template.subject,
          html: template.html,
          text: template.text
        });
      }
    } else if (type === 'newTopic') {
      // Get users subscribed to this category (instructors and interested students)
      const subscribedUsers = await prisma.user.findMany({
        where: {
          OR: [
            { role: 'INSTRUCTOR' },
            { role: 'ADMIN' }
          ]
        },
        select: { email: true }
      });

      recipients = subscribedUsers.map(user => user.email);

      const template = forumEmailTemplates.newTopic(
        data.topicTitle,
        data.authorName,
        data.category || 'General',
        topicUrl
      );

      // Send to all recipients
      for (const email of recipients) {
        await sendEmail({
          to: email,
          subject: template.subject,
          html: template.html,
          text: template.text
        });
      }
    }

    console.log(`Forum notifications sent to ${recipients.length} recipients`);
    return true;
  } catch (error) {
    console.error('Failed to send forum notifications:', error);
    return false;
  }
}

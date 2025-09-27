import { prisma } from "../lib/prisma";

export async function sendNotificationToLearner(learnerId: string, message: string, type: string = "info") {
  // TODO: Implement actual notification sending logic
  // This could integrate with email, SMS, push notifications, etc.

  console.log(`Sending notification to learner ${learnerId}: ${message} (${type})`);

  // Example: Save notification to database if there's a notifications table
  try {
    // If there's a notifications table, save the notification
    // await prisma.notification.create({
    //   data: {
    //     userId: learnerId,
    //     message,
    //     type,
    //     read: false,
    //     createdAt: new Date()
    //   }
    // });
  } catch (error) {
    console.error("Failed to save notification:", error);
  }

  return { success: true, message: "Notification sent" };
}

export async function sendNotificationToMultipleLearners(learnerIds: string[], message: string, type: string = "info") {
  const results = [];

  for (const learnerId of learnerIds) {
    try {
      const result = await sendNotificationToLearner(learnerId, message, type);
      results.push({ learnerId, ...result });
    } catch (error) {
      results.push({ learnerId, success: false, error: error.message });
    }
  }

  return results;
}

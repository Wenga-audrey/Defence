import { Server } from "ws";
import prisma from "../prisma";

const wss = new Server({ noServer: true });
const clients: { [userId: string]: Set<any> } = {};

wss.on("connection", (ws, req) => {
  const userId = new URLSearchParams(req.url?.split("?")[1]).get("userId");
  if (!userId) return ws.close();

  if (!clients[userId]) clients[userId] = new Set();
  clients[userId].add(ws);

  ws.on("close", () => {
    clients[userId].delete(ws);
    if (clients[userId].size === 0) delete clients[userId];
  });
});

// Use this function whenever a new notification is created
export async function pushNotification(userId: string, notification: any) {
  await prisma.notification.create({ data: { userId, ...notification } });
  if (clients[userId]) {
    for (const ws of clients[userId]) {
      ws.send(JSON.stringify(notification));
    }
  }
}

export { wss };
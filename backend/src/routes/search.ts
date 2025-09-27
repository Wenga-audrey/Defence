import { Router } from "express";
import prisma from "../prisma";

const router = Router();

router.get("/search", async (req, res) => {
  const { q, page = 1 } = req.query;
  const take = 10;
  const skip = (Number(page) - 1) * take;

  // Fuzzy search for users, lessons, content
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: q as string, mode: "insensitive" } },
        { email: { contains: q as string, mode: "insensitive" } },
      ],
    },
    take,
    skip,
  });
  const lessons = await prisma.lesson.findMany({
    where: {
      title: { contains: q as string, mode: "insensitive" },
    },
    take,
    skip,
  });
  const content = await prisma.content.findMany({
    where: {
      title: { contains: q as string, mode: "insensitive" },
    },
    take,
    skip,
  });

  // Format for frontend
  const results = [
    ...users.map(u => ({ id: u.id, type: "User", name: u.name, link: `/users/${u.id}` })),
    ...lessons.map(l => ({ id: l.id, type: "Lesson", title: l.title, link: `/lessons/${l.id}` })),
    ...content.map(c => ({ id: c.id, type: "Content", title: c.title, link: `/content/${c.id}` })),
  ];

  res.json({ success: true, results, page: Number(page), hasMore: results.length === take });
});

export default router;
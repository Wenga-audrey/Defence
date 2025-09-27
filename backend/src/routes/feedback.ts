import { Router } from "express";
// import { prisma } from "../lib/prisma";

const router = Router();

// TODO: Create feedback model in Prisma schema
// // Fetch feedback needing response
// router.get("/feedback/pending", async (req, res) => {
//   const feedbacks = await prisma.feedback.findMany({
//     where: { responded: false },
//     include: { learner: true, subject: true },
//     orderBy: { createdAt: "desc" },
//     take: 20,
//   });
//   res.json({ success: true, feedbacks });
// });

// // Respond to feedback
// router.post("/feedback/:id/respond", async (req, res) => {
//   const { response } = req.body;
//   await prisma.feedback.update({
//     where: { id: req.params.id },
//     data: { response, responded: true, respondedAt: new Date() },
//   });
//   res.json({ success: true });
// });

export default router;
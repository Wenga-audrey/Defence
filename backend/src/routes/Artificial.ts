import { Router } from "express";
import { generateAIQuiz, recommendStudyPlan, aiFeedback } from "../../services/ai";

const router = Router();

router.post("/generate-quiz", async (req, res, next) => {
  try {
    const { classId, subjectId, chapterId, topic } = req.body;
    const questions = await generateAIQuiz({ classId, subjectId, chapterId, topic });
    res.json({ success: true, questions });
  } catch (err) {
    next(err);
  }
});

router.get("/recommendations/:learnerId", async (req, res, next) => {
  try {
    const learnerId = req.params.learnerId;
    const recommendations = await recommendStudyPlan(learnerId);
    res.json({ success: true, recommendations });
  } catch (err) {
    next(err);
  }
});

router.post("/feedback/:quizId", async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const { answers } = req.body;
    const feedback = await aiFeedback(quizId, answers);
    res.json({ success: true, feedback });
  } catch (err) {
    next(err);
  }
});

export default router;
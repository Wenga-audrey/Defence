import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// Approve institutional agreement
router.post("/licensing/approve", async (req, res, next) => {
  try {
    const { institutionId, terms } = req.body;
    await prisma.institution.update({ where: { id: institutionId }, data: { licensed: true, licenseTerms: terms } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// List licensed institutions
router.get("/licensing/list", async (req, res, next) => {
  try {
    const institutions = await prisma.institution.findMany({ where: { licensed: true } });
    res.json({ success: true, institutions });
  } catch (err) {
    next(err);
  }
});

export default router;
import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import {
  getTeams,
  updateLotteryRanks
} from "../controllers/teamController";

const router = Router();

router.get("/", authenticateJWT, getTeams);
router.put("/update-lottery-ranks", authenticateJWT, updateLotteryRanks);

export default router;

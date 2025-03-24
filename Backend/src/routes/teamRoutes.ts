import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import {
  getTeams,
  setDraftedPlayers,
  updateLotteryRanks
} from "../controllers/teamController";

const router = Router();

router.get("/", authenticateJWT, getTeams);
router.put("/draft/:playerId", authenticateJWT, setDraftedPlayers);
router.put("/update-lottery-ranks", authenticateJWT, updateLotteryRanks);

export default router;

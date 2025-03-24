import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import {
  getPlayers,
  changeAddedStatus
} from "../controllers/playerController";

const router = Router();

router.get("/", authenticateJWT, getPlayers);
router.put("/change_added_status/:playerId", authenticateJWT, changeAddedStatus);

export default router;

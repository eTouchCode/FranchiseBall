import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import {
  getPlayers,
  setPlayerAsDraft,
  changeAddedStatus
} from "../controllers/playerController";

const router = Router();

router.get("/", authenticateJWT, getPlayers);
router.put("/draft/:playerId", authenticateJWT, setPlayerAsDraft);
router.put("/change_added_status/:playerId", authenticateJWT, changeAddedStatus);

export default router;

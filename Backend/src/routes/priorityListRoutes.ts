import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { getPriorityLists, savePriorityLists } from "../controllers/priorityListController";

const router = Router();

router.get('/', authenticateJWT, getPriorityLists);
router.post("/", authenticateJWT, savePriorityLists);

export default router;

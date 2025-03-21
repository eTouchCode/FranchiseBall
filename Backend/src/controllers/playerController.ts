import { Request, Response } from "express";
import Player from "../models/Player";

export const getPlayers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" }) as unknown as Promise<void>;
    }

    const players = await Player.find();
    res.status(200).json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const setPlayerAsDraft = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" }) as unknown as Promise<void>;
    }

    const playerId = req.params.playerId;
    const {isDrafted} = req.body;

    const player = await Player.findOneAndUpdate(
      {_id: playerId},
      {'isDrafted': isDrafted},
      {new: true}
    );

    if (!player) {
      res.status(404).json({ message: "Player not found." });
      return;
    }

    const players = await Player.find();
    res.status(200).json({
      message: isDrafted ? 'Player setted as draft successfully!' : 'Playered removed successfully!',
      players: players
    })

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
}

export const changeAddedStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" }) as unknown as Promise<void>;
    }

    const playerId = req.params.playerId;
    const {isAdded} = req.body;

    const player = await Player.findOneAndUpdate(
      {_id: playerId},
      {'isAdded': isAdded},
      {new: true}
    );

    if (!player) {
      res.status(404).json({"message": "Player not found."});
    }

    const players = await Player.find();
    res.status(200).json({
      message: isAdded === true ? "Player added successfully" : "Player removed successfully",
      players: players
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
}
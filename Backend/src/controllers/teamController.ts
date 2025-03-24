import { Request, Response } from "express";
import Team from "../models/Team";
import Player from "../models/Player";

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" }) as unknown as Promise<void>;
    }

    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const updateLotteryRanks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teams } = req.body;

    if (!Array.isArray(teams)) {
      res.status(400).json({ message: "Invalid input format. Expected an array of teams." });
      return;
    }

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      const { _id } = team;

      if (!_id) {
        res.status(400).json({ message: "Each team must have an _id." });
        return;
      }

      await Team.findByIdAndUpdate(_id, { lottery_rank: i }, { new: true });
    }

    res.status(200).json({ message: "Lottery setted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const setDraftedPlayers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" }) as unknown as Promise<void>;
    }

    const playerId = req.params.playerId;
    const {isDrafted, teamId} = req.body;

    const player = await Player.findById(playerId);

    if (!player) {
      res.status(400).json({message: "Player not found in the database."});
    }

    const team = await Team.findById(teamId);

    if (!team) {
      res.status(400).json({message: "Team not found in the database."});
    }

    if (isDrafted) {
      team?.drafted_players?.push(playerId);
    } else {
      if (team?.drafted_players) {
        team.drafted_players = team.drafted_players.filter(id => id.toString() !== playerId);
      }
    }

    await team?.save();

    const teams = await Team.find();

    res.status(200).json({
      message: isDrafted ? 'Player set as draft successfully!' : 'Player removed from draft successfully!',
      teams: teams
    })

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
}
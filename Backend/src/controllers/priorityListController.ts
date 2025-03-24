import { Request, Response } from "express";
import PriorityLists from "../models/PriorityList";
import { IPlayer } from "../models/Player";
import Player from "../models/Player";

export const getPriorityLists = async (req: Request, res: Response): Promise<void> => {
  try {
    const priorityListDoc = await PriorityLists.findOne(); 

    if (!priorityListDoc) {
      res.status(200).json({ priorityLists: {} });
      return;
    }

    let priorityLists = priorityListDoc.priorityLists;
    
    if (priorityLists instanceof Map) {
      priorityLists = Object.fromEntries(priorityLists);
    }
    
    const populatedPriorityLists: { [teamId: string]: any[] } = {};

    for (const [teamId, playerIds] of Object.entries(priorityLists)) {
      const players = await Player.find({ '_id': { $in: playerIds } }).exec();
      populatedPriorityLists[teamId] = players;
    }

    res.status(200).json({
      message: "Priority lists saved successfully.",
      priorityLists: populatedPriorityLists
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
}

export const savePriorityLists = async (req: Request, res: Response): Promise<void> => {
  try {
    const { priorityLists }: { priorityLists: { [teamId: string]: IPlayer[] } } = req.body;

    if (!priorityLists || Object.keys(priorityLists).length === 0) {
      res.status(400).json({ message: "Priority lists are required." });
      return;
    }

    await PriorityLists.collection.drop().catch(() => {});

    const updatedPriorityLists: { [teamId: string]: any[] } = {};

    for (const [teamId, players] of Object.entries(priorityLists)) {
      const playerIds: string[] = [];

      for (const player of players) {
        let playerDoc = await Player.findOne({ link: player.link });
        if (!playerDoc) {
          playerDoc = new Player(player);
          await playerDoc.save();
        }
        playerIds.push(playerDoc._id.toString());
      }

      updatedPriorityLists[teamId] = playerIds;
    }

    const newPriorityList = new PriorityLists({
      priorityLists: updatedPriorityLists
    });

    await newPriorityList.save();

    const populatedPriorityLists: { [teamId: string]: any[] } = {};
    
    for (const [teamId, playerIds] of Object.entries(updatedPriorityLists)) {
      const players = await Player.find({ '_id': { $in: playerIds } });
      populatedPriorityLists[teamId] = players;
    }

    res.status(200).json({
      message: "Priority lists saved successfully.",
      priorityLists: populatedPriorityLists
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
}
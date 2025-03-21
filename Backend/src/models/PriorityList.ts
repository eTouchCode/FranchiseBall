import mongoose, { Schema, Document } from "mongoose";
import { IPlayer } from "./Player";

export interface IPriorityLists extends Document {
  priorityLists: {
    [teamId: string]: IPlayer[];
  };
}

const PriorityListsSchema = new Schema({
  priorityLists: {
    type: Map,
    of: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
    required: true
  }
});

const PriorityLists = mongoose.model<IPriorityLists>("PriorityLists", PriorityListsSchema);

export default PriorityLists;

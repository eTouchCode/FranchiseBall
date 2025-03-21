import mongoose, {Schema, Document} from "mongoose";

export interface ITeam extends Document {
  name: string;
  win: number;
  loss: number;
  runs_differential: number;
  avg: number;
  obp: number;
  era: number;
  whip: number;
  team_rank: number;
  runs_on: number;
  world_titles: number;
  league_titles: number;
  division_titles: number;
  weighted_score: number;
  lottery_rank?: number;
}

const TeamSchema = new Schema({
  name: {
    type: String,
    requried: true,
    unique: true
  },
  win: {
    type: Number,
    required: true
  },
  loss: {
    type: Number,
    required: true
  },
  runs_differential: {
    type: Number,
    required: true
  },
  avg: {
    type: Number,
    required: true
  },
  obp: {
    type: Number,
    required: true
  },
  era: {
    type: Number,
    required: true
  },
  whip: {
    type: Number,
    required: true
  },
  team_rank: {
    type: Number,
    required: true
  },
  runs_on: {
    type: Number,
    required: true
  },
  world_titles: {
    type: Number,
    required: true
  },
  league_titles: {
    type: Number,
    required: true
  },
  division_titles: {
    type: Number,
    required: true
  },
  weighted_score: {
    type: Number,
    required: true
  },
  lottery_rank: {
    type: Number
  }
})

const Team = mongoose.model<ITeam>("Team", TeamSchema);

export default Team;
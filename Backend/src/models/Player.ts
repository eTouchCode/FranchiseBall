import mongoose, {Schema, Document} from "mongoose";

export interface IPlayer extends Document {
  _id: string;
  link: string;
  name: string;
  position: string;
  age: number;
  control: number;
  movement: number;
  velocity: number;
  stamina: number;
  power: number;
  contact: number;
  speed: number;
  defense: number;
  isDrafted?: boolean;
  isAdded?: boolean;
}

const PlayerSchema = new Schema({
  link: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  position: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  control: {
    type: Number
  },
  movement: {
    type: Number
  },
  velocity: {
    type: Number
  },
  stamina: {
    type: Number
  },
  power: {
    type: Number
  },
  contact: {
    type: Number
  },
  speed: {
    type: Number
  },
  defense: {
    type: Number
  },
  isDrafted: {
    type: Boolean
  },
  isAdded: {
    type: Boolean
  }
})

const Player = mongoose.model<IPlayer>("Player", PlayerSchema);

export default Player;
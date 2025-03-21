import express, { Application } from "express";
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from "./config/dbConfig";

import authRoutes from './routes/authRoutes';
import playerRoutes from './routes/playerRoutes';
import teamRoutes from './routes/teamRoutes';
import priorityListRoutes from './routes/priorityListRoutes';

import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/player", playerRoutes);
app.use("/api/v1/team", teamRoutes);
app.use('/api/v1/priority_list', priorityListRoutes);

app.use(errorHandler);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prisma.js';

import userRouter from './routes/user.routes.js';

dotenv.config();

const app = express();
const { Request, Response } = express;

// middlewares
app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);

app.get('/', async(req, res) => {
    res.send("Welcome to meal tracker api");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
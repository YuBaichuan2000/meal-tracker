import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRouter from './routes/user.routes.js';
import ingredientRouter from './routes/ingredient.routes.js';
import dishRouter from './routes/dish.routes.js';
import menuRouter from './routes/menu.routes.js'

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/ingredients', ingredientRouter);
app.use('/api/dishes', dishRouter);
app.use('/api/menu', menuRouter);


app.get('/', async(req, res) => {
    res.send("Welcome to meal tracker api");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
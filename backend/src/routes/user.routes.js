import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();


// CREATE user
router.post('/', async (req, res) => {
    try  {
        const newUser = await prisma.user.create({
            data: {username, email, password},
        });
        res.json(newUser);
    } catch (error) {
        res.status(500).json({error: 'Error creating user'});
    }
});

// READ User
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({error: "Error fetching users"});
    }
});

export default router;
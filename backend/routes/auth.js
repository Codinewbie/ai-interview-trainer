// routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const secret = process.env.JWT_SECRET || 'yourSuperSecretKey';

router.post('/login', (req, res) => {
  const { userId, name } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ message: 'userId and name required' });
  }

  const token = jwt.sign({ userId, name }, secret, { expiresIn: '2h' });

  res.json({ token });
});

export default router;

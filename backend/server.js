import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import interviewRoutes from './routes/interviewRoutes.js';
import auth from './routes/auth.js'; // ✅ Add this line
import pdfRoutes from './routes/pdfRoutes.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// ✅ Register your routes
app.use('/api/interview', interviewRoutes);
app.use('/api', auth); // ✅ Mount the auth routes here
app.use('/api', pdfRoutes); // ✅ Add this line

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

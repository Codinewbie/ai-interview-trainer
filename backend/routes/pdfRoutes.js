// routes/pdfRoutes.js
import express from 'express';
import { generatePDF } from '../controllers/pdfController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/interview/export-pdf', authenticateToken, generatePDF);

export default router;

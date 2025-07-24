// routes/interviewRoutes.js
import express from 'express';
import {
  startInterview,
  submitAnswer,
  getHistory,
  saveSummary
} from '../controllers/interviewController.js';
import { exportSummaryAsPDF } from '../controllers/exportSummaryAsPDF.js';
import authenticateToken from '../middleware/auth.js'; // ✅ Use `import`

const router = express.Router();

router.get('/export-pdf', authenticateToken, exportSummaryAsPDF);
router.post('/start', authenticateToken, startInterview);
router.post('/answer', authenticateToken, submitAnswer);
router.get('/history/:userId', authenticateToken, getHistory);
router.post('/summary', authenticateToken, saveSummary);

export default router;

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import InterviewSession from '../models/InterviewSession.js'; // adjust path to your model

export const generatePDF = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Ensure exports folder exists
    const exportDir = './exports';
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    const doc = new PDFDocument();
    const filePath = `${exportDir}/session-${Date.now()}.pdf`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(20).text('AI Interview Session Summary', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Summary: ${session.summary}`);
    doc.moveDown();
    doc.fontSize(14).text(`Skill Score: ${session.skillScore}/100`);
    doc.moveDown(1.5);

    // Questions
    session.questions.forEach((q, index) => {
      doc.fontSize(14).text(`Q${index + 1}: ${q.question}`, { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(`Answer: ${q.answer}`);
      doc.moveDown(0.3);
      doc.text(`Strengths: ${q.feedback?.strengths || 'N/A'}`);
      doc.moveDown(0.3);
      doc.text(`Improvements: ${q.feedback?.improvements || 'N/A'}`);
      doc.moveDown(0.3);
      doc.text(`Rating: ${q.feedback?.rating ?? 'N/A'}/10`);
      doc.moveDown(1);
    });

    doc.end();

    stream.on('finish', () => {
      res.download(filePath, 'SessionSummary.pdf', (err) => {
        if (err) console.error('Download error:', err);
        fs.unlinkSync(filePath); // clean up
      });
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};

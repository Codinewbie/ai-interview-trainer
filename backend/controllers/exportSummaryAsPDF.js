import PDFDocument from 'pdfkit';
import InterviewSession from '../models/InterviewSession.js';

export const exportSummaryAsPDF = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required in the request body.' });
    }

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'No session found with the provided ID.' });
    }

    console.log('Fetched skillScore:', session);

    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          'Content-Length': Buffer.byteLength(pdfData),
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=interview_summary.pdf',
        })
        .end(pdfData);
    });

    // --- PDF Content ---
    doc.fontSize(20).font('Helvetica-Bold').text('Interview Session Summary', { align: 'center' });
    doc.moveDown();

    session.questions.forEach((q, index) => {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('black').text(`Q${index + 1}: ${q.question}`);

      doc.fontSize(12).font('Helvetica-Bold').fillColor('black').text('Answer:', { continued: true });
      doc.font('Helvetica').fillColor('blue').text(` ${q.answer || 'N/A'}`);

      const hasFeedback = q.feedback && Object.keys(q.feedback).length > 0;

      if (hasFeedback && q.feedback.strengths.length) {
        const { rating, strengths, improvements } = q.feedback;

        doc.moveDown();
        doc.fontSize(12).font('Helvetica-Bold').fillColor('black').text('AI Feedback:');

        doc.fontSize(12)
          .font('Helvetica-Bold').text('- Rating:', { continued: true })
          .font('Helvetica').text(` ${rating ?? 'N/A'}`);

        doc.font('Helvetica-Bold').text('- Strengths:', { continued: true });
        doc.font('Helvetica').text(` ${Array.isArray(strengths) ? strengths.join(', ') : strengths || 'N/A'}`);

        doc.font('Helvetica-Bold').text('- Improvements:', { continued: true });
        doc.font('Helvetica').text(` ${Array.isArray(improvements) ? improvements.join(', ') : improvements || 'N/A'}`);
      } else {
        doc.fontSize(12).font('Helvetica-Bold').fillColor('black').text('AI Feedback: N/A');
      }

      doc.moveDown();
    });

    doc.moveDown();
    doc.fontSize(14).font('Helvetica-Bold').fillColor('black').text(`Skill Score Impact Estimate:`, { continued: true });
    doc.font('Helvetica').text(` ${session.skillScore ?? 'Not available'}`);
    doc.end();

  } catch (error) {
    console.error('PDF Export Error:', error);
    res.status(500).json({ message: 'Error exporting PDF.' });
  }
};

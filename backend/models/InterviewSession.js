import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  rating: Number,
  comments: String,
  strengths: [String],
  improvements: [String],
});

const QuestionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  feedback: FeedbackSchema,
});

const InterviewSessionSchema = new mongoose.Schema({
  userId: String,
  role: String,
  questions: [QuestionSchema],
  startedAt: Date,
  completedAt: Date,
  skillScore: Number,
  summary: String,
  skillTags: [String],
});

export default mongoose.model('InterviewSession', InterviewSessionSchema);

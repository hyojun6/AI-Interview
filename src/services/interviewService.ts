import axios from 'axios';
import { InterviewConfig, Question, InterviewSession, InterviewResult } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

class InterviewService {
  async generateQuestions(config: InterviewConfig): Promise<Question[]> {
    const response = await axios.post(`${API_BASE_URL}/generate-questions`, config);
    return response.data.questions;
  }

  async evaluateAnswer(
    question: string,
    answer: string,
    field: string,
    difficulty: string
  ): Promise<{ feedback: string; score: number }> {
    const response = await axios.post(`${API_BASE_URL}/evaluate-answer`, {
      question,
      answer,
      field,
      difficulty,
    });
    return response.data;
  }

  async getResults(session: InterviewSession): Promise<InterviewResult> {
    const response = await axios.post(`${API_BASE_URL}/get-results`, {
      session_id: session.id,
      answers: session.answers,
      config: session.config,
    });
    return response.data;
  }
}

export const interviewService = new InterviewService();
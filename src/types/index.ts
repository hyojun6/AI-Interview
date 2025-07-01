export interface InterviewConfig {
  field: string;
  difficulty: '초급' | '중급' | '고급';
  questionCount: number;
}

export interface Question {
  id: string;
  question: string;
  context?: string;
}

export interface Answer {
  questionId: string;
  answer: string;
  feedback?: string;
  score?: number;
}

export interface InterviewSession {
  id: string;
  config: InterviewConfig;
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  status: 'setup' | 'in-progress' | 'completed';
  startTime: Date;
  endTime?: Date;
}

export interface InterviewResult {
  totalQuestions: number;
  averageScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}
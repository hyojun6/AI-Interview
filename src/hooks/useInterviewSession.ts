import { useState, useCallback } from 'react';
import { InterviewSession, InterviewConfig, Question, Answer, InterviewResult } from '../types';
import { interviewService } from '../services/interviewService';

export const useInterviewSession = () => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startInterview = useCallback(async (config: InterviewConfig) => {
    setLoading(true);
    setError(null);

    try {
      const questions = await interviewService.generateQuestions(config);
      const newSession: InterviewSession = {
        id: Date.now().toString(),
        config,
        questions,
        answers: [],
        currentQuestionIndex: 0,
        status: 'in-progress',
        startTime: new Date(),
      };
      setSession(newSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async (answer: string) => {
    if (!session) return;

    setLoading(true);
    try {
      const currentQuestion = session.questions[session.currentQuestionIndex];
      const feedback = await interviewService.evaluateAnswer(
        currentQuestion.question,
        answer,
        session.config.field,
        session.config.difficulty
      );

      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        answer,
        feedback: feedback.feedback,
        score: feedback.score,
      };

      const updatedSession = {
        ...session,
        answers: [...session.answers, newAnswer],
        currentQuestionIndex: session.currentQuestionIndex + 1,
        status: session.currentQuestionIndex + 1 >= session.questions.length ? 'completed' as const : 'in-progress' as const,
        endTime: session.currentQuestionIndex + 1 >= session.questions.length ? new Date() : undefined,
      };

      setSession(updatedSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  }, [session]);

  const getResults = useCallback(async (): Promise<InterviewResult | null> => {
    if (!session || session.status !== 'completed') return null;

    try {
      return await interviewService.getResults(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get results');
      return null;
    }
  }, [session]);

  const resetInterview = useCallback(() => {
    setSession(null);
    setError(null);
  }, []);

  return {
    session,
    loading,
    error,
    startInterview,
    submitAnswer,
    getResults,
    resetInterview,
  };
};
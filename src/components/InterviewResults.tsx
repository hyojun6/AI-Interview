import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { InterviewSession, InterviewResult } from '../types';

interface InterviewResultsProps {
  session: InterviewSession;
  getResults: () => Promise<InterviewResult | null>;
  onRestart: () => void;
}

export const InterviewResults: React.FC<InterviewResultsProps> = ({ 
  session, 
  getResults, 
  onRestart 
}) => {
  const [results, setResults] = useState<InterviewResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const result = await getResults();
      setResults(result);
      setLoading(false);
    };
    
    fetchResults();
  }, [getResults]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">인터뷰 결과를 분석 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-95">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">인터뷰 완료!</h1>
            <p className="text-gray-600">
              {session.config.field} 분야 인터뷰 연습을 완료하셨습니다.
            </p>
          </div>
        </div>

        {results && (
          <>
            {/* Overall Score */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 backdrop-blur-sm bg-opacity-95">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBackground(results.averageScore)} mb-6`}>
                  <span className={`text-3xl font-bold ${getScoreColor(results.averageScore)}`}>
                    {Math.round(results.averageScore)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">전체 점수</h2>
                <p className="text-gray-600 mb-6">{results.feedback}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-600">{results.totalQuestions}</div>
                    <div className="text-sm text-blue-800">답변한 질문 수</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-green-600">{session.config.difficulty}</div>
                    <div className="text-sm text-green-800">난이도</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-purple-600">{session.config.field}</div>
                    <div className="text-sm text-purple-800">분야</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm bg-opacity-95">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">강점</h3>
                </div>
                <ul className="space-y-2">
                  {results.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm bg-opacity-95">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">개선이 필요한 부분</h3>
                </div>
                <ul className="space-y-2">
                  {results.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 backdrop-blur-sm bg-opacity-95">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 text-orange-600 mr-2" />
                질문별 피드백
              </h3>
              <div className="space-y-4">
                {session.answers.map((answer, index) => (
                  <div key={answer.questionId} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">질문 {index + 1}</h4>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        answer.score ? getScoreBackground(answer.score) : 'bg-gray-100'
                      } ${answer.score ? getScoreColor(answer.score) : 'text-gray-600'}`}>
                        {answer.score ? `${Math.round(answer.score)}점` : '채점 대기 중'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {session.questions[index]?.question}
                    </p>
                    {answer.feedback && (
                      <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                        {answer.feedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            <span>새로운 인터뷰 시작</span>
          </button>
        </div>
      </div>
    </div>
  );
};

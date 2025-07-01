import React, { useState } from 'react';
import { MessageSquare, User, Send, ArrowRight } from 'lucide-react';
import { InterviewSession as InterviewSessionType } from '../types';

interface InterviewSessionProps {
  session: InterviewSessionType;
  onSubmitAnswer: (answer: string) => void;
  loading: boolean;
}

export const InterviewSession: React.FC<InterviewSessionProps> = ({ 
  session,
  onSubmitAnswer, 
  loading 
}) => {
  const [answer, setAnswer] = useState('');
  const currentQuestion = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmitAnswer(answer.trim());
      setAnswer('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 backdrop-blur-sm bg-opacity-95">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {session.config.field} 면접
                </h1>
                <p className="text-gray-600 capitalize">
                  {session.config.difficulty} 난이도
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">질문</div>
              <div className="text-xl font-bold text-gray-900">
                {session.currentQuestionIndex + 1} / {session.questions.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 backdrop-blur-sm bg-opacity-95">
          <div className="flex items-start space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">면접관</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-lg text-gray-800 leading-relaxed">
                  {currentQuestion?.question}
                </p>
                {currentQuestion?.context && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Context:</strong> {currentQuestion.context}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Answer Input */}
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-95">
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">답변</h2>
              <div className="space-y-4">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="대답을 작성해주세요."
                  className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800"
                  disabled={loading}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">          
                    <div className="text-sm text-gray-600">
                      글자수 : {answer.length}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={!answer.trim() || loading}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>제출중..</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>제출</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 면접 팁</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• STAR 기법(상황, 과제, 행동, 결과)을 활용하면 더 설득력 있는 답변이 됩니다.</li>
            <li>• 구체적인 사례나 경험을 들어 설명해보세요.</li>
            <li>• 자신감을 갖고 답변하세요. 완벽한 답보다 당신만의 생각과 표현이 더 중요합니다.</li>
            <li>• 똑바로 앉고, 시선은 정면을 향하게 하세요.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
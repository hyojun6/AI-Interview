import React, { useState } from 'react';
import { Settings, Users, Brain, Target, Play, ArrowLeft, Sparkles } from 'lucide-react';
import { InterviewConfig } from '../types';

interface InterviewSetupProps {
  onStart: (config: InterviewConfig) => void;
  onBack: () => void;
  loading: boolean;
}

const fields = [
  { 
    id: 'technology', 
    name: '기술 면접', 
    icon: Brain, 
    description: '프로그래밍, 시스템 설계, 기술 문제 해결',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'business', 
    name: '비즈니스', 
    icon: Target, 
    description: '전략, 경영, 리더십 및 비즈니스 역량',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'general', 
    name: '일반 면접', 
    icon: Users, 
    description: '인성, 소프트 스킬, 일반적인 면접 질문',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'data-science', 
    name: '데이터 사이언스', 
    icon: Settings, 
    description: '데이터 분석, 머신러닝, 통계 및 데이터 활용',
    color: 'from-orange-500 to-red-500'
  },
];

const difficulties = [
  { 
    id: 'beginner', 
    name: '초급', 
    description: '기초 수준의 질문',
    level: 1,
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  { 
    id: 'intermediate', 
    name: '중급', 
    description: '실무 경험을 요하는 질문',
    level: 2,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  { 
    id: 'advanced', 
    name: '고급', 
    description: '시니어 레벨의 복합적 질문',
    level: 3,
    color: 'bg-red-100 text-red-800 border-red-200'
  },
];

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStart, onBack, loading }) => {
  const [config, setConfig] = useState<InterviewConfig>({
    field: 'technology',
    difficulty: '초급',
    questionCount: 5,
  });

  const handleStart = () => {
    console.log("onStart 호출 당시 questionCount:", config.questionCount);
    onStart(config);
  };

  const selectedField = fields.find(f => f.id === config.field);
  const selectedDifficulty = difficulties.find(d => d.id === config.difficulty);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>대시보드로 돌아가기</span>
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI 면접 설정</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            맞춤형 면접 연습 시작하기
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            당신의 목표와 수준에 맞는 면접 질문을 생성하여 실전 같은 연습을 경험해보세요.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
          <div className="space-y-10">
            {/* Field Selection */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                면접 분야 선택
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div
                      key={field.id}
                      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        config.field === field.id
                          ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                          : 'border-gray-200 hover:border-gray-300 bg-white/50'
                      }`}
                      onClick={() => setConfig({ ...config, field: field.id })}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${field.color} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">{field.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                        </div>
                      </div>
                      {config.field === field.id && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                난이도 설정
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficulties.map((difficulty) => (
                  <div
                    key={difficulty.id}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      config.difficulty === difficulty.id
                        ? 'border-purple-500 bg-purple-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-gray-300 bg-white/50'
                    }`}
                    onClick={() => setConfig({ ...config, difficulty: difficulty.id as any })}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full mx-1 ${
                              i < difficulty.level ? 'bg-purple-500' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">{difficulty.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{difficulty.description}</p>
                    </div>
                    {config.difficulty === difficulty.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                질문 개수
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">{config.questionCount}개</div>
                  <p className="text-green-700">
                    예상 소요 시간: {config.questionCount * 3}~{config.questionCount * 5}분
                  </p>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={config.questionCount}
                  onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) })}
                  className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer slider-green"
                />
                <div className="flex justify-between text-sm text-green-600 mt-3 font-medium">
                  <span>1개 (빠른 연습)</span>
                  <span>10개 (심화 연습)</span>
                </div>
              </div>
            </div>

            {/* Summary & Start */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-4">면접 설정 요약</h3>
                  <div className="space-y-2 text-blue-100">
                    <p>📚 분야: <span className="text-white font-medium">{selectedField?.name}</span></p>
                    <p>⭐ 난이도: <span className="text-white font-medium">{selectedDifficulty?.name}</span></p>
                    <p>❓ 질문 수: <span className="text-white font-medium">{config.questionCount}개</span></p>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    onClick={handleStart}
                    disabled={loading}
                    className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span>면접 준비 중...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>면접 시작하기</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
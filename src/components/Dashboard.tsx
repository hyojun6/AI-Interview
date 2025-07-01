import React from 'react';
import { 
  TrendingUp, 
  MessageSquare, 
  Target, 
  Award, 
  BookOpen, 
  Star,
  ArrowRight,
  Play,
  Brain,
  Zap
} from 'lucide-react';

interface DashboardProps {
  onStartInterview: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartInterview }) => {
  const recentSessions = [
    { id: 1, field: '기술', difficulty: '중급', score: 85, date: '2025-7-1' },
    { id: 2, field: '비즈니스', difficulty: '고급', score: 78, date: '2025-7-1' },
    { id: 3, field: '일반', difficulty: '초급', score: 92, date: '2025-7-1' },
  ];

  const stats = {
    totalSessions: 24,
    averageScore: 82,
    improvementRate: 15,
    todayQuestions: 7
  };

  // 주간 진행률 데이터 (면접 질문 개수 기준, 1개당 10%)
  const weeklyProgress = [
    { day: '월', questions: 8, percentage: Math.min(8 * 10, 100) },
    { day: '화', questions: 7, percentage: Math.min(7 * 10, 100) },
    { day: '수', questions: 0, percentage: Math.min(0 * 10, 100) },
    { day: '목', questions: 0, percentage: Math.min(0 * 10, 100) },
    { day: '금', questions: 0, percentage: Math.min(0 * 10, 100) },
    { day: '토', questions: 0, percentage: Math.min(0 * 10, 100) },
    { day: '일', questions: 0, percentage: Math.min(0 * 10, 100) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                AI 면접 연습
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">오늘 {stats.todayQuestions}문제</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">안녕하세요! 👋</h2>
          <p className="text-lg text-gray-600">오늘도 면접 실력을 향상시켜보세요</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 면접 세션</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">평균 점수</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}점</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">실력 향상률</p>
                <p className="text-2xl font-bold text-gray-900">+{stats.improvementRate}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">오늘 대답한 질문</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayQuestions}개</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Action Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Start */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">새로운 면접 시작하기</h3>
                  <p className="text-blue-100 mb-6">AI와 함께 실전 같은 면접을 연습해보세요</p>
                  <button
                    onClick={onStartInterview}
                    className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-xl hover:bg-blue-50 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                  >
                    <Play className="w-5 h-5" />
                    <span>면접 시작하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                    <Brain className="w-16 h-16 text-white/80" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">최근 면접 기록</h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                  <span>전체보기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{session.field} 면접</p>
                        <p className="text-sm text-gray-600">{session.difficulty} • {session.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">{session.score}점</p>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(session.score / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Chart */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">주간 진행률</h3>
              <p className="text-sm text-gray-600 mb-4">면접 질문 1개당 10% (10개 이상 시 100%)</p>
              <div className="space-y-3">
                {weeklyProgress.map((day) => (
                  <div key={day.day} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 w-6">{day.day}</span>
                    <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${day.percentage}%` }}
                      ></div>
                    </div>
                    <span className="font-medium w-12 text-right">{day.percentage}%</span>
                    <span className="text-xs text-gray-500 w-8 text-right">({day.questions}개)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-2">💡 오늘의 팁</h3>
              <p className="text-green-50 text-sm">
                면접에서 STAR 기법을 활용해보세요. 상황(Situation), 과제(Task), 행동(Action), 결과(Result)를 순서대로 설명하면 더 체계적인 답변이 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
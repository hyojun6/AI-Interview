import React, { useState } from 'react';
import { useInterviewSession } from './hooks/useInterviewSession';
import { Dashboard } from './components/Dashboard';
import { InterviewSetup } from './components/InterviewSetup';
import { InterviewSession } from './components/InterviewSession';
import { InterviewResults } from './components/InterviewResults';

type AppState = 'dashboard' | 'setup' | 'interview' | 'results';

function App() {
  const [appState, setAppState] = useState<AppState>('dashboard');
  const {
    session,
    loading,
    error,
    startInterview,
    submitAnswer,
    getResults,
    resetInterview,
  } = useInterviewSession();

  const handleStartInterview = () => {
    setAppState('setup');
  };

  const handleConfigureInterview = async (config: any) => {
    await startInterview(config);
    setAppState('interview');
  };

  const handleBackToDashboard = () => {
    setAppState('dashboard');
    resetInterview();
  };

  const handleInterviewComplete = () => {
    setAppState('results');
  };

  const handleRestart = () => {
    setAppState('dashboard');
    resetInterview();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">문제가 발생했습니다</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackToDashboard}
            className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  // State-based rendering
  switch (appState) {
    case 'dashboard':
      return <Dashboard onStartInterview={handleStartInterview} />;
    
    case 'setup':
      return (
        <InterviewSetup
          onStart={handleConfigureInterview}
          onBack={handleBackToDashboard}
          loading={loading}
        />
      );
    
    case 'interview':
      if (!session) {
        setAppState('dashboard');
        return null;
      }
      
      if (session.status === 'completed') {
        setAppState('results');
        return null;
      }
      
      return (
        <InterviewSession
          session={session}
          onSubmitAnswer={submitAnswer}
          loading={loading}
        />
      );
    
    case 'results':
      if (!session || session.status !== 'completed') {
        setAppState('dashboard');
        return null;
      }
      
      return (
        <InterviewResults
          session={session}
          getResults={getResults}
          onRestart={handleRestart}
        />
      );

    default:
      return <Dashboard onStartInterview={handleStartInterview} />;
  }
}

export default App;
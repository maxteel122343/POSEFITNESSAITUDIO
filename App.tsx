
import React, { useState, useCallback } from 'react';
import { POSES } from './constants';
import { Pose, AppState } from './types';
import { transformImage } from './geminiService';
import Header from './components/Header';
import PoseCard from './components/PoseCard';
import Uploader from './components/Uploader';
import ResultDisplay from './components/ResultDisplay';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    selectedPose: null,
    userImage: null,
    resultImage: null,
    isLoading: false,
    error: null,
  });

  const handleSelectPose = (pose: Pose) => {
    setState(prev => ({ ...prev, selectedPose: pose, error: null }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpload = (base64Image: string) => {
    setState(prev => ({ ...prev, userImage: base64Image, error: null }));
  };

  const handleProcess = async () => {
    if (!state.selectedPose || !state.userImage) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await transformImage(state.userImage, state.selectedPose);
      setState(prev => ({ ...prev, resultImage: result, isLoading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message || "Failed to transform image", isLoading: false }));
    }
  };

  const reset = () => {
    setState({
      selectedPose: null,
      userImage: null,
      resultImage: null,
      isLoading: false,
      error: null,
    });
  };

  const goBackToPose = () => {
    setState(prev => ({ ...prev, userImage: null, resultImage: null, error: null }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogoClick={reset} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {!state.selectedPose && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Step 1: Choose Your Pose</h2>
              <p className="text-slate-600">Select a pose from our library of dozens of silhouettes.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {POSES.map(pose => (
                <PoseCard 
                  key={pose.id} 
                  pose={pose} 
                  onSelect={handleSelectPose}
                  isActive={state.selectedPose?.id === pose.id}
                />
              ))}
            </div>
          </section>
        )}

        {state.selectedPose && !state.resultImage && !state.isLoading && (
          <section className="max-w-2xl mx-auto animate-fadeIn">
            <button 
              onClick={() => setState(prev => ({ ...prev, selectedPose: null }))}
              className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <i className="fas fa-arrow-left mr-2"></i> Back to Pose Library
            </button>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-slate-100">
              <div className="p-6 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-indigo-900">{state.selectedPose.name}</h2>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded uppercase tracking-wider">
                    {state.selectedPose.category}
                  </span>
                </div>
                <img 
                  src={state.selectedPose.imageUrl} 
                  alt={state.selectedPose.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
              </div>
              
              <div className="p-8">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Step 2: Upload Your Photo</h3>
                  <Uploader onUpload={handleUpload} currentImage={state.userImage} />
                </div>

                {state.userImage && (
                  <button
                    onClick={handleProcess}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-magic"></i>
                    Transform Into This Pose
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {state.isLoading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-24 h-24 border-8 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-bold text-slate-800">AI is posing you...</h2>
            <p className="text-slate-600 mt-2">This usually takes about 5-10 seconds</p>
          </div>
        )}

        {state.resultImage && !state.isLoading && (
          <ResultDisplay 
            original={state.userImage!} 
            result={state.resultImage} 
            poseName={state.selectedPose!.name}
            onReset={reset}
            onTryAgain={goBackToPose}
          />
        )}

        {state.error && (
          <div className="max-w-md mx-auto mt-8 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
            <i className="fas fa-exclamation-circle text-xl"></i>
            <p>{state.error}</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
        <p>© 2024 Pose Master AI. Powered by Gemini 2.5 Flash Image.</p>
      </footer>
    </div>
  );
};

export default App;

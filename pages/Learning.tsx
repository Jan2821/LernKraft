import React, { useState } from 'react';
import { Subject } from '../types';
import { geminiService } from '../services/geminiService';
import { Loader2, CheckCircle, XCircle, Lightbulb, ArrowRight, RefreshCw } from 'lucide-react';

export const LearningArea: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [exercise, setExercise] = useState<{question: string, correctAnswer: string, hint?: string} | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleGenerate = async () => {
    if (!selectedSubject || !topic) return;
    setLoading(true);
    setFeedback(null);
    setUserAnswer('');
    setShowHint(false);
    
    const result = await geminiService.generateExercise(selectedSubject, topic);
    setExercise(result);
    setLoading(false);
  };

  const handleCheck = async () => {
    if (!exercise || !userAnswer) return;
    setLoading(true);
    const result = await geminiService.checkAnswer(exercise.question, userAnswer, exercise.correctAnswer);
    setFeedback(result);
    setLoading(false);
  };

  if (!selectedSubject) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Wähle ein Fach</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(Subject).map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-left"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{subj}</h2>
              <p className="text-slate-500">Klicke um Themen zu wählen</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button 
        onClick={() => setSelectedSubject(null)}
        className="text-slate-500 hover:text-blue-600 mb-6 flex items-center text-sm font-medium"
      >
        ← Zurück zur Übersicht
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">{selectedSubject} Übung</h2>
          <p className="text-blue-100">Lass dir von unserer KI Aufgaben erstellen.</p>
        </div>

        <div className="p-8">
          {!exercise ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Welches Thema möchtest du üben?</label>
                <input
                  type="text"
                  placeholder="z.B. Bruchrechnung, Simple Past, Gedichtanalyse..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={!topic || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <RefreshCw className="mr-2 w-5 h-5" />}
                Aufgabe generieren
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="text-sm uppercase tracking-wide text-slate-400 font-bold mb-2">Aufgabe</h3>
                <p className="text-xl text-slate-800 font-medium leading-relaxed">{exercise.question}</p>
              </div>

              {showHint && exercise.hint && (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-100 flex items-start">
                  <Lightbulb className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <p>{exercise.hint}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Deine Antwort</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow min-h-[100px]"
                  placeholder="Schreibe hier deine Lösung..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={!!feedback}
                />
              </div>

              {feedback && (
                <div className={`p-6 rounded-xl border flex items-start ${
                  feedback.toLowerCase().includes('richtig') || feedback.toLowerCase().includes('gut') 
                    ? 'bg-green-50 border-green-200 text-green-900' 
                    : 'bg-orange-50 border-orange-200 text-orange-900'
                }`}>
                  {feedback.toLowerCase().includes('richtig') || feedback.toLowerCase().includes('gut') 
                    ? <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 text-green-600" />
                    : <XCircle className="w-6 h-6 mr-3 flex-shrink-0 text-orange-600" />
                  }
                  <div>
                    <p className="font-medium mb-1">Feedback</p>
                    <p>{feedback}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4 border-t border-slate-100">
                {!feedback ? (
                  <>
                     <button
                      onClick={() => setShowHint(true)}
                      className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                    >
                      Tipp anzeigen
                    </button>
                    <button
                      onClick={handleCheck}
                      disabled={!userAnswer || loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                      Überprüfen
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setExercise(null); setTopic(''); }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium flex items-center justify-center transition-colors"
                  >
                    Nächste Aufgabe <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
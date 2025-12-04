import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (username: string) => void;
  onStartOnboarding: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onStartOnboarding }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = storageService.login(username);
    if (user) {
      onLogin(username);
    } else {
      setError('Benutzer nicht gefunden. Versuche "admin", "lehrer" oder "schueler"');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Willkommen zurück</h1>
          <p className="text-slate-500">Logge dich bei LernKraft ein</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Benutzername</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50"
              placeholder="z.B. schueler"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200"
          >
            Anmelden
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-600 mb-4">Noch keinen Account?</p>
          <button
            onClick={onStartOnboarding}
            className="text-blue-600 font-bold hover:underline"
          >
            Jetzt für Nachhilfe anmelden
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400 bg-slate-50 p-2 rounded">
          <p>Demo Logins:</p>
          <p>Admin: <span className="font-mono text-slate-600">admin</span></p>
          <p>Lehrer: <span className="font-mono text-slate-600">lehrer</span></p>
          <p>Schüler: <span className="font-mono text-slate-600">schueler</span></p>
        </div>
      </div>
    </div>
  );
};
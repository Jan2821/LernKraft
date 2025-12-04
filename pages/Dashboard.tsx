import React from 'react';
import { User, Subject } from '../types';
import { BookOpen, Trophy, Clock, Star } from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Hallo, {user.fullName}! 👋</h1>
        <p className="text-slate-500">Willkommen zurück bei LernKraft. Bereit etwas Neues zu lernen?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Level 3</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">1250 XP</h3>
          <p className="text-blue-100 text-sm">Du bist auf dem besten Weg!</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">45 Min</h3>
          <p className="text-slate-500 text-sm">Lernzeit heute</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
              <Star className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">12</h3>
          <p className="text-slate-500 text-sm">Abgeschlossene Übungen</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-6">Deine Fächer</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: Subject.MATH, color: 'bg-emerald-500', icon: '📐', desc: 'Algebra, Geometrie & mehr' },
          { id: Subject.GERMAN, color: 'bg-rose-500', icon: '📖', desc: 'Grammatik & Literatur' },
          { id: Subject.ENGLISH, color: 'bg-indigo-500', icon: '🌍', desc: 'Vokabeln & Konversation' }
        ].map((subject) => (
          <div 
            key={subject.id}
            onClick={() => onNavigate('learning')}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`h-32 ${subject.color} relative p-6 flex items-center justify-center`}>
              <span className="text-6xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">{subject.icon}</span>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-1">{subject.id}</h3>
              <p className="text-sm text-slate-500 mb-4">{subject.desc}</p>
              <button className="w-full py-2 bg-slate-50 text-slate-600 font-medium rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                Jetzt üben
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
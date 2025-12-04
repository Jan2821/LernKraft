import React from 'react';
import { 
  Home, 
  BookOpen, 
  MessageCircle, 
  Users, 
  LogOut, 
  Settings,
  GraduationCap
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, activePage, onNavigate, onLogout }) => {
  const NavItem = ({ page, icon: Icon, label }: { page: string; icon: any; label: string }) => (
    <button
      onClick={() => onNavigate(page)}
      className={`flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-colors ${
        activePage === page 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col shadow-sm fixed left-0 top-0">
      <div className="p-6 flex items-center border-b border-slate-100">
        <div className="bg-blue-600 p-2 rounded-lg mr-3">
          <GraduationCap className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">LernKraft</h1>
          <p className="text-xs text-slate-500">Online Nachhilfe</p>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Menu
          </p>
          
          <NavItem page="dashboard" icon={Home} label="Übersicht" />
          
          {(user.role === UserRole.STUDENT || user.role === UserRole.TEACHER) && (
            <>
              <NavItem page="learning" icon={BookOpen} label="Lernen & Üben" />
              <NavItem page="chat" icon={MessageCircle} label="Nachrichten" />
            </>
          )}
          
          {user.role === UserRole.ADMIN && (
            <NavItem page="admin" icon={Users} label="Verwaltung" />
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
            {user.fullName.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-900 truncate">{user.fullName}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Abmelden
        </button>
      </div>
    </div>
  );
};
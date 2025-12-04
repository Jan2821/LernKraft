import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { Plus, Trash2, Search, User as UserIcon } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    fullName: '',
    role: UserRole.STUDENT,
    password: 'password123' // Simplified for demo
  });

  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = () => {
    setUsers(storageService.getUsers());
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: Date.now().toString(),
      username: newUser.username,
      fullName: newUser.fullName,
      role: newUser.role,
      joinedDate: new Date().toISOString(),
      hasPaid: true // Admins create paid accounts by default
    };
    storageService.addUser(user);
    setShowAddModal(false);
    setNewUser({ username: '', fullName: '', role: UserRole.STUDENT, password: '' });
    refreshUsers();
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Benutzer wirklich löschen?')) {
      storageService.deleteUser(id);
      refreshUsers();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Verwaltung</h1>
          <p className="text-slate-500">Benutzerkonten verwalten und Zugänge erstellen</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          Neuer Zugang
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Benutzer suchen..." 
            className="bg-transparent border-none outline-none text-slate-600 w-full placeholder-slate-400"
          />
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Benutzername</th>
              <th className="px-6 py-4">Rolle</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 mr-3">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-900">{user.fullName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{user.username}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                    user.role === UserRole.TEACHER ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center text-emerald-600 text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    Aktiv
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Neuen Benutzer erstellen</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Voller Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newUser.fullName}
                  onChange={e => setNewUser({...newUser, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Benutzername</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newUser.username}
                  onChange={e => setNewUser({...newUser, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rolle</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                >
                  <option value={UserRole.STUDENT}>Schüler</option>
                  <option value={UserRole.TEACHER}>Lehrer</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
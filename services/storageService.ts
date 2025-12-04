import { User, UserRole, Message } from '../types';

const USERS_KEY = 'lernkraft_users';
const MESSAGES_KEY = 'lernkraft_messages';
const CURRENT_USER_KEY = 'lernkraft_current_user';

// Seed initial data
const seedData = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const initialUsers: User[] = [
      {
        id: 'admin-1',
        username: 'admin',
        fullName: 'System Administrator',
        role: UserRole.ADMIN,
        joinedDate: new Date().toISOString(),
        hasPaid: true
      },
      {
        id: 'teacher-1',
        username: 'lehrer',
        fullName: 'Max Mustermann',
        role: UserRole.TEACHER,
        joinedDate: new Date().toISOString(),
        hasPaid: true
      },
      {
        id: 'student-1',
        username: 'schueler',
        fullName: 'Lisa Lerner',
        role: UserRole.STUDENT,
        joinedDate: new Date().toISOString(),
        hasPaid: true
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }
};

export const storageService = {
  init: seedData,

  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  addUser: (user: User) => {
    const users = storageService.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  updateUser: (updatedUser: User) => {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  deleteUser: (userId: string) => {
    const users = storageService.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  },

  login: (username: string): User | null => {
    const users = storageService.getUsers();
    const user = users.find(u => u.username === username);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  getMessages: (chatId: string): Message[] => {
    // Simplified: All messages stored in one array, filtered by "context" in a real app
    // Here we just return all for simplicity or filter by mocked implementation
    const data = localStorage.getItem(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveMessage: (msg: Message) => {
    const messages = storageService.getMessages('global');
    messages.push(msg);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }
};
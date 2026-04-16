import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BoardProvider, useBoard } from './context/BoardContext';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import TaskBoard from './components/TaskBoard';
import TaskModal from './components/TaskModal';
import ActivityLog from './components/ActivityLog';
import { LogOut, User, Layout, Activity, Compass, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas/80 backdrop-blur-md border-b border-ink/[0.03]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-10">
          <div className="flex items-center space-x-3 group cursor-default">
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center transition-transform group-hover:rotate-12">
              <span className="text-canvas text-xs font-bold">AS</span>
            </div>
            <span className="text-sm font-bold text-ink tracking-tighter uppercase">Aura Space</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-[11px] font-bold uppercase tracking-widest text-ink/30">
            <a href="#" className="text-ink hover:text-ink transition-colors">Board</a>
            <a href="#" className="hover:text-ink transition-colors">Strategy</a>
            <a href="#" className="hover:text-ink transition-colors">Metrics</a>
          </div>
        </div>
        
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-2 text-ink/40">
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">{user.email}</span>
            <div className="w-6 h-6 rounded-full bg-ink/[0.05] border border-ink/[0.05] flex items-center justify-center">
              <User className="w-3 h-3" />
            </div>
          </div>
          <button 
            onClick={logout}
            className="text-ink/30 hover:text-rose-600 transition-colors p-1"
            title="Logout System"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

const BoardView = () => {
  const { addTask, updateTask } = useBoard();
  const [modalState, setModalState] = useState({ isOpen: false, task: null, initialStatus: 'Todo' });

  const handleAddTask = (status) => {
    setModalState({ isOpen: true, task: null, initialStatus: status || 'Todo' });
  };

  const handleEditTask = (task) => {
    setModalState({ isOpen: true, task, initialStatus: task.status });
  };

  const handleSaveTask = (taskData) => {
    if (modalState.task) {
      updateTask(modalState.task.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-9">
        <TaskBoard 
          onAddTask={handleAddTask} 
          onEditTask={handleEditTask} 
        />
      </div>
      <div className="lg:col-span-3">
        <div className="sticky top-28">
          <ActivityLog />
        </div>
      </div>

      <TaskModal 
        isOpen={modalState.isOpen}
        task={modalState.task}
        initialStatus={modalState.initialStatus}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onSave={handleSaveTask}
      />
    </div>
  );
};

const MainContent = () => {
  const { user } = useAuth();

  if (!user) return <Login />;

  return (
    <ProtectedRoute>
      <BoardProvider>
        <div className="pt-28 pb-20 min-h-screen">
          <div className="max-w-7xl mx-auto px-6">
            <BoardView />
          </div>
        </div>
      </BoardProvider>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <MainContent />
    </AuthProvider>
  );
}

export default App;

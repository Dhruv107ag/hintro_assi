import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BoardContext = createContext(null);

export const BoardProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('aura_tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [activities, setActivities] = useState(() => {
    const savedActivities = localStorage.getItem('aura_activities');
    return savedActivities ? JSON.parse(savedActivities) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' or 'createdAt'

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('aura_tasks', JSON.stringify(tasks));
    localStorage.setItem('aura_activities', JSON.stringify(activities));
  }, [tasks, activities]);

  const logActivity = useCallback((type, task) => {
    const newActivity = {
      id: crypto.randomUUID(),
      type, // 'created', 'edited', 'moved', 'deleted'
      taskId: task.id,
      taskTitle: task.title,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep last 50
  }, []);

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: taskData.status || 'Todo'
    };
    setTasks(prev => [...prev, newTask]);
    logActivity('created', newTask);
  };

  const updateTask = (taskId, updates) => {
    let updatedTask;
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        updatedTask = { ...task, ...updates };
        return updatedTask;
      }
      return task;
    }));
    if (updatedTask) logActivity('edited', updatedTask);
  };

  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (taskToDelete) logActivity('deleted', taskToDelete);
  };

  const moveTask = (taskId, newStatus) => {
    let movedTask;
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        movedTask = { ...task, status: newStatus };
        return movedTask;
      }
      return task;
    }));
    if (movedTask) logActivity('moved', movedTask);
  };

  const resetBoard = () => {
    setTasks([]);
    setActivities([]);
    localStorage.removeItem('aura_tasks');
    localStorage.removeItem('aura_activities');
  };

  const filteredTasks = tasks
    .filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterPriority === 'all' || task.priority === filterPriority)
    )
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <BoardContext.Provider value={{ 
      tasks: filteredTasks, 
      activities,
      addTask, 
      updateTask, 
      deleteTask, 
      moveTask,
      resetBoard,
      searchQuery,
      setSearchQuery,
      filterPriority,
      setFilterPriority,
      sortBy,
      setSortBy
    }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);

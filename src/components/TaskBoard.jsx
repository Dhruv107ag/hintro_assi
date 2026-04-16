import React, { useState } from 'react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { 
  sortableKeyboardCoordinates 
} from '@dnd-kit/sortable';
import { useBoard } from '../context/BoardContext';
import Column from './Column';
import TaskCard from './TaskCard';
import { Search, Filter, ArrowUpDown, Trash2, Plus, SlidersHorizontal } from 'lucide-react';

const COLUMNS = ['Todo', 'Doing', 'Done'];

const TaskBoard = ({ onAddTask, onEditTask }) => {
  const { 
    tasks, 
    moveTask, 
    deleteTask, 
    searchQuery, 
    setSearchQuery, 
    filterPriority, 
    setFilterPriority,
    sortBy,
    setSortBy,
    resetBoard
  } = useBoard();

  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    const isOverColumn = COLUMNS.includes(overId);
    const overTask = tasks.find(t => t.id === overId);
    
    const newStatus = isOverColumn ? overId : overTask?.status;

    if (newStatus && activeTask.status !== newStatus) {
      moveTask(activeId, newStatus);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    // Final safety check if dropped extremely fast
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    const isOverColumn = COLUMNS.includes(overId);
    const overTask = tasks.find(t => t.id === overId);
    
    const newStatus = isOverColumn ? overId : overTask?.status;

    if (newStatus && activeTask.status !== newStatus) {
      moveTask(activeId, newStatus);
    }
  };

  return (
    <div className="space-y-12">
      {/* Editorial Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-ink/[0.03] pb-10">
        <div className="max-w-xl">
          <div className="text-meta mb-3">Workspace Overview</div>
          <h1 className="text-4xl font-bold text-ink tracking-tight mb-4">Strategic Planner</h1>
          <p className="text-ink/50 text-sm leading-relaxed">
            Manage your internship objectives with precision. Drag elements to redefine status and use the filters to focus your perspective.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/20 group-focus-within:text-ink/60 transition-colors" />
            <input
              type="text"
              placeholder="Search Title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-ink/[0.03] border border-transparent focus:border-ink/10 focus:bg-white rounded-lg pl-9 pr-4 py-2 text-xs font-medium outline-none transition-all w-48"
            />
          </div>
          
          <div className="flex items-center space-x-2 bg-ink/[0.03] px-3 py-2 rounded-lg border border-transparent">
            <SlidersHorizontal className="w-3.5 h-3.5 text-ink/30" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-transparent text-[11px] font-bold uppercase tracking-wider outline-none cursor-pointer text-ink/60 hover:text-ink transition-colors"
            >
              <option value="all">Priority: All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button
            onClick={() => onAddTask()}
            className="btn-ink px-5 py-2 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
          
          <button
            onClick={() => { if(window.confirm('Wipe all board data?')) resetBoard(); }}
            className="p-2 text-ink/20 hover:text-rose-600 transition-colors"
            title="Reset Board"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {COLUMNS.map(col => (
            <Column
              key={col}
              title={col}
              tasks={tasks.filter(t => t.status === col)}
              onAddTask={onAddTask}
              onEditTask={onEditTask}
              onDeleteTask={deleteTask}
            />
          ))}

          <DragOverlay dropAnimation={null}>
            {activeTask ? (
              <div className="dnd-dragoverlay">
                <TaskCard task={activeTask} isOverlay={true} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default TaskBoard;

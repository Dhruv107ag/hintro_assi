import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const Column = ({ title, tasks, onAddTask, onEditTask, onDeleteTask }) => {
  const { setNodeRef } = useDroppable({ id: title });

  return (
    <div className="flex flex-col w-full min-w-[320px] h-full">
      <div className="flex items-end justify-between mb-6 pb-2 border-b-2 border-ink/5 px-1">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-bold text-ink tracking-tight">{title}</h2>
          <span className="text-meta text-[9px] bg-ink/5 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button 
          onClick={() => onAddTask(title)}
          className="text-ink/30 hover:text-ink transition-colors p-1"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 rounded-2xl min-h-[500px] transition-all duration-500"
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={onEditTask} 
                onDelete={onDeleteTask} 
              />
            ))}
          </div>
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center text-ink/10 border-2 border-dashed border-ink/[0.03] rounded-2xl mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest">Empty Status</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;

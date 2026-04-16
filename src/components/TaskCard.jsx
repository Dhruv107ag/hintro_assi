import React, { useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Tag, Pencil, Trash2, GripHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import gsap from 'gsap';

const priorityStyles = {
  Low: 'text-emerald-700 bg-emerald-50',
  Medium: 'text-amber-700 bg-amber-50',
  High: 'text-rose-700 bg-rose-50',
};

const TaskCard = ({ task, onEdit, onDelete, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: isOverlay ? `overlay-${task.id}` : task.id });

  const cardRef = useRef(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  useEffect(() => {
    if (!isDragging) {
      gsap.from(cardRef.current, {
        y: 15,
        opacity: 0,
        duration: 0.8,
        ease: 'power4.out',
      });
    }
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white border border-border-warm rounded-xl p-5 shadow-[0_4px_0_0_rgba(26,26,26,0.02)] hover:shadow-[0_12px_24px_-12px_rgba(26,26,26,0.1)] hover:-translate-y-1 transition-all duration-500 cursor-default overflow-hidden`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button 
            {...attributes} 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing text-ink/10 hover:text-ink/40 transition-colors"
          >
            <GripHorizontal className="w-5 h-5" />
          </button>
          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button onClick={() => onEdit(task)} className="p-2 hover:bg-ink/5 rounded-lg text-ink/40 hover:text-ink transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-2 hover:bg-ink/5 rounded-lg text-ink/40 hover:text-rose-600 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h3 className="text-ink font-bold text-base leading-tight mb-2 tracking-tight group-hover:text-ink/80 transition-colors">
        {task.title}
      </h3>
      <p className="text-ink/70 text-xs leading-relaxed mb-6 line-clamp-2">
        {task.description || 'No additional details provided.'}
      </p>

      <div className="flex items-center justify-between border-t border-ink/[0.03] pt-4">
        <div className="flex items-center space-x-4">
          {task.dueDate && (
            <div className="flex items-center space-x-1.5 text-meta text-[9px]">
              <Calendar className="w-3 h-3 text-ink/50" />
              <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
            </div>
          )}
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center space-x-1.5 text-meta text-[9px]">
              <Tag className="w-3 h-3 text-ink/50" />
              <span>{task.tags.length} TAGS</span>
            </div>
          )}
        </div>
        <div className="text-meta text-[8px] opacity-40">
          ID: {task.id.slice(0, 4)}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

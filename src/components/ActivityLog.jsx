import React from 'react';
import { useBoard } from '../context/BoardContext';
import { History, Plus, Pencil, Move, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ActivityLog = () => {
  const { activities } = useBoard();

  const getIcon = (type) => {
    switch (type) {
      case 'created': return <Plus className="w-3 h-3 text-ink" />;
      case 'edited': return <Pencil className="w-3 h-3 text-ink" />;
      case 'moved': return <Move className="w-3 h-3 text-ink" />;
      case 'deleted': return <Trash2 className="w-3 h-3 text-rose-600" />;
      default: return <Clock className="w-3 h-3 text-ink" />;
    }
  };

  const getLabel = (type) => {
    switch (type) {
      case 'created': return 'Entried';
      case 'edited': return 'Modified';
      case 'moved': return 'Relocated';
      case 'deleted': return 'Archived';
      default: return 'Logged';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-ink/[0.02] border border-ink/[0.05] p-10 rounded-2xl flex flex-col items-center justify-center text-center">
        <History className="w-8 h-8 text-ink/5 mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink/20">Chronicle Empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-ink/5">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-ink/40 flex items-center gap-2">
          <History className="w-3 h-3" />
          System Chronicle
        </h2>
        <span className="text-[9px] font-mono text-ink/20">{activities.length} EVENTS</span>
      </div>
      
      <div className="space-y-6">
        {activities.slice(0, 15).map((activity) => (
          <div key={activity.id} className="relative pl-6 pb-6 border-l border-ink/[0.05] last:pb-0 group">
            <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-canvas border border-ink/10 flex items-center justify-center p-0.5 group-hover:scale-125 transition-transform duration-300">
              {getIcon(activity.type)}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink/80">{getLabel(activity.type)}</span>
                <span className="text-[9px] text-ink/20">{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
              </div>
              <p className="text-xs text-ink/40 italic leading-tight truncate">
                "{activity.taskTitle}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {activities.length > 0 && (
        <div className="pt-4 border-t border-ink/[0.03] text-center">
          <button className="text-[9px] font-bold uppercase tracking-widest text-ink/20 hover:text-ink/60 transition-colors">
            End of History
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;

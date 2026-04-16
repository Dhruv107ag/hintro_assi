import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Tag, AlertCircle } from 'lucide-react';
import gsap from 'gsap';

const TaskModal = ({ task, isOpen, onClose, onSave, initialStatus, tasks, onMove }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: '',
    tags: '',
    status: 'Todo'
  });
  const [error, setError] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        tags: task.tags?.join(', ') || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Low',
        dueDate: '',
        tags: '',
        status: initialStatus || 'Todo'
      });
    }
    setError('');
    setSelectedTaskId('');
  }, [task, initialStatus, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const ctx = gsap.context(() => {
        gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
        gsap.fromTo(modalRef.current, 
          { scale: 0.95, opacity: 0, y: 30 }, 
          { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
        );
      });
      return () => ctx.revert();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedTaskId) {
      onMove(selectedTaskId, initialStatus);
      return;
    }

    if (!formData.title.trim()) {
      setError('A title is required to categorize this objective.');
      return;
    }
    
    const processedData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : []
    };
    
    onSave(processedData);
    handleClose();
  };

  const handleClose = () => {
    gsap.to(modalRef.current, { 
      scale: 0.95, 
      opacity: 0, 
      y: 30, 
      duration: 0.4, 
      ease: 'power2.in',
      onComplete: onClose 
    });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={handleClose}
      />
      
      <div 
        ref={modalRef}
        className="bg-canvas w-full max-w-xl rounded-3xl relative z-10 overflow-hidden shadow-[0_32px_64px_-12px_rgba(26,26,26,0.2)] border border-ink/5"
      >
        <div className="flex items-center justify-between p-8 border-b border-ink/[0.03]">
          <div>
            <div className="text-meta mb-1">Entry Management</div>
            <h2 className="text-2xl font-bold text-ink tracking-tight">
              {task ? 'Refine Objective' : 'New Strategic Entry'}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-ink/5 rounded-full text-ink/20 hover:text-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {(!task && initialStatus !== 'Todo') && (
            <div className="group pb-6 border-b border-ink/5">
              <label className="text-meta block mb-2 transition-colors group-focus-within:text-ink">Select Existing Task to Move</label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full py-2.5 bg-ink/[0.03] border-b border-ink/10 focus:border-ink outline-none transition-all text-ink font-medium px-3"
              >
                <option value="">-- Create a new task below --</option>
                {tasks?.filter(t => t.status !== initialStatus).map(t => (
                  <option key={t.id} value={t.id}>[{t.status}] {t.title}</option>
                ))}
              </select>
            </div>
          )}

          {!selectedTaskId && (
            <div className="space-y-6">
              <div className="group">
                <label className="text-meta block mb-2 transition-colors group-focus-within:text-ink">Objective Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full py-2.5 bg-transparent border-b border-ink/10 focus:border-ink outline-none transition-all text-ink font-medium placeholder:text-ink/20"
                  placeholder="Briefly describe the task..."
                  autoFocus
                />
                {error && (
                  <div className="flex items-center space-x-2 text-red-600 text-[10px] font-bold uppercase tracking-wider mt-2">
                    <AlertCircle className="w-3 h-3" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="group">
                <label className="text-meta block mb-2 transition-colors group-focus-within:text-ink">Context / Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[120px] bg-ink/[0.02] border border-ink/5 rounded-xl p-4 outline-none focus:border-ink/20 transition-all text-ink text-sm leading-relaxed scrollbar-none"
                  placeholder="Include any relevant details or links..."
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="group">
                  <label className="text-meta block mb-2 transition-colors group-focus-within:text-ink">Priority Matrix</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full py-2 bg-transparent border-b border-ink/10 outline-none text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    <option value="Low">Low Importance</option>
                    <option value="Medium">Standard Priority</option>
                    <option value="High">Critical Access</option>
                  </select>
                </div>

                <div className="group">
                  <label className="text-meta block mb-2 transition-colors group-focus-within:text-ink">Timeline Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/20 pointer-events-none" />
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full pl-7 py-2 bg-transparent border-b border-ink/10 outline-none text-xs font-medium cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="text-meta block mb-2 transition-colors group-focus-within:text-ink">Categorization Tags</label>
                <div className="relative">
                  <Tag className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/20 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full pl-7 py-2 bg-transparent border-b border-ink/10 outline-none text-xs font-medium placeholder:text-ink/20"
                    placeholder="e.g. Research, UI, Backend..."
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-6 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="text-meta hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-ink px-10"
            >
              {selectedTaskId 
                ? `Move to ${initialStatus}`
                : task ? 'Commit Changes' : 'Initialize Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

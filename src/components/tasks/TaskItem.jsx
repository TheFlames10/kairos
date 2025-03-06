import React from 'react';

const TaskItem = ({ task, onEdit, onDelete, onMove, isDraggable = true }) => {
  const priorityColors = {
    high: '#e74c3c',
    medium: '#f39c12',
    low: '#3498db'
  };

  const handleDragStart = (e) => {
    if (!isDraggable) return;
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('source', task.assignedDay || 'backlog');
  };

  return (
    <div 
      className="task-item"
      draggable={isDraggable}
      onDragStart={handleDragStart}
    >
      <div className="task-header">
        <div 
          className="priority-indicator" 
          style={{ backgroundColor: priorityColors[task.priority || 'medium'] }}
        />
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <button 
            className="edit-btn"
            onClick={() => onEdit(task)}
          >
            <span className="icon fa fa-edit"></span>
          </button>
          <button 
            className="delete-btn"
            onClick={() => onDelete(task.id)}
          >
            <span className="icon fa fa-trash"></span>
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        {task.dueDate && (
          <div className="due-date">
            <span className="icon fa fa-calendar"></span>
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
        {task.tags && task.tags.length > 0 && (
          <div className="tags">
            {task.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
        {task.progress !== undefined && (
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${task.progress}%` }}
            />
            <span className="progress-text">{task.progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
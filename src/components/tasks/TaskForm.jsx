import React, { useState, useEffect } from 'react';

const TaskForm = ({ task = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: [],
    progress: 0,
    estimatedTime: '',
    assignedDay: null
  });

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        tags: task.tags ? task.tags.join(', ') : '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      tags: value.split(',').map(tag => tag.trim())
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format the data
    const formattedData = {
      ...formData,
      tags: typeof formData.tags === 'string' 
        ? formData.tags.split(',').map(tag => tag.trim()) 
        : formData.tags,
      progress: Number(formData.progress) || 0
    };
    
    onSubmit(formattedData);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
        <button 
          type="button" 
          className="close-btn"
          onClick={onCancel}
        >
          &times;
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags (comma separated)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={typeof formData.tags === 'string' ? formData.tags : formData.tags.join(', ')}
          onChange={handleTagsChange}
          placeholder="e.g. work, important, project"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="progress">Progress (%)</label>
          <input
            type="number"
            id="progress"
            name="progress"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="estimatedTime">Estimated Time (hours)</label>
          <input
            type="number"
            id="estimatedTime"
            name="estimatedTime"
            min="0"
            step="0.5"
            value={formData.estimatedTime}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="assignedDay">Assign to Day</label>
        <select
          id="assignedDay"
          name="assignedDay"
          value={formData.assignedDay || ''}
          onChange={handleChange}
        >
          <option value="">Backlog (Unassigned)</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-btn">
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
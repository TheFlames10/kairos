import React, { useContext, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';
import TaskList from '../tasks/TaskList';
import TaskForm from '../tasks/TaskForm';

const BacklogView = () => {
  const { backlog, loading, addTask } = useContext(TaskContext);
  const [showForm, setShowForm] = useState(false);

  const handleAddTask = (task) => {
    addTask(task);
    setShowForm(false);
  };

  return (
    <div className="backlog-view">
      <div className="view-header">
        <h1>Backlog</h1>
        <button 
          className="add-btn"
          onClick={() => setShowForm(true)}
        >
          + Add Task
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <TaskList 
          tasks={backlog} 
          location="backlog"
        />
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TaskForm 
              onSubmit={handleAddTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BacklogView;
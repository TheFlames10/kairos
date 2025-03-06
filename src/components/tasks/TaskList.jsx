import React, { useContext } from 'react';
import TaskItem from './TaskItem';
import { TaskContext } from '../../context/TaskContext';

const TaskList = ({ tasks, location, droppable = true }) => {
  const { moveTask, updateTask, deleteTask } = useContext(TaskContext);

  const handleDragOver = (e) => {
    if (!droppable) return;
    e.preventDefault();
  };

  const handleDrop = (e) => {
    if (!droppable) return;
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData('taskId');
    const source = e.dataTransfer.getData('source');
    
    if (source !== location) {
      moveTask(taskId, source, location);
    }
  };

  const handleEdit = (task) => {
    // This would typically open the edit modal
    console.log('Edit task:', task);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  return (
    <div 
      className="task-list"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {tasks.length === 0 ? (
        <div className="empty-list">
          <p>No tasks available</p>
        </div>
      ) : (
        tasks.map(task => (
          <TaskItem 
            key={task.id} 
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
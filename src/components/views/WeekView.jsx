import React, { useContext, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';
import TaskList from '../tasks/TaskList';
import TaskForm from '../tasks/TaskForm';

const WeekView = () => {
  const { dailyTasks, loading, addTask } = useContext(TaskContext);
  const [showForm, setShowForm] = useState(false);
  const [activeDay, setActiveDay] = useState(null);

  const days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const handleAddTask = (task) => {
    addTask({
      ...task,
      assignedDay: activeDay
    });
    setShowForm(false);
  };

  const getTotalTasksForDay = (day) => {
    return dailyTasks[day].length;
  };

  const getCompletedTasksForDay = (day) => {
    return dailyTasks[day].filter(task => task.progress === 100).length;
  };

  return (
    <div className="week-view">
      <div className="view-header">
        <h1>Week View</h1>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <div className="days-container">
          {days.map(day => (
            <div key={day} className="day-column">
              <div className="day-header">
                <h2>{day}</h2>
                <div className="day-meta">
                  <span className="task-count">
                    {getCompletedTasksForDay(day)}/{getTotalTasksForDay(day)} tasks
                  </span>
                  <button 
                    className="add-task-btn"
                    onClick={() => {
                      setActiveDay(day);
                      setShowForm(true);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <TaskList 
                tasks={dailyTasks[day]} 
                location={day}
              />
            </div>
          ))}
        </div>
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

export default WeekView;
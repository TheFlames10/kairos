import React, { useContext, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';

const ScheduleView = () => {
  const { schedules, loading, addSchedule, updateSchedule, deleteSchedule } = useContext(TaskContext);
  const [showForm, setShowForm] = useState(false);
  const [editSchedule, setEditSchedule] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    days: [],
    color: '#3498db',
    repeatPattern: 'weekly',
    notes: ''
  });

  // Reset form when opening for a new schedule
  const handleNewSchedule = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      days: [],
      color: '#3498db',
      repeatPattern: 'weekly',
      notes: ''
    });
    setEditSchedule(null);
    setShowForm(true);
  };

  // Load schedule data into form for editing
  const handleEditSchedule = (schedule) => {
    setFormData({
      ...schedule,
      days: Array.isArray(schedule.days) ? schedule.days : []
    });
    setEditSchedule(schedule);
    setShowForm(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle checkboxes for days of the week
      setFormData(prev => {
        const updatedDays = [...prev.days];
        
        if (checked) {
          if (!updatedDays.includes(value)) {
            updatedDays.push(value);
          }
        } else {
          const index = updatedDays.indexOf(value);
          if (index > -1) {
            updatedDays.splice(index, 1);
          }
        }
        
        return {
          ...prev,
          days: updatedDays
        };
      });
    } else {
      // Handle other inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const scheduleData = {
      ...formData,
      id: editSchedule ? editSchedule.id : Date.now().toString()
    };
    
    if (editSchedule) {
      updateSchedule(scheduleData);
    } else {
      addSchedule(scheduleData);
    }
    
    setShowForm(false);
  };

  // Handle schedule deletion
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      deleteSchedule(id);
    }
  };

  return (
    <div className="schedule-view">
      <div className="view-header">
        <h1>Schedules</h1>
        <button 
          className="add-btn"
          onClick={handleNewSchedule}
        >
          + Add Schedule
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading schedules...</div>
      ) : (
        <div className="schedules-list">
          {schedules.length === 0 ? (
            <div className="empty-list">
              <p>No schedules available</p>
              <button 
                className="create-schedule-btn"
                onClick={handleNewSchedule}
              >
                Create your first schedule
              </button>
            </div>
          ) : (
            schedules.map(schedule => (
              <div 
                key={schedule.id} 
                className="schedule-item"
                style={{ borderLeftColor: schedule.color }}
              >
                <div className="schedule-header">
                  <h3>{schedule.name}</h3>
                  <div className="schedule-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditSchedule(schedule)}
                    >
                      <span className="icon fa fa-edit"></span>
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(schedule.id)}
                    >
                      <span className="icon fa fa-trash"></span>
                    </button>
                  </div>
                </div>
                
                <div className="schedule-details">
                  <div className="date-range">
                    <span className="icon fa fa-calendar"></span>
                    <span>
                      {new Date(schedule.startDate).toLocaleDateString()} - 
                      {new Date(schedule.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="days">
                    <span className="icon fa fa-clock"></span>
                    <span>
                      {schedule.days.join(', ')}
                    </span>
                  </div>
                  
                  {schedule.notes && (
                    <div className="notes">
                      <span className="icon fa fa-sticky-note"></span>
                      <span>{schedule.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form className="schedule-form" onSubmit={handleSubmit}>
              <div className="form-header">
                <h2>{editSchedule ? 'Edit Schedule' : 'Create New Schedule'}</h2>
                <button 
                  type="button" 
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  &times;
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Days of the Week</label>
                <div className="days-checkboxes">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <label key={day} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="days"
                        value={day}
                        checked={formData.days.includes(day)}
                        onChange={handleChange}
                      />
                      {day.slice(0, 3)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="repeatPattern">Repeat Pattern</label>
                <select
                  id="repeatPattern"
                  name="repeatPattern"
                  value={formData.repeatPattern}
                  onChange={handleChange}
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editSchedule ? 'Update Schedule' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
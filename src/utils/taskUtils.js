/**
 * Get tasks due on a specific date
 * @param {Array} tasks - Array of tasks
 * @param {Date} date - Date to filter by
 * @returns {Array} Filtered tasks
 */
export const getTasksDueOnDate = (tasks, date) => {
    if (!tasks || !Array.isArray(tasks) || !date) return [];
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      try {
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getFullYear() === date.getFullYear() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getDate() === date.getDate()
        );
      } catch (error) {
        return false;
      }
    });
  };
  
  /**
   * Get tasks assigned to a specific day
   * @param {Array} tasks - Array of tasks
   * @param {string} day - Day name (Monday, Tuesday, etc.)
   * @returns {Array} Filtered tasks
   */
  export const getTasksForDay = (tasks, day) => {
    if (!tasks || !Array.isArray(tasks) || !day) return [];
    
    return tasks.filter(task => task.assignedDay === day);
  };
  
  /**
   * Sort tasks by priority (high, medium, low)
   * @param {Array} tasks - Array of tasks
   * @returns {Array} Sorted tasks
   */
  export const sortTasksByPriority = (tasks) => {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    
    return [...tasks].sort((a, b) => {
      const priorityA = a.priority ? priorityOrder[a.priority.toLowerCase()] : 4;
      const priorityB = b.priority ? priorityOrder[b.priority.toLowerCase()] : 4;
      return priorityA - priorityB;
    });
  };
  
  /**
   * Sort tasks by due date (earliest first)
   * @param {Array} tasks - Array of tasks
   * @returns {Array} Sorted tasks
   */
  export const sortTasksByDueDate = (tasks) => {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    return [...tasks].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  };
  
  /**
   * Filter tasks by tags
   * @param {Array} tasks - Array of tasks
   * @param {Array} tags - Array of tags to filter by
   * @returns {Array} Filtered tasks
   */
  export const filterTasksByTags = (tasks, tags) => {
    if (!tasks || !Array.isArray(tasks) || !tags || !Array.isArray(tags) || tags.length === 0) {
      return tasks;
    }
    
    return tasks.filter(task => {
      if (!task.tags || !Array.isArray(task.tags)) return false;
      return tags.some(tag => task.tags.includes(tag));
    });
  };
  
  /**
   * Calculate task completion percentage based on subtasks
   * @param {Object} task - Task object with subtasks array
   * @returns {number} Completion percentage
   */
  export const calculateTaskCompletion = (task) => {
    if (!task || !task.subtasks || !Array.isArray(task.subtasks) || task.subtasks.length === 0) {
      return task.progress || 0;
    }
    
    const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedSubtasks / task.subtasks.length) * 100);
  };
  
  /**
   * Get overdue tasks (due date has passed)
   * @param {Array} tasks - Array of tasks
   * @returns {Array} Overdue tasks
   */
  export const getOverdueTasks = (tasks) => {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (!task.dueDate || task.progress === 100) return false;
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      return dueDate < today;
    });
  };
  
  /**
   * Group tasks by specific property
   * @param {Array} tasks - Array of tasks
   * @param {string} property - Property to group by
   * @returns {Object} Grouped tasks
   */
  export const groupTasksBy = (tasks, property) => {
    if (!tasks || !Array.isArray(tasks) || !property) return {};
    
    return tasks.reduce((grouped, task) => {
      const key = task[property] || 'unassigned';
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      
      grouped[key].push(task);
      return grouped;
    }, {});
  };
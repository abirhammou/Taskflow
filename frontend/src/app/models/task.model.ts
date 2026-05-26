export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;   // yyyy-MM-dd
  completed: boolean;
}

// Matches your backend TaskDTO
export interface TaskDTO {
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

// Stats returned from /task/stats
export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;   // e.g., 75.5 → 75.5%
}
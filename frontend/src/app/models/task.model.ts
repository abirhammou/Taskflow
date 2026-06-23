export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  userId: string;
}

export interface TaskDTO {
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  userId: string; // ← add this so the backend knows who the task belongs to
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface UserInfo {
  username: string;
  email: string;
  role: string;
}

export interface TaskWithUser extends Task {
  assignee: UserInfo | null;
}
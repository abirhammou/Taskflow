export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  ownerId: string;
  taskIds: number[];
}

export interface ProjectDTO {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  ownerId: string;
}

// UI-only view model — adds the fields the template needs
// that don't exist on the backend entity
export interface ProjectView extends Project {
  icon: string;
  color: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  completedTasks: number;
  totalTasks: number;
  due: string;
}
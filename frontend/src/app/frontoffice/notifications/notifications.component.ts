import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  notifications = [
    { icon: '✅', title: 'Task Completed', body: 'Alice marked "Design new landing page" as done.', time: '2 minutes ago', color: '#13deb9', read: false },
    { icon: '💬', title: 'New Comment', body: 'Bob commented on "Fix login API bug": looks good!', time: '15 minutes ago', color: '#5d87ff', read: false },
    { icon: '👥', title: 'Team Invite', body: 'You were added to the Frontend Team by Carol.', time: '1 hour ago', color: '#7460ee', read: false },
    { icon: '📅', title: 'Due Date Reminder', body: '"Write unit tests" is due tomorrow.', time: '3 hours ago', color: '#ffae1f', read: true },
    { icon: '🚀', title: 'Project Update', body: 'TaskFlow Web App progress reached 68%.', time: 'Yesterday', color: '#5d87ff', read: true },
    { icon: '⚠️', title: 'Overdue Task', body: '"Update README docs" is 2 days overdue.', time: '2 days ago', color: '#fa5c7c', read: true },
  ];

  markAllRead() {
    this.notifications.forEach(n => n.read = true);
  }
}

import { TeamsComponent } from '../../../pages/ui-components/teams/teams.component';
import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/dashboard/dashboard',
  },
  {
    navCap: 'Ui Components',
  },
  {
    displayName: 'User',
    iconName: 'rosette',
    route: '/dashboard/ui-components/badge',
  },
  {
    displayName: 'Teams',
    iconName: 'poker-chip',
    route: '/dashboard/ui-components/teams',
  },
  {
    displayName: 'Tasks',
    iconName: 'list',
    route: '/dashboard/ui-components/lists',
  },
  {
    displayName: 'Projects',
    iconName: 'layout-navbar-expand',
    route: '/dashboard/ui-components/menu',
  },
  {
    displayName: 'Notifications',
    iconName: 'tooltip',
    route: '/dashboard/ui-components/tooltips',
  },
  
];
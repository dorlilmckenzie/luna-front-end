export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Home', icon: '🏠' },
  { href: '/calendar', label: 'Calendar', icon: '📅' },
  { href: '/history', label: 'History', icon: '🗂️' },
  { href: '/statistics', label: 'Stats', icon: '📊' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'タイムライン', icon: '🏠' },
  { to: '/record/new', label: '記録する', icon: '➕' },
  { to: '/arcades', label: 'ゲーセン', icon: '🕹️' },
];

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background flex">
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-3 text-xs gap-1 ${
              isActive ? 'text-primary font-medium' : 'text-muted-foreground'
            }`
          }
        >
          <span className="text-xl">{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

import { Gift, Home, MapPin, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/timeline', label: 'タイムライン', icon: Home },
  { to: '/arcades', label: 'ゲーセン', icon: MapPin },
  { to: '/prizes', label: '景品', icon: Gift },
  { to: '/settings', label: '設定', icon: Settings },
];

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center">
      <nav className="flex w-full max-w-[640px] bg-card">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-3 text-xs ${
                isActive ? 'text-primary font-medium' : 'text-muted-foreground'
              }`
            }
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

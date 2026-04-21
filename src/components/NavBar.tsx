import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

const navItems = [
  { to: '/', label: 'タイムライン', icon: '🏠' },
  { to: '/record/new', label: '記録する', icon: '➕' },
  { to: '/arcades', label: 'ゲーセン', icon: '🕹️' },
];

export default function NavBar() {
  const { profile, session } = useAuthStore();
  const displayName = profile?.display_name ?? session?.user.email ?? '';
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  if (!session) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 border-b bg-background flex items-center justify-between px-4 py-2 text-xs text-muted-foreground z-10">
        <span>{displayName}</span>
        <button
          onClick={handleLogout}
          className="text-destructive underline"
        >
          ログアウト
        </button>
      </header>
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
    </>
  );
}

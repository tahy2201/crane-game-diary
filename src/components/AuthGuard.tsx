import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { session, isLoading } = useAuthStore();

  if (isLoading) return null;
  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

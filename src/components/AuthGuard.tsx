import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

type Props = {
  children: React.ReactNode;
};

/**
 * 認証が必要なページをラップするガードコンポーネント。
 * 未ログイン時は /login へリダイレクトし、認証確認中は何も描画しない。
 */
export default function AuthGuard({ children }: Props) {
  const { session, isLoading } = useAuthStore();

  if (isLoading) return null;
  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

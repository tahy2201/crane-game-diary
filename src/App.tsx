import { useState } from 'react';
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';
import BottomNavigation from '@/components/layout/BottomNavigation';
import FloatingActionButton from '@/components/layout/FloatingActionButton';
import Modal from '@/components/layout/Modal';
import { useAuth } from '@/hooks/useAuth';
import Arcades from '@/pages/Arcades';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import Dev from '@/pages/Dev';
import DeleteAccount from '@/pages/delete-account';
import GroupNew from '@/pages/group-new';
import Master from '@/pages/master';
import CraneTypesPage from '@/pages/master/crane-types';
import PrizeCategoriesPage from '@/pages/master/prize-categories';
import NotFound from '@/pages/NotFound';
import OwnerTransfer from '@/pages/owner-transfer';
import Prizes from '@/pages/prize';
import Settings from '@/pages/settings';
import Timeline from '@/pages/Timeline';

/** FAB を表示するパス。BottomNavigation のタブ画面のみに限定する */
const FAB_VISIBLE_PATHS = ['/timeline', '/arcades', '/prizes'];

/** ルーティングと共通レイアウト（BottomNavigation・FloatingActionButton・Modal）を束ねるコンポーネント */
function AppContent() {
  useAuth();
  const { pathname } = useLocation();
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const showFab = FAB_VISIBLE_PATHS.includes(pathname);

  return (
    <>
      {/* BottomNavigation の高さ分だけ下部に余白を確保 */}
      <div className="pb-16">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/timeline" replace />} />
          <Route
            path="/timeline"
            element={
              <AuthGuard>
                <Timeline />
              </AuthGuard>
            }
          />
          <Route
            path="/arcades"
            element={
              <AuthGuard>
                <Arcades />
              </AuthGuard>
            }
          />
          <Route
            path="/prizes"
            element={
              <AuthGuard>
                <Prizes />
              </AuthGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            }
          />
          <Route
            path="/group/new"
            element={
              <AuthGuard>
                <GroupNew />
              </AuthGuard>
            }
          />
          <Route
            path="/master"
            element={
              <AuthGuard>
                <Master />
              </AuthGuard>
            }
          />
          <Route
            path="/master/prize-categories"
            element={
              <AuthGuard>
                <PrizeCategoriesPage />
              </AuthGuard>
            }
          />
          <Route
            path="/master/crane-types"
            element={
              <AuthGuard>
                <CraneTypesPage />
              </AuthGuard>
            }
          />
          <Route
            path="/owner-transfer"
            element={
              <AuthGuard>
                <OwnerTransfer />
              </AuthGuard>
            }
          />
          <Route
            path="/delete-account"
            element={
              <AuthGuard>
                <DeleteAccount />
              </AuthGuard>
            }
          />
          <Route path="/dev" element={<Dev />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <BottomNavigation />
      {showFab && (
        <FloatingActionButton onClick={() => setIsRecordModalOpen(true)} />
      )}
      <Modal
        open={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="プレイを記録"
      >
        <p className="text-sm text-muted-foreground">
          記録フォームはここに入ります
        </p>
      </Modal>
    </>
  );
}

/** HashRouter でラップしたアプリケーションルート。GitHub Pages 対応のため HashRouter を使用 */
export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

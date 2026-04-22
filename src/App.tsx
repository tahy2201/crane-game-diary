import { useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';
import BottomNav from '@/components/layout/BottomNav';
import FAB from '@/components/layout/FAB';
import Modal from '@/components/layout/Modal';
import { useAuth } from '@/hooks/useAuth';
import Arcades from '@/pages/Arcades';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import Dev from '@/pages/Dev';
import NotFound from '@/pages/NotFound';
import Timeline from '@/pages/Timeline';
import Prizes from '@/pages/prize';
import Settings from '@/pages/settings';

function AppContent() {
  useAuth();
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <>
      <div className="pb-16">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/timeline" replace />} />
          <Route path="/timeline" element={<AuthGuard><Timeline /></AuthGuard>} />
          <Route path="/arcades" element={<AuthGuard><Arcades /></AuthGuard>} />
          <Route path="/prizes" element={<AuthGuard><Prizes /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
          <Route path="/dev" element={<Dev />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <BottomNav />
      <FAB onClick={() => setFabOpen(true)} />
      <Modal open={fabOpen} onClose={() => setFabOpen(false)} title="プレイを記録">
        <p className="text-sm text-muted-foreground">記録フォームはここに入ります</p>
      </Modal>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

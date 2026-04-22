import { HashRouter, Route, Routes } from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/hooks/useAuth';
import Arcades from '@/pages/Arcades';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import NotFound from '@/pages/NotFound';
import RecordNew from '@/pages/RecordNew';
import Timeline from '@/pages/Timeline';

function AppRoutes() {
  useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <Timeline />
          </AuthGuard>
        }
      />
      <Route
        path="/record/new"
        element={
          <AuthGuard>
            <RecordNew />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div className="pb-16">
        <AppRoutes />
      </div>
      <NavBar />
    </HashRouter>
  );
}

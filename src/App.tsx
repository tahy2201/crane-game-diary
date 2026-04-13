import { HashRouter, Route, Routes } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Arcades from '@/pages/Arcades';
import NotFound from '@/pages/NotFound';
import RecordNew from '@/pages/RecordNew';
import Timeline from '@/pages/Timeline';

export default function App() {
  return (
    <HashRouter>
      <div className="pb-16">
        <Routes>
          <Route path="/" element={<Timeline />} />
          <Route path="/record/new" element={<RecordNew />} />
          <Route path="/arcades" element={<Arcades />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <NavBar />
    </HashRouter>
  );
}

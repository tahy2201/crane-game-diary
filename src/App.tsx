import { HashRouter, Routes, Route } from 'react-router-dom'
import NavBar from '@/components/NavBar'
import Timeline from '@/pages/Timeline'
import RecordNew from '@/pages/RecordNew'
import Arcades from '@/pages/Arcades'
import NotFound from '@/pages/NotFound'

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
  )
}

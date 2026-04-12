import { HashRouter, Routes, Route } from 'react-router-dom'
import Timeline from '@/pages/Timeline'
import RecordNew from '@/pages/RecordNew'
import Arcades from '@/pages/Arcades'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Timeline />} />
        <Route path="/record/new" element={<RecordNew />} />
        <Route path="/arcades" element={<Arcades />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  )
}

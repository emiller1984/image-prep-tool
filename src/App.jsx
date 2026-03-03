import { Routes, Route } from 'react-router-dom'
import MainApp from './components/MainApp'
import AdminPage from './components/admin/AdminPage'
import BulkApp from './components/bulk/BulkApp'
import VisualApp from './components/visual/VisualApp'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/bulk" element={<BulkApp />} />
      <Route path="/visual" element={<VisualApp />} />
    </Routes>
  )
}

import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* ✅ Default route is now dashboard */}
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/history" element={
        <ProtectedRoute>
          <div>History View</div>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
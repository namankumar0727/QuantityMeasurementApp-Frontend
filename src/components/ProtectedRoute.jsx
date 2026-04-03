import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  
  console.log("🛡️ ProtectedRoute - session:", session);
  console.log("🛡️ ProtectedRoute - loading:", loading);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // ✅ This route is for history view - require login
  if (!session) {
    console.log("🛡️ No session, redirecting to login");
    return <Navigate to="/?requireLogin=true" replace />;
  }
  
  console.log("🛡️ Session found, rendering protected content");
  return <>{children}</>;
}
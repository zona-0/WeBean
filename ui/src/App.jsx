import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard tab="dashboard" /></ProtectedRoute>} />
          <Route path="/data" element={<ProtectedRoute><Dashboard tab="data" /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Dashboard tab="profile" /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard tab="admin" /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
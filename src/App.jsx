import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PresenceProvider } from './context/PresenceContext';
import { useEffect } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AccueilDashboard from './pages/AccueilDashboard';
import ParticipantPortal from './pages/ParticipantPortal';
import ParticipantDetail from './pages/ParticipantDetail';
import GenerateBadges from './pages/GenerateBadges';
import InstallPrompt from './components/InstallPrompt';
import './App.css';

// Enregistrer le Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker enregistré avec succès:', registration.scope);
      })
      .catch((error) => {
        console.log('Échec de l\'enregistrement du Service Worker:', error);
      });
  });
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true });
    } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      navigate('/', { replace: true });
    }
  }, [user, loading, allowedRoles, navigate]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null;
  }

  return children;
}

function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      const destination = user.role === 'admin' ? '/admin' : user.role === 'accueil' ? '/accueil' : '/participant-portal';
      navigate(destination, { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
  }

  return <Login />;
}

function App() {
  return (
    <AuthProvider>
      <PresenceProvider>
        <Router>
          <InstallPrompt />
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/accueil"
              element={
                <ProtectedRoute allowedRoles={['accueil']}>
                  <AccueilDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/participant-portal"
              element={
                <ProtectedRoute allowedRoles={['participant']}>
                  <ParticipantPortal />
                </ProtectedRoute>
              }
            />
            
            <Route path="/participant/:id" element={<ParticipantDetail />} />
            
            <Route
              path="/generate-badges"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <GenerateBadges />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </PresenceProvider>
    </AuthProvider>
  );
}

export default App;

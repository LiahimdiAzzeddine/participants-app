import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [selectedRole, setSelectedRole] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [accueilPassword, setAccueilPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const ADMIN_PASSWORD = 'admin2026'; // À changer en production
  const ACCUEIL_PASSWORD = 'equipe2026'; // À changer en production

  const handleLogin = () => {
    setError('');

    if (!selectedRole) {
      setError('Veuillez sélectionner un profil');
      return;
    }

    if (selectedRole === 'admin') {
      if (adminPassword !== ADMIN_PASSWORD) {
        setError('Mot de passe administrateur incorrect');
        return;
      }
      login('admin');
      navigate('/admin');
    } else if (selectedRole === 'accueil') {
      if (accueilPassword !== ACCUEIL_PASSWORD) {
        setError('Mot de passe équipe d\'accueil incorrect');
        return;
      }
      login('accueil');
      navigate('/accueil');
    } else if (selectedRole === 'participant') {
      login('participant');
      navigate('/participant-portal');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Tournoi Inter-filiales 2026</h1>
          <p>Système de Gestion des Participants</p>
        </div>

        <div className="login-body">
          <h2>Sélectionnez votre profil</h2>

          <div className="role-cards">
            <div
              className={`role-card ${selectedRole === 'admin' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('admin')}
            >
              <div className="role-icon">👨‍💼</div>
              <h3>Administrateur</h3>
              <p>Gestion complète des participants et génération des badges</p>
            </div>

            <div
              className={`role-card ${selectedRole === 'accueil' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('accueil')}
            >
              <div className="role-icon">🎫</div>
              <h3>Équipe d'Accueil</h3>
              <p>Scanner les QR codes et marquer les présences</p>
            </div>

            <div
              className={`role-card ${selectedRole === 'participant' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('participant')}
            >
              <div className="role-icon">👤</div>
              <h3>Participant</h3>
              <p>Consulter votre fiche et statut de présence</p>
            </div>
          </div>

          {selectedRole === 'admin' && (
            <div className="admin-password">
              <label>Mot de passe administrateur</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          )}

          {selectedRole === 'accueil' && (
            <div className="admin-password">
              <label>Mot de passe équipe d'accueil</label>
              <input
                type="password"
                value={accueilPassword}
                onChange={(e) => setAccueilPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={handleLogin}
            className="btn-login"
            disabled={!selectedRole}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

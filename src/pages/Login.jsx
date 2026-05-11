import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiUsers, FiUser, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [selectedRole, setSelectedRole] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [accueilPassword, setAccueilPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const adminInputRef = useRef(null);
  const accueilInputRef = useRef(null);

  const ADMIN_PASSWORD = 'admin2026'; // À changer en production
  const ACCUEIL_PASSWORD = 'equipe2026'; // À changer en production

  // Auto-focus sur l'input quand un profil est sélectionné
  useEffect(() => {
    if (selectedRole === 'admin' && adminInputRef.current) {
      setTimeout(() => {
        adminInputRef.current.focus();
        // Scroll pour rendre l'input visible sur mobile
        const inputRect = adminInputRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Si l'input n'est pas visible, scroller
        if (inputRect.top < 0 || inputRect.bottom > viewportHeight) {
          adminInputRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 150);
    } else if (selectedRole === 'accueil' && accueilInputRef.current) {
      setTimeout(() => {
        accueilInputRef.current.focus();
        // Scroll pour rendre l'input visible sur mobile
        const inputRect = accueilInputRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Si l'input n'est pas visible, scroller
        if (inputRect.top < 0 || inputRect.bottom > viewportHeight) {
          accueilInputRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 150);
    } else if (selectedRole === 'participant') {
      // Pour le participant, se connecter directement
      handleLogin();
    }
  }, [selectedRole]);

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
              <div className="role-icon">
                <FiShield />
              </div>
              <h3>Administrateur</h3>
              <p>Gestion complète des participants et génération des badges</p>
            </div>

            <div
              className={`role-card ${selectedRole === 'accueil' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('accueil')}
            >
              <div className="role-icon">
                <FiUsers />
              </div>
              <h3>Équipe d'Accueil</h3>
              <p>Scanner les QR codes et marquer les présences</p>
            </div>

            <div
              className={`role-card ${selectedRole === 'participant' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('participant')}
            >
              <div className="role-icon">
                <FiUser />
              </div>
              <h3>Participant</h3>
              <p>Consulter votre fiche et statut de présence</p>
            </div>
          </div>

          {selectedRole === 'admin' && (
            <div className="admin-password">
              <label>
                <FiLock style={{ marginRight: '0.5rem' }} />
                Mot de passe administrateur
              </label>
              <input
                ref={adminInputRef}
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
              <label>
                <FiLock style={{ marginRight: '0.5rem' }} />
                Mot de passe équipe d'accueil
              </label>
              <input
                ref={accueilInputRef}
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

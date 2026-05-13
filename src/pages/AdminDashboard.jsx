import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiCheckCircle, FiXCircle, FiAward, FiSearch, FiDownload, FiFileText, FiLogOut, FiEye } from 'react-icons/fi';
import { readExcelFile } from '../utils/excelReader';
import { useAuth } from '../context/AuthContext';
import { usePresence } from '../context/PresenceContext';
import { useConsent } from '../context/ConsentContext';
import './AdminDashboard.css';

function AdminDashboard() {
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const { logout } = useAuth();
  const { presences } = usePresence();
  const { consents } = useConsent();
  const navigate = useNavigate();

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    const data = await readExcelFile('/ListeParticipantsTournoiInterfiliales2026.xlsx');
    setParticipants(data);
    setFilteredParticipants(data);
  };

  useEffect(() => {
    let filtered = participants;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.participant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.filiale.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDiscipline) {
      filtered = filtered.filter(p => p.discipline === selectedDiscipline);
    }

    setFilteredParticipants(filtered);
  }, [searchTerm, selectedDiscipline, participants]);

  const disciplines = [...new Set(participants.map(p => p.discipline))].filter(Boolean);

  const toggleSelectParticipant = (id) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(selectedParticipants.filter(pid => pid !== id));
    } else {
      setSelectedParticipants([...selectedParticipants, id]);
    }
  };

  const selectAll = () => {
    setSelectedParticipants(filteredParticipants.map(p => p.id));
  };

  const deselectAll = () => {
    setSelectedParticipants([]);
  };

  const generateBadges = () => {
    const ids = selectedParticipants.length > 0 ? selectedParticipants : filteredParticipants.map(p => p.id);
    navigate('/generate-badges', { state: { participantIds: ids } });
  };

  const exportPresences = () => {
    const data = participants.map(p => ({
      ID: p.id,
      Participant: p.participant,
      Filiale: p.filiale,
      Discipline: p.discipline,
      Direction: p.direction,
      Ville: p.ville || '-',
      'Ville de départ': p.villeDepart || '-',
      Présent: presences[p.id] ? 'Oui' : 'Non',
      'Heure pointage': presences[p.id]?.time || '-',
      'Date pointage': presences[p.id]?.date || '-'
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `presences_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportConsents = () => {
    // Filtrer uniquement les participants qui ont accepté le consentement
    const participantsWithConsent = participants.filter(p => consents[p.id]?.validated);
    
    const data = participantsWithConsent.map(p => ({
      ID: p.id,
      Participant: p.participant,
      Filiale: p.filiale,
      Discipline: p.discipline,
      Direction: p.direction,
      'Email participant': p.emailParticipant,
      'Email responsable': p.emailResponsable || '-',
      Ville: p.ville || '-',
      'Ville de départ': p.villeDepart || '-',
      'Date validation': consents[p.id]?.date || '-',
      'Lieu validation': consents[p.id]?.lieu || '-',
      'Heure validation': consents[p.id]?.timestamp ? new Date(consents[p.id].timestamp).toLocaleTimeString('fr-FR') : '-'
    }));

    if (data.length === 0) {
      alert('Aucun participant n\'a encore accepté le consentement.');
      return;
    }

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `consentements_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const presentCount = participants.filter(p => presences[p.id]).length;
  const consentCount = participants.filter(p => consents[p.id]?.validated).length;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Tableau de Bord Administrateur</h1>
          <p>Gestion des participants et génération des badges</p>
        </div>
        <button onClick={logout} className="btn-logout">
          <FiLogOut style={{ marginRight: '0.5rem' }} />
          Déconnexion
        </button>
      </header>

      <div className="admin-stats">
        <div className="stat-card">
          <FiUsers className="stat-icon" />
          <span className="stat-number">{participants.length}</span>
          <span className="stat-label">Total Participants</span>
        </div>
        <div className="stat-card">
          <FiCheckCircle className="stat-icon" />
          <span className="stat-number">{presentCount}</span>
          <span className="stat-label">Présents</span>
        </div>
        <div className="stat-card">
          <FiXCircle className="stat-icon" />
          <span className="stat-number">{participants.length - presentCount}</span>
          <span className="stat-label">Absents</span>
        </div>
        <div className="stat-card">
          <FiAward className="stat-icon" />
          <span className="stat-number">{disciplines.length}</span>
          <span className="stat-label">Disciplines</span>
        </div>
      </div>

      <div className="admin-actions">
        <div className="filters-row">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom, filiale ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les disciplines</option>
            {disciplines.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="action-buttons">
          <button onClick={selectAll} className="btn-action">
            Tout sélectionner
          </button>
          <button onClick={deselectAll} className="btn-action">
            Tout désélectionner
          </button>
          <button onClick={generateBadges} className="btn-action primary">
            <FiFileText style={{ marginRight: '0.5rem' }} />
            Générer les badges ({selectedParticipants.length || filteredParticipants.length})
          </button>
          <button onClick={exportPresences} className="btn-action secondary">
            <FiDownload style={{ marginRight: '0.5rem' }} />
            Exporter les présences
          </button>
          <button onClick={exportConsents} className="btn-action secondary">
            <FiDownload style={{ marginRight: '0.5rem' }} />
            Exporter les consentements ({consentCount})
          </button>
        </div>
      </div>

      <div className="participants-table">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedParticipants.length === filteredParticipants.length && filteredParticipants.length > 0}
                  onChange={(e) => e.target.checked ? selectAll() : deselectAll()}
                />
              </th>
              <th>ID</th>
              <th>Participant</th>
              <th>Filiale</th>
              <th>Discipline</th>
              <th>Direction</th>
              <th>Ville</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.map(participant => (
              <tr key={participant.id} className={presences[participant.id] ? 'present' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(participant.id)}
                    onChange={() => toggleSelectParticipant(participant.id)}
                  />
                </td>
                <td>{participant.id}</td>
                <td className="participant-name">{participant.participant}</td>
                <td>{participant.filiale}</td>
                <td><span className="discipline-tag">{participant.discipline}</span></td>
                <td>{participant.direction}</td>
                <td>{participant.ville || '-'}</td>
                <td>
                  {presences[participant.id] ? (
                    <span className="status-badge present">Présent</span>
                  ) : (
                    <span className="status-badge absent">Absent</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/participant/${participant.id}`)}
                    className="btn-view-small"
                  >
                    <FiEye style={{ marginRight: '0.35rem' }} />
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredParticipants.length === 0 && (
        <div className="no-results">Aucun participant trouvé</div>
      )}
    </div>
  );
}

export default AdminDashboard;

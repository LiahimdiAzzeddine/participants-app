import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { readExcelFile } from '../utils/excelReader';
import './HomePage.css';

function HomePage() {
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedVille, setSelectedVille] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    const data = await readExcelFile('/Participants_QR_Complet.xlsx');
    setParticipants(data);
    setFilteredParticipants(data);
    setLoading(false);
  };

  useEffect(() => {
    filterParticipants();
  }, [searchTerm, selectedDiscipline, selectedVille, participants]);

  const filterParticipants = () => {
    let filtered = participants;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.participant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.societe.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDiscipline) {
      filtered = filtered.filter(p => p.discipline === selectedDiscipline);
    }

    if (selectedVille) {
      filtered = filtered.filter(p => p.ville === selectedVille);
    }

    setFilteredParticipants(filtered);
  };

  const disciplines = [...new Set(participants.map(p => p.discipline))].filter(Boolean);
  const villes = [...new Set(participants.map(p => p.ville))].filter(Boolean);

  if (loading) {
    return <div className="loading">Chargement des participants...</div>;
  }

  return (
    <div className="home-page">
      <header className="header">
        <h1>Gestion des Participants</h1>
        <p>Compétition 'Nom de Compétition' - Mai 2026</p>
        <div className="header-actions">
          <Link to="/checkin" className="btn-checkin-link">
            Pointage des présences
          </Link>
        </div>
      </header>

      <div className="filters-container">
        <div className="filters">
          <input
            type="text"
            placeholder="Rechercher un participant ou société..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

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

          <select
            value={selectedVille}
            onChange={(e) => setSelectedVille(e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les villes</option>
            {villes.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <span className="stat-number">{filteredParticipants.length}</span>
          <span className="stat-label">Participants</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{disciplines.length}</span>
          <span className="stat-label">Disciplines</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{villes.length}</span>
          <span className="stat-label">Villes</span>
        </div>
      </div>

      <div className="participants-grid">
        {filteredParticipants.map(participant => (
          <Link
            key={participant.id}
            to={`/participant/${participant.id}`}
            className="participant-card"
          >
            <div className="card-header">
              <span className="discipline-badge">{participant.discipline}</span>
              <span className="id-badge">{participant.id}</span>
            </div>
            <h3>{participant.participant}</h3>
            <p className="societe">{participant.societe}</p>
            <div className="card-info">
              <p className="info-location">{participant.ville}</p>
              <p className="info-date">{participant.dateCompetition} à {participant.heure}</p>
            </div>
          </Link>
        ))}
      </div>

      {filteredParticipants.length === 0 && (
        <div className="no-results">
          <p>Aucun participant trouvé</p>
        </div>
      )}
    </div>
  );
}

export default HomePage;

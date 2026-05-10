import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { readExcelFile } from '../utils/excelReader';
import './CheckIn.css';

function CheckIn() {
  const [participants, setParticipants] = useState([]);
  const [checkedIn, setCheckedIn] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadParticipants();
    loadCheckedInStatus();
  }, []);

  const loadParticipants = async () => {
    const data = await readExcelFile('/Participants_QR_new.xlsx');
    setParticipants(data);
    setFilteredParticipants(data);
  };

  const loadCheckedInStatus = () => {
    const saved = localStorage.getItem('checkedIn');
    if (saved) {
      setCheckedIn(JSON.parse(saved));
    }
  };

  const handleCheckIn = (participantId) => {
    const newCheckedIn = {
      ...checkedIn,
      [participantId]: {
        timestamp: new Date().toISOString(),
        time: new Date().toLocaleTimeString('fr-FR')
      }
    };
    setCheckedIn(newCheckedIn);
    localStorage.setItem('checkedIn', JSON.stringify(newCheckedIn));
  };

  const handleCheckOut = (participantId) => {
    const newCheckedIn = { ...checkedIn };
    delete newCheckedIn[participantId];
    setCheckedIn(newCheckedIn);
    localStorage.setItem('checkedIn', JSON.stringify(newCheckedIn));
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = participants.filter(p =>
        p.participant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.filiale.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredParticipants(filtered);
    } else {
      setFilteredParticipants(participants);
    }
  }, [searchTerm, participants]);

  const checkedInCount = Object.keys(checkedIn).length;
  const totalCount = participants.length;

  const exportPresences = () => {
    const data = participants.map(p => ({
      ID: p.id,
      Participant: p.participant,
      Filiale: p.filiale,
      Discipline: p.discipline,
      Présent: checkedIn[p.id] ? 'Oui' : 'Non',
      'Heure pointage': checkedIn[p.id]?.time || '-'
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `presences_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="checkin-page">
      <header className="checkin-header">
        <div>
          <h1>Pointage des Présences</h1>
          <p>Tournoi Inter-filiales 2026</p>
        </div>
        <button onClick={() => navigate('/')} className="btn-back-home">
          Retour à l'accueil
        </button>
      </header>

      <div className="checkin-stats">
        <div className="stat-box present">
          <span className="stat-number">{checkedInCount}</span>
          <span className="stat-label">Présents</span>
        </div>
        <div className="stat-box absent">
          <span className="stat-number">{totalCount - checkedInCount}</span>
          <span className="stat-label">Absents</span>
        </div>
        <div className="stat-box total">
          <span className="stat-number">{totalCount}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      <div className="checkin-actions">
        <input
          type="text"
          placeholder="Rechercher par nom, ID ou société..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-checkin"
        />
        <button onClick={exportPresences} className="btn-export">
          Exporter les présences (CSV)
        </button>
      </div>

      <div className="checkin-list">
        {filteredParticipants.map(participant => (
          <div
            key={participant.id}
            className={`checkin-item ${checkedIn[participant.id] ? 'checked-in' : ''}`}
          >
            <div className="checkin-info">
              <div className="checkin-main">
                <span className="checkin-id">{participant.id}</span>
                <span className="checkin-name">{participant.participant}</span>
              </div>
              <div className="checkin-details">
                <span>{participant.filiale}</span>
                <span className="separator">•</span>
                <span>{participant.discipline}</span>
              </div>
              {checkedIn[participant.id] && (
                <div className="checkin-time">
                  Pointé à {checkedIn[participant.id].time}
                </div>
              )}
            </div>
            <div className="checkin-buttons">
              {!checkedIn[participant.id] ? (
                <button
                  onClick={() => handleCheckIn(participant.id)}
                  className="btn-checkin"
                >
                  Pointer
                </button>
              ) : (
                <button
                  onClick={() => handleCheckOut(participant.id)}
                  className="btn-checkout"
                >
                  Annuler
                </button>
              )}
              <button
                onClick={() => navigate(`/participant/${participant.id}`)}
                className="btn-view"
              >
                Voir badge
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredParticipants.length === 0 && (
        <div className="no-results">
          Aucun participant trouvé
        </div>
      )}
    </div>
  );
}

export default CheckIn;

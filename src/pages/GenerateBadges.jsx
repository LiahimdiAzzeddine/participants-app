import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { readExcelFile } from '../utils/excelReader';
import './GenerateBadges.css';

function GenerateBadges() {
  const location = useLocation();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const badgeRefs = useRef([]);

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    const participantIds = location.state?.participantIds || [];
    const allData = await readExcelFile('/Participants_QR_Complet.xlsx');
    
    if (participantIds.length > 0) {
      const filtered = allData.filter(p => participantIds.includes(p.id));
      setParticipants(filtered);
    } else {
      setParticipants(allData);
    }
    
    setLoading(false);
  };

  const generateAllBadges = async () => {
    setGenerating(true);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    for (let i = 0; i < participants.length; i++) {
      const element = badgeRefs.current[i];
      if (element) {
        const canvas = await html2canvas(element, {
          scale: 2,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        setProgress(Math.round(((i + 1) / participants.length) * 100));
      }
    }
    
    pdf.save(`Badges_${participants.length}_participants.pdf`);
    setGenerating(false);
    setProgress(0);
  };

  if (loading) {
    return (
      <div className="generate-page">
        <div className="loading">Chargement des participants...</div>
      </div>
    );
  }

  return (
    <div className="generate-page">
      <header className="generate-header">
        <div>
          <h1>Génération des Badges</h1>
          <p>{participants.length} badge(s) à générer</p>
        </div>
        <button onClick={() => navigate('/admin')} className="btn-back-admin">
          Retour au tableau de bord
        </button>
      </header>

      <div className="generate-actions">
        <button 
          onClick={generateAllBadges} 
          className="btn-generate"
          disabled={generating}
        >
          {generating ? `Génération en cours... ${progress}%` : 'Générer tous les badges (PDF)'}
        </button>
      </div>

      {generating && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <div className="badges-preview">
        <h2>Aperçu des badges</h2>
        <div className="badges-grid">
          {participants.map((participant, index) => (
            <div 
              key={participant.id} 
              className="badge-preview"
              ref={el => badgeRefs.current[index] = el}
            >
              <div className="badge">
                <div className="badge-header">
                  <h1>Compétition Veolia</h1>
                  <p className="badge-subtitle">Mai 2026</p>
                </div>

                <div className="badge-body">
                  <div className="participant-info">
                    <h2>{participant.participant}</h2>
                    <p className="discipline-tag">{participant.discipline}</p>
                  </div>

                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Société</span>
                      <span className="info-value">{participant.societe}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Direction</span>
                      <span className="info-value">{participant.direction}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Date</span>
                      <span className="info-value">{participant.dateCompetition}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Heure</span>
                      <span className="info-value">{participant.heure}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Lieu</span>
                      <span className="info-value">{participant.lieu}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Ville</span>
                      <span className="info-value">{participant.ville}</span>
                    </div>
                  </div>

                  <div className="qr-section">
                    <QRCodeCanvas
                      value={`${window.location.origin}/participant/${participant.id}`}
                      size={150}
                      level="H"
                      includeMargin={true}
                    />
                    <p className="participant-id">{participant.id}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GenerateBadges;

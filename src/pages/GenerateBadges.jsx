import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
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
    const allData = await readExcelFile('/ListeParticipantsTournoiInterfiliales2026.xlsx');
    
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
    const zip = new JSZip();
    const folder = zip.folder('badges');
    
    for (let i = 0; i < participants.length; i++) {
      const element = badgeRefs.current[i];
      const participant = participants[i];
      
      if (element) {
        // Forcer la largeur avant la capture
        const originalWidth = element.style.width;
        element.style.width = '300px';
        
        const canvas = await html2canvas(element, {
          scale: 2,
          backgroundColor: '#ffffff',
          width: 300,
          windowWidth: 300
        });
        
        // Restaurer la largeur originale
        element.style.width = originalWidth;
        
        // Convertir en blob PNG
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        
        // Nom du fichier : Badge_PART-0001_NomParticipant.png
        const fileName = `Badge_${participant.id}_${participant.participant.replace(/[^a-z0-9]/gi, '_')}.png`;
        folder.file(fileName, blob);
        
        setProgress(Math.round(((i + 1) / participants.length) * 100));
      }
    }
    
    // Générer et télécharger le ZIP
    const content = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
    
    saveAs(content, `Badges_${participants.length}_participants.zip`);
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
          {generating ? `Génération en cours... ${progress}%` : 'Télécharger tous les badges (ZIP)'}
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
                  <img src="/Veolia_logo.png" alt="Veolia" className="badge-logo" />
                  <h1>{participant.participant}</h1>
                </div>
                <div className="badge-discipline">
                  <span className="discipline-tag-header">{participant.discipline}</span>
                </div>

                <div className="badge-body">
                  <div className="info-grid">
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
                    {participant.ville && (
                      <div className="info-item">
                        <span className="info-label">Ville</span>
                        <span className="info-value">{participant.ville}</span>
                      </div>
                    )}
                  </div>

                  <div className="qr-section">
                    <QRCodeCanvas
                      value={`${window.location.origin}/participant/${participant.id}`}
                      size={120}
                      level="H"
                      includeMargin={true}
                    />
                    <p className="qr-label">Scannez pour accéder</p>
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

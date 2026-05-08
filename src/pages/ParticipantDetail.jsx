import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { readExcelFile } from '../utils/excelReader';
import './ParticipantDetail.css';

function ParticipantDetail() {
  const { id } = useParams();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const badgeRef = useRef(null);
  const qrRef = useRef(null);

  useEffect(() => {
    loadParticipant();
  }, [id]);

  const loadParticipant = async () => {
    const data = await readExcelFile('/Participants_QR_Complet.xlsx');
    const found = data.find(p => p.id === id);
    setParticipant(found);
    setLoading(false);
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `QR_${participant.id}_${participant.participant}.png`;
    link.href = url;
    link.click();
  };

  const downloadBadge = async () => {
    const element = badgeRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff'
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Badge_${participant.id}_${participant.participant}.pdf`);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!participant) {
    return (
      <div className="not-found">
        <h2>Participant non trouvé</h2>
        <Link to="/" className="btn-back">Retour à l'accueil</Link>
      </div>
    );
  }

  const qrUrl = `${window.location.origin}/participant/${participant.id}`;

  return (
    <div className="detail-page">
      <Link to="/" className="btn-back">← Retour</Link>

      <div className="badge-container" ref={badgeRef}>
        <div className="badge">
          <div className="badge-header">
            <h1>Compétition Nom</h1>
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
                <span className="info-label">Email</span>
                <span className="info-value">{participant.emailParticipant}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Responsable</span>
                <span className="info-value">{participant.emailResponsable}</span>
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

            <div className="qr-section" ref={qrRef}>
              <QRCodeCanvas
                value={qrUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
              <p className="qr-label">Scannez pour accéder</p>
              <p className="participant-id">{participant.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="actions">
        <button onClick={downloadQRCode} className="btn-download">
          Télécharger le QR Code
        </button>
        <button onClick={downloadBadge} className="btn-download primary">
          Télécharger le badge
        </button>
      </div>
    </div>
  );
}

export default ParticipantDetail;

import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { FiArrowLeft, FiCheckCircle, FiClock, FiDownload, FiXCircle, FiUser, FiBriefcase, FiMail, FiAward, FiCalendar, FiMapPin } from 'react-icons/fi';
import { readExcelFile } from '../utils/excelReader';
import { useAuth } from '../context/AuthContext';
import { usePresence } from '../context/PresenceContext';
import './ParticipantDetail.css';

function ParticipantDetail() {
  const { id } = useParams();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const badgeRef = useRef(null);
  const qrRef = useRef(null);
  const { user } = useAuth();
  const { markPresent, markAbsent, isPresent, getPresenceInfo } = usePresence();

  const isAccueil = user?.role === 'accueil';
  const present = participant ? isPresent(participant.id) : false;
  const presenceInfo = participant ? getPresenceInfo(participant.id) : null;

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

    // Télécharger directement en PNG
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `Badge_${participant.id}_${participant.participant}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleMarkPresent = () => {
    if (participant) {
      markPresent(participant.id);
    }
  };

  const handleMarkAbsent = () => {
    if (participant) {
      markAbsent(participant.id);
    }
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
      <Link to={isAccueil ? "/accueil" : "/"} className="btn-back">
        <FiArrowLeft style={{ marginRight: '0.5rem' }} />
        Retour
      </Link>

      {isAccueil && (
        <div className={`presence-banner ${present ? 'present' : 'absent'}`}>
          {present ? (
            <div className="presence-info">
              <FiCheckCircle className="presence-icon" />
              <div>
                <h3>Participant présent</h3>
                <p>Pointé le {presenceInfo.date} à {presenceInfo.time}</p>
              </div>
            </div>
          ) : (
            <div className="presence-info">
              <FiClock className="presence-icon" />
              <div>
                <h3>Participant non pointé</h3>
                <p>Cliquez sur le bouton ci-dessous pour marquer comme présent</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="badge-container" ref={badgeRef}>
        <div className="badge">
          <div className="badge-header">
            <h1>{participant.participant}</h1>
            <p className="discipline-tag-header">{participant.discipline}</p>
          </div>

          <div className="badge-body">

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">
                  <FiBriefcase style={{ marginRight: '0.35rem' }} />
                  Société
                </span>
                <span className="info-value">{participant.societe}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <FiBriefcase style={{ marginRight: '0.35rem' }} />
                  Direction
                </span>
                <span className="info-value">{participant.direction}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <FiMail style={{ marginRight: '0.35rem' }} />
                  Email
                </span>
                <span className="info-value">{participant.emailParticipant}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <FiUser style={{ marginRight: '0.35rem' }} />
                  Responsable
                </span>
                <span className="info-value">{participant.emailResponsable}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <FiCalendar style={{ marginRight: '0.35rem' }} />
                  Date
                </span>
                <span className="info-value">{participant.dateCompetition}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <FiClock style={{ marginRight: '0.35rem' }} />
                  Heure
                </span>
                <span className="info-value">{participant.heure}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <FiMapPin style={{ marginRight: '0.35rem' }} />
                  Lieu
                </span>
                <span className="info-value">{participant.lieu}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <FiMapPin style={{ marginRight: '0.35rem' }} />
                  Ville
                </span>
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
        {isAccueil ? (
          <>
            {!present ? (
              <button onClick={handleMarkPresent} className="btn-mark-present">
                <FiCheckCircle style={{ marginRight: '0.5rem' }} />
                Marquer comme présent
              </button>
            ) : (
              <button onClick={handleMarkAbsent} className="btn-mark-absent">
                <FiXCircle style={{ marginRight: '0.5rem' }} />
                Annuler la présence
              </button>
            )}
          </>
        ) : (
          <>
            <button onClick={downloadQRCode} className="btn-download">
              <FiDownload style={{ marginRight: '0.5rem' }} />
              Télécharger le QR Code
            </button>
            <button onClick={downloadBadge} className="btn-download primary">
              <FiDownload style={{ marginRight: '0.5rem' }} />
              Télécharger le badge (PNG)
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ParticipantDetail;

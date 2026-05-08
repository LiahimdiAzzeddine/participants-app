import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useAuth } from '../context/AuthContext';
import { usePresence } from '../context/PresenceContext';
import { readExcelFile } from '../utils/excelReader';
import './ParticipantPortal.css';

function ParticipantPortal() {
  const [scanning, setScanning] = useState(false);
  const [participant, setParticipant] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState('');
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const { logout, user } = useAuth();
  const { isPresent, getPresenceInfo } = usePresence();
  const navigate = useNavigate();

  useEffect(() => {
    // Détecter si c'est un mobile en premier
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobile);
    
    const loadData = async () => {
      const data = await readExcelFile('/Participants_QR_Complet.xlsx');
      setParticipants(data);
      
      // Si l'utilisateur a déjà un participant ID, le charger
      if (user?.participantId) {
        const found = data.find(p => p.id === user.participantId);
        if (found) {
          setParticipant(found);
        }
      }
    };
    
    loadData();
    codeReader.current = new BrowserMultiFormatReader();
    loadCameras();

    return () => {
      stopScanning();
    };
  }, [user?.participantId]);

  const loadCameras = async () => {
    try {
      const videoInputDevices = await codeReader.current.listVideoInputDevices();
      setCameras(videoInputDevices);
      
      // Détecter si c'est un mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Sur mobile : sélectionner la caméra arrière
        const backCamera = videoInputDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        );
        
        if (backCamera) {
          setSelectedCamera(backCamera.deviceId);
        } else if (videoInputDevices.length > 0) {
          setSelectedCamera(videoInputDevices[0].deviceId);
        }
      } else {
        // Sur laptop/desktop : utiliser la première caméra (webcam)
        if (videoInputDevices.length > 0) {
          setSelectedCamera(videoInputDevices[0].deviceId);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des caméras:', error);
    }
  };

  const loadParticipants = async () => {
    const data = await readExcelFile('/Participants_QR_Complet.xlsx');
    setParticipants(data);
  };

  const startScanning = async () => {
    if (!selectedCamera) {
      setMessage('Veuillez sélectionner une caméra');
      return;
    }

    setScanning(true);
    setMessage('');

    try {
      codeReader.current.decodeFromVideoDevice(
        selectedCamera,
        videoRef.current,
        (result, err) => {
          if (result) {
            handleScanResult(result.text);
          }
        }
      );
    } catch (error) {
      setMessage('Erreur d\'accès à la caméra');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    setScanning(false);
  };

  const handleScanResult = (url) => {
    stopScanning();
    
    const match = url.match(/participant\/([A-Z]+-\d+)/);
    if (match) {
      const participantId = match[1];
      const found = participants.find(p => p.id === participantId);
      
      if (found) {
        setParticipant(found);
        setMessage('✓ Fiche chargée avec succès');
      } else {
        setMessage('Participant non trouvé');
      }
    } else {
      setMessage('QR Code invalide');
    }
  };

  const presenceInfo = participant ? getPresenceInfo(participant.id) : null;
  const present = participant ? isPresent(participant.id) : false;

  return (
    <div className="participant-portal">
      <header className="portal-header">
        <div>
          <h1>Portail Participant</h1>
          <p>Consultez votre fiche personnelle</p>
        </div>
        <button onClick={logout} className="btn-logout">
          Déconnexion
        </button>
      </header>

      {!participant ? (
        <div className="scanner-section">
          <div className="scanner-container-portal">
            {!scanning ? (
              <div className="scanner-placeholder">
                <div className="scanner-icon">📱</div>
                <h2>Scanner votre QR Code</h2>
                <p>Scannez le QR Code de votre badge pour accéder à votre fiche</p>
                
                {isMobile && cameras.length > 1 && (
                  <div className="camera-selector">
                    <label>Choisir la caméra :</label>
                    <select 
                      value={selectedCamera} 
                      onChange={(e) => setSelectedCamera(e.target.value)}
                      className="camera-select"
                    >
                      {cameras.map(camera => (
                        <option key={camera.deviceId} value={camera.deviceId}>
                          {camera.label || `Caméra ${cameras.indexOf(camera) + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <button onClick={startScanning} className="btn-scan">
                  Scanner mon QR Code
                </button>
              </div>
            ) : (
              <div className="scanner-active">
                <video ref={videoRef} className="scanner-video" />
                <button onClick={stopScanning} className="btn-stop-scan">
                  Annuler
                </button>
              </div>
            )}
          </div>

          {message && (
            <div className={`scan-message ${message.includes('✓') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>
      ) : (
        <div className="participant-info-portal">
          <div className="status-banner">
            {present ? (
              <div className="status-present">
                <span className="status-icon">✓</span>
                <div>
                  <h3>Vous êtes marqué comme présent</h3>
                  <p>Pointé le {presenceInfo.date} à {presenceInfo.time}</p>
                </div>
              </div>
            ) : (
              <div className="status-absent">
                <span className="status-icon">⏳</span>
                <div>
                  <h3>Vous n'êtes pas encore pointé</h3>
                  <p>Présentez-vous à l'accueil pour être enregistré</p>
                </div>
              </div>
            )}
          </div>

          <div className="participant-card-portal">
            <h2>{participant.participant}</h2>
            
            <div className="info-section">
              <h3>Informations personnelles</h3>
              <div className="info-grid-portal">
                <div className="info-item-portal">
                  <span className="label">ID Participant</span>
                  <span className="value">{participant.id}</span>
                </div>
                <div className="info-item-portal">
                  <span className="label">Société</span>
                  <span className="value">{participant.societe}</span>
                </div>
                <div className="info-item-portal">
                  <span className="label">Direction</span>
                  <span className="value">{participant.direction}</span>
                </div>
                <div className="info-item-portal">
                  <span className="label">Email</span>
                  <span className="value">{participant.emailParticipant}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Compétition</h3>
              <div className="info-grid-portal">
                <div className="info-item-portal">
                  <span className="label">Discipline</span>
                  <span className="value highlight">{participant.discipline}</span>
                </div>
                <div className="info-item-portal">
                  <span className="label">Date</span>
                  <span className="value">{participant.dateCompetition}</span>
                </div>
                <div className="info-item-portal">
                  <span className="label">Heure</span>
                  <span className="value">{participant.heure}</span>
                </div>
                <div className="info-item-portal">
                  <span className="label">Lieu</span>
                  <span className="value">{participant.lieu}, {participant.ville}</span>
                </div>
              </div>
            </div>

            <div className="portal-actions">
              <button
                onClick={() => navigate(`/participant/${participant.id}`)}
                className="btn-view-badge"
              >
                Voir mon badge complet
              </button>
              <button
                onClick={() => setParticipant(null)}
                className="btn-scan-another"
              >
                Scanner un autre QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParticipantPortal;

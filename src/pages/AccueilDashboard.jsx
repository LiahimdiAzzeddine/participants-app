import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useAuth } from '../context/AuthContext';
import { usePresence } from '../context/PresenceContext';
import { readExcelFile } from '../utils/excelReader';
import './AccueilDashboard.css';

function AccueilDashboard() {
  const [scanning, setScanning] = useState(false);
  const [participant, setParticipant] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState('');
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const { logout } = useAuth();
  const { markPresent, isPresent, getPresenceInfo, presences } = usePresence();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const data = await readExcelFile('/Participants_QR_Complet.xlsx');
      setParticipants(data);
    };
    
    loadData();
    codeReader.current = new BrowserMultiFormatReader();
    loadCameras();
    
    return () => {
      stopScanning();
    };
  }, []);

  const loadCameras = async () => {
    try {
      const videoInputDevices = await codeReader.current.listVideoInputDevices();
      setCameras(videoInputDevices);
      
      // Sélectionner automatiquement la caméra arrière
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
    } catch (error) {
      console.error('Erreur lors du chargement des caméras:', error);
    }
  };

  const startScanning = async () => {
    if (!selectedCamera) {
      setMessage('Veuillez sélectionner une caméra');
      return;
    }

    setScanning(true);
    setMessage('');
    setParticipant(null);

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
    
    // Extraire l'ID du participant depuis l'URL
    const match = url.match(/participant\/([A-Z]+-\d+)/);
    if (match) {
      const participantId = match[1];
      const found = participants.find(p => p.id === participantId);
      
      if (found) {
        setParticipant(found);
        if (!isPresent(participantId)) {
          markPresent(participantId);
          setMessage(`✓ ${found.participant} marqué comme présent`);
        } else {
          const info = getPresenceInfo(participantId);
          setMessage(`ℹ ${found.participant} déjà pointé à ${info.time}`);
        }
      } else {
        setMessage('Participant non trouvé');
      }
    } else {
      setMessage('QR Code invalide');
    }
  };

  const presentCount = Object.keys(presences).length;

  return (
    <div className="accueil-dashboard">
      <header className="accueil-header">
        <div>
          <h1>Équipe d'Accueil</h1>
          <p>Scanner les QR codes des participants</p>
        </div>
        <button onClick={logout} className="btn-logout">
          Déconnexion
        </button>
      </header>

      <div className="accueil-stats">
        <div className="stat-box">
          <span className="stat-number">{presentCount}</span>
          <span className="stat-label">Participants pointés</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{participants.length - presentCount}</span>
          <span className="stat-label">En attente</span>
        </div>
      </div>

      <div className="scanner-container">
        {!scanning ? (
          <div className="scanner-placeholder">
            <div className="scanner-icon">📷</div>
            <h2>Scanner un QR Code</h2>
            <p>Sélectionnez une caméra et cliquez sur le bouton ci-dessous</p>
            
            {cameras.length > 1 && (
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
              Activer le scanner
            </button>
          </div>
        ) : (
          <div className="scanner-active">
            <video ref={videoRef} className="scanner-video" />
            <button onClick={stopScanning} className="btn-stop-scan">
              Arrêter le scanner
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className={`scan-message ${message.includes('✓') ? 'success' : 'info'}`}>
          {message}
        </div>
      )}

      {participant && (
        <div className="participant-card-accueil">
          <div className="card-header-accueil">
            <h3>{participant.participant}</h3>
            {isPresent(participant.id) && (
              <span className="badge-present">Présent</span>
            )}
          </div>
          <div className="card-body-accueil">
            <div className="info-row">
              <span className="label">ID:</span>
              <span className="value">{participant.id}</span>
            </div>
            <div className="info-row">
              <span className="label">Discipline:</span>
              <span className="value">{participant.discipline}</span>
            </div>
            <div className="info-row">
              <span className="label">Société:</span>
              <span className="value">{participant.societe}</span>
            </div>
            <div className="info-row">
              <span className="label">Direction:</span>
              <span className="value">{participant.direction}</span>
            </div>
            <div className="info-row">
              <span className="label">Compétition:</span>
              <span className="value">{participant.dateCompetition} à {participant.heure}</span>
            </div>
            <div className="info-row">
              <span className="label">Lieu:</span>
              <span className="value">{participant.lieu}, {participant.ville}</span>
            </div>
            {isPresent(participant.id) && (
              <div className="info-row highlight">
                <span className="label">Pointé à:</span>
                <span className="value">{getPresenceInfo(participant.id).time}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate(`/participant/${participant.id}`)}
            className="btn-view-full"
          >
            Voir la fiche complète
          </button>
        </div>
      )}
    </div>
  );
}

export default AccueilDashboard;

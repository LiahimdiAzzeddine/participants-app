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
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const { logout } = useAuth();
  const { markPresent, isPresent, getPresenceInfo, presences } = usePresence();
  const navigate = useNavigate();

  useEffect(() => {
    // Détecter si c'est un mobile en premier
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobile);
    
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
      console.log('Caméras détectées:', videoInputDevices);
      setCameras(videoInputDevices);
      
      // Détecter si c'est un mobile
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      console.log('Est mobile:', isMobileDevice);
      
      let selectedDeviceId = '';
      
      if (isMobileDevice) {
        // Sur mobile : sélectionner la caméra arrière
        const backCamera = videoInputDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        );
        
        console.log('Caméra arrière trouvée:', backCamera);
        
        if (backCamera) {
          selectedDeviceId = backCamera.deviceId;
        } else if (videoInputDevices.length > 0) {
          selectedDeviceId = videoInputDevices[0].deviceId;
        }
      } else {
        // Sur laptop/desktop : utiliser la première caméra (webcam)
        if (videoInputDevices.length > 0) {
          selectedDeviceId = videoInputDevices[0].deviceId;
          console.log('Webcam sélectionnée:', videoInputDevices[0]);
        }
      }
      
      console.log('Caméra sélectionnée ID:', selectedDeviceId);
      setSelectedCamera(selectedDeviceId);
      return selectedDeviceId;
    } catch (error) {
      console.error('Erreur lors du chargement des caméras:', error);
      return null;
    }
  };

  const startScanning = async () => {
    setMessage('');
    setParticipant(null);

    try {
      // Si pas de caméra sélectionnée, charger les caméras
      let cameraId = selectedCamera;
      if (!cameraId) {
        const devices = await codeReader.current.listVideoInputDevices();
        console.log('Caméras disponibles:', devices);
        
        if (devices.length === 0) {
          setMessage('Aucune caméra détectée. Veuillez autoriser l\'accès à la caméra.');
          return;
        }
        
        // Détecter si mobile
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        console.log('Appareil mobile:', isMobileDevice);
        
        if (isMobileDevice) {
          // Sur mobile : chercher caméra arrière en priorité
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('environment') ||
            device.label.toLowerCase().includes('arrière')
          );
          
          // Si plusieurs caméras et pas de caméra arrière trouvée, prendre la dernière (souvent la principale)
          if (backCamera) {
            cameraId = backCamera.deviceId;
            console.log('Caméra arrière sélectionnée:', backCamera.label);
          } else if (devices.length > 1) {
            cameraId = devices[devices.length - 1].deviceId;
            console.log('Dernière caméra sélectionnée:', devices[devices.length - 1].label);
          } else {
            cameraId = devices[0].deviceId;
            console.log('Première caméra sélectionnée:', devices[0].label);
          }
        } else {
          // Sur laptop/desktop : utiliser la première caméra (webcam)
          cameraId = devices[0].deviceId;
          console.log('Webcam sélectionnée:', devices[0].label);
        }
        
        setSelectedCamera(cameraId);
        setCameras(devices);
      }

      setScanning(true);
      console.log('Démarrage du scanner avec caméra:', cameraId);

      await codeReader.current.decodeFromVideoDevice(
        cameraId,
        videoRef.current,
        (result, err) => {
          if (result) {
            console.log('QR Code détecté:', result.text);
            handleScanResult(result.text);
          }
          if (err && err.name !== 'NotFoundException') {
            console.error('Erreur de scan:', err);
          }
        }
      );
    } catch (error) {
      console.error('Erreur scanner:', error);
      let errorMessage = 'Erreur d\'accès à la caméra';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Accès à la caméra refusé. Veuillez autoriser l\'accès dans les paramètres.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Aucune caméra trouvée sur cet appareil.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'La caméra est déjà utilisée par une autre application.';
      }
      
      setMessage(errorMessage);
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
              Activer le scanner
            </button>
          </div>
        ) : (
          <div className="scanner-active">
            <video 
              ref={videoRef} 
              className="scanner-video"
              autoPlay
              playsInline
              muted
            />
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

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/library';
import { FiCamera, FiCheckCircle, FiClock, FiLogOut, FiUser, FiAward, FiMapPin, FiCalendar, FiMail, FiBriefcase } from 'react-icons/fi';
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

  const loadParticipants = async () => {
    const data = await readExcelFile('/Participants_QR_Complet.xlsx');
    setParticipants(data);
  };

  const startScanning = async () => {
    setMessage('');

    try {
      setScanning(true);
      
      // Détecter si mobile
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Configuration de la caméra
      const constraints = {
        video: {
          facingMode: isMobileDevice ? { ideal: 'environment' } : 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      console.log('Demande d\'accès caméra avec contraintes:', constraints);
      console.log('Est mobile:', isMobileDevice);
      console.log('VideoRef existe:', !!videoRef.current);
      
      // Obtenir le stream vidéo
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Stream obtenu:', stream);
      console.log('Tracks vidéo:', stream.getVideoTracks());
      
      // Attacher le stream à la vidéo
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Attendre que les métadonnées soient chargées
        videoRef.current.onloadedmetadata = () => {
          console.log('Métadonnées vidéo chargées');
          console.log('Dimensions vidéo:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
        };
        
        // Forcer la lecture
        try {
          await videoRef.current.play();
          console.log('Vidéo en lecture, readyState:', videoRef.current.readyState);
        } catch (playError) {
          console.error('Erreur play():', playError);
        }
      }
      
      // Démarrer le décodage
      codeReader.current.decodeFromVideoDevice(
        undefined, // Laisser undefined pour utiliser le stream déjà attaché
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
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Impossible d\'accéder à la caméra arrière. Utilisation de la caméra frontale.';
        // Réessayer avec la caméra frontale
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }
        } catch (e) {
          console.error('Erreur caméra frontale:', e);
        }
      }
      
      setMessage(errorMessage);
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    // Arrêter le stream vidéo
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
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
        setMessage('Fiche chargée avec succès');
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
          <FiLogOut style={{ marginRight: '0.5rem' }} />
          Déconnexion
        </button>
      </header>

      {!participant ? (
        <div className="scanner-section">
          <div className="scanner-container-portal">
            {!scanning ? (
              <div className="scanner-placeholder">
                <div className="scanner-icon">
                  <FiCamera />
                </div>
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
                <video 
                  ref={videoRef} 
                  className="scanner-video"
                  autoPlay
                  playsInline
                  muted
                />
                <button onClick={stopScanning} className="btn-stop-scan">
                  Annuler
                </button>
              </div>
            )}
          </div>

          {message && (
            <div className={`scan-message ${message.includes('succès') ? 'success' : 'error'}`}>
              {message.includes('succès') && <FiCheckCircle style={{ marginRight: '0.5rem' }} />}
              {message}
            </div>
          )}
        </div>
      ) : (
        <div className="participant-info-portal">
          <div className="status-banner">
            {present ? (
              <div className="status-present">
                <span className="status-icon">
                  <FiCheckCircle />
                </span>
                <div>
                  <h3>Vous êtes marqué comme présent</h3>
                  <p>Pointé le {presenceInfo.date} à {presenceInfo.time}</p>
                </div>
              </div>
            ) : (
              <div className="status-absent">
                <span className="status-icon">
                  <FiClock />
                </span>
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
                  <span className="label">
                    <FiUser style={{ marginRight: '0.35rem' }} />
                    ID Participant
                  </span>
                  <span className="value">{participant.id}</span>
                </div>
                <div className="info-item-portal">
                  <span className="label">
                    <FiBriefcase style={{ marginRight: '0.35rem' }} />
                    Société
                  </span>
                  <span className="value">{participant.societe}</span>
                </div>
                <div className="info-item-portal">
                  <span className="label">
                    <FiBriefcase style={{ marginRight: '0.35rem' }} />
                    Direction
                  </span>
                  <span className="value">{participant.direction}</span>
                </div>
                <div className="info-item-portal">
                  <span className="label">
                    <FiMail style={{ marginRight: '0.35rem' }} />
                    Email
                  </span>
                  <span className="value">{participant.emailParticipant}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Compétition</h3>
              <div className="info-grid-portal">
                <div className="info-item-portal">
                  <span className="label">
                    <FiAward style={{ marginRight: '0.35rem' }} />
                    Discipline
                  </span>
                  <span className="value highlight">{participant.discipline}</span>
                </div>
                <div className="info-item-portal">
                  <span className="label">
                    <FiCalendar style={{ marginRight: '0.35rem' }} />
                    Date
                  </span>
                  <span className="value">{participant.dateCompetition}</span>
                </div>
                <div className="info-item-portal">
                  <span className="label">
                    <FiClock style={{ marginRight: '0.35rem' }} />
                    Heure
                  </span>
                  <span className="value">{participant.heure}</span>
                </div>
                <div className="info-item-portal">
                  <span className="label">
                    <FiMapPin style={{ marginRight: '0.35rem' }} />
                    Lieu
                  </span>
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

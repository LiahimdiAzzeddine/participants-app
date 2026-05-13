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
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const participantCardRef = useRef(null);
  const { logout } = useAuth();
  const { markPresent, markAbsent, isPresent, getPresenceInfo, presences } = usePresence();
  const navigate = useNavigate();

  useEffect(() => {
    // Détecter si c'est un mobile en premier
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobile);
    
    const loadData = async () => {
      const data = await readExcelFile('/ListeParticipantsTournoiInterfiliales2026.xlsx');
      setParticipants(data);
      setFilteredParticipants(data);
    };
    
    loadData();
    codeReader.current = new BrowserMultiFormatReader();
    loadCameras();
    
    return () => {
      stopScanning();
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredParticipants(participants);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = participants.filter(p => 
        p.participant.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.filiale.toLowerCase().includes(query) ||
        p.discipline.toLowerCase().includes(query)
      );
      setFilteredParticipants(filtered);
    }
  }, [searchQuery, participants]);

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
        
        // Scroll vers la carte du participant sur mobile
        setTimeout(() => {
          if (participantCardRef.current) {
            participantCardRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start'
            });
          }
        }, 300);
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

      <div className="search-section">
        <h2>Rechercher un participant</h2>
        <input
          type="text"
          placeholder="Rechercher par nom, ID, société ou discipline..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        
        {searchQuery && (
          <div className="search-results">
            <p className="results-count">
              {filteredParticipants.length} résultat(s) trouvé(s)
            </p>
            <div className="results-list">
              {filteredParticipants.map(p => (
                <div key={p.id} className="result-item">
                  <div className="result-info">
                    <h4>{p.participant}</h4>
                    <p className="result-details">
                      {p.id} • {p.discipline} • {p.filiale}
                    </p>
                  </div>
                  <div className="result-actions">
                    {isPresent(p.id) ? (
                      <>
                        <span className="badge-present-small">Présent</span>
                        <button
                          onClick={() => {
                            markAbsent(p.id);
                            setMessage(`✗ Présence de ${p.participant} annulée`);
                          }}
                          className="btn-cancel"
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          markPresent(p.id);
                          setMessage(`✓ ${p.participant} marqué comme présent`);
                        }}
                        className="btn-mark-present"
                      >
                        Marquer présent
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setParticipant(p);
                        setSearchQuery('');
                      }}
                      className="btn-select"
                    >
                      Sélectionner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {participant && (
        <div ref={participantCardRef} className="participant-card-accueil">
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
              <span className="label">Filiale:</span>
              <span className="value">{participant.filiale}</span>
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
              <span className="value">
                {participant.lieu}
                {participant.ville && `, ${participant.ville}`}
              </span>
            </div>
            {participant.villeDepart && (
              <div className="info-row">
                <span className="label">Ville de départ:</span>
                <span className="value">{participant.villeDepart}</span>
              </div>
            )}
            {isPresent(participant.id) && (
              <div className="info-row highlight">
                <span className="label">Pointé à:</span>
                <span className="value">{getPresenceInfo(participant.id).time}</span>
              </div>
            )}
          </div>
          <div className="card-actions">
            {!isPresent(participant.id) ? (
              <button
                onClick={() => {
                  markPresent(participant.id);
                  setMessage(`✓ ${participant.participant} marqué comme présent`);
                }}
                className="btn-mark-present"
              >
                Marquer présent
              </button>
            ) : (
              <button
                onClick={() => {
                  markAbsent(participant.id);
                  setMessage(`✗ Présence de ${participant.participant} annulée`);
                }}
                className="btn-cancel"
              >
                Annuler la présence
              </button>
            )}
            <button
              onClick={() => navigate(`/participant/${participant.id}`)}
              className="btn-view-full"
            >
              Voir la fiche complète
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccueilDashboard;

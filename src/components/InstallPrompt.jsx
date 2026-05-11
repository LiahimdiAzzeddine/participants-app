import { useState, useEffect } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';
import './InstallPrompt.css';

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Vérifier si c'est iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Vérifier si l'app est déjà installée
    const standalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');
    setIsStandalone(standalone);

    // Vérifier si l'utilisateur a déjà refusé l'installation
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const shouldShow = !dismissed || (Date.now() - dismissedTime > oneDayInMs);

    if (!standalone && shouldShow) {
      // Pour Android/Chrome
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Pour iOS, afficher après 3 secondes
      if (iOS) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Installation: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <button onClick={handleDismiss} className="install-prompt-close">
          <FiX />
        </button>
        
        <div className="install-prompt-icon">
          <img src="/logo2.png" alt="Tournoi Amendis" />
        </div>
        
        <div className="install-prompt-text">
          <h3>Installer l'application</h3>
          {isIOS ? (
            <p>
              Appuyez sur <span className="ios-share-icon">⎙</span> puis 
              "Sur l'écran d'accueil" pour installer l'application.
            </p>
          ) : (
            <p>
              Installez l'application pour un accès rapide et une meilleure expérience.
            </p>
          )}
        </div>

        {!isIOS && deferredPrompt && (
          <button onClick={handleInstallClick} className="install-prompt-button">
            <FiDownload />
            Installer
          </button>
        )}
      </div>
    </div>
  );
}

export default InstallPrompt;

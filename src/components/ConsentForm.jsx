import { useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import './ConsentForm.css';

function ConsentForm({ participant, onValidate, onCancel }) {
  const [accepted, setAccepted] = useState(false);
  const [lieu, setLieu] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accepted) {
      alert('Veuillez cocher la case de consentement pour continuer.');
      return;
    }
    if (!lieu.trim()) {
      alert('Veuillez indiquer le lieu.');
      return;
    }

    setSubmitting(true);
    await onValidate(lieu);
    setSubmitting(false);
  };

  return (
    <div className="consent-overlay">
      <div className="consent-modal">
        <div className="consent-header">
          <h2>Autorisation d'utilisation d'image</h2>
          <p className="consent-subtitle">Veuillez lire et accepter les conditions ci-dessous</p>
        </div>

        <form onSubmit={handleSubmit} className="consent-form">
          <div className="consent-body">
            <div className="consent-text">
              <p className="consent-intro">
                Je soussigné(e) <strong>{participant.participant}</strong>, autorise Veolia Maroc à utiliser mon image à des fins commerciales et promotionnelles selon les modalités décrites ci-dessous.
              </p>

              <div className="consent-section">
                <h3>Description de l'utilisation prévue :</h3>
                <ul>
                  <li><strong>Type d'utilisation :</strong> Interne & externe</li>
                  <li><strong>Durée de l'utilisation :</strong> 5 ans</li>
                  <li><strong>Finalité de l'utilisation :</strong> Promotion de l'image de marque de Veolia Maroc en interne et en externe</li>
                </ul>
              </div>

              <p className="consent-notice">
                Je comprends que cette autorisation est donnée librement, sans contrainte, et que je peux la révoquer à tout moment par écrit à l'adresse suivante : <a href="mailto:dpo.maroc@veolia.com">dpo.maroc@veolia.com</a>
              </p>

              <p className="consent-notice">
                Je reconnais avoir été informé(e) de mes droits concernant l'utilisation de mon image, notamment le droit de demander la suppression de mon image.
              </p>
            </div>

            <div className="consent-location">
              <label htmlFor="lieu">Fait à :</label>
              <input
                type="text"
                id="lieu"
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
                placeholder="Ville"
                required
                className="consent-input"
              />
            </div>

            <div className="consent-date">
              <p>Le {new Date().toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</p>
            </div>

            <div className="consent-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  required
                />
                <span className="checkbox-text">
                  <FiCheckCircle className="checkbox-icon" />
                  Lu et approuvé - J'accepte les conditions ci-dessus
                </span>
              </label>
            </div>
          </div>

          <div className="consent-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn-cancel-consent"
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-validate-consent"
              disabled={!accepted || submitting}
            >
              {submitting ? 'Validation...' : 'Valider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConsentForm;

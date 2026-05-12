import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ConsentContext = createContext();

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within ConsentProvider');
  }
  return context;
};

export const ConsentProvider = ({ children }) => {
  const [consents, setConsents] = useState({});
  const [loading, setLoading] = useState(true);
  const [useSupabase, setUseSupabase] = useState(false);

  useEffect(() => {
    loadConsents();
  }, []);

  const loadConsents = async () => {
    const configured = isSupabaseConfigured();
    setUseSupabase(configured);

    if (configured) {
      try {
        const { data, error } = await supabase
          .from('consents')
          .select('*');

        if (error) {
          console.error('Erreur Supabase:', error);
          loadFromLocalStorage();
        } else {
          const consentsObj = {};
          data.forEach(item => {
            consentsObj[item.participant_id] = {
              validated: item.validated,
              timestamp: item.timestamp,
              date: item.date,
              lieu: item.lieu
            };
          });
          setConsents(consentsObj);
          console.log('Consentements chargés depuis Supabase:', data.length);
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        loadFromLocalStorage();
      }
    } else {
      console.log('Supabase non configuré, utilisation de localStorage');
      loadFromLocalStorage();
    }

    setLoading(false);
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('consents');
    if (saved) {
      setConsents(JSON.parse(saved));
    }
  };

  const validateConsent = async (participantId, lieu) => {
    const consentData = {
      validated: true,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('fr-FR'),
      lieu: lieu || ''
    };

    const newConsents = {
      ...consents,
      [participantId]: consentData
    };
    setConsents(newConsents);

    if (useSupabase) {
      try {
        const { error } = await supabase
          .from('consents')
          .upsert({
            participant_id: participantId,
            validated: true,
            timestamp: consentData.timestamp,
            date: consentData.date,
            lieu: consentData.lieu,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'participant_id'
          });

        if (error) {
          console.error('Erreur lors de la sauvegarde:', error);
          localStorage.setItem('consents', JSON.stringify(newConsents));
        } else {
          console.log('Consentement sauvegardé dans Supabase:', participantId);
        }
      } catch (err) {
        console.error('Erreur Supabase:', err);
        localStorage.setItem('consents', JSON.stringify(newConsents));
      }
    } else {
      localStorage.setItem('consents', JSON.stringify(newConsents));
    }
  };

  const hasConsent = (participantId) => {
    return !!consents[participantId]?.validated;
  };

  const getConsentInfo = (participantId) => {
    return consents[participantId] || null;
  };

  const refreshConsents = async () => {
    await loadConsents();
  };

  return (
    <ConsentContext.Provider value={{ 
      consents, 
      validateConsent, 
      hasConsent, 
      getConsentInfo,
      refreshConsents,
      loading,
      useSupabase
    }}>
      {children}
    </ConsentContext.Provider>
  );
};

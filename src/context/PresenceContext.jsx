import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const PresenceContext = createContext();

export const usePresence = () => {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error('usePresence must be used within PresenceProvider');
  }
  return context;
};

export const PresenceProvider = ({ children }) => {
  const [presences, setPresences] = useState({});
  const [loading, setLoading] = useState(true);
  const [useSupabase, setUseSupabase] = useState(false);

  // Charger les présences au démarrage
  useEffect(() => {
    loadPresences();
  }, []);

  const loadPresences = async () => {
    const configured = isSupabaseConfigured();
    setUseSupabase(configured);

    if (configured) {
      // Charger depuis Supabase
      try {
        const { data, error } = await supabase
          .from('presences')
          .select('*');

        if (error) {
          console.error('Erreur Supabase:', error);
          // Fallback sur localStorage
          loadFromLocalStorage();
        } else {
          // Convertir le tableau en objet
          const presencesObj = {};
          data.forEach(item => {
            presencesObj[item.participant_id] = {
              timestamp: item.timestamp,
              time: item.time,
              date: item.date
            };
          });
          setPresences(presencesObj);
          console.log('Présences chargées depuis Supabase:', data.length);
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        loadFromLocalStorage();
      }
    } else {
      // Utiliser localStorage
      console.log('Supabase non configuré, utilisation de localStorage');
      loadFromLocalStorage();
    }

    setLoading(false);
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('presences');
    if (saved) {
      setPresences(JSON.parse(saved));
    }
  };

  const markPresent = async (participantId) => {
    const presenceData = {
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString('fr-FR'),
      date: new Date().toLocaleDateString('fr-FR')
    };

    const newPresences = {
      ...presences,
      [participantId]: presenceData
    };
    setPresences(newPresences);

    if (useSupabase) {
      // Sauvegarder dans Supabase
      try {
        const { error } = await supabase
          .from('presences')
          .upsert({
            participant_id: participantId,
            timestamp: presenceData.timestamp,
            time: presenceData.time,
            date: presenceData.date,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'participant_id'
          });

        if (error) {
          console.error('Erreur lors de la sauvegarde:', error);
          // Fallback sur localStorage
          localStorage.setItem('presences', JSON.stringify(newPresences));
        } else {
          console.log('Présence sauvegardée dans Supabase:', participantId);
        }
      } catch (err) {
        console.error('Erreur Supabase:', err);
        localStorage.setItem('presences', JSON.stringify(newPresences));
      }
    } else {
      // Sauvegarder dans localStorage
      localStorage.setItem('presences', JSON.stringify(newPresences));
    }
  };

  const markAbsent = async (participantId) => {
    const newPresences = { ...presences };
    delete newPresences[participantId];
    setPresences(newPresences);

    if (useSupabase) {
      // Supprimer de Supabase
      try {
        const { error } = await supabase
          .from('presences')
          .delete()
          .eq('participant_id', participantId);

        if (error) {
          console.error('Erreur lors de la suppression:', error);
          localStorage.setItem('presences', JSON.stringify(newPresences));
        } else {
          console.log('Présence supprimée de Supabase:', participantId);
        }
      } catch (err) {
        console.error('Erreur Supabase:', err);
        localStorage.setItem('presences', JSON.stringify(newPresences));
      }
    } else {
      // Supprimer de localStorage
      localStorage.setItem('presences', JSON.stringify(newPresences));
    }
  };

  const isPresent = (participantId) => {
    return !!presences[participantId];
  };

  const getPresenceInfo = (participantId) => {
    return presences[participantId] || null;
  };

  const refreshPresences = async () => {
    await loadPresences();
  };

  return (
    <PresenceContext.Provider value={{ 
      presences, 
      markPresent, 
      markAbsent, 
      isPresent, 
      getPresenceInfo,
      refreshPresences,
      loading,
      useSupabase
    }}>
      {children}
    </PresenceContext.Provider>
  );
};

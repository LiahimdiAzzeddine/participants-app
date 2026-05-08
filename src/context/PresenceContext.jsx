import { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    const saved = localStorage.getItem('presences');
    if (saved) {
      setPresences(JSON.parse(saved));
    }
  }, []);

  const markPresent = (participantId) => {
    const newPresences = {
      ...presences,
      [participantId]: {
        timestamp: new Date().toISOString(),
        time: new Date().toLocaleTimeString('fr-FR'),
        date: new Date().toLocaleDateString('fr-FR')
      }
    };
    setPresences(newPresences);
    localStorage.setItem('presences', JSON.stringify(newPresences));
  };

  const markAbsent = (participantId) => {
    const newPresences = { ...presences };
    delete newPresences[participantId];
    setPresences(newPresences);
    localStorage.setItem('presences', JSON.stringify(newPresences));
  };

  const isPresent = (participantId) => {
    return !!presences[participantId];
  };

  const getPresenceInfo = (participantId) => {
    return presences[participantId] || null;
  };

  return (
    <PresenceContext.Provider value={{ presences, markPresent, markAbsent, isPresent, getPresenceInfo }}>
      {children}
    </PresenceContext.Provider>
  );
};

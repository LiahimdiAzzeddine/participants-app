import * as XLSX from 'xlsx';

// Fonction pour convertir le numéro de série Excel en date
const excelDateToJSDate = (serial) => {
  console.log('Conversion date Excel:', serial, 'Type:', typeof serial);
  
  if (typeof serial !== 'number') {
    return serial; // Si ce n'est pas un nombre, retourner tel quel
  }
  
  // Méthode alternative plus simple
  const date = new Date((serial - 25569) * 86400 * 1000);
  
  // Formater en DD/MM/YYYY
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  const formatted = `${day}/${month}/${year}`;
  console.log('Date convertie:', formatted);
  
  return formatted;
};

export const readExcelFile = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: false });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Debug: afficher les colonnes de la première ligne
    if (data.length > 0) {
      console.log('Colonnes Excel détectées:', Object.keys(data[0]));
      console.log('Première ligne de données:', data[0]);
    }
    
    return data.map((row, index) => {
      // Essayer différentes variantes du nom de colonne pour la date
      let dateCompetition = row['Jour'] || row['Date compétition'] || row['Date competition'] || row['Date'] || row['DATE'] || '';
      
      console.log(`Ligne ${index + 1} - Date brute:`, dateCompetition);
      
      // Convertir la date si c'est un nombre
      if (typeof dateCompetition === 'number') {
        dateCompetition = excelDateToJSDate(dateCompetition);
      }
      
      console.log(`Ligne ${index + 1} - Date finale:`, dateCompetition);
      
      return {
        id: `PART-${String(index + 1).padStart(4, '0')}`,
        discipline: row.Disciplines || row.Discipline || '',
        participant: row.Participant || '',
        filiale: row.Fililales || row.Filiale || row.Société || '',
        emailParticipant: row['Adresse mail'] || row['Email participant'] || '',
        emailResponsable: row['Adresse Mail Hiérarchie'] || row['Email responsable'] || '',
        direction: row.Direction || '',
        dateCompetition: dateCompetition,
        heure: row['Démarrage de la compétition'] || row.Heure || '',
        lieu: row.Lieu || '',
        ville: row.Ville || '',
        villeDepart: row['Ville de départ'] || ''
      };
    });
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier Excel:', error);
    return [];
  }
};

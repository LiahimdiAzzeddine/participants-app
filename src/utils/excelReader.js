import * as XLSX from 'xlsx';

export const readExcelFile = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    return data.map((row, index) => ({
      id: `PART-${String(index + 1).padStart(4, '0')}`,
      discipline: row.Disciplines || row.Discipline || '',
      participant: row.Participant || '',
      societe: row.Société || '',
      emailParticipant: row['Email participant'] || '',
      emailResponsable: row['Email responsable'] || '',
      direction: row.Direction || '',
      dateCompetition: row['Date compétition'] || '',
      heure: row.Heure || '',
      lieu: row.Lieu || '',
      ville: row.Ville || ''
    }));
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier Excel:', error);
    return [];
  }
};

# 🏆 Application de Gestion des Participants - Compétition Veolia

Application web moderne développée avec React.js pour gérer les participants d'une compétition à partir d'un fichier Excel.

## ✨ Fonctionnalités

### 📊 Import et Lecture de Données
- Import automatique du fichier Excel (.xlsx)
- Lecture des données avec SheetJS (xlsx)
- Génération automatique d'ID unique pour chaque participant (format: PART-0001)

### 🏠 Page d'Accueil
- Liste complète des participants
- Recherche par nom ou société
- Filtre par discipline
- Filtre par ville
- Statistiques en temps réel (nombre de participants, disciplines, villes)
- Design moderne avec cartes interactives

### 👤 Page Détail Participant
- URL dynamique: `/participant/:id`
- Badge participant moderne et professionnel
- Affichage de toutes les informations:
  - Nom du participant
  - Discipline
  - Société
  - Emails (participant et responsable)
  - Direction
  - Date et heure de la compétition
  - Lieu et ville

### 📱 QR Code
- Génération automatique d'un QR Code unique pour chaque participant
- Le QR Code contient l'URL: `https://monsite.com/participant/{id}`
- Scan du QR Code → redirection vers la page du participant
- Bouton de téléchargement du QR Code (format PNG)

### 📥 Téléchargements
- **Télécharger le QR Code**: Image PNG haute qualité
- **Télécharger le badge participant**: PDF complet avec toutes les informations

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm run dev

# Build pour la production
npm run build
```

## 📦 Dépendances Principales

- **React 19** - Framework UI
- **React Router DOM** - Navigation
- **xlsx** - Lecture de fichiers Excel
- **qrcode.react** - Génération de QR Codes
- **html2canvas** - Capture d'écran du badge
- **jspdf** - Génération de PDF

## 📁 Structure du Projet

```
src/
├── pages/
│   ├── HomePage.jsx          # Page d'accueil avec liste et filtres
│   ├── HomePage.css
│   ├── ParticipantDetail.jsx # Page détail avec badge et QR Code
│   └── ParticipantDetail.css
├── utils/
│   └── excelReader.js        # Utilitaire de lecture Excel
├── App.jsx                   # Configuration des routes
└── main.jsx                  # Point d'entrée
```

## 📋 Format du Fichier Excel

Le fichier Excel doit contenir les colonnes suivantes:

| Colonne | Description |
|---------|-------------|
| Discipline | Sport/activité |
| Participant | Nom du participant |
| Société | Nom de la société |
| Email participant | Email du participant |
| Email responsable | Email du responsable |
| Direction | Direction/département |
| Date compétition | Date de l'événement |
| Heure | Heure de l'événement |
| Lieu | Lieu de la compétition |
| Ville | Ville de la compétition |

### Exemple de données:
```
Babyfoot | Chouibi Montassir | Amendis Tanger | montassir.chouibi@veolia.com | fatima.hmimid@veolia.com | DET | 14/05/2026 | 10h00 | Sonarges | Tétouan
```

## 🎨 Design

- Interface moderne et responsive
- Dégradés de couleurs professionnels
- Cartes interactives avec effets hover
- Badge participant élégant et imprimable
- QR Code intégré avec style

## 🔧 Configuration

Le fichier Excel doit être placé dans le dossier `public/` avec le nom `Participants_QR_Complet.xlsx`.

Pour changer l'URL de base des QR Codes, modifiez la variable `qrUrl` dans `ParticipantDetail.jsx`:

```javascript
const qrUrl = `https://votre-domaine.com/participant/${participant.id}`;
```

## 📱 Utilisation

1. Placez votre fichier Excel dans `public/Participants_QR_Complet.xlsx`
2. Lancez l'application avec `npm run dev`
3. Accédez à `http://localhost:5173`
4. Naviguez dans la liste des participants
5. Cliquez sur un participant pour voir son badge
6. Téléchargez le QR Code ou le badge complet

## 🌐 Déploiement

Pour déployer l'application:

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`.

## 📄 Licence

Projet développé pour Veolia - Compétition Mai 2026

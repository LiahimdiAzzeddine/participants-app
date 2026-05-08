# Contexte du Projet - Tournoi Inter-filiales 2026

## Objectif
Mettre en place un système de badges avec QR code individuel pour chaque participant du Tournoi Inter-filiales 2026 afin de faciliter :
- L'accueil des participants
- Le pointage des présences
- La distribution des goodies

## Fonctionnalités Implémentées

### 1. Gestion des Participants (Page d'accueil)
**URL** : `/`

**Fonctionnalités** :
- Liste complète de tous les participants
- Recherche par nom ou société
- Filtres par discipline et ville
- Statistiques en temps réel
- Accès rapide au badge de chaque participant
- Bouton d'accès au système de pointage

**Cas d'usage** :
- Consultation rapide de la liste des inscrits
- Recherche d'un participant spécifique
- Vue d'ensemble des disciplines et villes représentées

### 2. Badge Participant avec QR Code
**URL** : `/participant/:id`

**Fonctionnalités** :
- Badge professionnel avec toutes les informations du participant
- QR Code unique généré automatiquement
- Téléchargement du QR Code (PNG)
- Téléchargement du badge complet (PDF)

**Informations affichées** :
- Nom du participant
- Discipline
- Société
- Email participant et responsable
- Direction
- Date, heure et lieu de la compétition
- Ville
- ID unique (PART-XXXX)

**Cas d'usage** :
- Impression des badges avant l'événement
- Distribution des badges à l'accueil
- Vérification d'identité lors de l'événement
- Scan du QR Code pour accès rapide aux informations

### 3. Pointage des Présences (NOUVEAU)
**URL** : `/checkin`

**Fonctionnalités** :
- Liste de tous les participants avec statut de présence
- Pointage manuel en un clic
- Recherche rapide par nom, ID ou société
- Statistiques en temps réel (présents/absents/total)
- Export des présences en CSV
- Sauvegarde locale des pointages (localStorage)
- Affichage de l'heure de pointage
- Possibilité d'annuler un pointage

**Cas d'usage** :
- Accueil des participants le jour J
- Pointage à l'entrée de l'événement
- Suivi en temps réel des présences
- Export pour reporting et statistiques
- Distribution des goodies (vérifier qui est présent)

## Workflow Complet

### Avant l'événement
1. **Préparation des données**
   - Importer le fichier Excel avec tous les participants
   - Vérifier que toutes les informations sont correctes

2. **Impression des badges**
   - Accéder à chaque participant via la page d'accueil
   - Télécharger le badge en PDF
   - Imprimer les badges pour tous les participants

3. **Préparation des QR Codes**
   - Télécharger les QR Codes individuels si nécessaire
   - Les QR Codes sont déjà inclus dans les badges

### Le jour de l'événement

#### À l'accueil
1. **Pointage des arrivées**
   - Ouvrir la page `/checkin`
   - Rechercher le participant par nom ou scanner son badge
   - Cliquer sur "Pointer" pour enregistrer sa présence
   - L'heure de pointage est enregistrée automatiquement

2. **Distribution des badges**
   - Vérifier l'identité du participant
   - Remettre le badge pré-imprimé
   - Le participant peut scanner son QR Code pour voir ses informations

3. **Distribution des goodies**
   - Consulter la liste des présents
   - Distribuer les goodies uniquement aux participants pointés
   - Éviter les doublons grâce au système de pointage

#### Pendant l'événement
- **Consultation des informations** : Les participants peuvent scanner leur QR Code pour voir leurs horaires et lieux de compétition
- **Suivi des présences** : L'équipe organisatrice peut suivre en temps réel le nombre de présents

#### Après l'événement
1. **Export des données**
   - Cliquer sur "Exporter les présences (CSV)"
   - Obtenir un fichier avec tous les participants et leur statut
   - Utiliser pour les statistiques et le reporting

2. **Analyse**
   - Taux de présence par discipline
   - Taux de présence par société
   - Horaires d'arrivée des participants

## Architecture Technique

### Structure des données
```javascript
{
  id: "PART-0001",
  discipline: "Babyfoot",
  participant: "Chouibi Montassir",
  societe: "Amendis Tanger",
  emailParticipant: "montassir.chouibi@veolia.com",
  emailResponsable: "fatima.hmimid@veolia.com",
  direction: "DET",
  dateCompetition: "14/05/2026",
  heure: "10h00",
  lieu: "Sonarges",
  ville: "Tétouan"
}
```

### Stockage des pointages
- **LocalStorage** : Les pointages sont sauvegardés localement dans le navigateur
- **Format** : 
```javascript
{
  "PART-0001": {
    "timestamp": "2026-05-14T10:30:00.000Z",
    "time": "10:30:00"
  }
}
```

### QR Code
- **Contenu** : URL vers la page du participant
- **Format** : `https://votre-domaine.com/participant/PART-0001`
- **Niveau de correction** : High (H) - 30% de redondance

## Avantages du Système

### Pour l'organisation
- ✅ Accueil rapide et fluide
- ✅ Suivi en temps réel des présences
- ✅ Pas de liste papier à gérer
- ✅ Export automatique pour reporting
- ✅ Réduction des erreurs de pointage
- ✅ Distribution contrôlée des goodies

### Pour les participants
- ✅ Badge professionnel et moderne
- ✅ Accès rapide à leurs informations via QR Code
- ✅ Pas de file d'attente pour l'inscription
- ✅ Expérience digitale et moderne

### Pour l'événement
- ✅ Image professionnelle
- ✅ Traçabilité complète
- ✅ Statistiques précises
- ✅ Gain de temps considérable

## Évolutions Possibles

### Court terme
- Scanner automatique de QR Code pour pointage
- Notifications push pour les participants
- Impression en masse des badges

### Moyen terme
- Application mobile dédiée
- Système de check-in par discipline
- Intégration avec un système de gestion d'événements

### Long terme
- Reconnaissance faciale
- Badge électronique (NFC)
- Gamification (points, classements)

## Support et Maintenance

### Pendant l'événement
- Équipe technique disponible
- Accès administrateur pour corrections
- Backup des données en temps réel

### Après l'événement
- Conservation des données pour archives
- Analyse des statistiques
- Retour d'expérience pour les prochains événements

---

**Prêt pour le Tournoi Inter-filiales 2026 !** 🏆

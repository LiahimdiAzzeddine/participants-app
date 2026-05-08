# Système à 3 Profils - Tournoi Inter-filiales 2026

## Vue d'Ensemble

L'application est maintenant structurée avec **3 profils distincts** ayant chacun des fonctionnalités spécifiques :

1. **ADMIN** - Gestion complète
2. **ÉQUIPE D'ACCUEIL** - Pointage des présences
3. **PARTICIPANT** - Consultation personnelle

---

## 🔐 Page de Connexion

**URL** : `/`

### Sélection du Profil
- 3 cartes cliquables pour choisir son profil
- Mot de passe requis uniquement pour l'administrateur
- Mot de passe par défaut : `admin2026` (à changer en production)

---

## 👨‍💼 PROFIL ADMIN

**URL** : `/admin`

### Fonctionnalités

#### 1. Vue d'ensemble
- Tableau de bord avec statistiques :
  - Total participants
  - Présents
  - Absents
  - Nombre de disciplines

#### 2. Liste des participants
- Tableau complet avec toutes les informations
- Recherche par nom, société ou ID
- Filtre par discipline
- Indication visuelle des participants présents (fond vert)

#### 3. Sélection multiple
- Cases à cocher pour chaque participant
- Bouton "Tout sélectionner"
- Bouton "Tout désélectionner"

#### 4. Génération de badges
- **Générer les badges** : Crée les badges pour les participants sélectionnés
- Si aucune sélection : génère pour tous les participants filtrés
- Badge format PDF avec :
  - QR Code
  - Nom du participant
  - Discipline
  - Direction
  - Date, heure et lieu de compétition
  - Ville

#### 5. Export des données
- **Exporter les présences** : Télécharge un fichier CSV avec :
  - ID, Nom, Société, Discipline, Direction, Ville
  - Statut (Présent/Absent)
  - Heure et date de pointage

#### 6. Actions
- Voir la fiche détaillée de chaque participant
- Déconnexion

---

## 🎫 PROFIL ÉQUIPE D'ACCUEIL

**URL** : `/accueil`

### Fonctionnalités

#### 1. Scanner QR Code
- Activation de la caméra
- Scan automatique du QR Code du participant
- Détection instantanée

#### 2. Pointage automatique
- Dès qu'un QR Code est scanné :
  - Le participant est identifié
  - Il est automatiquement marqué comme "présent"
  - L'heure de pointage est enregistrée
  - Sa fiche s'affiche

#### 3. Affichage de la fiche
Après le scan, affichage de :
- Nom du participant
- ID
- Discipline
- Société
- Direction
- Date, heure et lieu de compétition
- Statut de présence avec heure de pointage

#### 4. Statistiques en temps réel
- Nombre de participants pointés
- Nombre en attente

#### 5. Gestion des doublons
- Si un participant est déjà pointé, un message l'indique
- Affiche l'heure du premier pointage

#### 6. Actions
- Voir la fiche complète du participant
- Scanner un autre QR Code
- Déconnexion

---

## 👤 PROFIL PARTICIPANT

**URL** : `/participant-portal`

### Fonctionnalités

#### 1. Scanner son propre QR Code
- Le participant scanne le QR Code de son badge
- Accès instantané à sa fiche personnelle

#### 2. Statut de présence
Bannière en haut de page indiquant :
- **Si présent** : "Vous êtes marqué comme présent" (vert)
  - Affiche la date et l'heure de pointage
- **Si absent** : "Vous n'êtes pas encore pointé" (orange)
  - Message pour se présenter à l'accueil

#### 3. Informations personnelles
- ID Participant
- Société
- Direction
- Email

#### 4. Informations de compétition
- Discipline (mise en évidence)
- Date
- Heure
- Lieu et ville

#### 5. Actions
- **Voir mon badge complet** : Accès à la page du badge avec QR Code
- **Scanner un autre QR Code** : Retour au scanner
- Déconnexion

---

## 📱 Format du Badge (PDF)

Le badge généré contient :

```
┌─────────────────────────────────┐
│   Compétition Veolia            │
│   Mai 2026                      │
├─────────────────────────────────┤
│                                 │
│   [Nom du Participant]          │
│   [Discipline]                  │
│                                 │
│   Société: [...]                │
│   Direction: [...]              │
│   Email: [...]                  │
│                                 │
│   Date: [...]                   │
│   Heure: [...]                  │
│   Lieu: [...], [Ville]          │
│                                 │
│   ┌─────────────┐               │
│   │             │               │
│   │  QR  CODE   │               │
│   │             │               │
│   └─────────────┘               │
│   [ID: PART-XXXX]               │
│                                 │
└─────────────────────────────────┘
```

---

## 🔄 Workflow Complet

### Avant l'événement (ADMIN)
1. Se connecter en tant qu'Admin
2. Vérifier la liste des participants
3. Sélectionner tous les participants
4. Cliquer sur "Générer les badges"
5. Imprimer tous les badges
6. Plastifier les badges

### Le jour J - À l'accueil (ÉQUIPE D'ACCUEIL)
1. Se connecter en tant qu'Équipe d'Accueil
2. Activer le scanner
3. Quand un participant arrive :
   - Scanner son QR Code
   - Le système le marque automatiquement comme présent
   - Vérifier les informations affichées
   - Remettre le badge au participant

### Pendant l'événement (PARTICIPANT)
1. Le participant se connecte en tant que Participant
2. Il scanne son propre QR Code
3. Il voit sa fiche avec :
   - Son statut de présence
   - Ses horaires de compétition
   - Le lieu

### Après l'événement (ADMIN)
1. Se connecter en tant qu'Admin
2. Cliquer sur "Exporter les présences"
3. Analyser les données dans le fichier CSV

---

## 💾 Stockage des Données

### LocalStorage
Les données suivantes sont stockées localement :
- **Authentification** : Profil de l'utilisateur connecté
- **Présences** : Liste des participants pointés avec heure

### Format des présences
```javascript
{
  "PART-0001": {
    "timestamp": "2026-05-14T10:30:00.000Z",
    "time": "10:30:00",
    "date": "14/05/2026"
  }
}
```

### Avantages
- Fonctionne hors ligne
- Pas de serveur nécessaire
- Rapide

### Limitations
- Données stockées sur l'appareil uniquement
- Pas de synchronisation entre appareils
- Export CSV recommandé régulièrement

---

## 🔒 Sécurité

### Mot de passe Admin
- Par défaut : `admin2026`
- **À CHANGER EN PRODUCTION**
- Modifier dans `src/pages/Login.jsx` ligne 10

### Accès aux profils
- Chaque profil a des routes protégées
- Redirection automatique si non autorisé
- Déconnexion disponible sur toutes les pages

---

## 📊 Statistiques et Reporting

### En temps réel
- Nombre de présents/absents
- Taux de présence
- Visible sur le tableau de bord Admin

### Export CSV
Contient toutes les informations :
- Données participant
- Statut de présence
- Heure et date de pointage
- Utilisable dans Excel, Google Sheets, etc.

---

## 🎯 Cas d'Usage Détaillés

### Cas 1 : Participant arrive à l'accueil
1. **Équipe d'Accueil** : Active le scanner
2. **Participant** : Présente son badge
3. **Système** : Scanne le QR Code
4. **Système** : Marque comme présent automatiquement
5. **Équipe d'Accueil** : Vérifie les infos et remet le badge

### Cas 2 : Participant veut voir ses horaires
1. **Participant** : Se connecte au portail
2. **Participant** : Scanne son QR Code
3. **Système** : Affiche sa fiche avec horaires
4. **Participant** : Consulte lieu, heure, discipline

### Cas 3 : Admin veut générer des badges pour une discipline
1. **Admin** : Se connecte
2. **Admin** : Filtre par discipline (ex: Babyfoot)
3. **Admin** : Sélectionne tous
4. **Admin** : Clique sur "Générer les badges"
5. **Système** : Crée les PDFs pour cette discipline

### Cas 4 : Participant déjà pointé rescanne
1. **Équipe d'Accueil** : Scanne le QR Code
2. **Système** : Détecte qu'il est déjà présent
3. **Système** : Affiche "Déjà pointé à [heure]"
4. **Équipe d'Accueil** : Informe le participant

---

## 🚀 Démarrage Rapide

### Installation
```bash
npm install
```

### Lancement
```bash
npm run dev
```

### Accès
- Ouvrir http://localhost:5173
- Choisir un profil
- Se connecter

### Comptes de test
- **Admin** : Mot de passe `admin2026`
- **Équipe d'Accueil** : Pas de mot de passe
- **Participant** : Pas de mot de passe

---

## 📱 Compatibilité

### Navigateurs
- Chrome (recommandé)
- Firefox
- Edge
- Safari

### Appareils
- Desktop
- Tablette
- Smartphone

### Caméra
- Nécessaire pour scanner les QR Codes
- Autorisation requise par le navigateur

---

## 🆘 Support

### Problèmes courants

**La caméra ne fonctionne pas**
- Vérifier les autorisations du navigateur
- Utiliser HTTPS en production
- Tester avec un autre navigateur

**Le QR Code n'est pas reconnu**
- Vérifier la qualité d'impression
- Améliorer l'éclairage
- Rapprocher/éloigner le badge

**Les données ne se sauvegardent pas**
- Vérifier que le localStorage est activé
- Ne pas utiliser le mode navigation privée
- Exporter régulièrement en CSV

---

**Système prêt pour le Tournoi Inter-filiales 2026 !** 🏆

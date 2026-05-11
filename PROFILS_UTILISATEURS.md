# Profils Utilisateurs - Tournoi Amendis 2026

## 🔴 Profil Admin
**Mot de passe :** `admin2026`

### Rôle
Gestion complète du tournoi et supervision générale.

### Fonctionnalités
- 📊 **Tableau de bord complet** : Vue d'ensemble avec statistiques (total participants, présents, absents, disciplines)
- 🔍 **Recherche avancée** : Filtrer par nom, filiale, ID ou discipline
- 🎫 **Génération de badges** : Créer et télécharger les badges en masse (format PNG/ZIP)
- 📥 **Export des données** : Exporter la liste des présences en CSV
- 👁️ **Consultation détaillée** : Voir la fiche complète de chaque participant
- ✅ **Sélection multiple** : Générer des badges pour des participants spécifiques

### Page d'accès
`/admin`

---

## 🟢 Profil Équipe d'Accueil
**Mot de passe :** `equipe2026`

### Rôle
Accueil et pointage des participants le jour de la compétition.

### Fonctionnalités
- 📷 **Scanner QR Code** : Scanner les badges des participants avec la caméra (mobile/desktop)
- ✓ **Pointage présence** : Marquer automatiquement les participants comme présents
- ❌ **Annuler présence** : Corriger une erreur de pointage
- 🔍 **Recherche rapide** : Trouver un participant par nom, ID, filiale ou discipline
- ✋ **Pointage manuel** : Marquer présent sans scanner (via recherche)
- 📊 **Statistiques temps réel** : Voir le nombre de participants pointés et en attente
- 👁️ **Fiche participant** : Consulter les détails après scan ou recherche

### Page d'accès
`/accueil`

### Particularités
- Détection automatique de la caméra arrière sur mobile
- Sélection manuelle de caméra si plusieurs disponibles
- Affichage de l'heure de pointage pour chaque participant

---

## 🔵 Profil Participant
**Mot de passe :** Aucun (accès direct)

### Rôle
Consultation personnelle des informations de compétition.

### Fonctionnalités
- 🔍 **Recherche personnelle** : Trouver sa fiche par nom ou ID
- 📱 **Scanner son QR code** : Accéder directement à sa fiche via QR code
- 📄 **Voir son badge** : Consulter toutes les informations de compétition
- 📥 **Télécharger son badge** : Télécharger son badge en PNG
- ℹ️ **Informations affichées** :
  - Nom et discipline
  - Filiale et direction
  - Emails (participant et responsable)
  - Date, heure et lieu de compétition
  - Ville et ville de départ
  - QR code personnel

### Page d'accès
`/participant-portal`

### Particularités
- Accès sans mot de passe pour faciliter la consultation
- QR code unique pour chaque participant
- Badge téléchargeable pour impression personnelle

---

## 📊 Comparaison des Profils

| Fonctionnalité | Admin | Équipe d'Accueil | Participant |
|----------------|-------|------------------|-------------|
| Voir tous les participants | ✅ | ✅ | ❌ |
| Générer badges en masse | ✅ | ❌ | ❌ |
| Scanner QR codes | ❌ | ✅ | ✅ (son propre) |
| Marquer présence | ❌ | ✅ | ❌ |
| Export CSV | ✅ | ❌ | ❌ |
| Recherche globale | ✅ | ✅ | ✅ (limitée) |
| Télécharger badge | ✅ | ✅ | ✅ (le sien) |
| Statistiques | ✅ | ✅ | ❌ |
| Mot de passe requis | ✅ | ✅ | ❌ |

---

## 🔐 Sécurité

### Mots de passe
- **Admin** : `admin2026` (accès complet)
- **Équipe d'Accueil** : `equipe2026` (accès pointage)
- **Participant** : Aucun (accès consultation uniquement)

### Protection des routes
- Routes admin protégées : `/admin`, `/generate-badges`
- Routes équipe protégées : `/accueil`
- Routes publiques : `/`, `/participant-portal`, `/participant/:id`

---

## 📱 Utilisation Mobile

### Admin
- Interface responsive adaptée
- Tableaux scrollables horizontalement
- Actions tactiles optimisées

### Équipe d'Accueil
- **Optimisé pour mobile** 🎯
- Détection automatique caméra arrière
- Interface de scan plein écran
- Scroll automatique vers les détails après scan
- Boutons tactiles larges

### Participant
- Interface simplifiée pour mobile
- QR code scannable facilement
- Badge consultable sur smartphone
- Téléchargement direct sur mobile

---

## 🎯 Cas d'Usage Typiques

### Jour J - Avant la compétition
1. **Admin** : Génère tous les badges en masse et les imprime
2. **Admin** : Distribue les badges aux participants

### Jour J - Pendant l'accueil
1. **Équipe d'Accueil** : Se connecte sur tablette/smartphone
2. **Participant** : Arrive avec son badge
3. **Équipe d'Accueil** : Scanne le QR code du badge
4. **Système** : Marque automatiquement le participant comme présent
5. **Équipe d'Accueil** : Vérifie les informations affichées

### Jour J - Participant sans badge
1. **Équipe d'Accueil** : Utilise la recherche par nom
2. **Équipe d'Accueil** : Sélectionne le participant
3. **Équipe d'Accueil** : Clique sur "Marquer présent"
4. **Système** : Enregistre la présence

### Après la compétition
1. **Admin** : Exporte les présences en CSV
2. **Admin** : Analyse les statistiques de participation

---

## 💡 Conseils d'Utilisation

### Pour l'Admin
- Générer les badges quelques jours avant l'événement
- Exporter régulièrement les présences pendant l'événement
- Utiliser les filtres pour analyser par discipline

### Pour l'Équipe d'Accueil
- Tester la caméra avant le début de l'accueil
- Utiliser la recherche pour les participants sans badge
- Vérifier les statistiques régulièrement

### Pour les Participants
- Scanner son QR code pour accéder rapidement à sa fiche
- Télécharger son badge avant l'événement
- Conserver son badge pour le jour J

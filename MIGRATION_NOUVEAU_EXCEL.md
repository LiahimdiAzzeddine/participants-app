# Migration vers le nouveau fichier Excel

## Date de migration
10 Mai 2026

## Changements effectués

### 1. Nouveau fichier Excel
- **Ancien fichier** : `Participants_QR_Complet.xlsx`
- **Nouveau fichier** : `Participants_QR_new.xlsx`

### 2. Colonnes renommées

| Ancien nom | Nouveau nom |
|------------|-------------|
| Société | Fililales |
| Email participant | Adresse mail |
| Email responsable | Adresse Mail Hiérarchie |
| Date compétition | Jour |
| Heure | Démarrage de la compétition |

### 3. Nouvelle colonne ajoutée
- **Ville de départ** : Nouvelle colonne pour indiquer la ville de départ du participant

### 4. Fichiers modifiés

#### src/utils/excelReader.js
- Mise à jour du mapping des colonnes
- Ajout du support pour les nouveaux noms de colonnes
- Ajout du champ `villeDepart`
- Changement de `societe` vers `filiale`
- Support des anciens noms pour rétrocompatibilité

#### Pages mises à jour
Tous les fichiers suivants ont été mis à jour pour :
- Utiliser `filiale` au lieu de `societe`
- Charger le nouveau fichier `Participants_QR_new.xlsx`
- Afficher le champ "Ville de départ" quand disponible

**Liste des pages modifiées :**
- `src/pages/HomePage.jsx`
- `src/pages/AdminDashboard.jsx`
- `src/pages/AccueilDashboard.jsx`
- `src/pages/ParticipantDetail.jsx`
- `src/pages/ParticipantPortal.jsx`
- `src/pages/GenerateBadges.jsx`
- `src/pages/CheckIn.jsx`

### 5. Fonctionnalités préservées

✅ Toutes les fonctionnalités existantes continuent de fonctionner :
- Lecture et affichage des participants
- Génération de badges
- Pointage des présences
- Recherche par nom, filiale, discipline
- Export CSV des présences
- Scanner QR code
- Portail participant

### 6. Rétrocompatibilité

Le code supporte les deux formats de fichier Excel :
- Si une colonne avec le nouveau nom existe, elle est utilisée
- Sinon, le système cherche l'ancien nom de colonne
- Cela permet une transition en douceur

### 7. Exemple de données

```
Disciplines: Babyfoot
Participant: CHOUIBI Montassir
Fililales: Amendis Tanger
Adresse mail: montassir.chouibi@veolia.com
Adresse Mail Hiérarchie: fatima.hmimid@veolia.com
Direction: DET
Jour: 14/05/2026
Démarrage de la compétition: 10h00
Lieu: Sonarges
Ville: Tétouan
Ville de départ: [vide ou rempli]
```

### 8. Tests recommandés

Avant de déployer en production, vérifier :
1. ✅ Chargement correct du nouveau fichier Excel
2. ✅ Affichage des participants avec les nouvelles colonnes
3. ✅ Recherche par filiale fonctionne
4. ✅ Export CSV contient les bonnes colonnes
5. ✅ Génération de badges avec les nouvelles données
6. ✅ Affichage de "Ville de départ" quand disponible
7. ✅ Scanner QR code et pointage fonctionnent

## Notes importantes

- Le champ "Ville de départ" est optionnel et ne s'affiche que s'il est rempli
- Les exports CSV incluent maintenant la colonne "Ville de départ"
- La recherche fonctionne avec "Filiale" au lieu de "Société"
- Tous les labels dans l'interface ont été mis à jour pour refléter les nouveaux noms

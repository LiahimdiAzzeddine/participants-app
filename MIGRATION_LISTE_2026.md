# Migration vers ListeParticipantsTournoiInterfiliales2026.xlsx

## Date de migration
13 Mai 2026

## Contexte
Le responsable souhaite utiliser le fichier `ListeParticipantsTournoiInterfiliales2026.xlsx` au lieu de `Participants_QR_new.xlsx`.

## Analyse des différences

### Colonnes présentes dans les DEUX fichiers ✅
- Disciplines
- Participant
- Fililales
- Adresse mail
- Direction
- Jour
- Démarrage de la compétition
- Lieu

### Colonnes MANQUANTES dans le nouveau fichier ⚠️

| Colonne | Ancien fichier | Nouveau fichier | Impact |
|---------|---------------|-----------------|--------|
| **Adresse Mail Hiérarchie** | ✅ Présente | ❌ Absente | Email du responsable hiérarchique |
| **Ville** | ✅ Présente | ❌ Absente | Ville du participant |
| **Ville de départ** | ❌ Absente | ❌ Absente | Jamais utilisée |

## Impact sur l'application

### 1. Champs qui deviennent optionnels
- `emailResponsable` (Adresse Mail Hiérarchie) - sera vide
- `ville` (Ville) - sera vide
- `villeDepart` (Ville de départ) - déjà optionnel

### 2. Fonctionnalités affectées

#### ✅ Fonctionnalités NON affectées (fonctionnent normalement)
- Affichage de la liste des participants
- Recherche par nom, filiale, discipline
- Génération de badges (nom, filiale, discipline)
- Pointage des présences
- Scanner QR code
- Export CSV des présences
- Portail participant (accès par email participant)

#### ⚠️ Fonctionnalités partiellement affectées
- **Détails du participant** : Les champs "Email Responsable" et "Ville" seront vides
- **Badges** : Si le badge affiche la ville, elle sera absente
- **Exports** : Les colonnes "Ville" et "Email Responsable" seront vides dans les exports

## Modifications nécessaires

### 1. Mise à jour du chemin du fichier Excel
Changer dans tous les fichiers qui chargent le fichier Excel :
```javascript
// Ancien
const filePath = '/Participants_QR_new.xlsx';

// Nouveau
const filePath = '/ListeParticipantsTournoiInterfiliales2026.xlsx';
```

### 2. Mise à jour de excelReader.js
Le code actuel gère déjà les colonnes optionnelles avec l'opérateur `||`, donc il fonctionnera correctement. Les champs manquants seront simplement des chaînes vides.

### 3. Mise à jour de l'interface utilisateur
Masquer ou marquer comme optionnels les champs suivants dans l'affichage :
- Email Responsable
- Ville

## Recommandations

### Option 1 : Utiliser le nouveau fichier tel quel ✅ RECOMMANDÉ
**Avantages :**
- Pas de modification du fichier Excel
- Code déjà compatible (gère les champs optionnels)
- Migration simple

**Inconvénients :**
- Perte d'information (email responsable, ville)
- Affichage de champs vides dans l'interface

**Actions requises :**
1. Changer le chemin du fichier dans le code
2. Mettre à jour l'interface pour masquer les champs vides
3. Tester toutes les fonctionnalités

### Option 2 : Enrichir le nouveau fichier Excel
**Avantages :**
- Conserve toutes les informations
- Aucune modification de l'interface nécessaire

**Inconvénients :**
- Nécessite de modifier le fichier Excel
- Demande au responsable d'ajouter les colonnes manquantes

**Actions requises :**
1. Demander au responsable d'ajouter les colonnes :
   - "Adresse Mail Hiérarchie"
   - "Ville"
2. Remplir les données manquantes
3. Changer le chemin du fichier dans le code

## Plan de migration (Option 1 - Recommandée)

### Étape 1 : Mise à jour du code
- [x] Analyser les différences entre les fichiers
- [ ] Mettre à jour le chemin du fichier Excel dans tous les composants
- [ ] Adapter l'interface pour gérer les champs optionnels
- [ ] Tester le chargement des données

### Étape 2 : Tests
- [ ] Vérifier le chargement du nouveau fichier
- [ ] Tester l'affichage des participants
- [ ] Tester la génération de badges
- [ ] Tester le pointage
- [ ] Tester les exports CSV
- [ ] Tester le scanner QR code

### Étape 3 : Déploiement
- [ ] Commit des modifications
- [ ] Déploiement sur Vercel
- [ ] Vérification en production

## Fichiers à modifier

1. **src/pages/HomePage.jsx** - Changer le chemin du fichier
2. **src/pages/AdminDashboard.jsx** - Changer le chemin du fichier
3. **src/pages/AccueilDashboard.jsx** - Changer le chemin du fichier
4. **src/pages/ParticipantDetail.jsx** - Masquer les champs vides
5. **src/pages/ParticipantPortal.jsx** - Changer le chemin du fichier
6. **src/pages/GenerateBadges.jsx** - Changer le chemin du fichier
7. **src/pages/CheckIn.jsx** - Changer le chemin du fichier

## Notes importantes

- Le code actuel utilise déjà `|| ''` pour gérer les colonnes optionnelles
- Les champs manquants seront simplement des chaînes vides
- Aucune erreur ne devrait se produire
- L'interface affichera des champs vides pour "Email Responsable" et "Ville"

## Décision finale

**À décider avec le responsable :**
- [ ] Option 1 : Utiliser le nouveau fichier tel quel (champs vides acceptés)
- [ ] Option 2 : Enrichir le fichier Excel avec les colonnes manquantes


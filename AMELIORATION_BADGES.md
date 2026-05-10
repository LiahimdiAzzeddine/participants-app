# Amélioration du Design des Badges

## Date
10 Mai 2026

## Objectif
Rendre les badges plus compacts et mieux organisés avec des petites cartes pour chaque information.

## Changements effectués

### 1. Réduction de la taille globale

**ParticipantDetail.jsx (page /participant/:id)**
- Largeur maximale du badge : 600px (centré)
- Padding réduit : 1.25rem → 1rem
- Header plus compact : 1.5rem de padding
- Taille du titre : 1.85rem → 1.5rem

**GenerateBadges.jsx (génération en masse)**
- Grille adaptée : minmax(350px) → minmax(280px)
- Badges plus compacts dans la grille
- Padding réduit : 1.5rem → 1rem

### 2. Design en petites cartes

**Avant :**
```
┌─────────────────────┐
│ Label: Valeur       │
└─────────────────────┘
```

**Après :**
```
┌───────────────┐
│ LABEL         │
│ Valeur        │
└───────────────┘
```

**Caractéristiques des cartes :**
- Background : #f8f9fa (gris très clair)
- Bordure gauche : 3px solid rouge Amendis
- Ombre légère : box-shadow
- Padding compact : 0.6rem - 0.75rem
- Gap réduit entre label et valeur : 0.3rem - 0.35rem
- Border-radius : 3px

### 3. Typographie optimisée

**Labels :**
- Taille : 0.65rem - 0.7rem
- Style : UPPERCASE, bold
- Couleur : gris Amendis
- Letter-spacing : 0.3px - 0.5px

**Valeurs :**
- Taille : 0.8rem - 0.85rem
- Style : medium weight
- Line-height : 1.3 (meilleure lisibilité)
- Word-break : break-word (évite débordement)

### 4. QR Code réduit

**Tailles ajustées :**
- ParticipantDetail : 200px → 160px
- GenerateBadges : 150px → 120px
- Mobile (768px) : 140px
- Mobile (480px) : 120px - 110px

**Section QR :**
- Padding réduit : 1rem → 0.85rem
- Labels plus petits : 0.8rem → 0.7rem
- ID participant : 1.1rem → 0.85rem - 0.95rem

### 5. Header du badge

**Optimisations :**
- Padding : 1.5rem → 1rem - 1.25rem
- Titre : 1.5rem → 1.2rem - 1.5rem
- Tag discipline : 0.85rem → 0.75rem - 0.85rem
- Padding tag : 0.4rem 1rem → 0.35rem 0.85rem

### 6. Grille d'informations

**Layout :**
- 2 colonnes maintenues
- Gap réduit : 1.25rem → 0.6rem - 0.75rem
- Margin bottom : 2rem → 1rem - 1.25rem

**Mobile :**
- Passe en 1 colonne
- Gap encore plus réduit : 0.6rem

### 7. Responsive amélioré

**Breakpoints optimisés :**

**768px (tablettes) :**
- Badge container : max-width 100%
- Info grid : 1 colonne
- QR code : 140px
- Padding général réduit

**480px (petits mobiles) :**
- Header : 0.85rem padding
- Titre : 1.15rem
- QR code : 110px - 120px
- Cartes info : 0.6rem padding

### 8. Cohérence visuelle

**Éléments harmonisés :**
- Border-radius uniforme : 3px pour les petits éléments
- Ombres légères et cohérentes
- Espacement proportionnel
- Couleurs Amendis respectées

## Résultat

### Avant
- Badge large et espacé
- Informations dispersées
- QR code imposant
- Moins de badges visibles à l'écran

### Après
- Badge compact et dense
- Informations organisées en cartes
- QR code proportionné
- Plus de badges visibles simultanément
- Meilleure utilisation de l'espace
- Design plus moderne et professionnel

## Avantages

✅ **Gain d'espace** : 30-40% de réduction de taille
✅ **Meilleure lisibilité** : Cartes séparées visuellement
✅ **Plus professionnel** : Design moderne et épuré
✅ **Impression optimisée** : Taille réduite = moins de papier
✅ **Mobile-friendly** : Adapté aux petits écrans
✅ **Génération rapide** : Badges plus légers à générer

## Fichiers modifiés

1. `src/pages/ParticipantDetail.css` - Style du badge individuel
2. `src/pages/ParticipantDetail.jsx` - Taille QR code (200→160px)
3. `src/pages/GenerateBadges.css` - Style des badges en masse
4. `src/pages/GenerateBadges.jsx` - Taille QR code (150→120px)

## Tests recommandés

- [ ] Vérifier l'affichage sur desktop
- [ ] Vérifier l'affichage sur mobile
- [ ] Tester la génération de badges en masse
- [ ] Vérifier le téléchargement PNG
- [ ] Tester le scan des QR codes réduits
- [ ] Vérifier la lisibilité de toutes les informations

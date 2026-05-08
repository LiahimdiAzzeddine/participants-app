# Thème Amendis - Documentation

## 🎨 Palette de couleurs

### Couleurs principales
- **Rouge Amendis** : `#C8102E` - Couleur principale de la marque
- **Rouge foncé** : `#A00D25` - Pour les hovers et états actifs
- **Rouge clair** : `#E6143A` - Pour les accents légers
- **Gris Amendis** : `#6D6E71` - Couleur secondaire
- **Gris clair** : `#9B9B9B` - Pour les textes secondaires
- **Gris foncé** : `#4A4A4A` - Pour les textes importants

### Couleurs de statut
- **Succès** : `#4CAF50` - Pour les présences confirmées
- **Avertissement** : `#FF9800` - Pour les absences
- **Erreur** : `#F44336` - Pour les erreurs
- **Info** : `#2196F3` - Pour les informations

### Couleurs neutres
- **Blanc** : `#FFFFFF`
- **Gris clair** : `#F5F5F5` - Fond de page
- **Bordure** : `#E0E0E0`
- **Texte foncé** : `#1A1A1A`
- **Texte moyen** : `#666666`

## 📐 Variables CSS

Toutes les couleurs et styles sont définis dans `src/theme.css` :

```css
:root {
  --amendis-red: #C8102E;
  --amendis-red-dark: #A00D25;
  --amendis-red-light: #E6143A;
  --amendis-gray: #6D6E71;
  --amendis-gray-light: #9B9B9B;
  --amendis-gray-dark: #4A4A4A;
  
  --success: #4CAF50;
  --warning: #FF9800;
  --error: #F44336;
  --info: #2196F3;
  
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);
}
```

## 🎯 Composants stylisés

### Headers
- Fond dégradé rouge Amendis
- Texte blanc
- Ombre portée
- Bordure arrondie

### Boutons
- **Primaire** : Rouge Amendis avec hover foncé
- **Secondaire** : Gris Amendis
- **Succès** : Vert pour les actions positives
- **Avertissement** : Orange pour les actions d'annulation

### Cards
- Fond blanc
- Bordure subtile
- Ombre légère
- Hover avec élévation

### Inputs
- Bordure grise par défaut
- Focus avec bordure rouge Amendis
- Ombre de focus subtile

### Badges
- Fond rouge Amendis pour les disciplines
- Fond vert pour les présences
- Fond gris pour les absences

## 📄 Fichiers modifiés

### Fichiers CSS mis à jour
1. `src/theme.css` - Variables globales (nouveau)
2. `src/pages/Login.css` - Page de connexion
3. `src/pages/AdminDashboard.css` - Dashboard administrateur
4. `src/pages/AccueilDashboard.css` - Dashboard équipe d'accueil
5. `src/pages/ParticipantDetail.css` - Détail participant

### Fichiers JS modifiés
1. `src/main.jsx` - Import du thème

## 🎨 Éléments de design

### Gradients
```css
background: linear-gradient(135deg, var(--amendis-red) 0%, var(--amendis-red-dark) 100%);
```

### Ombres
- **Petite** : Cartes et éléments légers
- **Moyenne** : Hover states
- **Grande** : Headers et éléments importants

### Bordures
- **Petite** : 4px pour les boutons et inputs
- **Moyenne** : 8px pour les cartes
- **Grande** : 12px pour les containers principaux

### Transitions
```css
transition: all 0.3s ease;
```

## 🖼️ Exemples d'utilisation

### Bouton principal
```jsx
<button className="btn-primary">
  Action principale
</button>
```

### Card avec bordure Amendis
```jsx
<div className="card" style={{borderLeft: '4px solid var(--amendis-red)'}}>
  Contenu
</div>
```

### Header avec gradient
```jsx
<header className="page-header">
  <h1>Titre</h1>
  <p>Sous-titre</p>
</header>
```

## 📱 Responsive Design

Tous les composants sont responsive avec des breakpoints à :
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

### Adaptations mobiles
- Headers en colonne
- Boutons pleine largeur
- Grilles en une colonne
- Textes réduits

## ✨ Effets interactifs

### Hover
- Changement de couleur
- Élévation (translateY)
- Ombre plus prononcée

### Focus
- Bordure rouge Amendis
- Ombre de focus subtile
- Pas de outline par défaut

### Active
- Légère réduction de taille
- Couleur plus foncée

## 🎯 Cohérence visuelle

### Typographie
- **Titres** : Font-weight 700, couleur gris foncé
- **Sous-titres** : Font-weight 600
- **Corps** : Font-weight 400-500
- **Labels** : Font-weight 600, uppercase, letterspacing

### Espacements
- **Petit** : 0.5rem (8px)
- **Moyen** : 1rem (16px)
- **Grand** : 1.5rem (24px)
- **Très grand** : 2rem (32px)

### Alignements
- Headers : Centré ou flex space-between
- Cards : Padding uniforme de 1.5-2rem
- Grilles : Gap de 1-1.5rem

## 🔧 Personnalisation

Pour modifier les couleurs, éditez `src/theme.css` :

```css
:root {
  --amendis-red: #VOTRE_COULEUR;
  /* ... autres variables */
}
```

Tous les composants utiliseront automatiquement les nouvelles couleurs.

## 📊 Avant / Après

### Avant
- Couleurs génériques (vert, violet)
- Pas de cohérence visuelle
- Design basique

### Après
- Couleurs Amendis (rouge #C8102E, gris #6D6E71)
- Cohérence sur toutes les pages
- Design professionnel et moderne
- Identité visuelle forte

## 🎉 Résultat

L'application reflète maintenant l'identité visuelle d'Amendis avec :
- ✅ Couleurs de la marque
- ✅ Design moderne et professionnel
- ✅ Cohérence sur toutes les pages
- ✅ Responsive et accessible
- ✅ Effets interactifs fluides

## 📞 Support

Pour toute modification du thème, consultez :
- `src/theme.css` - Variables globales
- Documentation CSS des composants individuels

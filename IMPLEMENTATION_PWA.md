# Implémentation PWA - Tournoi Amendis 2026

## 📋 Résumé

L'application Tournoi Amendis 2026 est maintenant une **Progressive Web App (PWA)** complète, installable sur iOS, Android et Desktop.

## ✅ Fonctionnalités implémentées

### 1. Manifest Web App (`public/manifest.json`)
- ✅ Nom de l'application : "Tournoi Amendis 2026"
- ✅ Nom court : "Tournoi Amendis"
- ✅ Icônes : logo2.png (192x192 et 512x512)
- ✅ Couleur de thème : Rouge Amendis (#C8102E)
- ✅ Mode d'affichage : Standalone (plein écran)
- ✅ Orientation : Portrait
- ✅ Langue : Français

### 2. Service Worker (`public/sw.js`)
- ✅ Stratégie de cache : Network First avec fallback
- ✅ Cache des ressources essentielles
- ✅ Mise à jour automatique du cache
- ✅ Support hors ligne partiel
- ✅ Nettoyage des anciens caches

### 3. Composant d'installation (`src/components/InstallPrompt.jsx`)
- ✅ Notification automatique d'installation
- ✅ Détection iOS vs Android
- ✅ Instructions spécifiques pour iOS
- ✅ Bouton d'installation pour Android/Desktop
- ✅ Bouton de fermeture
- ✅ Réaffichage après 24h si fermé
- ✅ Masquage si déjà installé
- ✅ Design responsive et élégant

### 4. Meta tags PWA (`index.html`)
- ✅ Theme color
- ✅ Apple mobile web app capable
- ✅ Apple touch icon
- ✅ Description
- ✅ Lien vers manifest

### 5. Enregistrement Service Worker (`src/App.jsx`)
- ✅ Enregistrement automatique au chargement
- ✅ Logs de débogage
- ✅ Gestion des erreurs

## 📁 Fichiers créés/modifiés

### Nouveaux fichiers
```
public/manifest.json              # Configuration PWA
public/sw.js                      # Service Worker
src/components/InstallPrompt.jsx  # Composant notification
src/components/InstallPrompt.css  # Styles notification
GUIDE_PWA.md                      # Guide utilisateur
IMPLEMENTATION_PWA.md             # Ce fichier
```

### Fichiers modifiés
```
index.html                        # Meta tags PWA
src/App.jsx                       # Import InstallPrompt + SW registration
```

## 🎨 Design de la notification

### Desktop/Tablette
```
┌─────────────────────────────────────────────────┐
│  [Logo]  Installer l'application            [X] │
│          Installez l'application pour un         │
│          accès rapide...                         │
│                                    [📥 Installer] │
└─────────────────────────────────────────────────┘
```

### Mobile
```
┌───────────────────────────────┐
│  [Logo]  Installer...      [X]│
│          Installez pour un     │
│          accès rapide...       │
│  [📥 Installer]                │
└───────────────────────────────┘
```

### iOS
```
┌───────────────────────────────┐
│  [Logo]  Installer...      [X]│
│          Appuyez sur ⎙ puis   │
│          "Sur l'écran          │
│          d'accueil"            │
└───────────────────────────────┘
```

## 🔧 Configuration technique

### Stratégie de cache
```javascript
Network First → Cache Fallback → Offline Page
```

1. **Essaie le réseau** en premier
2. **Met en cache** la réponse
3. **Utilise le cache** si le réseau échoue
4. **Retourne index.html** pour les navigations

### Fichiers en cache initial
- `/` (page d'accueil)
- `/index.html`
- `/logo2.png`
- `/amendis-logo.png`
- `/manifest.json`

### Fichiers en cache dynamique
- Toutes les pages visitées
- Toutes les ressources chargées
- Mise à jour automatique

## 📱 Comportement par plateforme

### Android (Chrome/Firefox/Edge)
1. Événement `beforeinstallprompt` capturé
2. Notification affichée immédiatement
3. Bouton "Installer" fonctionnel
4. Installation native via le navigateur

### iOS (Safari uniquement)
1. Détection iOS automatique
2. Notification affichée après 3 secondes
3. Instructions pour installation manuelle
4. Pas de bouton (limitation iOS)

### Desktop (Chrome/Edge)
1. Événement `beforeinstallprompt` capturé
2. Notification affichée immédiatement
3. Bouton "Installer" fonctionnel
4. Application installée comme app native

## 🎯 Expérience utilisateur

### Première visite
1. L'utilisateur ouvre l'application
2. Service Worker s'enregistre en arrière-plan
3. Notification d'installation apparaît (après 3s sur iOS)
4. L'utilisateur peut installer ou fermer

### Si fermé
1. Timestamp enregistré dans localStorage
2. Notification réapparaît après 24h
3. Permet de ne pas être intrusif

### Si installé
1. Détection automatique du mode standalone
2. Notification ne s'affiche plus
3. Expérience plein écran

## 🚀 Déploiement

### Prérequis
- ✅ HTTPS obligatoire (PWA ne fonctionne qu'en HTTPS)
- ✅ Manifest accessible
- ✅ Service Worker accessible
- ✅ Icônes disponibles

### Vérification
1. Ouvrez Chrome DevTools
2. Onglet "Application"
3. Section "Manifest" : Vérifier les infos
4. Section "Service Workers" : Vérifier l'enregistrement
5. Lighthouse : Score PWA > 90

### Commandes
```bash
# Build production
npm run build

# Preview
npm run preview

# Deploy (Vercel)
vercel --prod
```

## 🧪 Tests

### Test Android
1. Ouvrir sur Chrome Android
2. Vérifier notification d'installation
3. Installer l'application
4. Vérifier icône sur écran d'accueil
5. Ouvrir et vérifier mode standalone

### Test iOS
1. Ouvrir sur Safari iOS
2. Attendre 3 secondes
3. Vérifier notification avec instructions
4. Suivre les instructions
5. Vérifier icône sur écran d'accueil

### Test Desktop
1. Ouvrir sur Chrome/Edge
2. Vérifier notification
3. Cliquer sur "Installer"
4. Vérifier fenêtre dédiée
5. Vérifier dans menu Démarrer/Applications

### Test hors ligne
1. Installer l'application
2. Visiter plusieurs pages
3. Activer mode avion
4. Rouvrir l'application
5. Vérifier que les pages en cache s'affichent

## 📊 Métriques PWA

### Lighthouse scores attendus
- **PWA** : 100/100
- **Performance** : 90+/100
- **Accessibility** : 95+/100
- **Best Practices** : 95+/100
- **SEO** : 90+/100

### Critères PWA
- ✅ Installable
- ✅ Service Worker enregistré
- ✅ Manifest valide
- ✅ HTTPS
- ✅ Responsive
- ✅ Icônes appropriées
- ✅ Splash screen (auto-généré)

## 🔄 Mises à jour futures

### Fonctionnalités possibles
- 🔔 Push notifications
- 📴 Mode hors ligne complet
- 🔄 Synchronisation en arrière-plan
- 📥 Téléchargement de badges en cache
- 🎨 Thème sombre
- 🌐 Support multilingue

### Améliorations cache
- Cache des images de badges
- Cache du fichier Excel
- Stratégie de cache plus agressive
- Préchargement des pages importantes

## 🐛 Dépannage

### Service Worker ne s'enregistre pas
```javascript
// Vérifier dans la console
navigator.serviceWorker.getRegistrations()
  .then(registrations => console.log(registrations));
```

### Cache ne fonctionne pas
```javascript
// Vérifier le cache
caches.keys().then(keys => console.log(keys));
```

### Notification ne s'affiche pas
- Vérifier que l'app n'est pas déjà installée
- Vérifier localStorage : `pwa-install-dismissed`
- Vérifier la console pour les erreurs

### Forcer la réinstallation
```javascript
// Dans la console
localStorage.removeItem('pwa-install-dismissed');
location.reload();
```

## 📚 Ressources

### Documentation
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev - PWA](https://web.dev/progressive-web-apps/)
- [Apple - Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)

### Outils
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PWA Builder](https://www.pwabuilder.com/)
- [Manifest Generator](https://app-manifest.firebaseapp.com/)

## ✅ Checklist de déploiement

- [ ] Vérifier HTTPS activé
- [ ] Tester sur Chrome Android
- [ ] Tester sur Safari iOS
- [ ] Tester sur Chrome Desktop
- [ ] Vérifier Lighthouse score
- [ ] Tester mode hors ligne
- [ ] Vérifier icônes affichées correctement
- [ ] Tester notification d'installation
- [ ] Vérifier que le cache fonctionne
- [ ] Documenter pour les utilisateurs

---

**Version** : 1.0.0  
**Date** : Mai 2026  
**Auteur** : Équipe Technique Amendis

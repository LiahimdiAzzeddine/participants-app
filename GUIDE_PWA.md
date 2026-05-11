# Guide PWA - Application Tournoi Amendis 2026

## 🚀 Qu'est-ce qu'une PWA ?

Une **Progressive Web App (PWA)** est une application web qui peut être installée sur votre appareil (smartphone, tablette, ordinateur) comme une application native, tout en restant accessible via un navigateur.

## ✨ Avantages de l'installation

### Pour tous les utilisateurs
- 📱 **Accès rapide** : Icône sur l'écran d'accueil
- 🚀 **Lancement instantané** : Ouverture plus rapide
- 📴 **Fonctionne hors ligne** : Accès aux données en cache
- 🎨 **Expérience native** : Interface plein écran sans barre d'adresse
- 💾 **Moins de données** : Cache intelligent pour économiser la bande passante

### Pour l'équipe d'accueil
- 📷 **Caméra optimisée** : Meilleur accès à la caméra pour scanner les QR codes
- ⚡ **Performance** : Chargement plus rapide des pages
- 🔔 **Notifications** : (Future fonctionnalité)

## 📲 Installation sur Android

### Méthode 1 : Notification automatique
1. Ouvrez l'application dans Chrome
2. Une notification apparaît en bas de l'écran
3. Cliquez sur **"Installer"**
4. L'application s'installe automatiquement

### Méthode 2 : Menu du navigateur
1. Ouvrez l'application dans Chrome
2. Appuyez sur le menu (⋮) en haut à droite
3. Sélectionnez **"Installer l'application"** ou **"Ajouter à l'écran d'accueil"**
4. Confirmez l'installation

### Résultat
- ✅ Icône sur l'écran d'accueil
- ✅ Ouverture en plein écran
- ✅ Apparaît dans la liste des applications

## 🍎 Installation sur iOS (iPhone/iPad)

### Étapes d'installation
1. Ouvrez l'application dans **Safari** (important !)
2. Une notification apparaît avec les instructions
3. Appuyez sur le bouton **Partager** (⎙) en bas de l'écran
4. Faites défiler et sélectionnez **"Sur l'écran d'accueil"**
5. Modifiez le nom si nécessaire
6. Appuyez sur **"Ajouter"**

### Important pour iOS
- ⚠️ **Utilisez Safari** : L'installation ne fonctionne que sur Safari
- ⚠️ Chrome/Firefox sur iOS ne supportent pas l'installation PWA
- ℹ️ La notification s'affiche 3 secondes après l'ouverture

### Résultat
- ✅ Icône sur l'écran d'accueil
- ✅ Ouverture en plein écran
- ✅ Barre de statut personnalisée

## 💻 Installation sur Desktop (Windows/Mac/Linux)

### Chrome/Edge
1. Ouvrez l'application
2. Cliquez sur l'icône d'installation (➕) dans la barre d'adresse
3. Ou menu (⋮) → **"Installer Tournoi Amendis"**
4. Confirmez l'installation

### Résultat
- ✅ Application dans le menu Démarrer/Applications
- ✅ Fenêtre dédiée sans barre d'adresse
- ✅ Raccourci sur le bureau (optionnel)

## 🔧 Fonctionnalités PWA

### Cache intelligent
- Les pages visitées sont mises en cache
- Accès rapide même avec connexion lente
- Fonctionne partiellement hors ligne

### Stratégie de cache
- **Network First** : Essaie d'abord le réseau
- **Cache Fallback** : Utilise le cache si le réseau échoue
- **Auto-update** : Met à jour le cache automatiquement

### Fichiers mis en cache
- Page d'accueil
- Logo et icônes
- Manifest
- Pages visitées récemment

## 🔄 Mise à jour de l'application

### Automatique
- L'application se met à jour automatiquement
- Pas besoin de réinstaller
- Les nouvelles fonctionnalités apparaissent au prochain chargement

### Forcer la mise à jour
1. Fermez complètement l'application
2. Rouvrez-la
3. Le service worker télécharge les nouvelles versions

## ❌ Désinstallation

### Android
1. Maintenez l'icône de l'application
2. Sélectionnez **"Désinstaller"** ou **"Supprimer"**
3. Confirmez

### iOS
1. Maintenez l'icône de l'application
2. Appuyez sur **"Supprimer l'app"**
3. Confirmez

### Desktop
1. Ouvrez l'application
2. Menu (⋮) → **"Désinstaller Tournoi Amendis"**
3. Ou désinstallez depuis les paramètres système

## 🎯 Notification d'installation

### Comportement
- Apparaît automatiquement à l'ouverture de l'application
- S'affiche en bas de l'écran
- Peut être fermée avec le bouton ✕

### Réaffichage
- Si vous fermez la notification, elle réapparaît après 24h
- Permet de ne pas être trop intrusif
- Vous pouvez toujours installer manuellement via le menu

### Masquer définitivement
- Installez l'application
- Ou fermez la notification (réapparaît dans 24h)

## 🛠️ Dépannage

### La notification n'apparaît pas
- **Android** : Vérifiez que vous utilisez Chrome
- **iOS** : Utilisez Safari (pas Chrome)
- **Desktop** : Vérifiez que vous utilisez Chrome/Edge
- Videz le cache et rechargez la page

### L'installation échoue
- Vérifiez votre connexion internet
- Assurez-vous d'utiliser HTTPS
- Essayez de vider le cache du navigateur
- Redémarrez le navigateur

### L'application ne se met pas à jour
- Fermez complètement l'application
- Videz le cache du navigateur
- Rouvrez l'application

### Problèmes de caméra après installation
- Vérifiez les permissions de l'application
- Paramètres → Applications → Tournoi Amendis → Permissions
- Activez l'accès à la caméra

## 📊 Statistiques PWA

### Taille de l'application
- **Installation** : ~2-5 MB
- **Cache** : Variable selon l'utilisation
- **Total** : Généralement < 10 MB

### Performance
- **Temps de chargement** : 50-70% plus rapide après installation
- **Consommation données** : Réduite de 60-80% grâce au cache
- **Autonomie batterie** : Légèrement améliorée

## 🔐 Sécurité et confidentialité

### Données stockées localement
- Cache des pages visitées
- Préférence d'installation (acceptée/refusée)
- Données de présence (si Supabase non configuré)

### Permissions requises
- **Caméra** : Pour scanner les QR codes (équipe d'accueil)
- **Stockage** : Pour le cache et les données hors ligne
- **Réseau** : Pour synchroniser avec le serveur

### Aucune donnée sensible
- Pas de stockage de mots de passe
- Pas de données bancaires
- Pas de géolocalisation

## 📱 Compatibilité

### Navigateurs supportés
| Plateforme | Navigateur | Installation | Notification |
|------------|------------|--------------|--------------|
| Android | Chrome | ✅ | ✅ |
| Android | Firefox | ✅ | ✅ |
| Android | Edge | ✅ | ✅ |
| iOS | Safari | ✅ | ✅ |
| iOS | Chrome | ❌ | ❌ |
| Desktop | Chrome | ✅ | ✅ |
| Desktop | Edge | ✅ | ✅ |
| Desktop | Firefox | ⚠️ | ⚠️ |

✅ = Supporté | ❌ = Non supporté | ⚠️ = Support partiel

## 💡 Conseils d'utilisation

### Pour l'équipe d'accueil
1. **Installez l'application** avant le jour J
2. Testez la caméra après installation
3. Gardez l'application ouverte pendant l'événement
4. Rechargez si besoin pour synchroniser les données

### Pour les administrateurs
1. Installez sur votre ordinateur pour un accès rapide
2. Utilisez le mode desktop pour une meilleure vue d'ensemble
3. Exportez régulièrement les données

### Pour les participants
1. Installez pour accéder rapidement à votre badge
2. Téléchargez votre badge avant l'événement
3. Gardez l'application pour les prochains tournois

## 🆘 Support

### Problèmes courants
- **"Impossible d'installer"** → Vérifiez HTTPS et le navigateur
- **"Notification ne s'affiche pas"** → Attendez 3 secondes ou installez manuellement
- **"Cache trop volumineux"** → Videz le cache dans les paramètres

### Contact
Pour toute question ou problème, contactez l'équipe technique Amendis.

---

**Version PWA** : 1.0.0  
**Dernière mise à jour** : Mai 2026

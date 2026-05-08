# Guide de débogage - Caméra mobile

## Problème
La vidéo de la caméra ne s'affiche pas sur mobile lors du scan QR code.

## Modifications apportées

### 1. Logs de débogage améliorés
J'ai ajouté des logs détaillés dans `startScanning()` pour diagnostiquer le problème :

```javascript
console.log('Est mobile:', isMobileDevice);
console.log('VideoRef existe:', !!videoRef.current);
console.log('Stream obtenu:', stream);
console.log('Tracks vidéo:', stream.getVideoTracks());
console.log('Métadonnées vidéo chargées');
console.log('Dimensions vidéo:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
console.log('Vidéo en lecture, readyState:', videoRef.current.readyState);
```

### 2. CSS amélioré pour mobile
Ajout de styles spécifiques pour mobile dans `AccueilDashboard.css` et `ParticipantPortal.css` :

```css
.scanner-video {
  width: 100%;
  max-width: 500px;
  height: auto;
  aspect-ratio: 4/3;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #000;
  min-height: 300px;
  object-fit: cover;
  display: block;
}

@media (max-width: 768px) {
  .scanner-video {
    max-width: 100%;
    min-height: 400px;
  }
}
```

## Comment déboguer sur mobile

### Étape 1 : Ouvrir la console mobile
Sur Chrome Android :
1. Connectez votre téléphone à votre ordinateur via USB
2. Activez le mode développeur sur Android
3. Ouvrez Chrome sur PC : `chrome://inspect`
4. Sélectionnez votre appareil et cliquez sur "Inspect"

Sur Safari iOS :
1. Activez "Inspecteur Web" dans Réglages > Safari > Avancé
2. Connectez l'iPhone à votre Mac
3. Ouvrez Safari sur Mac > Développement > [Votre iPhone]

### Étape 2 : Tester le scanner
1. Allez sur la page Équipe d'Accueil ou Portail Participant
2. Cliquez sur "Activer le scanner"
3. Vérifiez les logs dans la console :

**Logs attendus si tout fonctionne :**
```
Demande d'accès caméra avec contraintes: {video: {...}}
Est mobile: true
VideoRef existe: true
Stream obtenu: MediaStream {...}
Tracks vidéo: [MediaStreamTrack {...}]
Métadonnées vidéo chargées
Dimensions vidéo: 1280 x 720
Vidéo en lecture, readyState: 4
```

**Logs si problème :**
- Si "VideoRef existe: false" → Problème de référence React
- Si erreur après "Stream obtenu" → Problème d'attachement du stream
- Si "readyState: 0 ou 1" → Vidéo pas prête
- Si dimensions "0 x 0" → Stream pas actif

### Étape 3 : Vérifications importantes

#### A. Permissions caméra
- Vérifiez que l'application a la permission d'accéder à la caméra
- Sur Android : Paramètres > Applications > Chrome > Autorisations
- Sur iOS : Réglages > Safari > Caméra

#### B. HTTPS requis
- La caméra ne fonctionne que sur HTTPS (ou localhost)
- Vérifiez que votre URL commence par `https://`
- Sur Vercel, HTTPS est automatique

#### C. Attributs vidéo
Le code utilise déjà les bons attributs :
```jsx
<video 
  ref={videoRef} 
  className="scanner-video"
  autoPlay      // Lecture automatique
  playsInline   // Lecture inline sur iOS (pas en plein écran)
  muted         // Nécessaire pour autoPlay
/>
```

## Solutions possibles

### Solution 1 : Forcer les dimensions
Si le problème persiste, essayez de forcer les dimensions dans le JSX :

```jsx
<video 
  ref={videoRef} 
  className="scanner-video"
  autoPlay
  playsInline
  muted
  width="640"
  height="480"
/>
```

### Solution 2 : Vérifier le z-index
Ajoutez dans le CSS :

```css
.scanner-video {
  position: relative;
  z-index: 1;
}
```

### Solution 3 : Alternative - Utiliser html5-qrcode
Si le problème persiste avec @zxing/library, on peut essayer une autre bibliothèque :

```bash
npm install html5-qrcode
```

Cette bibliothèque gère mieux les caméras mobiles.

## Informations système

### Configuration actuelle
- **Bibliothèque QR** : @zxing/library (BrowserMultiFormatReader)
- **Détection mobile** : User-Agent regex
- **Caméra mobile** : `facingMode: { ideal: 'environment' }` (caméra arrière)
- **Caméra desktop** : `facingMode: 'user'` (webcam frontale)

### Contraintes vidéo
```javascript
{
  video: {
    facingMode: isMobileDevice ? { ideal: 'environment' } : 'user',
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }
}
```

## Prochaines étapes

1. **Testez sur mobile** et vérifiez les logs dans la console
2. **Partagez les logs** si le problème persiste
3. **Vérifiez HTTPS** - c'est souvent la cause principale
4. **Testez sur différents navigateurs** (Chrome, Safari, Firefox mobile)

## Notes importantes

- ✅ Le code PNG/ZIP fonctionne correctement
- ✅ La conversion de date Excel est implémentée
- ✅ Le sélecteur de caméra n'apparaît que sur mobile
- ⚠️ La vidéo doit s'afficher avec les nouveaux logs de débogage

# Guide de test rapide - Mobile

## 🎯 Test prioritaire : Caméra mobile

### Étape 1 : Accéder à la console mobile

#### Sur Android (Chrome)
1. Connectez votre téléphone à votre PC via USB
2. Sur le téléphone : Activez "Débogage USB" dans les options développeur
3. Sur PC : Ouvrez Chrome et allez sur `chrome://inspect`
4. Cliquez sur "Inspect" sous votre appareil

#### Sur iOS (Safari)
1. Sur iPhone : Réglages > Safari > Avancé > Activez "Inspecteur Web"
2. Connectez l'iPhone au Mac via USB
3. Sur Mac : Safari > Développement > [Votre iPhone] > [Votre page]

### Étape 2 : Tester le scanner

1. **Allez sur** : `https://votre-app.vercel.app/accueil`
2. **Connectez-vous** avec : `equipe2026`
3. **Cliquez** sur "Activer le scanner"
4. **Observez** :
   - ✅ La vidéo doit s'afficher (fond noir avec image caméra)
   - ✅ La console doit afficher les logs
   - ✅ Le sélecteur de caméra doit apparaître (si plusieurs caméras)

### Étape 3 : Vérifier les logs

**Logs normaux (tout fonctionne) :**
```
✅ Est mobile: true
✅ VideoRef existe: true
✅ Stream obtenu: MediaStream {id: "...", active: true}
✅ Tracks vidéo: [MediaStreamTrack {kind: "video", ...}]
✅ Métadonnées vidéo chargées
✅ Dimensions vidéo: 1280 x 720
✅ Vidéo en lecture, readyState: 4
```

**Logs problématiques :**
```
❌ VideoRef existe: false
   → Problème React, rechargez la page

❌ NotAllowedError
   → Permissions refusées, autorisez la caméra

❌ Dimensions vidéo: 0 x 0
   → Stream pas actif, vérifiez HTTPS

❌ readyState: 0 ou 1
   → Vidéo pas prête, attendez quelques secondes
```

## 🎯 Test secondaire : Dates

### Vérification rapide
1. **Allez sur** : `https://votre-app.vercel.app/admin`
2. **Connectez-vous** avec : `admin2026`
3. **Regardez** la colonne "Date compétition"
4. **Vérifiez** : Doit afficher `14/05/2026` (pas `46156`)

### Dans la console
```
✅ Colonnes Excel détectées: ["Disciplines", "Participant", ...]
✅ Valeur brute Date compétition: 46156
✅ Conversion date Excel: 46156 Type: number
✅ Date convertie: 14/05/2026
```

## 🎯 Test tertiaire : Téléchargement PNG

### Test 1 : Badge individuel
1. **Allez sur** : `/participant/PART-0001`
2. **Cliquez** : "Télécharger le badge (PNG)"
3. **Vérifiez** : Fichier téléchargé = `Badge_PART-0001_NomParticipant.png`

### Test 2 : Badges en masse
1. **Allez sur** : `/generate-badges`
2. **Cliquez** : "Télécharger tous les badges (ZIP)"
3. **Vérifiez** : 
   - Fichier téléchargé = `Badges_X_participants.zip`
   - Contenu du ZIP = fichiers PNG uniquement

## ⚡ Résolution rapide des problèmes

| Problème | Solution rapide |
|----------|----------------|
| Vidéo noire | Vérifiez HTTPS + permissions caméra |
| Pas de vidéo du tout | Rechargez la page, vérifiez les logs |
| Date = nombre | Vérifiez les logs de conversion |
| PDF au lieu de PNG | Videz le cache navigateur |
| Caméra frontale au lieu d'arrière | Normal si pas de caméra arrière détectée |

## 📱 Checklist rapide

```
[ ] Console mobile ouverte
[ ] HTTPS activé (URL commence par https://)
[ ] Permissions caméra accordées
[ ] Vidéo s'affiche sur mobile
[ ] Dates au format DD/MM/YYYY
[ ] Téléchargement PNG fonctionne
[ ] ZIP contient des PNG
```

## 🆘 Si ça ne marche toujours pas

1. **Partagez les logs** de la console mobile
2. **Indiquez** :
   - Modèle de téléphone
   - Navigateur utilisé
   - Message d'erreur exact
3. **Consultez** `DEBUG_CAMERA_MOBILE.md` pour plus de détails

## ✅ Tout fonctionne ?

Si tous les tests passent, l'application est prête pour la production ! 🎉

**Prochaines étapes :**
1. Testez avec de vrais QR codes
2. Testez le marquage de présence
3. Testez l'export CSV
4. Formez les équipes d'accueil

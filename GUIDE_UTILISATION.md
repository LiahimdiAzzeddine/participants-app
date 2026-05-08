# 📖 Guide d'Utilisation - Application Gestion des Participants

## 🎯 Démarrage Rapide

### 1. Le serveur est déjà lancé !
L'application est accessible sur: **http://localhost:5173**

### 2. Structure de l'Application

#### 🏠 Page d'Accueil (`/`)
- **Liste des participants** : Affichage en grille avec cartes modernes
- **Barre de recherche** : Recherchez par nom ou société
- **Filtres** :
  - Par discipline (Babyfoot, Tennis, etc.)
  - Par ville (Tétouan, Tanger, etc.)
- **Statistiques** : Nombre total de participants, disciplines et villes

#### 👤 Page Détail (`/participant/:id`)
- **Badge participant** : Design professionnel avec toutes les informations
- **QR Code** : Généré automatiquement pour chaque participant
- **Boutons de téléchargement** :
  - 📥 Télécharger le QR Code (PNG)
  - 📄 Télécharger le badge participant (PDF)

## 🔄 Workflow d'Utilisation

### Scénario 1: Consulter la liste des participants
1. Ouvrez http://localhost:5173
2. Vous voyez tous les participants sous forme de cartes
3. Utilisez la recherche pour trouver un participant spécifique
4. Filtrez par discipline ou ville selon vos besoins

### Scénario 2: Voir le détail d'un participant
1. Cliquez sur une carte participant
2. Vous êtes redirigé vers `/participant/PART-XXXX`
3. Consultez toutes les informations du participant
4. Le QR Code est affiché automatiquement

### Scénario 3: Télécharger le QR Code
1. Sur la page détail d'un participant
2. Cliquez sur "📥 Télécharger le QR Code"
3. Le fichier PNG est téléchargé automatiquement
4. Nom du fichier: `QR_PART-XXXX_NomParticipant.png`

### Scénario 4: Télécharger le badge complet
1. Sur la page détail d'un participant
2. Cliquez sur "📄 Télécharger le badge participant"
3. Un PDF est généré avec le badge complet
4. Nom du fichier: `Badge_PART-XXXX_NomParticipant.pdf`

### Scénario 5: Scanner un QR Code
1. Utilisez un smartphone pour scanner le QR Code
2. Vous êtes redirigé vers l'URL: `https://monsite.com/participant/PART-XXXX`
3. La page détail du participant s'affiche

## 📊 Format des Données Excel

### Colonnes Requises
```
Discipline | Participant | Société | Email participant | Email responsable | Direction | Date compétition | Heure | Lieu | Ville
```

### Exemple de Ligne
```
Babyfoot | Chouibi Montassir | Amendis Tanger | montassir.chouibi@veolia.com | fatima.hmimid@veolia.com | DET | 14/05/2026 | 10h00 | Sonarges | Tétouan
```

## 🎨 Personnalisation

### Changer l'URL du QR Code
Éditez `src/pages/ParticipantDetail.jsx` ligne ~30:
```javascript
const qrUrl = `https://votre-domaine.com/participant/${participant.id}`;
```

### Modifier les Couleurs
Éditez les fichiers CSS dans `src/pages/`:
- `HomePage.css` : Couleurs de la page d'accueil
- `ParticipantDetail.css` : Couleurs du badge

### Couleurs Principales Actuelles
- **Primaire** : `#4CAF50` (Vert)
- **Dégradé** : `#667eea` → `#764ba2` (Violet)
- **Fond** : `#f5f5f5` (Gris clair)

## 🔧 Commandes Utiles

```bash
# Lancer le serveur de développement
npm run dev

# Arrêter le serveur
Ctrl + C dans le terminal

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview

# Linter le code
npm run lint
```

## 📱 Responsive Design

L'application est entièrement responsive:
- **Desktop** : Grille de 3-4 colonnes
- **Tablet** : Grille de 2 colonnes
- **Mobile** : Grille de 1 colonne

## 🐛 Résolution de Problèmes

### Le fichier Excel n'est pas trouvé
- Vérifiez que `Participants_QR_Complet.xlsx` est dans le dossier `public/`
- Le chemin doit être: `public/Participants_QR_Complet.xlsx`

### Les données ne s'affichent pas
- Ouvrez la console du navigateur (F12)
- Vérifiez les erreurs dans l'onglet Console
- Vérifiez que les noms de colonnes Excel correspondent exactement

### Le QR Code ne se télécharge pas
- Vérifiez que votre navigateur autorise les téléchargements
- Essayez avec un autre navigateur (Chrome, Firefox, Edge)

### Le PDF ne se génère pas
- Attendez quelques secondes après le clic
- Le badge doit être complètement chargé avant la génération

## 🎯 Prochaines Étapes

1. **Remplacer le fichier Excel** avec vos vraies données
2. **Personnaliser l'URL** du QR Code avec votre domaine
3. **Ajuster les couleurs** selon votre charte graphique
4. **Tester** tous les téléchargements
5. **Déployer** l'application en production

## 📞 Support

Pour toute question ou problème:
1. Consultez la console du navigateur (F12)
2. Vérifiez les logs du serveur Vite
3. Relisez ce guide d'utilisation

---

**Bon événement ! 🏆**

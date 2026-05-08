# Guide de Déploiement sur Vercel

## Prérequis
- Compte Vercel (gratuit sur vercel.com)
- Git installé
- Votre projet sur GitHub/GitLab/Bitbucket (ou déploiement local)

## Méthode 1 : Déploiement via GitHub (Recommandé)

### Étape 1 : Préparer le repository Git
```bash
# Initialiser git si ce n'est pas déjà fait
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - Application participants"

# Créer un repository sur GitHub et le lier
git remote add origin https://github.com/votre-username/participants-app.git
git branch -M main
git push -u origin main
```

### Étape 2 : Déployer sur Vercel
1. Allez sur https://vercel.com
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur "Add New Project"
4. Importez votre repository "participants-app"
5. Vercel détectera automatiquement Vite
6. Configuration automatique :
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
7. Cliquez sur "Deploy"

### Étape 3 : Attendre le déploiement
- Le déploiement prend 1-2 minutes
- Vous recevrez une URL comme : `https://participants-app.vercel.app`

## Méthode 2 : Déploiement via CLI Vercel

### Étape 1 : Installer Vercel CLI
```bash
npm install -g vercel
```

### Étape 2 : Se connecter
```bash
vercel login
```

### Étape 3 : Déployer
```bash
# Depuis le dossier du projet
vercel

# Pour la production
vercel --prod
```

## Configuration Importante

### vercel.json (Déjà créé)
Ce fichier est essentiel pour React Router. Il redirige toutes les routes vers index.html :
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Sans ce fichier, les URLs comme `/participant/PART-0001` ne fonctionneront pas en accès direct.

## Fichier Excel sur Vercel

### Important : Le fichier Excel doit être dans le dossier `public/`
Votre fichier `Participants_QR_Complet.xlsx` est déjà dans `public/`, donc il sera automatiquement déployé.

### Vérification après déploiement
L'URL du fichier sera : `https://votre-app.vercel.app/Participants_QR_Complet.xlsx`

## Mettre à jour l'URL des QR Codes

Après le déploiement, mettez à jour l'URL dans `src/pages/ParticipantDetail.jsx` :

```javascript
// Remplacez cette ligne (ligne ~30)
const qrUrl = `${window.location.origin}/participant/${participant.id}`;

// Par votre URL Vercel
const qrUrl = `https://votre-app.vercel.app/participant/${participant.id}`;
```

Ou gardez `window.location.origin` pour que ça fonctionne automatiquement.

## Variables d'Environnement (Optionnel)

Si vous voulez configurer l'URL de base :

### Créer `.env`
```
VITE_BASE_URL=https://votre-app.vercel.app
```

### Utiliser dans le code
```javascript
const qrUrl = `${import.meta.env.VITE_BASE_URL}/participant/${participant.id}`;
```

### Configurer sur Vercel
1. Allez dans votre projet sur Vercel
2. Settings > Environment Variables
3. Ajoutez `VITE_BASE_URL` avec votre URL

## Déploiements Automatiques

Une fois connecté à GitHub :
- Chaque `git push` sur la branche `main` déclenchera un déploiement automatique
- Les Pull Requests créent des previews automatiques
- Rollback facile depuis le dashboard Vercel

## Domaine Personnalisé (Optionnel)

### Ajouter votre propre domaine
1. Allez dans Settings > Domains
2. Ajoutez votre domaine (ex: participants.votredomaine.com)
3. Configurez les DNS selon les instructions Vercel
4. SSL automatique avec Let's Encrypt

## Vérifications Post-Déploiement

### Checklist
- [ ] Page d'accueil charge correctement
- [ ] Liste des participants s'affiche
- [ ] Recherche fonctionne
- [ ] Filtres fonctionnent
- [ ] Clic sur un participant ouvre la page détail
- [ ] QR Code s'affiche
- [ ] Téléchargement QR Code fonctionne
- [ ] Téléchargement badge PDF fonctionne
- [ ] URL directe `/participant/PART-0001` fonctionne (grâce à vercel.json)

## Problèmes Courants

### 1. Page 404 sur les routes
**Problème** : `/participant/PART-0001` retourne 404
**Solution** : Vérifiez que `vercel.json` existe et est correct

### 2. Fichier Excel non trouvé
**Problème** : Erreur de chargement du fichier
**Solution** : Vérifiez que le fichier est dans `public/` et non dans `src/`

### 3. Build échoue
**Problème** : Erreur pendant `npm run build`
**Solution** : 
```bash
# Testez localement
npm run build
npm run preview
```

### 4. QR Code pointe vers localhost
**Problème** : QR Code contient `localhost:5173`
**Solution** : Utilisez `window.location.origin` ou une variable d'environnement

## Commandes Utiles

```bash
# Build local pour tester
npm run build

# Prévisualiser le build
npm run preview

# Déployer sur Vercel
vercel --prod

# Voir les logs
vercel logs

# Lister les déploiements
vercel ls
```

## Coûts

### Plan Gratuit Vercel
- Déploiements illimités
- 100 GB de bande passante/mois
- SSL automatique
- Domaines personnalisés
- Parfait pour cette application

## Support

- Documentation Vercel : https://vercel.com/docs
- Support Vercel : https://vercel.com/support
- Community : https://github.com/vercel/vercel/discussions

---

**Prêt à déployer !** 🚀

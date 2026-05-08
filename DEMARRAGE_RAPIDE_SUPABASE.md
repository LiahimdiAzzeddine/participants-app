# 🚀 Démarrage rapide - Supabase en 10 minutes

## Option A : Sans Supabase (mode local)

**Rien à faire !** L'application fonctionne déjà avec localStorage.

```bash
npm run dev
```

## Option B : Avec Supabase (mode cloud - recommandé)

### ⏱️ 10 minutes chrono

#### 1️⃣ Créer un compte Supabase (2 min)
- Allez sur [https://supabase.com](https://supabase.com)
- Cliquez sur "Start your project"
- Créez un compte gratuit
- Créez un nouveau projet :
  - Nom : `tournoi-2026`
  - Mot de passe : (choisissez-en un fort)
  - Région : Europe West

#### 2️⃣ Créer la table (2 min)
- Dans le dashboard, allez dans **SQL Editor**
- Cliquez sur **New query**
- Ouvrez le fichier `supabase_setup.sql` de ce projet
- Copiez-collez tout le contenu
- Cliquez sur **Run**
- ✅ Vous devriez voir "Success"

#### 3️⃣ Récupérer les clés (1 min)
- Allez dans **Settings** (icône engrenage) > **API**
- Copiez ces deux valeurs :
  - **Project URL** : `https://xxxxx.supabase.co`
  - **anon public** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### 4️⃣ Configuration locale (1 min)
Créez un fichier `.env` à la racine du projet :

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Remplacez par vos vraies valeurs.

#### 5️⃣ Test local (2 min)
```bash
npm run dev
```

- Ouvrez la console du navigateur (F12)
- Connectez-vous en tant qu'équipe d'accueil
- Marquez un participant comme présent
- Vérifiez le log : `Présence sauvegardée dans Supabase: PART-XXXX`

✅ **Ça marche !**

#### 6️⃣ Déploiement Vercel (2 min)
- Allez dans votre projet Vercel
- **Settings** > **Environment Variables**
- Ajoutez :
  - `VITE_SUPABASE_URL` = votre URL
  - `VITE_SUPABASE_ANON_KEY` = votre clé
- Cliquez sur **Save**
- Redéployez : `vercel --prod`

✅ **C'est déployé !**

## ✅ Vérification

### Test de synchronisation
1. Ouvrez l'app sur votre téléphone
2. Marquez un participant comme présent
3. Ouvrez l'app sur votre ordinateur
4. Rechargez la page
5. ✅ Le participant doit apparaître comme présent

### Vérifier dans Supabase
1. Allez dans **Table Editor**
2. Sélectionnez la table `presences`
3. ✅ Vous devriez voir les participants marqués présents

## 🎯 Résultat

### Avant
```
📱 Téléphone 1 : Marque PART-0001 présent
💻 Ordinateur  : Ne voit pas PART-0001 ❌
```

### Après
```
📱 Téléphone 1 : Marque PART-0001 présent
💻 Ordinateur  : Voit PART-0001 présent ✅
📱 Téléphone 2 : Voit PART-0001 présent ✅
```

## 🆘 Problème ?

### "Supabase non configuré, utilisation de localStorage"
→ Les variables d'environnement ne sont pas configurées
→ Vérifiez le fichier `.env`

### "Invalid API key"
→ Vous avez copié la mauvaise clé
→ Utilisez la clé **anon public**, pas **service_role**

### Les données ne se synchronisent pas
→ Vérifiez que Supabase est configuré sur tous les appareils
→ Regardez les logs dans la console

### Autre problème
→ Consultez `MIGRATION_SUPABASE.md` (section dépannage)

## 📚 Documentation complète

- `CONFIGURATION_SUPABASE.md` - Guide détaillé
- `MIGRATION_SUPABASE.md` - Migration et dépannage
- `RESUME_INTEGRATION_SUPABASE.md` - Vue d'ensemble technique
- `supabase_setup.sql` - Script SQL prêt à l'emploi

## 💡 Conseil

**Testez d'abord en local** avant de déployer sur Vercel !

## 🎉 C'est tout !

Votre application synchronise maintenant les présences entre tous les appareils.

**Temps total : 10 minutes** ⏱️

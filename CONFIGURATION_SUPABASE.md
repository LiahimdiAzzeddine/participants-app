# Configuration Supabase pour les présences

## 📋 Étape 1 : Créer un compte Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Créez un compte (gratuit)
4. Créez un nouveau projet :
   - Nom du projet : `tournoi-participants`
   - Mot de passe de la base de données : (choisissez un mot de passe fort)
   - Région : Choisissez la plus proche (ex: Europe West)

## 📋 Étape 2 : Créer la table `presences`

1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Cliquez sur **New query**
3. Copiez-collez ce SQL :

```sql
-- Créer la table presences
CREATE TABLE presences (
  id BIGSERIAL PRIMARY KEY,
  participant_id TEXT UNIQUE NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  time TEXT NOT NULL,
  date TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer un index sur participant_id pour des recherches rapides
CREATE INDEX idx_presences_participant_id ON presences(participant_id);

-- Activer Row Level Security (RLS)
ALTER TABLE presences ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre la lecture à tous
CREATE POLICY "Permettre lecture à tous"
  ON presences
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Créer une politique pour permettre l'insertion à tous
CREATE POLICY "Permettre insertion à tous"
  ON presences
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Créer une politique pour permettre la mise à jour à tous
CREATE POLICY "Permettre mise à jour à tous"
  ON presences
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Créer une politique pour permettre la suppression à tous
CREATE POLICY "Permettre suppression à tous"
  ON presences
  FOR DELETE
  TO anon, authenticated
  USING (true);
```

4. Cliquez sur **Run** pour exécuter le SQL

## 📋 Étape 3 : Récupérer les clés API

1. Dans le dashboard Supabase, allez dans **Settings** (icône engrenage)
2. Cliquez sur **API**
3. Copiez ces deux valeurs :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (longue clé commençant par `eyJ...`)

## 📋 Étape 4 : Configurer les variables d'environnement

### En développement local

1. Créez un fichier `.env` à la racine du projet :

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. Remplacez les valeurs par vos vraies clés Supabase

### Sur Vercel

1. Allez dans votre projet Vercel
2. Cliquez sur **Settings** > **Environment Variables**
3. Ajoutez ces deux variables :
   - `VITE_SUPABASE_URL` = votre Project URL
   - `VITE_SUPABASE_ANON_KEY` = votre anon key
4. Cliquez sur **Save**
5. Redéployez votre application

## 📋 Étape 5 : Tester

1. Démarrez l'application : `npm run dev`
2. Connectez-vous en tant qu'équipe d'accueil
3. Marquez un participant comme présent
4. Vérifiez dans Supabase :
   - Allez dans **Table Editor**
   - Sélectionnez la table `presences`
   - Vous devriez voir l'entrée du participant

## ✅ Vérification

Ouvrez la console du navigateur, vous devriez voir :
```
Présences chargées depuis Supabase: X
Présence sauvegardée dans Supabase: PART-XXXX
```

Si vous voyez :
```
Supabase non configuré, utilisation de localStorage
```
Cela signifie que les variables d'environnement ne sont pas configurées.

## 🔄 Fonctionnement hybride

L'application fonctionne en mode **hybride** :

- ✅ **Si Supabase est configuré** : Utilise Supabase (synchronisation entre appareils)
- ✅ **Si Supabase n'est pas configuré** : Utilise localStorage (mode local)
- ✅ **Si Supabase échoue** : Fallback automatique sur localStorage

Cela signifie que l'application fonctionne toujours, même sans Supabase !

## 📊 Structure de la table

| Colonne | Type | Description |
|---------|------|-------------|
| id | BIGSERIAL | ID auto-incrémenté |
| participant_id | TEXT | ID du participant (PART-XXXX) |
| timestamp | TIMESTAMPTZ | Horodatage ISO |
| time | TEXT | Heure formatée (HH:MM:SS) |
| date | TEXT | Date formatée (DD/MM/YYYY) |
| updated_at | TIMESTAMPTZ | Dernière mise à jour |
| created_at | TIMESTAMPTZ | Date de création |

## 🔒 Sécurité

Les politiques RLS (Row Level Security) sont configurées pour :
- Permettre la lecture à tous (anon et authenticated)
- Permettre l'insertion, mise à jour et suppression à tous

**Note** : Pour un environnement de production, vous pourriez vouloir restreindre ces permissions.

## 🆘 Dépannage

### Erreur : "relation presences does not exist"
→ La table n'a pas été créée. Retournez à l'étape 2.

### Erreur : "Invalid API key"
→ Vérifiez que vous avez copié la bonne clé (anon public, pas service_role).

### Les données ne se synchronisent pas
→ Vérifiez les variables d'environnement dans Vercel.

### Erreur CORS
→ Supabase autorise tous les domaines par défaut. Si problème, vérifiez dans Settings > API > CORS.

## 💰 Limites gratuites Supabase

- ✅ 500 MB de base de données
- ✅ 1 GB de bande passante
- ✅ 50 000 utilisateurs actifs mensuels
- ✅ 2 GB de stockage fichiers

Largement suffisant pour un tournoi !

## 📞 Support

Si vous avez des questions :
- Documentation Supabase : [https://supabase.com/docs](https://supabase.com/docs)
- Discord Supabase : [https://discord.supabase.com](https://discord.supabase.com)

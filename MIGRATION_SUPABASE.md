# Migration vers Supabase - Guide rapide

## 🎯 Ce qui a changé

### Avant (localStorage uniquement)
- ❌ Données locales à chaque appareil
- ❌ Pas de synchronisation
- ❌ Perte de données si cache vidé

### Après (Supabase + localStorage)
- ✅ Synchronisation entre tous les appareils
- ✅ Données persistantes dans le cloud
- ✅ Fallback automatique sur localStorage si Supabase indisponible
- ✅ L'application fonctionne même sans Supabase configuré

## 🚀 Déploiement rapide

### Option 1 : Sans Supabase (comme avant)
1. Ne configurez rien
2. L'application utilisera localStorage automatiquement
3. Fonctionne exactement comme avant

### Option 2 : Avec Supabase (recommandé)
1. Suivez `CONFIGURATION_SUPABASE.md`
2. Configurez les variables d'environnement
3. Redéployez sur Vercel

## 📦 Fichiers modifiés

- ✅ `src/context/PresenceContext.jsx` - Logique hybride Supabase/localStorage
- ✅ `src/lib/supabase.js` - Client Supabase
- ✅ `.env.example` - Template des variables d'environnement
- ✅ `.gitignore` - Ajout de `.env` pour sécurité
- ✅ `package.json` - Ajout de `@supabase/supabase-js`

## 🔄 Migration des données existantes

Si vous avez déjà des présences dans localStorage et voulez les migrer vers Supabase :

### Script de migration (à exécuter dans la console du navigateur)

```javascript
// 1. Récupérer les données localStorage
const localData = JSON.parse(localStorage.getItem('presences') || '{}');

// 2. Convertir en format Supabase
const supabaseData = Object.entries(localData).map(([participantId, info]) => ({
  participant_id: participantId,
  timestamp: info.timestamp,
  time: info.time,
  date: info.date
}));

// 3. Insérer dans Supabase
const { data, error } = await supabase
  .from('presences')
  .insert(supabaseData);

if (error) {
  console.error('Erreur migration:', error);
} else {
  console.log('Migration réussie:', data);
}
```

## ✅ Vérification du mode actif

Ouvrez la console du navigateur et regardez les logs :

### Mode Supabase actif
```
Présences chargées depuis Supabase: 5
Présence sauvegardée dans Supabase: PART-0001
```

### Mode localStorage (fallback)
```
Supabase non configuré, utilisation de localStorage
```

## 🧪 Test de synchronisation

1. **Appareil 1** : Marquez un participant comme présent
2. **Appareil 2** : Rechargez la page
3. **Résultat** : Le participant doit apparaître comme présent sur l'appareil 2

Si ce n'est pas le cas :
- Vérifiez que Supabase est configuré sur les deux appareils
- Vérifiez les logs dans la console
- Vérifiez que les données sont dans Supabase (Table Editor)

## 🔧 Commandes utiles

### Installer les dépendances
```bash
npm install
```

### Démarrer en développement
```bash
npm run dev
```

### Build pour production
```bash
npm run build
```

### Déployer sur Vercel
```bash
vercel --prod
```

## 📊 Monitoring

### Vérifier les données dans Supabase
1. Allez sur [https://supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Table Editor**
4. Sélectionnez la table `presences`
5. Vous verrez toutes les présences enregistrées

### Statistiques
Dans le dashboard Supabase :
- **Database** > **Usage** : Voir l'utilisation de la base
- **API** > **Logs** : Voir les requêtes API

## ⚠️ Points d'attention

### Variables d'environnement Vercel
- Les variables doivent commencer par `VITE_` pour être accessibles côté client
- Après modification, redéployez l'application
- Les variables ne sont pas accessibles en mode preview, seulement en production

### Sécurité
- Ne commitez JAMAIS le fichier `.env` dans Git
- Utilisez `.env.example` comme template
- Les clés Supabase `anon` sont publiques (c'est normal)
- La sécurité est gérée par les politiques RLS

### Performance
- Supabase ajoute ~100-200ms de latence par rapport à localStorage
- C'est négligeable pour l'expérience utilisateur
- Le fallback localStorage garantit que l'app reste rapide même si Supabase est lent

## 🆘 Problèmes courants

### "Failed to fetch" dans la console
→ Vérifiez votre connexion internet ou les variables d'environnement

### Les données ne se synchronisent pas
→ Vérifiez que les deux appareils utilisent bien Supabase (logs dans console)

### "Invalid API key"
→ Vérifiez que vous avez copié la clé `anon public` et non `service_role`

### Données dupliquées
→ La contrainte `UNIQUE` sur `participant_id` empêche les doublons

## 💡 Conseils

1. **Testez d'abord en local** avec `.env` avant de déployer
2. **Gardez localStorage comme backup** (c'est déjà fait automatiquement)
3. **Exportez régulièrement** les données depuis Supabase (CSV)
4. **Surveillez les limites** du plan gratuit (largement suffisant)

## 📞 Besoin d'aide ?

Consultez :
- `CONFIGURATION_SUPABASE.md` - Configuration détaillée
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vercel](https://vercel.com/docs)

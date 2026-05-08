# Guide Complet - Tournoi Inter-filiales 2026

## Vue d'Ensemble

Cette application web a été développée spécifiquement pour le **Tournoi Inter-filiales 2026** afin de gérer efficacement :
- Les badges participants avec QR Code
- Le pointage des présences
- La distribution des goodies

## Fonctionnalités Principales

### 1. Page d'Accueil - Gestion des Participants
**Accès** : http://votre-domaine.com/

**Utilisation** :
- Consultez la liste complète des participants inscrits
- Recherchez un participant par nom ou société
- Filtrez par discipline (Babyfoot, Tennis, etc.)
- Filtrez par ville
- Cliquez sur un participant pour voir son badge
- Accédez au système de pointage via le bouton vert

### 2. Badge Participant avec QR Code
**Accès** : http://votre-domaine.com/participant/PART-XXXX

**Contenu du badge** :
- En-tête : "Compétition Veolia - Mai 2026"
- Nom du participant
- Discipline
- Société et Direction
- Emails (participant et responsable)
- Date, heure et lieu de la compétition
- QR Code unique

**Actions disponibles** :
- Télécharger le QR Code (PNG) - pour impression séparée
- Télécharger le badge complet (PDF) - pour impression

**Utilisation du QR Code** :
- Chaque participant reçoit un QR Code unique
- Scanner le QR Code redirige vers la page du participant
- Permet une vérification rapide de l'identité
- Facilite l'accès aux informations pendant l'événement

### 3. Pointage des Présences
**Accès** : http://votre-domaine.com/checkin

**Interface** :
- Statistiques en temps réel : Présents / Absents / Total
- Barre de recherche pour trouver rapidement un participant
- Liste de tous les participants avec leur statut
- Bouton "Pointer" pour enregistrer une présence
- Bouton "Annuler" pour corriger une erreur
- Bouton "Voir badge" pour accéder aux informations complètes

**Fonctionnalités** :
- Pointage en un clic
- Enregistrement automatique de l'heure de pointage
- Sauvegarde locale (pas besoin de connexion internet)
- Export CSV pour reporting
- Recherche instantanée

## Workflow Recommandé

### Phase 1 : Préparation (1-2 semaines avant)

#### Étape 1 : Vérification des données
1. Ouvrez le fichier Excel `Participants_QR_Complet.xlsx`
2. Vérifiez que toutes les colonnes sont remplies :
   - Disciplines
   - Participant
   - Société
   - Email participant
   - Email responsable
   - Direction
   - Date compétition
   - Heure
   - Lieu
   - Ville
3. Corrigez les erreurs éventuelles
4. Remplacez le fichier dans `public/Participants_QR_Complet.xlsx`

#### Étape 2 : Impression des badges
1. Accédez à la page d'accueil
2. Pour chaque participant (ou en masse) :
   - Cliquez sur la carte du participant
   - Cliquez sur "Télécharger le badge"
   - Imprimez le PDF sur du papier badge (format recommandé : A6 ou badge 10x15cm)
3. Plastifiez les badges si possible
4. Préparez des cordons/lanyards

#### Étape 3 : Test du système
1. Testez le pointage avec quelques participants fictifs
2. Vérifiez que les QR Codes fonctionnent
3. Testez l'export CSV
4. Formez l'équipe d'accueil

### Phase 2 : Le Jour J

#### Poste d'Accueil - Configuration
1. **Matériel nécessaire** :
   - Ordinateur portable ou tablette
   - Connexion internet (optionnelle, l'app fonctionne hors ligne)
   - Badges pré-imprimés
   - Scanner QR Code (optionnel, smartphone suffit)

2. **Ouverture de l'application** :
   - Ouvrez http://votre-domaine.com/checkin
   - Vérifiez que tous les participants sont listés
   - Gardez l'onglet ouvert toute la journée

#### Accueil des Participants

**Scénario 1 : Participant attendu**
1. Le participant arrive à l'accueil
2. Recherchez son nom dans la barre de recherche
3. Cliquez sur "Pointer"
4. L'heure de pointage s'affiche automatiquement
5. Remettez-lui son badge pré-imprimé
6. Expliquez-lui comment scanner son QR Code si besoin

**Scénario 2 : Participant non trouvé**
1. Vérifiez l'orthographe du nom
2. Recherchez par société
3. Si vraiment absent de la liste, notez-le pour ajout ultérieur

**Scénario 3 : Erreur de pointage**
1. Cliquez sur "Annuler" à côté du participant
2. Le pointage est supprimé
3. Vous pouvez pointer à nouveau si nécessaire

#### Distribution des Goodies
1. Consultez la liste des participants pointés (fond vert)
2. Distribuez les goodies uniquement aux participants présents
3. Cochez mentalement ou sur une liste papier de secours

#### Suivi en Temps Réel
- Les statistiques en haut de page se mettent à jour automatiquement
- Vous voyez en temps réel : Présents / Absents / Total
- Partagez ces chiffres avec l'organisation si besoin

### Phase 3 : Pendant l'Événement

#### Pour les Participants
- Ils peuvent scanner leur QR Code à tout moment
- Ils accèdent à leurs informations : horaire, lieu, discipline
- Ils peuvent partager leur page avec d'autres

#### Pour l'Organisation
- Consultez les présences par discipline
- Vérifiez qui est arrivé pour chaque compétition
- Utilisez la recherche pour trouver rapidement quelqu'un

### Phase 4 : Après l'Événement

#### Export des Données
1. Sur la page `/checkin`
2. Cliquez sur "Exporter les présences (CSV)"
3. Le fichier téléchargé contient :
   - ID du participant
   - Nom
   - Société
   - Discipline
   - Statut (Présent/Absent)
   - Heure de pointage

#### Analyse
Utilisez le fichier CSV pour :
- Calculer le taux de présence global
- Analyser par discipline
- Analyser par société
- Identifier les horaires de pointe
- Préparer le reporting

#### Archivage
- Conservez le fichier CSV
- Sauvegardez les données du localStorage si besoin
- Prenez des captures d'écran des statistiques

## Conseils et Bonnes Pratiques

### Pour l'Accueil
✅ **À FAIRE** :
- Arriver 30 minutes avant pour préparer
- Tester le système avant l'ouverture
- Avoir une liste papier de secours
- Former plusieurs personnes au système
- Garder l'ordinateur branché

❌ **À ÉVITER** :
- Fermer l'onglet du navigateur (perte des données)
- Pointer plusieurs fois la même personne
- Oublier de remettre le badge

### Pour les Badges
✅ **Recommandations** :
- Imprimer sur papier épais (200-300g)
- Plastifier pour la durabilité
- Utiliser des cordons de couleur par discipline
- Prévoir 10% de badges en plus (pertes, erreurs)

### Pour le Pointage
✅ **Astuces** :
- Utilisez la recherche plutôt que de scroller
- Pointez au fur et à mesure, pas en batch
- Vérifiez l'identité avant de pointer
- Exportez régulièrement (toutes les heures)

## Dépannage

### Problème : Les données ne s'affichent pas
**Solution** :
- Vérifiez que le fichier Excel est dans `public/`
- Rafraîchissez la page (F5)
- Vérifiez la console du navigateur (F12)

### Problème : Le pointage ne se sauvegarde pas
**Solution** :
- Vérifiez que le localStorage est activé
- Ne pas utiliser le mode navigation privée
- Vérifiez qu'il y a de l'espace disque

### Problème : Le QR Code ne fonctionne pas
**Solution** :
- Vérifiez que l'URL est correcte
- Testez avec plusieurs applications de scan
- Vérifiez la qualité d'impression

### Problème : L'export CSV ne fonctionne pas
**Solution** :
- Vérifiez que les téléchargements sont autorisés
- Essayez avec un autre navigateur
- Vérifiez l'espace disque disponible

## Support Technique

### Pendant l'Événement
- Personne de contact : [À définir]
- Téléphone : [À définir]
- Email : [À définir]

### Documentation
- Guide utilisateur : Ce document
- Documentation technique : README.md
- Contexte projet : CONTEXTE_PROJET.md
- Guide déploiement : DEPLOIEMENT_VERCEL.md

## Checklist Finale

### 1 Semaine Avant
- [ ] Données Excel vérifiées et à jour
- [ ] Application déployée sur Vercel
- [ ] Badges imprimés pour tous les participants
- [ ] Badges plastifiés
- [ ] Cordons/lanyards préparés
- [ ] Équipe d'accueil formée
- [ ] Matériel informatique testé

### La Veille
- [ ] Test complet du système
- [ ] Vérification des badges
- [ ] Préparation du poste d'accueil
- [ ] Briefing de l'équipe

### Le Jour J - Matin
- [ ] Installation du poste d'accueil
- [ ] Test de connexion internet
- [ ] Ouverture de l'application
- [ ] Vérification de la liste des participants
- [ ] Disposition des badges par ordre alphabétique

### Le Jour J - Soir
- [ ] Export des présences
- [ ] Sauvegarde des données
- [ ] Comptage des badges restants
- [ ] Débriefing de l'équipe

### Après l'Événement
- [ ] Analyse des données
- [ ] Reporting
- [ ] Retour d'expérience
- [ ] Archivage

---

**Bon Tournoi Inter-filiales 2026 !** 🏆

Pour toute question, consultez les autres documents de la documentation.

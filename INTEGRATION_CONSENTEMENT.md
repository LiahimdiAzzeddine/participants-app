# Intégration du Formulaire de Consentement

## Vue d'ensemble
Le formulaire de consentement a été intégré dans le portail participant. Lorsqu'un participant scanne son QR code, le système vérifie s'il a déjà validé le consentement. Si non, le formulaire s'affiche automatiquement.

## Fonctionnement

### 1. Flux utilisateur
1. Le participant scanne son QR code
2. Le système vérifie le statut du consentement
3. **Si non validé** : Le formulaire de consentement s'affiche en modal
4. **Si déjà validé** : La fiche participant s'affiche directement

### 2. Formulaire de consentement
Le formulaire contient :
- **Nom pré-rempli** : Récupéré automatiquement après le scan
- **Texte d'autorisation** : Autorisation d'utilisation d'image Veolia Maroc
- **Champ lieu** : Le participant doit saisir la ville
- **Date automatique** : Affichée au format français
- **Checkbox** : Pour confirmer "Lu et approuvé"
- **Boutons** : Valider ou Annuler

### 3. Stockage des données
- **Avec Supabase** : Les consentements sont sauvegardés dans la table `consents`
- **Sans Supabase** : Utilise localStorage comme fallback
- **Données enregistrées** :
  - `participant_id` : ID du participant
  - `validated` : true
  - `timestamp` : Date/heure ISO
  - `date` : Date au format français
  - `lieu` : Ville saisie par le participant

## Fichiers modifiés

### src/App.jsx
- Ajout de `ConsentProvider` pour envelopper l'application
- Import de `ConsentContext`

### src/pages/ParticipantPortal.jsx
- Import de `useConsent` et `ConsentForm`
- Ajout de l'état `showConsentForm`
- Vérification du consentement dans `handleScanResult`
- Ajout des handlers `handleConsentValidate` et `handleConsentCancel`
- Affichage conditionnel du formulaire en modal

### Fichiers existants (déjà créés)
- `src/context/ConsentContext.jsx` : Gestion des consentements
- `src/components/ConsentForm.jsx` : Composant du formulaire
- `src/components/ConsentForm.css` : Styles du formulaire
- `supabase_consents_setup.sql` : Script SQL pour Supabase

## Configuration Supabase

Pour activer la sauvegarde dans Supabase, exécutez le script SQL :

```sql
-- Voir le fichier supabase_consents_setup.sql
```

## Test de la fonctionnalité

1. Connectez-vous en tant que participant (sans mot de passe)
2. Scannez un QR code d'un participant qui n'a pas encore validé
3. Le formulaire de consentement devrait s'afficher
4. Remplissez le lieu et cochez la case
5. Cliquez sur "Valider"
6. La fiche participant s'affiche
7. Si vous scannez à nouveau le même QR code, le formulaire ne s'affiche plus

## Notes importantes

- Le consentement est lié à l'ID du participant
- Une fois validé, le participant ne verra plus le formulaire
- Le texte du formulaire est conforme aux exigences RGPD
- L'email de révocation est : dpo.maroc@veolia.com
- Durée d'autorisation : 5 ans

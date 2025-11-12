# Sauvegarde Finale du Personnage

## Contexte

L'écran de résumé propose sauvegarde du personnage créé. Cette sauvegarde est distincte de la validation finale et permet conservation en base de données pour utilisation ultérieure.

## Mécanisme de sauvegarde

### Bouton "Sauvegarder" (otherAction)

Comportement conditionnel :
- Si saveName existe (déjà sauvegardé) : Bouton caché (visibility: hidden)
- Sinon : Bouton affiché label "Sauvegarder"

### Processus

Clic "Sauvegarder" déclenche :
1. Appel saveDatabaseCharacter(callback)
2. Sauvegarde personnage en base
3. Callback reçoit code sauvegarde (data) ou null si échec
4. Si succès et nouveau code (data !== saveName) :
   - Stocke code dans saveName
   - Affiche dialogue confirmation avec code
   - Masque bouton (visibility: hidden)
5. Si succès et code existant : Alert "Personnage sauvegardé" (mise à jour)
6. Si échec : Alert "Echec de la sauvegarde."

### Code de sauvegarde

Code retourné = identifiant unique (chaîne alphanumérique ou GUID).

**Dialogue confirmation :** jQuery UI dialog affiche code dans zone `.codesave`, pas de boutons, fermeture par croix, permet copie manuelle.

## Distinction validation/sauvegarde

### Validation (Bouton "Valider")

- Objectif : Terminer wizard création
- Action : stepIndex → -1, retour menu
- Effet : Personnage créé mais pas nécessairement sauvegardé
- Irréversible : Impossible modifier via wizard après

### Sauvegarde (Bouton "Sauvegarder")

- Objectif : Persister personnage en base
- Action : Appel saveDatabaseCharacter(), génère code
- Effet : Personnage récupérable via code
- Timing : Avant OU après validation (indépendant)

### Scénarios

**Sauvegarder puis Valider (recommandé) :**
Clic "Sauvegarder" → Code généré → Clic "Valider" → Wizard terminé → Personnage sauvegardé et création terminée.

**Valider sans sauvegarder (risqué) :**
Clic "Valider" → Wizard terminé → Personnage en mémoire NON sauvegardé → Fermeture perd personnage.

**Sauvegarder sans valider (brouillon) :**
Clic "Sauvegarder" → Code généré → Retour étapes précédentes → Modifications possibles → Personnage sauvegardé = version antérieure.

**Mise à jour impossible :**
Personnage sauvegardé (saveName existe) → Bouton caché → Modifications via feuille personnage uniquement.

## Persistance et récupération

### Sauvegarde en base

saveDatabaseCharacter() effectue :
- Sérialisation character (JSON probable)
- Envoi backend ou LocalStorage/IndexedDB
- Génération code unique
- Retour code callback

### Récupération

Code permet :
- Chargement via loadDatabaseCharacter(code)
- Restauration état complet (caractéristiques, compétences, talents, trappings, etc.)
- Modification via feuille personnage (pas wizard)
- Export/partage via code

### Gestion codes

Stockage :
- Serveur : Base données mapping code → JSON
- Client : LocalStorage clé code, valeur personnage sérialisé

Sécurité : Codes uniques évitent collisions.

## Actions post-sauvegarde

### Bouton "Retour"

Après sauvegarde, "Retour" permet :
- Label "Retour" (vs "Annuler")
- Retour menu principal (showMenu())
- Restaure classes CSS panels

### Réutilisation

Personnage sauvegardé accessible via :
- Menu principal "Charger personnage"
- Saisie code sauvegarde
- Chargement feuille personnage
- Édition, progression XP, gestion équipement

## Relations

### Dépendances

- [resume-validation.md](./resume-validation.md) : Validation AVANT sauvegarde recommandée
- [resume-display.md](./resume-display.md) : Données sauvegardées
- [resume-export.md](./resume-export.md) : Export vs sauvegarde

### Fichiers impliqués

saveDatabaseCharacter() et loadDatabaseCharacter() gèrent persistance (fichier central CharGen ou Helper).

## Règles métier

### Sauvegarde optionnelle

Utilisateur peut :
- Valider sans sauvegarder (temporaire)
- Sauvegarder sans valider (brouillon)
- Sauvegarder puis valider (recommandé)

### Unicité code

Chaque sauvegarde génère code unique. Même personnage sauvegardé plusieurs fois = codes différents (versions multiples).

### Immuabilité post-validation

Une fois stepIndex = -1, impossible modifier via wizard. Modifications futures via feuille personnage.

### Expiration codes (potentielle)

Codes peuvent avoir durée de vie limitée (ex: 30 jours inactivité). Recommandation : Export JSON local backup permanent.

## Exemples Warhammer

Voir [exemples-personnages-types.md](../exemples-personnages-types.md) pour archétypes complets.

**Focus mécanisme sauvegarde :**

**Sauvegarde réussie (Agitateur Humain) :** Clic "Sauvegarder" → Dialogue affiche code unique "A7F3-K9L2-M4X8" → Copie code → Bouton masqué → Clic "Valider" finalise → Personnage récupérable via code.

**Échec sauvegarde (Répurgateur Nain) :** Clic "Sauvegarder" → Alert "Echec de la sauvegarde." (serveur/LocalStorage plein) → Bouton reste visible pour réessayer → Alternative : valider sans sauvegarder ou export JSON manuel.

**Brouillon incomplet (Sorcier Elfe) :** Talents incomplets → Sauvegarde génère code → Retour Talents pour compléter → Bouton caché (saveName existe) → Sauvegarde conserve version incomplète → Validation ultérieure termine mais version complète non sauvegardée.

**Risque perte données :** Validation sans sauvegarde → Personnage en mémoire uniquement → Fermeture navigateur = perte totale → Recommandation UI : avertissement avant validation si pas sauvegardé.

**Versions multiples (Nain) :** Sauvegarde niveau 1 → Code 1 généré → Progression niveau 2 → Nouvelle sauvegarde → Code 2 généré → Deux versions distinctes conservées.

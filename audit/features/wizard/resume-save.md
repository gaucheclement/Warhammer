# Sauvegarde Finale du Personnage

## Contexte

L'écran de résumé propose sauvegarde du personnage créé. Cette sauvegarde est distincte de la validation finale et permet conservation en base de données pour utilisation ultérieure.

## Mécanisme de sauvegarde

### Bouton "Sauvegarder" (otherAction)

Comportement conditionnel :
- Si CharGen.saveName existe (déjà sauvegardé) : Bouton caché (visibility: hidden)
- Sinon : Bouton affiché label "Sauvegarder"

### Processus

Clic "Sauvegarder" déclenche :
1. Appel CharGen.saveDatabaseCharacter(callback)
2. Sauvegarde personnage en base
3. Callback reçoit code sauvegarde (data) ou null si échec
4. Si succès et nouveau code (data !== CharGen.saveName) :
   - Stocke code dans CharGen.saveName
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

**Mise à jour impossible (V1) :**
Personnage sauvegardé (saveName existe) → Bouton caché → Modifications via feuille personnage uniquement.

## Persistance et récupération

### Sauvegarde en base

CharGen.saveDatabaseCharacter() effectue :
- Sérialisation character (JSON probable)
- Envoi backend ou LocalStorage/IndexedDB
- Génération code unique
- Retour code callback

### Récupération

Code permet :
- Chargement via CharGen.loadDatabaseCharacter(code)
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
- Retour menu principal (CharGen.showMenu())
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

CharGen.saveDatabaseCharacter() et CharGen.loadDatabaseCharacter() gèrent persistance (fichier central CharGen ou Helper).

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

**Agitateur Humain sauvegarde réussie :**
- Clic "Sauvegarder" → Dialogue "Code : A7F3-K9L2-M4X8"
- Copie code → Bouton masqué → Clic "Valider"
- Personnage récupérable via A7F3-K9L2-M4X8

**Répurgateur Nain échec sauvegarde :**
- Clic "Sauvegarder" → Alert "Echec de la sauvegarde." (serveur ou LocalStorage plein)
- Bouton reste visible → Réessayer ou valider sans sauvegarder
- Recommandation : Export JSON manuel backup

**Sorcier Elfe brouillon :**
- Talents incomplets → Clic "Sauvegarder" → Code B3G7-H1J5-N9P2
- Retour Talents → Ajout talents → Retour résumé
- Bouton caché (saveName existe) → Sauvegarde = version incomplète
- Clic "Valider" termine (version complète non sauvegardée)

**Halfling mise à jour :**
- Déjà sauvegardé (saveName "C5E8-F2G6-H4J9") → Bouton caché
- stepIndex -1 → Modifier impossible wizard
- Mise à jour : Charger feuille personnage → Modifier → Sauvegarder
- Nouveau code ou écrase ancien selon implémentation

**Prêtre perte données :**
- Oubli sauvegarde → Clic "Valider" direct
- Wizard terminé, personnage mémoire → Fermeture navigateur
- PERTE TOTALE (pas récupération)
- Recommandation UI : Avertissement si validation sans sauvegarde

**Guerrier Nain double sécurité :**
- Clic "Sauvegarder" → Code D6F9-G3H7-J2K5 copié fichier texte
- Export JSON (si disponible) → Backup local
- Double sécurité : Code + fichier JSON
- Récupération même si serveur perd données

**Halfling partage personnage :**
- Sauvegarde → Code E8F1-G4H7-J3K6
- Partage code avec ami → Ami charge via code
- Clone personnage dans son compte
- Chacun modifie version indépendamment

**Nain versions multiples :**
- Sauvegarde niveau 1 → Code F2G5-H8J1-K4L7
- Progression niveau 2, sauvegarde → Code M3N6-P9Q2-R5S8
- Deux codes = deux versions personnage
- Permet tester builds différents ou rollback

# Sauvegarde Finale du Personnage

## Contexte

Écran résumé propose sauvegarde personnage créé. Sauvegarde distincte de validation finale. Permet conservation base données pour utilisation ultérieure.

## Mécanisme de sauvegarde

### Bouton "Sauvegarder"

**Comportement conditionnel** : Si personnage déjà sauvegardé (code sauvegarde existe), bouton masqué. Si personnage jamais sauvegardé, bouton affiché avec label "Sauvegarder".

### Processus sauvegarde

**Déclenchement** : Clic bouton "Sauvegarder" déclenche opération sauvegarde.

**Étapes** :
1. Déclenchement sauvegarde personnage base données
2. Système génère code sauvegarde unique
3. Réception résultat : code sauvegarde si succès, indication échec sinon
4. Si succès avec nouveau code jamais obtenu avant :
   - Enregistrement code sauvegarde
   - Affichage dialogue confirmation contenant code
   - Masquage bouton "Sauvegarder"
5. Si succès avec code existant (mise à jour sauvegarde existante) : Message "Personnage sauvegardé"
6. Si échec sauvegarde : Message "Echec de la sauvegarde"

### Code de sauvegarde

**Format** : Identifiant unique alphanumérique (exemple : "A7F3-K9L2-M4X8") ou identifiant système.

**Affichage confirmation** : Dialogue modal affiche code sauvegarde. Aucun bouton action (fermeture uniquement). Utilisateur peut copier code manuellement pour conservation.

## Distinction validation/sauvegarde

### Validation (Bouton "Valider")

**Objectif** : Terminer wizard création personnage.

**Action** : Marquer wizard comme terminé, retour menu principal.

**Effet** : Personnage créé et finalisé mais pas nécessairement persisté base données.

**Irréversibilité** : Une fois validation effectuée, impossible modifier personnage via wizard. Modifications futures uniquement via feuille personnage.

### Sauvegarde (Bouton "Sauvegarder")

**Objectif** : Persister personnage dans base données de manière permanente.

**Action** : Déclencher sauvegarde, génération code unique.

**Effet** : Personnage récupérable ultérieurement via code sauvegarde.

**Timing** : Sauvegarde peut être effectuée avant OU après validation (opérations indépendantes).

### Scénarios usage

**Scénario recommandé - Sauvegarder puis Valider** :
Clic "Sauvegarder" → Code unique généré et affiché → Clic "Valider" → Wizard terminé → Résultat : Personnage sauvegardé en base ET création terminée.

**Scénario risqué - Valider sans sauvegarder** :
Clic "Valider" uniquement → Wizard terminé → Personnage existe en mémoire uniquement, NON persisté base → Fermeture navigateur ou session perdue = perte totale personnage.

**Scénario brouillon - Sauvegarder sans valider** :
Clic "Sauvegarder" → Code généré → Retour étapes précédentes wizard possible → Modifications ultérieures autorisées → Remarque : Sauvegarde conserve version état moment clic, pas modifications postérieures.

**Scénario mise à jour impossible** :
Personnage déjà sauvegardé (code existe) → Bouton "Sauvegarder" masqué automatiquement → Modifications futures personnage uniquement via feuille personnage (pas re-sauvegarde wizard).

## Persistance et récupération

### Sauvegarde base données

**Opération sauvegarde** : Personnage complet sérialisé (transformation structure données vers format persistable). Envoi données vers système stockage. Génération code unique identification. Retour code sauvegarde si succès.

**Voir aussi** : [../../patterns/pattern-google-sheets-storage.md](../../patterns/pattern-google-sheets-storage.md) pour détails infrastructure stockage.

### Récupération personnage

**Chargement via code** : Code sauvegarde permet chargement personnage complet depuis base données. Restauration intégrale état personnage : Caractéristiques toutes valeurs, Compétences toutes avances, Talents tous rangs, Équipement toutes quantités, Détails personnels, Budget XP complet.

**Modification post-chargement** : Personnage chargé modifiable via feuille personnage (pas via wizard). Permet progression aventures (gain XP, dépenses XP, acquisition équipement).

**Partage code** : Code sauvegarde partageable entre utilisateurs. Permet duplication personnages, partage templates, archétypes communauté.

### Gestion codes sauvegarde

**Stockage serveur** : Base données conserve association code unique vers données personnage complètes. Chaque code référence un personnage sauvegardé unique.

**Unicité codes** : Chaque sauvegarde génère code unique différent. Évite collisions, permet multiples sauvegardes même personnage (versions différentes).

## Actions post-sauvegarde

### Bouton "Retour"

**Changement label** : Après sauvegarde réussie, bouton change label "Annuler" vers "Retour".

**Action retour** : Clic "Retour" ramène menu principal application. Wizard création fermé, personnage conservé.

### Réutilisation personnage sauvegardé

**Accès chargement** : Menu principal offre option "Charger personnage". Saisie code sauvegarde dans champ dédié. Déclenchement chargement personnage complet.

**Utilisation chargée** : Ouverture feuille personnage avec données complètes. Édition informations personnage. Progression XP et amélioration capacités. Gestion équipement inventaire.

## Relations

### Dépendances

- [resume-validation.md](./resume-validation.md) : Validation complète avant sauvegarde recommandée
- [resume-display.md](./resume-display.md) : Détails données affichées et sauvegardées
- [resume-export.md](./resume-export.md) : Export PDF vs sauvegarde base données
- [../../patterns/pattern-google-sheets-storage.md](../../patterns/pattern-google-sheets-storage.md) : Infrastructure stockage

## Règles métier

### Sauvegarde optionnelle

**Flexibilité workflow** : Utilisateur peut choisir ordre opérations selon besoins.

**Options disponibles** : Valider sans sauvegarder (personnage temporaire mémoire uniquement, risque perte). Sauvegarder sans valider (brouillon modifiable, version intermédiaire persistée). Sauvegarder puis valider (approche recommandée, personnage persisté ET finalisé).

### Unicité codes sauvegarde

**Génération unique** : Chaque opération sauvegarde génère nouveau code unique différent. Même personnage sauvegardé plusieurs fois produit codes multiples distincts.

**Versions multiples** : Permet conserver versions différentes même personnage (brouillon initial, version finalisée, versions progressions ultérieures).

### Immuabilité post-validation

**Verrouillage wizard** : Une fois validation effectuée (wizard marqué terminé), impossible rouvrir wizard pour modifications. Protection évite modifications accidentelles structure création.

**Modifications autorisées** : Modifications futures personnage validé uniquement via feuille personnage dédiée. Permet progression normale (XP, équipement, détails) sans risquer cohérence structure.

### Expiration codes potentielle

**Durée vie limitée** : Codes sauvegarde peuvent avoir durée vie limitée système (exemple : expiration après 30 jours inactivité, nettoyage automatique vieilles sauvegardes).

**Recommandation backup** : Export JSON local recommandé pour backup permanent indépendant système. Assure conservation personnages importants même après expiration codes.

## Exemples Warhammer

Voir [exemples-personnages.md](../exemples-personnages.md) pour archétypes complets.

**Focus mécanisme sauvegarde :**

**Sauvegarde réussie (Agitateur Humain) :** Clic "Sauvegarder" → Dialogue affiche code unique "A7F3-K9L2-M4X8" → Copie code → Bouton masqué → Clic "Valider" finalise → Personnage récupérable via code.

**Échec sauvegarde (Répurgateur Nain) :** Clic "Sauvegarder" → Alert "Echec de la sauvegarde." (serveur/LocalStorage plein) → Bouton reste visible pour réessayer → Alternative : valider sans sauvegarder ou export JSON manuel.

**Brouillon incomplet (Sorcier Elfe) :** Talents incomplets → Sauvegarde génère code → Retour Talents pour compléter → Bouton caché (saveName existe) → Sauvegarde conserve version incomplète → Validation ultérieure termine mais version complète non sauvegardée.

**Risque perte données :** Validation sans sauvegarde → Personnage en mémoire uniquement → Fermeture navigateur = perte totale → Recommandation UI : avertissement avant validation si pas sauvegardé.

**Versions multiples (Nain) :** Sauvegarde niveau 1 → Code 1 généré → Progression niveau 2 → Nouvelle sauvegarde → Code 2 généré → Deux versions distinctes conservées.

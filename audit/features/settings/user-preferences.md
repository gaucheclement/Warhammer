# Configuration Utilisateur

## Vue d'ensemble

Système de paramétrage global permettant à l'utilisateur de personnaliser son expérience en sélectionnant les livres sources actifs et leurs contenus associés. Les préférences sont sauvegardées localement dans le navigateur.

Référence : Voir [books.md](../../database/books.md) pour la liste complète des livres sources.

## Règles Métier

### Sélection des Livres Sources

**Livre de Base (LDB)**
- Statut : Obligatoire, toujours actif
- Raison : Contient les règles fondamentales et le contenu de référence
- Comportement : Case à cocher désactivée, ne peut être décochée

**Livres Additionnels**
- Statut : Optionnels, activables/désactivables individuellement
- Impact : Détermine la disponibilité du contenu dans le wizard et le compendium
- Comportement :
  - Activé → Contenu visible et utilisable
  - Désactivé → Éléments marqués "inactive", invisibles mais conservés en mémoire

### Catégories de Livres

**1. Livres de Règles**
- LDB (Livre de Base)
- AA (Arsenal de l'Ancien Monde)
- VDLM (Vent de Magie)
- Contenu : Règles fondamentales, mécaniques de jeu

**2. Cadres de Campagne**
- ADE1, ADE2 (Archives de l'Empire)
- Middenheim
- Lustria
- SOC (Sea of Claws / Halfling Cuisine)
- Contenu : Régions, cultures, contenu géographique

**3. Scénarios**
- MSR (Mort sur le Reik)
- PDTC (Power Behind the Throne)
- Autres aventures publiées
- Contenu : Éléments spécifiques aux aventures

### Impact du Filtrage sur le Contenu

**Espèces**
- Exemple : Halfling Cuisine (SOC) propose espèces spécifiques
- Règle : Si SOC désactivé → espèces SOC cachées
- Conservation : Données restent en mémoire si déjà sélectionnées

**Carrières**
- Exemple : Sorcier du Feu requiert VDLM
- Règle : Si VDLM désactivé → carrière invisible dans le wizard
- Référence : Voir [careers.md](../../database/careers.md)

**Talents**
- Exemple : Talents régionaux ADE1
- Règle : Si ADE1 désactivé → talents exclus des listes
- Référence : Voir [talents.md](../../database/talents.md)

**Équipement, Sorts, Traits**
- Règle générale : Filtrage identique
- Principe : Contenu lié au livre source uniquement visible si livre actif

### Sélection par Type de Livre

**Interface**
- Organisation : Livres groupés par type (Règles / Campagne / Scénarios)
- Navigation : Cases à cocher par catégorie permettent sélection/désélection en masse
- Affichage : Nom livre, version, état activation

**Comportement Groupe**
- Action : Cocher case catégorie
- Résultat : Tous livres de cette catégorie activés/désactivés
- Exception : LDB toujours actif même si "Livres de Règles" décoché

## Persistance des Données

**Stockage Local (LocalStorage)**
- Clé : "whrpg"
- Format : JSON contenant objet user.options
- Structure :
  ```
  {
    options: {
      book: {
        "LDB": 1,
        "ADE1": 1,
        "Middenheim": 1
        // Livres actifs uniquement
      }
    }
  }
  ```

**Opérations**
- Lecture : Au chargement application
- Écriture : À la validation des options
- Portée : Session navigateur, persistance locale uniquement

**Gestion Configuration**
- Annulation : Restaure configuration précédente (non sauvegardée)
- Validation : Sauvegarde configuration dans LocalStorage et recharge données
- Impact : Rechargement immédiat du contenu filtré

## Scénarios d'Usage

### Campagne Empire Standard
- Configuration : LDB + ADE1 + ADE2 + Middenheim actifs, Lustria et SOC désactivés
- Résultat : Espèces Empire, carrières Middenheim, talents ADE visibles ; contenu Lustria/SOC caché
- Justification : Cohérence narrative, options pertinentes uniquement

### Campagne Lustria
- Configuration : LDB + Lustria actifs, Middenheim et autres désactivés
- Résultat : Hommes-lézards, équipement tropical visible ; contenu Empire caché
- Justification : Focus géographique jungle, expérience thématique

### Campagne Minimaliste
- Configuration : LDB seul actif
- Résultat : Contenu de base uniquement, toutes extensions cachées
- Justification : Apprentissage système, retour aux fondamentaux

## Métadonnées des Livres

**Informations Affichées**
- Label (nom complet), Abréviation (LDB, ADE1...), Folder (type), Version, Description (survol)

**Groupement**
- Critère : Attribut "folder" | Affichage : En-têtes gras | Ordre : Règles → Campagnes → Scénarios

## Interactions avec Autres Systèmes

**Wizard de Création**
- Lecture : Options au démarrage chaque étape
- Filtrage : Listes espèces/carrières/talents selon livres actifs
- Référence : Voir [wizard-creation.md](../wizard/wizard-creation.md)

**Compendium**
- Lecture : Options à l'ouverture
- Filtrage : Tables visibles selon livres actifs
- Référence : Voir [compendium-browser.md](../navigation/compendium-browser.md)

**Chargement Données**
- Déclencheur : Modification options livre
- Action : Rechargement complet des données filtrées
- Résultat : Contenu actualisé immédiatement

**Sauvegarde Personnage**
- Indépendance : Configuration livres séparée des données personnage
- Raison : Même personnage utilisable avec différentes configurations
- Comportement : Personnage sauvegardé contient références livres, mais affichage dépend configuration utilisateur courante

## Limitations

**Pas de Synchronisation Multi-Device**
- Portée : LocalStorage limité au navigateur courant
- Conséquence : Configuration non partagée entre appareils/navigateurs
- Workaround : Reconfiguration manuelle sur chaque device

**Conservation Données Inactives**
- Comportement : Éléments de livres désactivés restent en mémoire
- Raison : Éviter perte si personnage utilise contenu puis livre désactivé
- Conséquence : Élément marqué "inactive" mais visible dans fiche personnage

**Pas de Configuration Granulaire**
- Niveau : Livre entier uniquement
- Limitation : Impossible d'activer seulement une partie d'un livre
- Exemple : Impossible d'avoir talents ADE1 sans espèces ADE1

## Validation

**Règles de Cohérence**
- LDB toujours actif (non-négociable)
- Au moins un livre actif (minimum LDB)
- Configuration sauvegardée valide JSON

**Contrôles Interface**
- LDB : Case désactivée, empêche décochage
- Autres livres : Cases librement cochables/décochables
- Validation : Bouton "Valider" sauvegarde et applique
- Annulation : Bouton "Retour" restaure état précédent sans sauvegarder

# Google Sheets comme Infrastructure de Stockage

## Vue d'ensemble

L'application utilise Google Sheets comme base de données principale pour stocker à la fois les données de référence du jeu et les personnages créés par les utilisateurs.

## Architecture Stockage

### Document Google Sheets

**Identifiant** : Un unique document Google Sheets contient toutes les données.

**Organisation** : Multiples feuilles (sheets) séparées, une par type de données.

**Accès** : Via Google Apps Script API côté serveur.

### Types de Feuilles

**Tables de référence** : Une feuille par type d'entité (Species, Careers, CareerLevels, Skills, Talents, Spells, Trappings, Lores, Gods, Stars, Books, Classes, Characteristics, Details, Qualities, Traits, etc.).

**Sauvegarde personnages** : Feuille "Save" dédiée stockage personnages utilisateurs.

**Exports externes** : Feuille "Foundry" (optionnelle, pour exports vers systèmes tiers).

## Structure Tables de Référence

### Format Standard

**Première ligne** : En-têtes colonnes (noms champs).

**Lignes suivantes** : Une ligne par entrée, une colonne par champ.

**Ordre colonnes** : Flexible, défini par en-têtes première ligne.

### Champs Communs

**index** : Identifiant numérique unique séquentiel (1, 2, 3...).

**label** : Nom descriptif de l'entrée (ex: "Humains (Reiklander)", "Agitateur").

**book** : Source officielle (LDB, Middenheim, AA, etc.) ou "Homebrew" pour contenu personnalisé.

**page** : Numéro page livre référence.

**desc** : Description longue, peut contenir HTML formaté.

### Champs Spécifiques par Type

**Species** : characteristics (modificateurs), skills (liste), talents (liste), rand (poids génération aléatoire), etc.

**Careers** : class (catégorie), careerLevels (liens vers niveaux), species (espèces autorisées), regions (régions origine).

**Skills** : characteristic (caractéristique associée), specs (liste spécialisations possibles), advanced (oui/non).

**Talents** : max (nombre rangs), addCharacteristic/addSkill/addMagic/addTalent (effets), prerequisites (prérequis).

**Spells** : lore (domaine magie), CN (casting number), range/target/duration (portée/cible/durée), type (spell/petty/miracle/blessing).

## Feuille "Save" Personnages

### Structure

**2 colonnes** : Colonne A = identifiant unique (saveName), Colonne B = JSON personnage complet.

**Format identifiant** : Chaîne 10 caractères commençant par underscore (ex: `_k3f9zm2lp`).

**Format JSON** : Objet sérialisé contenant toutes données personnage (espèce, carrière, caractéristiques, compétences, talents, équipement, détails, XP, état wizard).

### Opérations

**Sauvegarde** : Recherche identifiant colonne A. Si trouvé → mise à jour ligne existante. Si non trouvé → ajout nouvelle ligne + génération nouvel identifiant.

**Chargement** : Recherche identifiant colonne A → Retour JSON colonne B correspondante.

**Suppression** : Suppression ligne complète → shift lignes suivantes vers le haut.

### Optimisation

**Recherche linéaire** : Parcours séquentiel colonne A acceptable pour <100 personnages.

**Opérations batch** : Lecture/écriture ensemble colonnes A:B en une opération pour performance.

## Opérations Données

### Lecture

**Lecture table complète** : Récupération toutes lignes feuille via getDataRange(), conversion array 2D.

**Première ligne** : Extraction en-têtes pour mapping colonnes.

**Lignes suivantes** : Parsing chaque ligne en objet selon en-têtes.

### Écriture

**Backup automatique** : Copie état actuel avant toute modification.

**Mise à jour ligne** : Modification valeurs cellules ligne spécifique.

**Insertion ligne** : Ajout nouvelle ligne fin table ou position spécifique.

**Opération atomique** : Écriture complète validée ou rollback en cas erreur.

### Validation

**Champs obligatoires** : Vérification présence index, label, autres champs requis selon type.

**Types données** : Validation number, string, boolean selon schéma.

**Références croisées** : Vérification cohérence IDs référencés (species, careers, skills, talents) existent.

**Doublons** : Détection doublons index ou label selon configuration.

## Conversion Données

### Structures Complexes

**Arrays** : Conversion en chaîne texte séparée virgules pour stockage cellule unique.

**Objets** : Soit aplatissement en colonnes multiples, soit sérialisation JSON si complexe.

**HTML** : Stockage brut, préservation balises, nettoyage caractères spéciaux (apostrophes, quotes).

### Nettoyage

**Trim** : Suppression espaces début/fin.

**Normalisation** : Remplacement caractères spéciaux (apostrophe typographique ' → apostrophe droite ').

**Sauts ligne** : Normalisation \r\n, \n, suppression multiples consécutifs.

## Performances

### Limites Taille

**Tables référence** : ~150-400 entrées par table (species, careers, talents, skills, spells).

**Personnages** : Limite pratique ~100-200 personnages sauvegardés.

**Taille document** : ~2.5 MB export complet toutes tables.

### Optimisations

**Rechargement partiel** : Après modification, recharge uniquement table modifiée (pas toutes tables).

**Cache client** : Données référence chargées une fois, conservées mémoire côté client.

**Operations batch** : Lecture/écriture groupée plutôt qu'opérations individuelles.

## Sécurité et Intégrité

### Contrôle Accès

**Lecture** : Accessible tous utilisateurs application (pour wizard création personnages).

**Écriture admin** : Réservée administrateurs authentifiés uniquement.

**Sauvegarde personnages** : Accessible utilisateurs via identifiant unique (pas auth requise pour consultation propres personnages).

### Intégrité Données

**Backup automatique** : Copie avant modification, permet rollback si erreur.

**Validation serveur** : Toutes modifications validées côté Google Apps Script avant commit.

**Pas de modifications concurrentes** : Dernière écriture écrase précédente (pas merge automatique).

## Limites et Contraintes

**Pas de transactions** : Pas support transactions multi-tables atomiques.

**Pas de jointures** : Pas requêtes SQL, lookup manuel côté client pour références croisées.

**Pas de contraintes FK** : Validation références doit être faite applicativement.

**Pas de versionning** : Pas historique modifications (sauf backup unique).

**Scalabilité limitée** : Google Sheets non conçu pour milliers d'entrées ou utilisateurs simultanés nombreux.

**Latence réseau** : Opérations dépendent connexion internet, latence Google API.

## Alternatives et Évolutions

### Migration Potentielle

**Base relationnelle** : MySQL, PostgreSQL pour scalabilité, transactions, contraintes FK.

**NoSQL** : MongoDB, Firestore pour flexibilité schéma, meil

leures performances.

**API REST** : Backend NodeJS/Python avec ORM pour gestion données structurées.

### Conservation Google Sheets

**Simplicité** : Pas d'infrastructure serveur dédiée requise.

**Accessibilité** : Données éditables directement dans Sheets si besoin.

**Backup facile** : Export JSON régulier simple.

**Suffisant pour usage** : Adapté volumétrie actuelle (jeu de rôle table, quelques dizaines utilisateurs).

## Exemples Métier

### Lecture Table Species

**Opération** : Chargement page wizard sélection espèce.

**Process** : Lecture feuille "Species" complète → Parsing première ligne (en-têtes) → Conversion lignes 2-N en objets Species → Filtrage si nécessaire (région, rand) → Affichage liste.

**Données** : ~10-15 entrées species (Humains variants, Nains, Elfes, Halflings, etc.).

### Sauvegarde Personnage

**Contexte** : Joueur termine étape Species du wizard.

**Opération** : save() génère JSON → Envoi Google Apps Script → Recherche identifiant existant colonne A → Pas trouvé donc génération `_x7k2pm9q` → Écriture ligne [A: "_x7k2pm9q", B: "{...JSON...}"] → Retour identifiant au client.

**Résultat** : Joueur reçoit code sauvegarde partageable.

### Modification Talent (Admin)

**Contexte** : Admin modifie description talent "Hardy".

**Opération** : Édition formulaire → Validation champs → Backup automatique feuille "Talents" → Recherche ligne index=42 → Mise à jour colonne "desc" → Commit → Rechargement table "Talents" côté client.

**Sécurité** : Backup permet rollback si erreur validation post-commit.

### Import Homebrew

**Contexte** : Admin importe 5 nouveaux talents homebrew depuis JSON.

**Opération** : Upload fichier JSON → Validation structure → Détection 5 entrées nouvelles → Backup feuille "Talents" → Ajout 5 lignes fin table → Génération nouveaux index séquentiels → Commit → Confirmation "5 talents ajoutés".

**Mode fusion** : Conserve talents existants, ajoute nouveaux sans écraser.

## Voir aussi

- [pattern-validation-references.md](./pattern-validation-references.md) - Validation références inter-tables
- [../database/](../database/) - Schémas détaillés toutes tables
- [../features/admin/](../features/admin/) - Interface administration données
- [../features/save-load/](../features/save-load/) - Sauvegarde/chargement personnages

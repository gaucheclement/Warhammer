# Édition Table Careers

## Objectif

Permet l'édition des carrières et leurs niveaux de progression via l'interface d'administration. Gère l'ajout, la modification et la suppression des careers avec leurs schémas de progression, compétences, talents et trappings.

## Structure des Champs Éditables

**Métadonnées**: Index, Label, Book, Page

**Classification**: Class (Académiques, Artisans, etc.), Type (root/tree/career/level), SubType

**Progression**: Level (hiérarchie), Statut (Argent/Bronze/Or/Laiton), Parent (carrière parente)

**Caractéristiques**: Schéma progression (WS, BS, S, T, I, Ag, Dex, Int, WP, Fel) - valeurs 0-5

**Compétences et Talents**: Skills, Talents, Trappings (listes textuelles)

**Données descriptives**: desc (HTML riche)

## Interface d'Édition

**Champs**: label, book/page, class/type/subType, level/parent, caractéristiques (10 valeurs numériques), skills/talents/trappings (textareas), desc (HTML riche)

## Validation des Données

**Obligatoires**: label, book/page, class, type/subType

**Hiérarchie**: root (level 0, no parent), tree (folder), career (base), level (1-4, needs parent)

**Caractéristiques**: 0-5 par stat, diminue avec niveaux supérieurs

**Format**: Listes virgules, peut contenir "(Au choix)", "OU", quantités

## Workflow Édition Careers

**Créer carrière**: 1) Root (level 0, type career), 2) Niveaux progression (level 1-4, type level, parent obligatoire), 3) Sorties (level 5+)

**Modifier**: Filtrer, sélectionner, ajuster, valider

**Dupliquer**: Sélectionner similaire, dupliquer, renommer, ajuster

## Exemples Concrets Warhammer

**Soldat** (LDB:54): Class Guerriers, level 0, stats WS:5 BS:4 S:4 T:4 I:3 Ag:3 Dex:3 Int:2 WP:3 Fel:2, skills "Athlétisme, Calme, Commandement...", talents "Coups puissants, Guerrier-né..."

**Garde** (LDB:54): Level 2, parent Soldat, skills "+3 au choix parmi: Conduite, Dressage..."

**Érudit** (LDB:48): Class Académiques, level 0, stats Int:5 WP:4 (hautes), skills "Langue (Au choix 2), Savoir (Au choix 3)..."

**Seigneur de guerre** (LDB:55): Level 5, parent Capitaine, sortie de carrière

## Gestion des Hiérarchies

**Structure**: Root (0) → Level 1 → Level 2 → Level 3 → Level 4 → Level 5+ (sorties)

**Relations**: Chaque niveau référence parent direct, validation parent.level = current.level - 1

**Folders**: Type "tree", organisation visuelle, non jouables

## Relations avec Autres Fonctionnalités

**Dépendances**
- [database/careers.md](../../database/careers.md) - Structure complète careers
- [database/talents.md](../../database/talents.md) - Talents référencés
- [database/skills.md](../../database/skills.md) - Skills référencés
- [database/trappings.md](../../database/trappings.md) - Trappings référencés
- [pattern-parsing.md](../../patterns/pattern-parsing.md) - Parsing listes

**Fonctionnalités liées**
- [interface.md](./interface.md) - Interface admin
- [edit-species.md](./edit-species.md) - Species référencent careers
- [edit-talents.md](./edit-talents.md) - Talents utilisés par careers
- [edit-skills.md](./edit-skills.md) - Skills utilisés par careers
- [validation.md](./validation.md) - Validation
- [save.md](./save.md) - Sauvegarde

## Limites et Contraintes

**Pas de vérification cascade**
- Modifier parent n'alerte pas sur impact enfants
- Supprimer une carrière ne vérifie pas si des personnages l'utilisent

**Format texte libre**
- Skills/talents/trappings en texte brut
- Parsing ultérieur au runtime
- Erreurs syntaxe non détectées à l'édition

**Pas de calcul automatique**
- Schémas de caractéristiques non validés par rapport aux niveaux précédents
- Cohérence progression à vérifier manuellement

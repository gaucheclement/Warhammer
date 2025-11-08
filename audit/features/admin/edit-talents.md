# Édition Table Talents

## Objectif

Permet l'édition des talents et leurs effets via l'interface d'administration. Gère l'ajout, modification et suppression des talents avec leurs tests, spécialisations, effets modificateurs et descriptions.

## Structure des Champs Éditables

**Métadonnées**: Index, Label, Book, Page

**Classification**: Type (talent/folder), SubType, Max (nombre de fois prenable)

**Spécialisations**: Peut contenir liste de spécialisations possibles (ex: "Acute Sense (Sight/Hearing/Taste)")

**Tests**: Liste des compétences/caractéristiques affectées par le talent

**Effets modificateurs**: Modificateurs appliqués aux caractéristiques ou compétences

**Données descriptives**: desc (HTML riche)

## Interface d'Édition

**Champs**: label (avec éventuellement spécialisations entre parenthèses), book/page, type/subType, max (numeric), tests (textarea), effects (textarea), desc (HTML riche)

## Validation des Données

**Obligatoires**: label, book/page

**Max**: Vide (infini), 1 (unique), 2-9 (limité), "spec" (une fois par spécialisation)

**Spécialisations**: Format "Talent (Spec1/Spec2/Spec3)" ou "Talent (Au choix)"

**Tests**: Liste compétences/caractéristiques affectées

**Effets**: Modificateurs numériques (ex: "+10 Initiative", "+5% chance critique")

## Workflow Édition Talents

**Créer talent simple**: Label unique, max=1, desc complète

**Créer talent avec spécialisations**: Label "Talent (Spec1/Spec2)", max="spec", une entrée par spécialisation

**Créer talent prenable plusieurs fois**: max=N (2-9) ou vide (infini)

**Modifier**: Filtrer, sélectionner, ajuster, valider

**Dupliquer**: Pour créer nouvelle spécialisation d'un talent existant

## Exemples Concrets Warhammer

**Acute Sense (Sight)** (LDB:126): Max="spec", tests "Perception", desc "Vision exceptionnelle..."

**Warrior Born** (LDB:142): Max=1, tests "+5 to Weapon Skill when using spears", desc "Guerrier naturel..."

**Strike Mighty Blow** (LDB:141): Max=vide (prenable multiple fois), effect "+1 dégâts en mêlée", desc "Frappe puissante..."

**Etiquette (Nobles)** (LDB:128): Max="spec", spécialisations (Nobles/Guilders/Servants/Scholars), tests "Charm avec cible correspondante"

## Gestion des Spécialisations

**Format label**: "Talent (Spec)" où Spec est la spécialisation exacte

**Max="spec"**: Indique qu'on peut prendre le talent une fois par spécialisation

**Liste spécialisations**: Stockée dans desc ou champ séparé selon implémentation

**Au choix**: "Talent (Au choix)" signifie joueur choisit une spécialisation libre

## Gestion des Effets

**Tests**: Compétences/caractéristiques bénéficiant de bonus

**Modificateurs**: Valeurs numériques (+X, -X, +X%, etc.)

**Effets spéciaux**: Décrits en texte libre dans desc

**Parsing**: Format texte libre, parsing au runtime

## Relations avec Autres Fonctionnalités

**Dépendances**
- [database/talents.md](../../database/talents.md) - Structure complète
- [database/skills.md](../../database/skills.md) - Skills référencés dans tests
- [pattern-specialisations.md](../../patterns/pattern-specialisations.md) - Format specs
- [pattern-modificateurs-caracteristiques.md](../../patterns/pattern-modificateurs-caracteristiques.md) - Effets

**Fonctionnalités liées**
- [interface.md](./interface.md) - Interface admin
- [edit-species.md](./edit-species.md) - Species référencent talents
- [edit-careers.md](./edit-careers.md) - Careers référencent talents
- [validation.md](./validation.md) - Validation
- [save.md](./save.md) - Sauvegarde

## Limites et Contraintes

**Format texte libre**: Tests et effets en texte brut, parsing ultérieur

**Pas de validation effets**: Modificateurs non vérifiés à l'édition

**Spécialisations non énumérées**: "(Au choix)" = liste ouverte

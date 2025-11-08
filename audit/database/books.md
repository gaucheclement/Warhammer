# Books (Sources)

## Vue d'ensemble

La table Books référence les livres sources Warhammer Fantasy Roleplay 4ème édition dont proviennent les données du système. Chaque livre contient différents types de contenu (espèces, carrières, talents, compétences, sorts, possessions).

**Objectif métier:** Tracer la provenance de chaque élément de données pour permettre le filtrage par source et respecter les droits éditoriaux.

**Utilisation principale:**
- Filtrage du contenu disponible selon les livres possédés
- Attribution d'origine à chaque donnée
- Organisation des références bibliographiques

## Structure des données

### Identifiants

| Champ | Type | Rôle |
|-------|------|------|
| index | nombre | Identifiant unique séquentiel (0-27) |
| label | texte | Nom complet du livre |
| abr | texte | Abréviation courte pour références (LDB, AA, VDLM, etc.) |

**Exemples:**
- "Livre de base" → abr: "LDB"
- "Archives de l'Empire Vol. I" → abr: "ADE1"
- "Mort sur le Reik" → abr: "MSR"

### Métadonnées éditoriales

| Champ | Valeurs | Signification |
|-------|---------|---------------|
| language | VF, VO | Version Française ou Version Originale |
| folder | texte | Catégorie: "Livre de Règle", "Cadre de campagne", "Scénario" |
| desc | HTML | Description marketing du livre |

**Règles:**
- Tous les livres français (VF) ont une description complète
- Livres anglais (VO) ont desc vide (non traduit)
- folder organise par type de publication

### Indicateurs de contenu

Chaque livre indique quels types de données il contient:

| Champ | Valeurs possibles | Signification |
|-------|-------------------|---------------|
| species | 1, 0.75, 0.5, 0, "" | Contient espèces jouables |
| careers | 1, 0.75, 0.5, 0, "" | Contient carrières |
| talents | 1, 0.75, 0.5, 0, "" | Contient talents |
| skills | 1, 0.75, 0.5, "" | Contient compétences |
| spells | 1, 0.75, 0.5, 0, "" | Contient sorts |
| trappings | 1, 0, "" | Contient possessions |

**Interprétation des valeurs:**
- `1` = Livre contient du contenu principal de ce type
- `0.75` = Contenu additionnel substantiel
- `0.5` = Contenu mineur ou optionnel
- `0` = Aucun contenu de ce type
- `""` (vide) = Non applicable ou non documenté

**Exemples concrets:**

Livre de base (LDB):
- species: 1, careers: 1, talents: 1, skills: 1, spells: 1, trappings: 1
- Contient tous les types, c'est le livre fondamental

Aux Armes (AA):
- species: 0.5, careers: 0.75, talents: 0.75, spells: 0.5, skills: "", trappings: 0
- Focus sur carrières/talents, peu d'espèces, pas de possessions

Altdorf (ACE):
- species: "", careers: "", talents: "", skills: "", spells: "", trappings: ""
- Guide géographique sans mécaniques de jeu

## Organisation des livres

**Livres de Règle (3)** : LDB (base complet), AA (combat), VDLM (magie)

**Cadre de campagne (12)** : Archives Empire (ADE1/2/3), Guides villes (Middenheim, ACE, Salzemund), Compagnons (EDOC, MSRC, PDTC, LRCC, EERC), Autres (ZI, SOC, Lustria, RM)

**Scénarios (13)** : BI, Ubersreik (AU1/2/3), NADJ, Ennemi Intérieur (EDO, MSR, PDT, LRC, EER)

## Relations avec autres tables

**Tables référençant Books** : Species, Careers, Talents, Skills, Spells, Trappings → champ book (abr)

**Règle métier** : Chaque donnée trace provenance vers livre source

**Abréviations (abr)** : Clés de référence courtes utilisées dans données (book), interface (affichage compact), filtres (sélection rapide). Ex: Nain→LDB, Gnome→NADJ, Boucher→ADE2

## Règles de validation

### Unicité

- **index** unique pour chaque livre (0-27 actuellement)
- **abr** unique (pas deux livres avec même abréviation)
- **label** unique (pas deux livres avec même nom)

### Cohérence des indicateurs

Tous les champs de contenu (species, careers, etc.) doivent avoir:
- Une valeur dans: 1, 0.75, 0.5, 0, ""
- Pas de valeurs négatives
- Pas de valeurs > 1

### Intégrité référentielle

Toute référence book dans les autres tables doit correspondre à une abr existante dans Books.

**Validation:** Si une espèce référence book:"ADE1", alors Books doit contenir un livre avec abr:"ADE1".

## Cas d'usage

**Filtrage par livres possédés** : Joueur a LDB+ADE1+Middenheim → Récupérer abr → Filtrer tables où book IN (abr) → Afficher contenu filtré

**Affichage sources** : talent.book="ADE2" → Chercher Books.abr="ADE2" → Afficher label complet

**Recherche par type** : Livres avec sorts → Filtrer Books.spells IN (1, 0.75, 0.5) → Retourner liste sources magie

## Particularités métier

**Versions linguistiques** : VF (desc complète, 60% catalogue), VO (desc vide, références bibliographiques). Système privilégie VF quand disponible.

**Valeurs fractionnaires** : 0.75 (contenu substantiel secondaire: AA careers, SOC species), 0.5 (mineur/optionnel: AA species, VDLM spells). Permet priorisation suggestions aléatoires.

## Limites et contraintes

**Nombre** : 28 livres actuels (0-27), extensible par incrémentation index

**Granularité** : Indicateurs binaires/ternaires (1/0.75/0.5/0/"") ne précisent pas COMBIEN/QUELLES données, seulement présence. Tables contenu tracent provenance exacte.

**Descriptions HTML** : desc formaté nécessite affichage HTML ou parsing. Livres VO ont desc="" (non traduits).

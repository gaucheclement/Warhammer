# Table Magicks - Documentation

## Vue d'ensemble

La table Magicks catalogue les domaines de magie disponibles dans Warhammer. Elle contient les huit Vents de Magie des Couleurs, les domaines alternatifs (Magie naturelle, Sorcellerie), et les magies interdites (Démonologie, Nécromancie, Chaos).

**Source** : `data/magicks.json`
**Références** : [Sorts](spells.md), [Talents](talents.md), [Domaines](lores.md)

## Structure des données

### Champs principaux

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| index | Integer | Oui | Identifiant unique séquentiel |
| label | String | Oui | Nom du domaine (ex: "Bête", "Feu") |
| suffix | String | Variable | Préfixe d'affichage (ex: "Domaine de la", "Domaine du") |
| abr | String | Variable | Abréviation du Vent (ex: "Ghur", "Aqshy") |
| folder | String | Oui | Catégorie organisationnelle |
| desc | String | Oui | Description complète avec règles, composants |
| book | String | Oui | Référence du livre source |
| page | Mixed | Oui | Numéro(s) de page |

### Catégories (folder)

| Folder | Domaines inclus | Usage |
|--------|----------------|-------|
| Magie des couleurs | Bête, Cieux, Feu, Lumière, Métal, Mort, Ombres, Vie | Huit Vents officiels des Collèges de Magie |
| Autres domaines | Magie naturelle, Sorcellerie | Traditions magiques alternatives |
| Magie noire | Démonologie, Nécromancie | Pratiques strictement interdites |
| Magie du Chaos | Nurgle, Slaanesh, Tzeentch | Corruption démoniaque, dieux du Chaos |
| Magie Ogre | Gueule | Gastromancie exclusive aux ogres |

## Champs à données variables

### suffix (Préfixe)

Permet affichage complet : `suffix + label` → "Domaine de la Bête", "Domaine du Feu"

**Avec suffix** : Tous les domaines des Couleurs et domaines alternatifs
**Sans suffix (vide)** : Sorcellerie, Démonologie, Nécromancie, Chaos

### abr (Abréviation/Vent)

Nom du Vent de Magie pour les huit Couleurs uniquement.

**Avec abr** : Les huit Vents des Couleurs (Ghur, Azyr, Aqshy, Hysh, Chamon, Shyish, Ulgu, Ghyran)
**Sans abr (vide)** : Tous les autres domaines (pas de Vent associé)

### desc (Description)

Contient cinq éléments structurés :
1. **Lore narrative** : Histoire, thématique, personnalité des praticiens
2. **Effets des sorts** : Types de sorts disponibles, capacités
3. **Attribut de domaine** : Bonus/malus automatiques lors de l'incantation
4. **Composants** : Liste des ingrédients magiques nécessaires (balise `<b>Composants:</b>`)
5. **Règles spéciales** : Effets additionnels, restrictions, conditions

## Relations avec autres tables

### Sorts (Spells)

Chaque domaine contient une liste de sorts filtrés automatiquement :
- **Magie des Couleurs** → `type="Magie des Arcanes"` ET `subType=label du domaine`
- **Magie du Chaos** → `type="Magie du Chaos"` ET `subType=nom du dieu`

**Logique** : Le code parcourt `CharGen.data.spell.allByTypeAndSpec[spellType][el.label]` pour récupérer les sorts associés.

**Référence** : [Sorts - Types et Domaines](spells.md#types-de-sorts)

### Talents (prérequis)

Pour lancer des sorts d'un domaine, le personnage doit posséder le talent correspondant :
- "Magie des Arcanes (Bête)" → accès aux sorts du Domaine de la Bête
- "Magie du Chaos (Tzeentch)" → accès aux sorts de Tzeentch

**Référence** : [Talents - Magie](talents.md#magie)

### Lores (Domaines de connaissances)

Les domaines des Couleurs correspondent aux huit traditions des Collèges de Magie impériaux.

**Référence** : Table `lores.json` (huit Ordres de Magie)

## Logique métier encodée

### Règles d'attributs de domaine

Chaque domaine octroie bonus/malus automatiques quand sorts lancés :

**Bête (Ghur)** : Gain possible de Trait "Peur 1" pour 1d10 rounds
**Cieux (Azyr)** : Dégâts électriques ignorent PA métal, frappent cibles à 2m
**Feu (Aqshy)** : +1 État En flammes, bonus +10 Incantation si flammes proches
**Lumière (Hysh)** : État Aveuglé, dégâts bonus contre Démons/Morts-vivants
**Métal (Chamon)** : Ignore PA métal, bonus dégâts = PA métal de la cible
**Mort (Shyish)** : +1 État Exténué sur cibles vivantes
**Ombres (Ulgu)** : Ignore tous PA non magiques
**Vie (Ghyran)** : +10 Incantation en milieu rural, retire États Exténué/Hémorragique

### Règles de composants

**Couleurs** : Composants coûteux (pistoles d'argent), matériaux spécifiques rares
**Magie naturelle** : Composants locaux faciles (herbes), récupérables par Savoir (Herboristerie), 5 sous de cuivre chacun
**Sorcellerie** : Composants bon marché (sous de cuivre = NI du sort), morceaux d'animaux, obligation sinon jet Incantations Imparfaites
**Gueule** : Composants carnés frais, peuvent restaurer PV du lanceur

### Restrictions de magie

**Magie naturelle** : Ne peut JAMAIS lancer sans composants (intégrés au processus)
**Sorcellerie** : Sans composant → jet obligatoire Tableau Incantations Imparfaites Mineures, même si succès
**Chaos/Noire** : Usage entraîne Corruption, illégal, traqué par autorités
**Gueule** : Réservée aux ogres, Carrière Boucher Ogre

## Exemples concrets

### Domaine des Couleurs (Feu)
```
index: 2
label: "Feu"
suffix: "Domaine du"
abr: "Aqshy"
folder: "Magie des couleurs"
desc: "Le Domaine du Feu est lié à Aqshy, le Vent rouge..."
      [Attribut: +1 État En flammes, bonus +10 si flammes proches]
      [Composants: charbon, huiles, graisses, bois rouges, clefs fer...]
book: "LDB"
page: "231, 247"
```

### Domaine alternatif (Magie naturelle)
```
index: 8
label: "Magie naturelle"
suffix: "Domaine de la"
abr: ""
folder: "Autres domaines"
desc: "Les pratiquants... sorciers de village... Élus..."
      [Ne peut lancer SANS composants]
      [Composants: herbes locales, 5 sous cuivre, DR+1 par forage]
book: "LDB"
page: "233, 254"
```

### Magie interdite (Nécromancie)
```
index: 11
label: "Nécromancie"
suffix: "Domaine de la"
abr: ""
folder: "Magie noire"
desc: "...maîtriser la mort... corps en décomposition... hérésie..."
book: "LDB"
page: 256
```

## Tests de cohérence

**Index uniques** : Aucun index dupliqué (0-15)
**Labels uniques** : Pas de doublons de nom
**Folder valide** : folder dans ["Magie des couleurs", "Autres domaines", "Magie noire", "Magie du Chaos", "Magie Ogre"]
**Abr cohérent** : abr rempli uniquement pour les huit domaines des Couleurs, vide sinon
**Couleurs complètes** : Exactement 8 domaines dans "Magie des couleurs" avec abr renseignés
**Suffix cohérent** : suffix présent pour domaines nécessitant affichage complet
**Composants présents** : desc contient section `<b>Composants:</b>` avec liste d'ingrédients
**Références valides** : book et page doivent référencer sources connues
**Champs non vides** : label, folder, desc, book, page obligatoires
**Sorts associés** : Vérifier que domaines Couleurs et Chaos ont sorts correspondants dans table Spells

## Règles de validation

### Champs obligatoires
- **index** : Entier unique >= 0
- **label** : Chaîne non vide, unique
- **folder** : Valeur dans liste autorisée
- **desc** : Chaîne non vide, minimum 50 caractères
- **book** : Code livre valide (LDB, ADE2, etc.)
- **page** : Numéro(s) de page valides

### Champs conditionnels
- **abr** : Obligatoire SI folder="Magie des couleurs", vide SINON
- **suffix** : Recommandé pour affichage, peut être vide
- **Composants dans desc** : Obligatoire pour tous domaines praticables

### Contraintes métier
- Exactement 8 domaines Couleurs avec abr uniques (Ghur, Azyr, Aqshy, Hysh, Chamon, Shyish, Ulgu, Ghyran)
- Magie noire : descriptions courtes (interdits), Attributs : bonus/malus explicites dans desc
- Relations Spells : domaines Couleurs et Chaos doivent avoir sorts avec subType correspondant

### Messages d'erreur
- Index manquant/dupliqué, Label vide, Folder invalide
- Abr manquant pour Couleurs ou présent hors Couleurs
- Composants absents de la description
- Description trop courte (minimum 50 caractères)
- Pas exactement 8 domaines de Magie des Couleurs
- Sorts manquants pour le domaine dans table Spells

---

**Navigation** : [Sorts](spells.md) | [Talents](talents.md) | [Index Database](README.md)

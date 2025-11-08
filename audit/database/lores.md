# Table Lores (Magicks) - Documentation

## Vue d'ensemble

La table Lores centralise les 16 domaines de magie : 8 Magie des Couleurs, 2 alternatifs, 2 Magie noire, 4 Chaos. Chaque domaine possède règles spécifiques, composants, et gouverne l'accès aux sorts.

**Source** : `data/magicks.json`
**Références** : [Spells](spells.md), [Talents](talents.md)

## Structure des données

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| index | Integer | Oui | Identifiant unique séquentiel (0-15) |
| label | String | Oui | Nom du domaine sans préfixe |
| suffix | String | Oui | Préfixe grammatical ("Domaine de la/des/du") |
| abr | String | Variable | Abréviation Vent (vide pour non-Couleurs) |
| folder | String | Oui | Catégorie (Magie couleurs/Autres/noire/Chaos/Ogre) |
| desc | String | Oui | Description narrative complète avec règles |
| book | String | Oui | Référence livre source |
| page | Mixed | Oui | Numéro(s) page |

**Catégories** : Magie couleurs (8), Autres domaines (2), Magie noire (2), Magie Chaos (4), Magie Ogre (1)

## Lores de la Magie des Couleurs

Les huit domaines correspondent aux Vents de Magie, chacun lié à un Ordre des Collèges.

**Bête (Ghur/Ambre)** : Ordre d'Ambre. Nature sauvage, transformation animale. Attribut : Peur 1 (1d10 rounds). Composants : fourrure, os, organes.

**Cieux (Azyr/Bleu)** : Ordre Céleste. Divination, foudre, destin. Attribut : ignore PA métal + frappe à 2m (Bonus FM dégâts). Composants : instruments astronomiques, viscères.

**Feu (Aqshy/Rouge)** : Ordre Flamboyant. Destruction, courage. Attribut : +1 En flammes + bonus +10 par En flammes proche. Composants : inflammables, ignifuges.

**Lumière (Hysh/Blanc)** : Ordre Lumineux. Bannissement, purification. Attribut : Aveuglé + bonus vs Démons/Morts-vivants. Composants : artefacts sacrés, cristaux.

**Métal (Chamon/Doré)** : Ordre Doré. Transmutation, alchimie. Attribut : ignore PA métal + bonus = PA métal. Composants : métaux lourds, outils forge.

**Mort (Shyish/Violet)** : Ordre d'Améthyste. Temps, mortalité (PAS nécromancie). Attribut : +1 Exténué (max 1). Composants : os, symboles mort.

**Ombres (Ulgu/Gris)** : Ordre Gris. Illusion, tromperie. Attribut : furtif + ignore PA non magiques. Composants : objets dissimulation.

**Vie (Ghyran/Vert)** : Ordre de Jade. Guérison, croissance. Attribut : +10 rural/sauvage + retire Exténué/Hémorragique + bonus vs morts-vivants. Composants : naturels vivants.

## Autres domaines

**Magie naturelle** : Sorciers village. Folklore rural, esprits. Composants OBLIGATOIRES. Récupération DR+1 (Herboristerie) ou 5 sous cuivre. Composants : herbes préparées strictement.

**Sorcellerie** : Autodidactes. Mélange Vents, corruption. +1 Corruption/Imparfaite. Toujours Imparfaites Mineures (sauf composant). Attribut : Hémorragique. Composants : animaux vivants, NI sous cuivre.

## Magie noire et Chaos

**Démonologie** : Proscrite. Invocation démons, soumission Chaos.
**Nécromancie** : Proscrite, hérésie. Maîtrise mort, animation cadavres.

**Nurgle** : Maladies, pourriture. Vent Jade corrompu.
**Slaanesh** : Torture, excès. Vents Améthyste/Or/Jade tordus.
**Tzeentch** : Changement, magie pure. Vents Gris/Améthyste/Blanc. Attribut : Test Résistance ou +1 Corruption (réussite : +1 Chance).
**Gueule** (ADE2) : Bouchers Ogres. Gastromancie. Restauration santé (1d10=10 ou ≥NI : récup Blessures=NI). Composants : restes sanglants frais.

## Relations avec autres tables

### Spells

**Lien** : Champ `subType` des sorts "Magie des Arcanes" = nom lore (Bête, Cieux, etc.)
**Filtrage** : Chaque sort arcane → un domaine spécifique
**Accès** : Personnage lance uniquement sorts de son domaine (talent)

Exemples : "Forme Bête" → subType:"Bête" | "Bouclier Aethyrique" → subType:"Cieux"

### Talents

**Lien** : "Magie des Arcanes (Domaine)" donne accès au lore
**Spécialisation** : Obligatoire - UN domaine par magicien
**Progression** : Rangs augmentent maîtrise

Exemple : "Magie Arcanes (Feu)" → tous sorts subType="Feu"

## Logique métier encodée

### Attributs de domaine

Magie Couleurs : attribut automatique à TOUS les sorts. Déclenchement : après lancer réussi. Cibles : ennemis (sauf même talent). Effets : États, bonus/malus, dégâts automatiques.

### Composants magiques

**Couleurs** : optionnels (réduisent Imparfaites)
**Naturelle** : OBLIGATOIRES (aucun lancer sans)
**Sorcellerie** : obligatoires SAUF si acceptation Imparfaites Mineures

**Coûts** : Couleurs/noire/Chaos (NI pistoles argent) | Naturelle (5 sous cuivre ou DR+1) | Sorcellerie (NI sous cuivre)

### Environnements favorables

**Vie** : +10 rural/sauvage
**Feu** : +10 par En flammes proche (≤Bonus FM mètres)

## Tests de cohérence

### Intégrité structurelle

- Index 0-15 séquentiels uniques
- Labels uniques, pas doublons
- Folders dans liste prédéfinie
- Abr non vides (Couleurs) / vides (autres)

### Cohérence Vents-Ordres

Domaines Couleurs documentent : Vent (abr), Ordre Collèges, Attribut complet

### Relations inverses

- Tous subType dans spells.json → lore existant
- Tous talents "Magie Arcanes (X)" → lore X existant

## Validation des données

### Contraintes par champ

**index** : Entier ≥0, unique
**label** : Non vide, unique, max 30 car
**suffix** : Format "Domaine de/du/des/de la"
**abr** : Vide OU 3-6 car majuscules
**folder** : ["Magie des couleurs", "Autres domaines", "Magie noire", "Magie du Chaos", "Magie Ogre"]
**desc** : Non vide, min 50 car (complètes), HTML possible
**book** : Non vide
**page** : Entier ou plage ("230, 245")

### Règles d'intégrité

- folder="Magie couleurs" → abr non vide ; autres → vide
- Magie noire/Chaos : desc courtes OK ; Couleurs/Autres : complètes (>500 car)
- Unicité suffix+label

### Messages d'erreur métier

"Lore {label} : abr manquant pour Magie des Couleurs"
"Lore {label} : folder invalide"
"Lore {label} : description trop courte pour domaine documenté"
"Sort {spell} référence lore inexistant : {subType}"
"Talent Magie Arcanes ({domaine}) : lore {domaine} non trouvé"

---

**Navigation** : [Spells](spells.md) | [Talents](talents.md) | [Index Database](README.md)

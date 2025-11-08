# Magie - Apprentissage sorts par domaine

## Vue d'ensemble

Apprentissage sorts suit regles strictes selon domaine et carriere. Chaque tradition impose prerequis, restrictions et couts XP specifiques.

**References** : [domains.md](domains.md), [xp-cost.md](xp-cost.md), [database/spells.md](../../database/spells.md)

## Prerequis generaux

**Talent requis** : Aucun sort appris sans talent approprie
- Arcanes → "Magie des Arcanes (Domaine)"
- Divine → "Beni" ou "Invocation (Dieu)"
- Chaos → "Magie du Chaos (Dieu)"
- Naturelle → "Magie Naturelle"
- Sorcellerie → "Sorcellerie"
- Mineure → N'importe quel talent magie

**Acces carriere** : Sort accessible si carriere permet magie ET domaine. Sinon cout double (hors carriere).

## Regles par domaine

### Magie Arcanes (Huit Vents)

**Specialisation exclusive** : Magicien choisit UN domaine. Ne peut jamais changer ou apprendre autres domaines (melange Vents = corruption).

**Apprentissage** :
- Lance UNIQUEMENT sorts domaine (subType correspond)
- Rangs talent augmentent maitrise, PAS acces nouveaux domaines
- Cout XP : CN × 10 (dans carriere) ou CN × 20 (hors carriere)

**Exemples** : Magister Feu apprend "Boule Feu" (CN 5) → 50 XP. Ne peut JAMAIS apprendre "Forme Bete" (domaine Bete).

### Magie Divine

**Benedictions (Beni)** : Prieres universelles, TOUS pretres
- Prerequis : Talent "Beni"
- Cout : 50 XP par benediction
- Exemples : "Benediction Bataille" (+10 CC)

**Miracles (Invocation)** : Pouvoir specifique dieu
- Prerequis : Talent "Invocation (Dieu X)"
- Acces : UNIQUEMENT miracles dieu X (subType = nom dieu)
- Cout : 100 XP par miracle
- Multi-divinite : Si sert plusieurs dieux, talent distinct requis par dieu

### Magie Chaos

**Nature** : Corrompue, proscrite
**Acces** : Sorts dieu + sorts Indivisibles (subType vide)
**Cout** : CN × 10 + risque +1 Corruption par Imparfaite
**Restriction** : Toujours hors carriere Empire (illegale)

### Magie Naturelle

**Particularite** : Composants OBLIGATOIRES (aucun sort sans)
**Cout** : 30 XP + composants (5 sous cuivre ou DR+1 Herboristerie)
**Apprentissage** : Tradition orale, grimoires villages

### Sorcellerie

**Danger** : +1 Corruption par sort Imparfait lance
**Particularite** : Toujours Imparfaites Mineures SAUF avec composants (sacrifices animaux)
**Cout** : Variable, autodidacte

### Magie Mineure (Petty)

**Acces** : Tous lanceurs sorts (universelle, CN=0)
**Cout** : 30 XP par sort
**Fonction** : Socle commun toute magie
**Exemples** : "Alerte", "Choc", "Lumiere"

## Progression domaine

**Rangs talent** : Rang 1 = acces domaine. Rang 2-4 = maitrise accrue MAIS pas nouveaux domaines.
**Nombre sorts** : Pas limite (autant que XP permet dans domaine)
**Changement** : Arcanes impossible (corruption), Divine possible (talent distinct par dieu), Chaos perd sorts ancien dieu

## Sources apprentissage

**Maitres** :
- Arcanes : Colleges Imperiaux (Altdorf)
- Divine : Temples, pretres superieurs
- Chaos : Cultistes, grimoires maudits
- Naturelle : Sorciers village, tradition orale
- Sorcellerie : Autodidacte, experimentations

**Grimoires/Parchemins** :
- Grimoires : 1d10 sorts (cout XP normal, 1 mois apprentissage)
- Parchemins : Usage unique (pas apprentissage)
- Tutelle maitre : Cout normal, 1 semaine par sort

## Restrictions

### Par carriere
- Soldat, Repurgateur : Aucune magie
- Noble : Divine acceptee, Arcanes rare
- Magicien, Pretre : Magie dans carriere (cout normal)

Voir [career-restrictions.md](career-restrictions.md).

### Par espece
- Humains : Tous domaines
- Elfes : Affinite Arcanes
- Nains : JAMAIS Arcanes, Divine uniquement
- Halflings : Divine principale

### Par region
- Empire : Colleges legaux, Divine repandue
- Bretonnie : Divine dominante, Dames Lac
- Kislev : Sorciers glaces
- Norsca : Chaos frequent

## Exemples Warhammer

**Apprenti Celestial** :
- Debut : "Magie Arcanes (Cieux)" Rang 1
- Apprend sorts Cieux CN 2-4 : 20-40 XP
- Connait 3-4 sorts debut
- Rang 2-3 : Sorts CN 6-8
- JAMAIS sorts Feu, Mort, etc.

**Pretre Sigmar** :
- Talents "Beni" + "Invocation (Sigmar)"
- Benedictions : 50 XP chacune
- Miracles Sigmar : 100 XP chacun
- Peut ajouter "Invocation (Ulric)" (sert deux dieux)

**Sorciere Village** :
- "Magie Naturelle"
- Sorts : 30 XP + composants obligatoires
- Herbes : 5 sous cuivre par incantation

**Cultiste Tzeentch** :
- "Magie Chaos (Tzeentch)" (illegal)
- Sorts Tzeentch + Indivisibles
- +1 Corruption par Imparfaite
- Risque bucher si decouvert

## Cout XP recapitulatif

| Type | Cout base | Dans carriere | Hors carriere |
|------|-----------|---------------|---------------|
| Arcanes | CN × 10 | CN × 10 | CN × 20 |
| Benediction | 50 XP | 50 XP | 100 XP |
| Miracle | 100 XP | 100 XP | 200 XP |
| Chaos | CN × 10 | N/A (illegal) | CN × 10 |
| Naturelle | 30 XP + composants | 30 XP | 60 XP |
| Mineure | 30 XP | 30 XP | 60 XP |

Voir [xp-cost.md](xp-cost.md) pour details formules.

## Regles coeur

1. **Specialisation exclusive Arcanes** : UN domaine, jamais changement
2. **Talent prerequis absolu** : Aucun apprentissage sans talent
3. **Carriere determine cout** : Dans carriere normal, hors carriere double
4. **Divine multi-dieux possible** : Talent distinct requis par dieu
5. **Composants obligatoires** : Naturelle (toujours), Sorcellerie (sinon Imparfaites)
6. **Magie Mineure universelle** : Tous lanceurs peuvent apprendre

## Relations systemes

**XP** : Cout varie CN, carriere, lore (voir xp-cost.md)
**Talents** : Prerequis absolu (voir talent-prerequisites.md)
**Carrieres** : Determinent acces et cout (voir career-restrictions.md)
**Lores** : Huit domaines imposent specialisation exclusive (voir domains.md)
**Composants** : Certains requis (voir ingredients.md)

---

**Navigation** : [domains.md](domains.md) | [xp-cost.md](xp-cost.md) | [Index Features](../README.md)

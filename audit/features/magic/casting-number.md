# Magie - CN (Casting Number)

## Vue d'ensemble

CN (Casting Number, Numero Incantation) mesure difficulte et puissance sorts. Determine modificateur test incantation et cout XP apprentissage.

**References** : [casting-tests.md](casting-tests.md), [xp-cost.md](xp-cost.md), [database/spells.md](../../database/spells.md)

## Valeurs CN

**CN 0** : Sorts mineurs (Petty Magic)
- Faciles, quasi-automatiques
- Pas modificateur test
- Exemples : "Alerte", "Choc", "Lumiere"

**CN 1-3** : Sorts faciles
- Debut apprentissage
- Modificateur test leger (-10 a -30)
- Exemples : "Arme Aethyrique" (CN 2), "Armure Aethyrique" (CN 2)

**CN 4-7** : Sorts moyens
- Confirmes, combat utiles
- Modificateur test moyen (-40 a -70)
- Exemples : "Boule Feu" (CN 5), "Forme Bete" (CN 7)

**CN 8-12** : Sorts puissants
- Magisters experimentes
- Modificateur test severe (-80 a -120)
- Exemples : "Vol" (CN 8), "Tempete Foudre" (CN 10)

**CN 13+** : Sorts legendaires
- Archi-mages, rituels
- Tres difficiles, risques eleves
- Exemples : "Dome Protection Majeur" (CN 15), Rituels anciens

## Impact test incantation

**Formule** : Langue (Magick) - (CN × 10)

**Exemples calcul** :
- Langue 50, CN 2 : Jet ≤ 30 (facile)
- Langue 50, CN 5 : Jet ≤ 0 (difficile, bonus requis)
- Langue 70, CN 8 : Jet ≤ -10 (impossible sans bonus)

**Petty (CN 0)** : Langue competence complete (pas malus)

## Impact cout XP

**Arcanes** : CN × 10 XP (dans carriere) / CN × 20 (hors)
**Chaos** : CN × 10 XP

**Exemples** :
- CN 2 : 20 XP / 40 XP
- CN 5 : 50 XP / 100 XP
- CN 8 : 80 XP / 160 XP
- CN 10 : 100 XP / 200 XP

**Divine** : Pas CN (benedictions 50 XP, miracles 100 XP fixes)

## CN par tradition

**Arcanes** : CN 0 (Petty) a 30+ (legendaires)
**Divine** : Pas CN (prieres fonctionnent differemment)
**Chaos** : CN 4 a 15+ (sorts corrompus puissants)
**Naturelle** : CN 0-3 (sorts simples folklore)
**Sorcellerie** : CN variable (melanges instables)

## Progression CN

**Apprenti** : CN 0-3 (Petty + sorts faciles)
**Journeyman** : CN 4-6 (sorts moyens utiles)
**Magister** : CN 7-10 (sorts puissants maitrise)
**Archi-mage** : CN 11+ (legendaires, rituels)

**Limite pratique** : CN 10+ rarement utilises (trop difficiles quotidien)

## Exemples sorts par CN

**CN 0 - Petty Magic** :
- "Alerte", "Choc", "Lumiere", "Ouverture", "Son"

**CN 2** :
- "Arme Aethyrique", "Armure Aethyrique" (protection base)

**CN 5** :
- "Boule Feu" (Feu), "Terreur" (Mort), "Benediction Guerriere"

**CN 7** :
- "Forme Bete" (Bete), "Illusion Majeure" (Ombres)

**CN 8** :
- "Vol" (Cieux), "Transmutation" (Metal)

**CN 10+** :
- "Tempete Foudre" (CN 10), "Dome Protection" (CN 15), Rituels anciens

## CN et attributs domaine

**Attributs domaine** : Appliques apres lancer reussi, independants CN
- Feu : +1 En flammes (tout CN)
- Cieux : Ignore PA metal (tout CN)
- Bete : Peur 1 (tout CN)

**CN determine** : Difficulte lancer, pas puissance attribut domaine

## Regles coeur

1. CN mesure difficulte et puissance sort
2. Modificateur test : -CN × 10
3. Cout XP Arcanes : CN × 10 (carriere) / CN × 20 (hors)
4. CN 0 = Petty (facile), CN 8+ = puissant (difficile)
5. Divine pas CN (systeme different)
6. CN determine apprentissage : Petty → faciles → moyens → puissants
7. Attributs domaine independants CN (appliques tout CN)

## Relations

**Casting-tests** → CN determine modificateur (casting-tests.md)
**XP-cost** → CN determine cout apprentissage (xp-cost.md)
**Spells** → Chaque sort a CN specifique (database/spells.md)
**Learning** → Progression CN avec experience (learning.md)

---

**Navigation** : [casting-tests.md](casting-tests.md) | [xp-cost.md](xp-cost.md) | [Index Features](../README.md)

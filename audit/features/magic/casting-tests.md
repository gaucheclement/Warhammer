# Magie - Tests incantation

## Vue d'ensemble

Tests incantation determinent succes/echec sorts. Basés Langue (Magick) pour Arcanes, Foi pour Divine. CN determine difficulte.

**References** : [casting-number.md](casting-number.md), [ingredients.md](ingredients.md)

## Caracteristiques tests

**Arcanes** : Intelligence + Test Langue (Magick)
**Divine** : Force Mentale + Test Priere
**Naturelle** : Force Mentale + Test Canalisation
**Sorcellerie/Chaos** : Force Mentale + Test Canalisation

## Formule difficulte

**Base** : Test Langue (Magick) ou Priere
**Modificateur CN** : -CN × 10

**Exemples** :
- Sort CN 2 : Langue (Magick) -20
- Sort CN 5 : Langue (Magick) -50
- Sort CN 8 : Langue (Magick) -80

**Petty Magic (CN 0)** : Pas modificateur, reussite quasi-automatique

## Modificateurs environnement

**Domaine Feu** : +10 si creatures En flammes proximite (max Bonus FM metres)
**Domaine Vie** : +10 milieu rural/sauvage
**Composants** : Reduisent Imparfaites si echec (pas bonus test)
**Fatigue** : Malus selon Etats Extenuer
**Distractions** : Malus combat, stress

## Resultats tests

**Reussite** :
- Sort lance avec succes
- Effets appliques
- Degres Reussite (DR) : Peuvent prolonger duree sorts "+"

**Echec** :
- Sort non lance
- Aucun effet
- Pas Corruption (sauf Chaos/Sorcellerie)

**Echec critique (Fumble)** :
- Sort non lance
- Imparfaites Mineures possibles
- Chaos/Sorcellerie : +1 Corruption

**Reussite critique** :
- Effet maximal
- Duree prolongee automatique (sorts "+")
- Aucun risque Imparfaites

## Degres Reussite (DR)

**Calcul** : (Valeur competence - Jet d\u00e9) / 10 (arrondi inferieur)

**Effets** :
- Sorts duree "+" : Chaque +2 DR ajoute duree base
- Exemple : "(Bonus FM) Rounds +" avec Bonus FM 4 et DR +4 → 4 + 4 = 8 rounds
- Degats certains sorts : Augmentes selon DR

## Tests par tradition

### Arcanes
**Competence** : Langue (Magick)
**Modificateur** : -CN × 10
**Critique** : Imparfaites possibles
**Attribut domaine** : Applique apres succes

### Divine
**Benedictions** : Pas test (automatiques)
**Miracles** : Test Priere (pas CN, difficulte fixe MJ)
**Faveur divine** : MJ peut modifier selon contexte

### Naturelle
**Competence** : Canalisation
**Composants** : OBLIGATOIRES (impossible sans)
**Modificateur** : Sorts simples (CN bas)

### Sorcellerie
**Competence** : Canalisation
**Danger** : Toujours Imparfaites Mineures sans composants
**Corruption** : +1 par Imparfaite

### Chaos
**Competence** : Canalisation
**Modificateur** : -CN × 10
**Corruption** : +1 par Imparfaite
**Tzeentch special** : Cible Test Resistance ou +1 Corruption (reussite +1 Chance)

## Exemples concrets

**Sorcier Feu lance "Boule Feu" (CN 5)** :
- Langue (Magick) 45
- Modificateur : -50 (CN 5)
- Jet requis : ≤ -5 (IMPOSSIBLE sans bonus)
- Avec +20 circonstances : Jet ≤ 15
- Reussite : Boule Feu lancee, attribut Feu applique (+1 En flammes)

**Pretre Sigmar lance benediction** :
- Pas test requis (automatique)
- Benediction appliquee immediate (+10 caracteristique cible)

**Sorciere Village lance sort naturel** :
- Composants herbes : Check (5 sous cuivre)
- Canalisation 30, CN 0
- Jet ≤ 30 (facile)
- Reussite : Sort applique

**Apprenti Celestial CN 2** :
- Langue (Magick) 35
- Modificateur : -20 (CN 2)
- Jet ≤ 15
- Reussite : Sort lance, attribut Cieux applique (ignore PA metal)

## Regles coeur

1. Test base Langue (Magick) ou Priere selon tradition
2. Modificateur -CN × 10 determine difficulte
3. Petty (CN 0) facile, automatique sauf fumble
4. Benedictions Divine automatiques (pas test)
5. Composants reduisent Imparfaites, pas bonus test
6. DR prolongent durees sorts "+"
7. Echec critique → Imparfaites + Corruption (Chaos/Sorcellerie)

## Relations

**CN** → Determine modificateur test (casting-number.md)
**Ingredients** → Reduisent Imparfaites echec (ingredients.md)
**Domains** → Modificateurs environnement (domains.md)
**Imparfaites** : Echecs critiques (non documente ici)

---

**Navigation** : [casting-number.md](casting-number.md) | [ingredients.md](ingredients.md) | [Index Features](../README.md)

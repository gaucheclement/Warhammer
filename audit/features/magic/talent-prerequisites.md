# Magie - Prerequis talents magiques

## Vue d'ensemble

Talents magiques sont prerequis absolu pour lancer sorts. Chaque tradition impose talents specifiques avec hierarchie et specialisations.

**References** : [domains.md](domains.md), [database/talents.md](../../database/talents.md)

## Talents Arcanes

**Petty Magic (Magie Mineure)** :
- Acces sorts mineurs (CN=0) universels
- Prerequis : Aucun
- Tous lanceurs peuvent apprendre
- Cout : 30 XP par sort mineur

**Arcane Magic (Domaine)** :
- Acces sorts domaine specifique (Bete, Cieux, Feu, etc.)
- Prerequis : Specialisation UN domaine obligatoire
- Exclusif : Ne peut avoir plusieurs domaines (corruption)
- Rangs : Augmentent maitrise, pas nouveaux domaines
- Cout sorts : CN × 10 (dans carriere)

**Channel (Canalisation)** :
- Bonus tests incantation
- Prerequis : Talent Arcane Magic
- Ameliore lancers, pas nouveaux sorts

## Talents Divins

**Bless (Beni)** :
- Acces benedictions universelles
- Prerequis : Aucun (foi suffit)
- Toutes benedictions disponibles (pas specialisation)
- Cout : 50 XP par benediction

**Invoke (Dieu)** :
- Acces miracles dieu specifique
- Prerequis : Specialisation dieu (Sigmar, Ulric, Manann, etc.)
- Multi-dieux possible : Talent distinct par dieu requis
- Cout : 100 XP par miracle

**Prayer** :
- Bonus tests prieres
- Prerequis : Bless ou Invoke
- Ameliore prieres, pas nouveaux miracles

## Talents proscr its

**Chaos Magic (Dieu)** :
- Acces sorts Chaos dieu + Indivisibles
- Prerequis : Corruption, culte Chaos
- ILLEGAL Empire, execution si decouvert
- Danger : +1 Corruption par Imparfaite
- Cout : CN × 10

**Witchcraft (Sorcellerie)** :
- Acces melange dangereux Vents
- Prerequis : Aucun (autodidacte)
- PROSCRIT, chassé Repurgateurs
- Danger : Toujours Imparfaites Mineures sauf composants
- +1 Corruption par Imparfaite

## Talents alternatifs

**Hedge Magic (Magie Naturelle)** :
- Acces sorts folkloriques simples
- Prerequis : Tradition rurale
- Composants OBLIGATOIRES (5 sous cuivre)
- Accepte villages, meprise Colleges
- Cout : 30 XP par sort

## Hierarchie talents

**Debutant** :
1. Petty Magic (mineurs universels)
2. Bless (benedictions) OU Hedge Magic (naturelle)

**Confirme** :
3. Arcane Magic (Domaine) avec specialisation
4. Invoke (Dieu) avec specialisation
5. Channel, Prayer (bonus)

**Avance** :
- Rangs multiples meme talent (Arcane Magic Rang 2-4)
- Pas accumulation domaines (corruption)

## Specialisation obligatoire

**Arcane** : UN domaine choisi acquisition talent, jamais change
**Divine** : UN dieu par talent Invoke, peut avoir plusieurs talents Invoke (multi-dieux)
**Chaos** : UN dieu Chaos, changer = perdre sorts ancien

**Exemples** :
- "Arcane Magic (Feu)" → Sorts Feu uniquement, JAMAIS Bete/Cieux/etc.
- "Invoke (Sigmar)" → Miracles Sigmar, peut ajouter "Invoke (Ulric)" separement

## Prerequis acquisition

**Arcanes** : Formation College Imperial (Altdorf) ou maitre prive
**Divines** : Ordination temple, service dieu
**Chaos** : Corruption, culte secret (illegal)
**Naturelle** : Apprentissage rural, tradition orale

## Exemples concrets

**Apprenti Sorcier Celestial** :
- Acquiert "Petty Magic" → Sorts mineurs (Alerte, Choc, etc.)
- Acquiert "Arcane Magic (Cieux)" → Sorts Cieux (Destine, Eclair, etc.)
- NE PEUT PAS acquerir "Arcane Magic (Feu)" (corruption si melange)

**Initie Sigmar** :
- Acquiert "Bless" → Toutes benedictions universelles
- Acquiert "Invoke (Sigmar)" → Miracles Sigmar
- Peut acquerir "Invoke (Ulric)" plus tard (sert deux dieux)

**Sorciere Village** :
- Acquiert "Hedge Magic" → Sorts naturels simples
- Composants OBLIGATOIRES chaque incantation

**Cultiste Tzeentch** :
- Acquiert "Chaos Magic (Tzeentch)" (illegal)
- Sorts Tzeentch + Indivisibles
- +1 Corruption par Imparfaite, risque bucher

## Regles coeur

1. Talent prerequis absolu : Aucun sort sans talent approprie
2. Specialisation Arcanes exclusive : UN domaine, jamais change
3. Divine multi-dieux possible : Talent distinct requis par dieu
4. Rangs augmentent maitrise : Pas acces nouveaux domaines
5. Petty Magic universelle : Tous lanceurs peuvent avoir
6. Composants selon talent : Hedge Magic toujours, Witchcraft sinon Imparfaites

## Relations

**Domains** → Specialisation exclusive Arcanes (domains.md)
**Spells** → Type sort determine talent requis (database/spells.md)
**Learning** → Talent determine apprentissage (learning.md)
**Careers** → Acces talent selon carriere (career-restrictions.md)

---

**Navigation** : [domains.md](domains.md) | [learning.md](learning.md) | [Index Features](../README.md)

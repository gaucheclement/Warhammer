# Character Model - État Aléatoire

## Objectif

Gestion état aléatoire pour reproductibilité tirages wizard.

## Contexte Warhammer

Tirages aléatoires wizard :
- Espèce (si option activée)
- Carrière (d100 selon table espèce)
- Signe astral (d100)
- Caractéristiques (2d10 chacune, bonus +0 à +20)
- Talents (ex: Humains "3 Talents aléatoires")

## Besoins reproductibilité

Rejouer personnage identique : Mêmes paramètres → mêmes résultats.

Annulation : Retour arrière sans perdre tirages.

Débogage : Reproduire personnage problématique.

## Conservation état

### Seeds

Nombres entiers initialisant générateur aléatoire.

Même seed → même séquence (déterministe).

### Impositions

Valeurs forcées ou historique tirages.

Permet forcer valeurs spécifiques ou éviter doublons.

## Composants

**Seed espèce** : Tirage espèce aléatoire.

**Impositions espèce** : Liste espèces forcées/exclues.

**Seed carrière** : Tirage carrière selon table espèce.

**Impositions carrières** : Carrières forcées/exclues.

**Seed signe** : Tirage signe (d100).

**Impositions signe** : Signe forcé.

**Seed caractéristiques** : Tirage bonus toutes caractéristiques.

**Impositions caractéristiques** : Valeurs forcées par caractéristique.

**Impositions talents** : Talents forcés/déjà tirés (évite doublons).

## Reproductibilité

Même état complet → même personnage exact.

Changer seed spécifique → résultat différent ce composant uniquement.

Exemple : Changer seed caractéristiques → nouveaux bonus, espèce/carrière/signe identiques.

## Sauvegarde et restauration

État complet inclus dans sauvegarde personnage.

Avantages :
- Reprendre wizard où arrêté
- Rejouer mêmes tirages si retour arrière
- Dupliquer puis modifier seed pour variantes

## Validation

Seeds : Entiers ≥ 0.

Impositions espèce : IDs valides table Species.

Impositions carrières : IDs valides tables Careers.

Impositions caractéristiques : Valeurs 0-20.

Impositions talents : IDs valides table Talents.

Validation souple (états debug acceptés).

## Voir aussi

- [../../patterns/pattern-generation-aleatoire.md](../../patterns/pattern-generation-aleatoire.md)

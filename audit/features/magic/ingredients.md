# Magie - Ingredients sorts

## Vue d'ensemble

Ingredients magiques (composants) requis ou optionnels selon domaine. Reduisent Imparfaites Mineures, parfois obligatoires.

**References** : [domains.md](domains.md), [database/spells.md](../../database/spells.md)

## Composants par domaine

### Arcanes (Huit Vents) - OPTIONNELS
**Effet** : Reduisent risque Imparfaites Mineures
**Cout** : NI pistoles argent par incantation
**Composants typiques** :
- Bete : Fourrure, os, organes animaux
- Cieux : Instruments astronomiques, visceres
- Feu : Materiaux inflammables, ignifuges
- Lumiere : Artefacts sacres, cristaux
- Metal : Metaux lourds, outils forge
- Mort : Os, symboles mortalite
- Ombres : Objets dissimulation
- Vie : Plantes vivantes, elements naturels

### Naturelle - OBLIGATOIRES
**Effet** : Aucun sort sans composants
**Cout** : 5 sous cuivre OU DR+1 Herboristerie
**Composants** : Herbes preparees strictement (recipes traditionnelles)
**Preparation** : 1 heure preparation + connaissances herboristerie

### Sorcellerie - OBLIGATOIRES (sauf acceptation Imparfaites)
**Effet** : Sans composants → Toujours Imparfaites Mineures
**Cout** : NI sous cuivre (sacrifices animaux vivants)
**Composants** : Animaux sacrifies rituellement
**Danger** : +1 Corruption par sort Imparfait lance

### Divine - Aucun
**Benedictions** : Foi suffit, pas composants materiels
**Miracles** : Pouvoir divin direct, pas ingredients
**Symboles** : Symboles saints optionnels (roleplay, pas mecanique)

### Chaos - OPTIONNELS
**Effet** : Reduisent Imparfaites
**Cout** : NI pistoles argent
**Composants** : Substances corrompues, victimes sacrifice (interdit)

## Mecaniques ingredients

**Avec composants** :
- Test Incantation normal
- Si echec : Pas Imparfaites Mineures automatiques (sauf Sorcellerie)
- Composants consommes chaque incantation

**Sans composants** :
- Arcanes/Chaos : Test normal mais risque Imparfaites si echec critique
- Naturelle : IMPOSSIBLE lancer
- Sorcellerie : Toujours Imparfaites Mineures

## Disponibilite ingredients

**Urbain** : Boutiques alchimie, herboristerie
- Arcanes/Chaos : NI pistoles (cher)
- Naturelle : 5 sous cuivre (accessible)

**Rural** : Cueillette, preparation
- Naturelle : DR+1 Herboristerie (gratuit mais temps)
- Arcanes : Difficile trouver (MJ)

**Illegal** : Marche noir
- Sorcellerie : Animaux vivants (suspect)
- Chaos : Substances proscrites (execution si decouvert)

## Exemples concrets

**Magister Feu lance "Boule Feu" (CN 5)** :
- Sans composants : Test normal, risque Imparfaite si echec critique
- Avec compos ants (huile, charbon, 4 pistoles) : Echec critique reduit Imparfaite

**Sorciere Village lance sort naturel** :
- DOIT avoir herbes preparees (5 sous cuivre)
- Sans herbes : IMPOSSIBLE lancer
- Preparation : 1h cueillette + DR Herboristerie

**Sorciere melange Vents** :
- Sans sacrifice animal : TOUJOURS Imparfaites Mineures
- Avec sacrifice (3 sous cuivre, animal vivant) : Test normal
- +1 Corruption par Imparfaite quand meme

**Pretre Sigmar lance benediction** :
- Aucun composant requis (foi suffit)
- Symbole Sigmar optionnel (marteau) roleplay

## Couts recapitulatif

| Domaine | Obligatoire | Cout | Effet |
|---------|-------------|------|-------|
| Arcanes Couleurs | Non | NI pistoles | Reduit Imparfaites |
| Naturelle | OUI | 5 sous OU DR+1 | Requis lancer |
| Sorcellerie | OUI (sinon penalite) | NI sous | Evite Imparfaites auto |
| Divine | Non | N/A | Foi suffit |
| Chaos | Non | NI pistoles | Reduit Imparfaites |

## Regles coeur

1. Naturelle composants OBLIGATOIRES : Impossible lancer sans
2. Sorcellerie sans composants : Toujours Imparfaites Mineures
3. Arcanes/Chaos optionnels : Reduisent risque Imparfaites
4. Divine aucun : Foi suffit
5. Composants consommes : Chaque incantation
6. Cout varie domaine : NI pistoles (Arcanes/Chaos) vs 5 sous (Naturelle)

## Relations

**Domains** → Composants selon domaine (domains.md)
**Learning** → Cout apprentissage + composants (learning.md)
**Casting-tests** → Impact tests incantation (casting-tests.md)
**Imparfaites** : Composants reduisent (non documente ici)

---

**Navigation** : [domains.md](domains.md) | [casting-tests.md](casting-tests.md) | [Index Features](../README.md)

# Character - Édition personnage

## Vue d'ensemble

Modification tous aspects personnage après création : caractéristiques, compétences, talents, sorts, équipement, détails, progression.

## Caractéristiques

Valeur base = espèce + jet + bonus talent + bonus étoile.

Avances totales = advance + career + avances temporaires.

Valeur finale = base + avances totales.

Bonus = floor(valeur finale / 10).

Édition inline : jet, advance, avances temporaires.

Recalcul auto : bonus, valeurs dérivées (PdB, Corruption, Chance, Détermination), compétences liées.

## Compétences

Valeur base = caractéristique associée totale.

Avances totales = specie + career + advance + avances temporaires.

Types : Base (auto) et Avancées (acquises).

Spécialisations = instances séparées.

Coût XP : Niveau actuel/cible et carrière (×1 en, ×2 hors).

## Talents

Base = 0, Avances totales = advance + roll + avances temporaires.

Specs = instances séparées.

Maximum : numérique, "Aucun" (illimité), "Bonus de X" (limité bonus carac).

Effets : addCharacteristic (+5/rang), addSkill (compétence), addMagic (lore), addTalent (talent secondaire).

Application : `applyTalent()` après chaque modif.

## Sorts

Pas avances/rangs, connaissance binaire.

Pré-requis : Talent magique.

Filtre par lore.

Cas spécial : "Béni (Dieu)" ajoute auto toutes bénédictions.

## Équipement

Structure : Nom, Quantité, État (porté/équipé/rangé/stocké), Encombrement, Catégorie.

Ajout : Carrière ou manuel.

Encombrement : Total = Σ (enc × quantité), Limite = BF × 10.

## Détails personnels

Champs : Nom, Âge, Sexe, Taille, Yeux, Cheveux, Signes, Ambitions, Lieu naissance, Classe, Famille, Histoire.

Modification : Texte libre sans validation stricte.

Dieu : Via talent "Béni" ou "Invocation".

Étoile : `setStar()` change signe, recalcul auto.

## Progression carrière

4 niveaux/carrière.

Passage niveau : Conditions avances min → récupérer niveau suivant → application auto avantages.

Changement carrière : Sélection nouvelle → niveau 1 → application avantages, avances conservées, coût XP change (×1/×2).

Pré-requis carrières avancées : Niveau min, carac min, talent/compétence requis.

## Validation

Types : Structurelle (valeurs positives, avances valides), Métier (XP disponible, pré-requis, limites max), Cohérence (dérivées, sorts/compétences liés talents).

XP disponible = xp.max - xp.used, Si < 0 → Erreur blocage.

Limites talents : total ≤ maximum, Si dépassé → Erreur blocage.

Recalculs auto : `applyTalent()`, `deleteEmpty()`, dérivées.

## Historique XP

Structure : max (gagné), used (dépensé), XP temporaire (modifs temporaires), log (historique).

XP disponible = max - used.

Log : ID unique + valeur (positif = gain, négatif = dépense).

Workflow : Modif avances temporaires → Calcul coût → Validation `saveAdvance()` → Transfert permanent → Réinit temporaires.

## Origines

Tableau `origins` : IDs carrière/espèce/"talent".

Format "|" : "vagabond_1|base".

Traçabilité sources multiples.

## Voir aussi

- [character-sheet.md](./character-sheet.md)
- [../character-model/](../character-model/)
- [../../business-rules/](../../business-rules/)

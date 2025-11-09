# Character Edit - Modification de personnage

## Vue d'ensemble

L'édition de personnage permet de modifier tous les aspects après création : caractéristiques, compétences, talents, sorts, équipement, détails, et progression de carrière. Toutes modifications respectent les règles Warhammer 4e et maintiennent la cohérence globale.

## Caractéristiques

### Calculs

Valeur base = espèce + jet + bonus talent + bonus étoile
Avances totales = advance + career + tmpadvance
Valeur finale = base + avances totales
Bonus = floor(valeur finale / 10)

### Modification

Édition inline (jet, advance, tmpadvance). Autres valeurs calculées automatiquement. Recalcul auto : bonus caractéristique, valeurs dérivées (PdB, Corruption, Chance, Détermination), compétences liées.

### Valeurs dérivées

PdB : Selon formule espèce (Humain: BF + 2×BE + BFM)
Corruption : BE + BFM
Chance : Valeur totale Destin
Détermination : Valeur totale Résilience

## Compétences

### Calculs

Valeur base = caractéristique associée totale
Avances totales = specie + career + advance + tmpadvance
Valeur finale = base + avances totales

### Gestion

Types : Base (auto) et Avancées (acquises). Spécialisations = instances séparées. `searchSkill()` déduplique. `deleteEmpty()` nettoie sans avances. Trois formats spec : fixes (liste définie), "Au choix" (libre), sans spec (générique).

Coût XP : Dépend niveau actuel/cible et carrière (x1 en carrière, x2 hors). `saveAdvance()` calcule, applique, log, maj xp.used.

## Talents

### Calculs

Base = 0
Avances totales = advance + roll + tmpadvance
Total = avances totales

### Gestion

`searchTalent()` déduplique (ID + spec). Specs = instances séparées. Talents auto via `addTalent`. `deleteEmpty()` supprime sans avances.

Maximum : numérique (2, 3, 4), "Aucun" (illimité), "Bonus de X" (limité bonus caractéristique). `getMax()` calcule limite.

### Effets talents

addCharacteristic : +5/rang (caractéristiques) ou +1 (Mouvement/Chance/Détermination/Corruption) ou BE (PdB)
addSkill : Ajoute compétence (spec talent → spec compétence)
addMagic : Débloque lore (Sorcellerie, Magie Mineure, Béni, Invocation)
addTalent : Ajoute talent secondaire

### Application

`applyTalent()` après chaque modif : réinitialise bonus caractéristiques, parcourt talents actifs, applique effets, nettoie sorts/compétences non couverts.

## Sorts

### Structure

Pas d'avances/rangs. Connaissance binaire. Label : "Nom (Spec)" pour Magie Arcanes, "Nom" sinon.

### Gestion

Pré-requis : Talent magique. `searchSpell()` déduplique. Filtre par lore. `applyTalent()` retire sorts sans talent actif.

Cas spécial : "Béni (Dieu)" ajoute auto toutes bénédictions via `CharGen.allGods[Helper.toId(spec)].getSpells()`. Retrait si talent perdu.

## Équipement

### Structure

Tableau `trappings` : Nom, Quantité, État (porté/équipé/rangé/stocké), Encombrement, Catégorie.

### Gestion

Ajout : Trappings carrière ou manuel. Suppression : retrait ou décrémentation. Quantités : incr/décr pour consommables. États : Porté, Équipé, Rangé, Stocké.

### Encombrement

Total = Σ (encombrement × quantité) pour portés/équipés
Limite = Bonus Force × 10
Impact : Léger (normal), Moyen (réduit), Lourd (très réduit), Surchargé (impossible)

Catégories : Armes mêlée/distance, Armures, Boucliers, Munitions, Vêtements, Outils, Provisions, Divers.

## Détails personnels

### Champs

Nom, Âge, Sexe, Taille, Couleur yeux/cheveux, Signes distinctifs, Ambitions court/long terme, Lieu naissance, Classe sociale, Famille, Histoire.

### Modification

Texte libre sans validation stricte (impact narratif). Cohérence suggérée espèce/carrière (non imposée).

Dieu : Via talent "Béni" ou "Invocation". Changement auto.
Étoile : `setStar()` change signe, recalcul auto bonus.

## Progression carrière

### Structure

Objet `careerLevel` : id, data, méthodes (getLabel, getCareer, getCharacteristics, getTalents, getSkills). 4 niveaux/carrière.

### Passage niveau supérieur

Conditions : avances min, conditions narratives. Processus : récupérer niveau suivant → `setCareerLevel()` → application auto avantages (carac/talents/compétences avec origins enrichies).

### Changement carrière

Sélection nouvelle → niveau entrée → `setCareerLevel()` → application avantages. Avances conservées, coût XP change (x1 en, x2 hors carrière).

Pré-requis carrières avancées : niveau min, carac min, talent/compétence requis. Blocage strict ou avertissement.

## Validation modifications

### Types

Structurelle : Valeurs positives, avances valides, existence référentiels.
Métier : XP disponible, pré-requis talents, limites max, sorts accessibles, encombrement.
Cohérence : Carac dérivées, compétences/sorts liés talents, origines valides.

### Validation XP

XP disponible = xp.max - xp.used
XP après modifs = disponible - tmp_used
Si < 0 → Erreur + blocage.

### Limites talents

talent.getTotal() ≤ talent.getMax(). Si dépassé → Erreur + blocage. Limite dynamique "Bonus de X" récupère bonus carac.

### Erreurs

Critiques (bloquantes) : XP négatif, talent > max, pré-requis manquant, sorts sans talent.
Avertissements (non bloquants) : Encombrement élevé, avances déséquilibrées, carrière incohérente.

### Cohérence globale

Recalculs auto : `applyTalent()` (sync talents/sorts/compétences/bonus), `deleteEmpty()` (supprime vides), dérivées (PdB/Corruption/Chance/Détermination). Vérification origins (références valides, pas d'orphelines).

## Historique XP

### Structure

Objet `xp` : max (total gagné), used (total dépensé), tmp_used (modifs temporaires), log (historique).

XP disponible = max - used
XP restant après validation = max - (used + tmp_used)

### Log

Entrées : ID unique + valeur (positif = gain, négatif = dépense). Préfixe numérique assure ordre chronologique.
Exemple : `{"Session 15/03": 100, "0_Carac: CC 10 => 15": -50}`

### Ajout

`addXP(id, value, uniqueId)` : value > 0 augmente max, < 0 augmente used. uniqueId = true empêche doublons. Ajouts auto lors `saveAdvance()` : Type + Nom + Progression + Coût.

### Annulation

Manuel : suppression log + ajustement used + réinit avances. Pas d'auto.

Statistiques : Totaux (gagné/dépensé/disponible), répartition (par type, par période).

## Workflow modifications temporaires

1. Modif avances → tmpadvance
2. Calcul coût → tmp_used
3. Affichage : "Coûtera X XP"
4. Validation `saveAdvance()` : calcul coût (`Helper.getXPCost() × multiplicateur`), ajout log, transfert (advance += tmpadvance), réinit (tmpadvance = 0, tmp_used = 0)

## Origines et traçabilité

Tableau `origins` : IDs carrière/espèce/"talent". Accumulation si multiples sources. Format "|" : "vagabond_1|base" (carrière + métadonnées). `hasOrigin()` gère split. `getSymbol()` affiche icône niveau carrière source.

## Relations composants

Caractéristiques ↔ Compétences (base), Talents (bonus), Espèce (base), Étoile (bonus), Carrière (avances)
Talents → Caractéristiques (bonus), Compétences (ajout), Sorts (lores), Talents secondaires
Sorts ← Talents magiques, Dieux (bénédictions/miracles)
Équipement ← Carrière (départ), Caractéristiques (limite encombrement)
XP ← Caractéristiques/Compétences/Talents (dépenses), Validation (disponibilité)
Carrière → Caractéristiques/Compétences/Talents (débloquage + coût), XP (multiplicateur)

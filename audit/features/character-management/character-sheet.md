# Character - Feuille personnage

## Vue d'ensemble

Affichage toutes informations personnage dans StepResume : 5 onglets (Perso, Compétences/Talents, Sorts, Possession, Expérience).

## Section Identité

15 champs onglet Perso : Nom, Race, Classe, Carrière, Niveau, Schéma Carrière, Statut, Signe, Âge, Taille, Cheveux, Yeux, Dieu, Ambitions, Motivations.

Chaque champ cliquable ouvre popup contextuelle.

## Caractéristiques

### Rollables

10 caractéristiques : CC, CT, F, E, I, Ag, Dex, Int, FM, Soc.

Colonnes : Label, Symbole, Init (Base), Aug (Avances, vide si 0), Cour (Total).

Bonus = total / 10 arrondi bas.

Clic → popup description + compétences carrière liées.

### Dérivées

4 groupes : Destin (Destin, Chance), Résilience (Résilience, Détermination, Dieu), Mouvement (Mvt, Marche, Course), Autre (PB, Corruption).

## Compétences

Panneau gauche : Base (auto-ajout manquantes).

Panneau droit : Groupées et avancées.

Tableau : Nom, Carac, Aug (vide si 0), Comp (total).

Base = characteristic.total, Avances = advance + specie + career + temporaires, Total = base + avances.

Tri alphabétique, clic → popup.

## Talents et Sorts

### Talents

Filtre getAdvance() > 0.

Tableau : Nom, Rang (actuel/maximum), Description.

Types max : 1 (unique), fixe (2/4), formule (3/BA), illimité.

### Sorts

5 catégories conditionnelles : Béni, Invocation, Magie mineure, Magie Arcanes, Magie Chaos.

Tableau : Nom, NI, Portée, Cible, Durée, Effet.

Synchronisation talents ↔ sorts automatique via `applyTalent()`.

## Équipement

Panneau gauche : Possessions (NOT Armures/Armes/Munitions).

Panneau droit : Armures (tableau Nom, Localisation, Enc, PA, Qualités) et Armes (tableau Nom, Groupe, Enc, Portée/Allonge, Dégâts, Qualités).

Encombrement : Total = somme enc, Limite BF×10.

## Export PDF

Contenu : Identité, Caractéristiques, Compétences, Talents, Sorts (optionnel), Équipement, Historique XP (optionnel).

Format : A4 portrait, 3-4 pages, 10-12pt, N&B.

Nom fichier : `[Nom]_[Carrière]_[Date].pdf`.

## Mise à jour temps réel

Wizard : Snapshot clone() au chargement, pas MAJ temps réel.

Post-création : Clone + avances temporaires, recalculs auto, affichage immédiat.

Recalculs : `applyTalent()`, dérivés, compétences (base = carac), talents (max dynamique).

## Voir aussi

- [character-edit.md](./character-edit.md)
- [../character-model/](../character-model/)
- [../../database/](../../database/)

# Character Sheet - Feuille de Personnage

## Vue d'ensemble

La feuille de personnage affiche toutes les informations du personnage dans l'écran StepResume avec 5 onglets : Perso, Compétences/Talents, Sorts, Possession, Expérience. Elle permet la consultation rapide des valeurs en jeu et l'interaction pour aide contextuelle.

**Objectif** : Référence complète du personnage jouable.

**Source** : Modèle Character + tables de référence.

## Section Identité

15 champs panneau gauche onglet Perso, format label en gras : valeur. **Obligatoires** : Nom, Race, Classe, Carrière, Niveau Carrière, Statut. **Optionnels** : Signe Astrologique, Âge, Taille, Cheveux, Yeux, Dieu Patron, Ambitions, Motivations. Doublons V1 : Schéma de Carrière = Niveau de Carrière (dupliqué).

Chaque champ cliquable ouvre popup contextuelle. Gestion nulls : affiche chaîne vide. Exemple : Gunther von Hortmann | Humain | Wymund l'Anachorète | Citadins | Agitateur | Démagogue | Bronze 3 | 25 ans | 5 pieds 8 pouces | Blonds | Bleus | Sigmar | Renverser le système | Justice sociale

## Caractéristiques et Compétences

### Caractéristiques Rollables (En-Tête Feuille)

10 caractéristiques type 'roll' en tableau : CC, CT, F, E, I, Ag, Dex, Int, FM, Soc. Colonnes : Label (abréviation), Symbole (icône niveau carrière si dans plan), Init (Base = Espèce + Roll + Talent + Star), Aug (Avances = Advance + Career + TmpAdvance, vide si 0), Cour (Total = Init + Aug). Clic → popup description + compétences carrière liées. Bonus = total / 10 arrondi bas.

### Caractéristiques Dérivées (Panneau Droit Onglet Perso)

4 groupes : **Destin** (Destin, Chance = Destin), **Résilience** (Résilience, Détermination = Résilience, Dieu Patron), **Mouvement** (Mouvement, Marche Mvt×2, Course Mvt×4), **Autre** (Points Blessures = (BE×2)+BFM + modificateurs espèce/talents, Corruption BE+BFM).

### Compétences (Onglet Compétences/Talents)

Panneau gauche : base (type 'base' ET spec vide/'Base'), auto-ajout manquantes. Panneau droit : groupées et avancées. Tableau : Nom (label + spécialisation + symbole carrière), Carac (abréviation + valeur base), Aug (avances, vide si 0), Comp (total). Calculs : Base = characteristic.getTotal(), Avances = advance + specie + career + tmpadvance, Total = base + avances. Tri alphabétique, clic → popup.

**Symbole Niveau Carrière** : Icône si élément dans plan carrière niveau 4, cherche allByCareer[careerID][4], récupère origin[0], affiche icône selon careerLevel (1-4). Ex : Corps à corps niveau 1 → Icône Bronze 1.

## Talents et Sorts

### Talents (Onglet Compétences/Talents - Suite Panneau Droit)

Après compétences, filtre getAdvance() > 0. Tableau : Nom (label + spécialisation + symbole carrière), Rang (actuel/maximum ex: 1, 2/BA, 3/4, 5), Description (effet court). Types max : 1 (unique), fixe (2/4), formule dynamique (3/BA = Bonus Agilité), illimité (rang seul). Formules : BA (Bonus Agilité), BF, BFM, BE. Tri alphabétique, clic → popup.

### Sorts (Onglet Sorts)

5 catégories conditionnelles selon talents. En-tête : Dieu Patron (si Béni/Invocation, clic → popup dieu), Domaine Magie Arcane (si Magie Arcanes, clic → popup lore), Domaine Chaos (si Magie Chaos, clic → popup).

Catégories : 1) Béni (bénédictions depuis god.getSpells()), 2) Invocation (miracles depuis god.getSpells()), 3) Magie mineure (si Petite Magie, tous sorts mineurs), 4) Magie des Arcanes (sorts filtrés subType = domaine), 5) Magie du Chaos (sorts filtrés subType = domaine Chaos).

Tableau 2 colonnes : Nom (label + spécialisation), NI (Niveau Incantation), Portée (Personnelle/X mètres/Toucher), Cible (Lanceur/1 allié/Zone), Durée (Instantané/X rounds/Permanent), Effet (description courte, colonne 80%). Clic → popup.

### Gestion Talents Magiques (applyTalent)

Synchronisation talents ↔ sorts automatique. Parcourt talents getTotal() > 0, si addMagic présent → Ajoute sorts. Si talent supprimé → Retire sorts. Types addMagic : Béni (blessings dieu), Invocation (miracles), Petite Magie (mineurs), Magie Arcanes (domaine), Magie Chaos (domaine Chaos). Ex : Béni (Sigmar) → +6 bénédictions, perte Magie Arcanes (Ghur) → -sorts Ghur.

## Équipement

### Onglet Possession

Panneau gauche : Possessions (liste verticale, filtre NOT Armures/Armes/Munitions, ex : Sac à dos, Corde 10m, Rations 1 semaine). Panneau droit : Armures (tableau Nom, Localisation Tête/Bras/Corps/Jambes/Toutes, Encombrement, PA, Qualités) et Armes (tableau Nom, Groupe 11 types, Encombrement, Portée/Allonge Courte/Moyenne/Longue/mètres, Dégâts BF+X/fixe, Qualités).

Stockage : trappings[] = strings avec quantités entre parenthèses, lookup via Helper.searchTrapping(label). Clic → popup si desc présent avec stats complètes.

**Encombrement** : Total = somme enc, Limite BF×10. Seuils : 0-BF×10 (Normal), BF×10+1 à BF×20 (Surchargé malus Mvt), >BF×20 (Immobilisé).

**Qualités** : 32 qualités (database/qualities.md). Armes atouts (Défensive, Empaleuse, Précise) / défauts (Encombrante X, Fragile, Lente recharger). Armures atouts (Flexible, Impénétrable) / défauts (Encombrante X, Bruyante).

## Export et Impression

### État V1 : Non Implémenté

Aucun export PDF, aucune règle CSS @media print. Ctrl+P impression standard conserve navigation/onglets, tableaux coupés, format peu lisible. Code commenté : Export Foundry VTT JSON (FoundryHelper.fullExport() → Blob JSON → [nom].json), non fonctionnel V1. Alternative : copier/coller manuel ou capture écran.

### Fonctionnalités Prévues

Export PDF : Bouton onglet Résumé, options nom ([Nom].pdf), format (A4 portrait/paysage), sections (toutes/sélection), technologies jsPDF + html2canvas / service serveur. CSS Print : masquer navigation/onglets/popups, marges 1cm, police 10-12pt, noir et blanc, sauts page intelligents. Mise en page : P1 (Identité + Caractéristiques + Dérivées), P2 (Compétences + Talents), P3 (Équipement + Sorts), total 3-4 pages A4.

Contenu obligatoire : Identité, Caractéristiques (10 + dérivées), Compétences (advances > 0), Talents (rang > 0). Optionnel : Sorts (si magique), Équipement, Historique XP. Format fichier : [Nom].pdf ou [Carrière]_[Nom]_[Date].pdf, métadonnées (Titre, Auteur Warhammer CharGen, Sujet Feuille WJRF).

## Mise à Jour Temps Réel

### Principe Général

Mode Wizard : Chaque step modifie character model, StepResume affiche snapshot character.clone() au chargement. Modifications steps ne mettent PAS à jour StepResume en temps réel (limitation V1), retour StepResume → Recharge clone → Affiche nouvelles valeurs.

Mode Post-Création : character = clone au chargement, modifications tmpadvance (avances temporaires) sur clone, recalculs automatiques, affichage immédiat. Validation → tmpadvance en advance permanent + refresh.

### Recalculs Automatiques

**applyTalent()** : Déclencheur chaque modification talents. Actions : Reset modificateurs (characteristic[].talent = 0), parcours actifs (getTotal() > 0) avec addMagic (ajoute/retire sorts), addCharacteristic (modificateurs +5/+1/+BE), addSkill (compétences talents), nettoyage orphelins. Impact : caractéristiques, sorts, compétences recalculés.

**Dérivés** : Déclencheurs modification caractéristiques/talents. Recalculs auto : Points Blessures ((BE×2)+BFM + modificateurs), Mouvement (base + talents, dérivés Marche Mvt×2, Course Mvt×4), Destin/Chance (Chance = Destin), Résilience/Détermination (similaire), Corruption (BE+BFM).

**Compétences** : Base = characteristic.getTotal() (lien dynamique), modification caractéristique → Recalcul auto. Ex : Ag 35→40 → Athlétisme 40+5=45. Avances tmpadvance → getTotal() recalculé immédiat.

**Talents** : Rangs tmpadvance → getTotal() recalculé. Max dynamique : Si formule (Bonus Agilité) → Recalcul si caractéristique modifiée. Ex : Chanceux max BA, Ag 35 (BA 3) max 3, Ag 40 (BA 4) max 4.

### Réactivité Interface

Modifications StepResume post-création : boutons +/- XP → tmpadvance immédiate, tableaux rafraîchis instantanément, encombrement recalculé. Pas délai, pas bouton "Recalculer". Performances fluides (JavaScript pur, pas appels serveur).

Validation : character.stepIndex = -1 → Clone sauvegardé. saveAdvance() → tmpadvance en advance + Log XP + Refresh → character.refresh() + CharGen.saveCharacter().

Limitations V1 : Cross-Steps (changements steps ne mettent PAS à jour Resume ouvert, retour menu pour voir changements), pas Watchers (recalculs manuels simple mais redondant).

Exemples : Ag++ 35→40 (BA 3→4) → Athlétisme 40, Chanceux max 4 | +Intelligent → Int.talent+5 → Compétences Int recalculées | +Magie Arcanes (Ghur) → Sorts Ghur ajoutés spells[].

## Voir Aussi

- **database/species.md, stars.md, careers.md, careerLevels.md, classes.md, details.md, characteristics.md, skills.md, talents.md, spells.md, gods.md, lores.md, trappings.md, qualities.md** : Tables de référence
- **character-model/identity.md, characteristics.md, skills.md, talents.md, spells.md, trappings.md** : Stockage modèle
- **wizard/species-selection.md, star-selection.md, career-selection.md, detail-*.md, characteristics-base.md, skills-values.md, talents-*.md, trappings-categories.md, resume-display.md, resume-derived.md, resume-export.md, resume-save.md, resume-validation.md** : Processus wizard
- **business-rules/skills-avances-progression.md, application-effets-talents.md, talents-ajout-skills-magie.md, filtrage-spells-lore.md, calcul-encombrement.md, categorisation-trappings.md, prix-disponibilite-trappings.md** : Règles métier
- **character-edit.md** : Édition post-création
- **save-load/sheets-load.md** : Chargement personnages

# Magic - Système magie

## Vue d'ensemble

Système magie complet : domaines (lores), sorts, talents magiques, incantation, acquisition.

## Domaines magie

### Magie Arcane

8 domaines (lores) : Fire, Beasts, Death, Heavens, Life, Light, Metal, Shadow.

Accès : Talent "Magie Arcanes (Domaine)".

Sorts : Sorts filtrés par subType = domaine.

### Magie Divine

Béni : Talent "Béni (Dieu)" → 6 bénédictions dieu.

Invocation : Talent "Invocation (Dieu)" → miracles dieu.

Sorts : Récupérés via `god.getSpells()`.

### Magie Mineure

Accès : Talent "Magie Mineure".

Sorts : Tous sorts type "petty".

### Magie Chaos

Domaines : Nurgle, Slaanesh, Tzeentch, Khorne.

Accès : Talents Chaos.

Corruption : Accumulation automatique usage.

## Talents magiques

Types : Sens de la magie (pré-requis), Magie Arcanes (domaine), Béni (dieu), Invocation (dieu), Magie Mineure, talents Chaos.

Effets : addMagic ajoute sorts automatiquement.

Application : `applyTalent()` synchronise talents ↔ sorts.

## Sorts

Structure : label, type (spell/petty), lore (domaine), CN (Niveau Incantation), range, target, duration, ingredients, desc.

Accès : Conditionnel présence talent magique.

Filtrage : Par lore, par type, par CN.

## Incantation

Principe : Test Langue Magick (Domaine), difficulté = CN.

Modificateurs : Ingrédients (-CN), circonstances, fatigue.

Échec : Malfonctionnement possible selon degré échec.

CN : 0-30+ selon puissance sort.

## Acquisition sorts

Création : Sorts auto via talents magiques.

Post-création : Acquisition nouveaux sorts (apprentissage, trouvaille grimoires, enseignement).

Coût XP : Selon formule magie. Voir [../../business-rules/calculs-xp-progression.md](../../business-rules/calculs-xp-progression.md).

Restrictions : Domaine accessible (talent présent), niveau approprié personnage.

## Listes sorts

Organisation : Par lore, par CN, alphabétique.

Affichage : Nom, CN, Portée, Cible, Durée, Effet.

Recherche : Filtre lore, filtre CN, recherche texte.

## Validation

Pré-requis : Talent magique actif correspondant.

Cohérence : Sort.lore = talent.lore, pas doublons.

Synchronisation : Perte talent → retrait sorts automatique.

## Voir aussi

- [../../database/spells.md](../../database/spells.md)
- [../../database/lores.md](../../database/lores.md)
- [../../database/gods.md](../../database/gods.md)
- [../../database/talents.md](../../database/talents.md)
- [../../business-rules/talents-effets-mecanismes.md](../../business-rules/talents-effets-mecanismes.md)

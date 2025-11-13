# Character Model - Validation

## Objectif

Règles validation cohérence personnage : pré-requis, limites, contraintes Warhammer.

## Processus

Vérification cohérence globale : valide (oui/non) + liste problèmes + actions correctives.

Déclenchement : Avant finalisation wizard, avant sauvegarde, à la demande.

## Validations structurelles

**Mode** : "guidé" ou "libre".

**Espèce** : Obligatoire dès étape 1.

**Carrière** : Obligatoire dès étape carrière. Format : carrière + niveau (1-4).

**Caractéristiques** : Exactement 15 (10 principales + 5 dérivées). IDs requis : CC, CT, F, E, I, Ag, Dex, Int, FM, Soc, Mvt, PB, Chance, Détermination, Corruption. Valeur totale ≥ 0. Origines valides.

## Validations métier

**Compétences** : Spécialisation obligatoire si "Au choix". Avances ≥ 0. Au moins une origine. Si origine talent, talent actif (rang > 0). Pas doublons ID+spec.

**Talents** : Spécialisation obligatoire si "Au choix". Avances ≥ 0. Rang ≤ maximum. Si origine talent, talent parent actif. Pas doublons ID+spec (sauf rangs multiples).

**Sorts** : Correspondance talent magie actif. Type sort matche type talent. Pour Magie Arcanes : domaine matche. Pas doublons.

**XP** : XP Max ≥ 0, XP Utilisée ≥ 0, XP Temporaire ≥ 0. XP Utilisée + XP Temporaire ≤ XP Max. Historique cohérent.

## Validations dérivées

**PB** : Minimum 1. Formule cohérente avec espèce. Modificateurs talents corrects.

**Encombrement** : Total ≥ 0, quantités ≥ 0. Avertissement si > limite (BF + BE).

**Mouvement** : ≥ 0. Cohérent espèce + talents.

## Validation wizard

Étapes : 0=espèce, 1=signe, 2=carrière, 3=carac, 4=talents, 5=skills, 6=sorts, 7=équip, 8=détails, 9=XP, 10=résumé.

Chaque étape valide avant passage suivante.

## Règles Warhammer

**Pré-requis talents** : Combat Instinctif (I≥30), Maîtrise (skill≥30), Magie Arcanes (talent Magicien).

**Limites rangs** : Rang ≤ maximum (fixe, formule, ou illimité).

**Limites raciales** : Caractéristiques cohérentes espèce.

**Cohérence carrière** : Skills/talents origines valides.

## Gestion erreurs

**Erreurs bloquantes** : Propriété manquante, XP négatif, doublons invalides, pré-requis non satisfaits, spécialisations manquantes.

**Avertissements** : Encombrement excessif, XP non dépensé, compétence jamais améliorée, déséquilibre caractéristiques.

## Moments validation

Changement étape wizard, finalisation wizard, validation avances XP, sauvegarde, à la demande.

Feedback : Propriété erreur + règle violée + action corrective.

## Voir aussi

- [character-structure.md](./character-structure.md)
- [character-calculations.md](./character-calculations.md)
- [character-getters.md](./character-getters.md)

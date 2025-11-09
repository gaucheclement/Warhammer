# Character Model - Validation

## Objectif

Documenter les règles de validation de cohérence du personnage: pré-requis, limites, contraintes métier Warhammer.

## Méthode validate()

Vérifie cohérence globale. Retourne {valid: boolean, errors: [...], warnings: [...]}. Utilisé avant finalisation wizard, avant sauvegarde, à la demande.

## Validations structurelles

**Mode et stepIndex**: mode ∈ ['guidé','libre'], stepIndex: null (non démarré), 0-N (en cours), -1 (terminé). Si mode='guidé' ET stepIndex=-1: wizard terminé

**Espèce (specie)**: Obligatoire si stepIndex>0, specie.id existe dans CharGen.allSpecies, getSpecie() retourne objet valide

**Carrière (careerLevel)**: Obligatoire si stepIndex>2, format 'career-slug|level', level ∈ [1,2,3,4], existe dans CharGen.allCareersLevels

**Caractéristiques**: Exactement 15 éléments (10 principales + 5 dérivées), Chaque id unique et valide, getTotal() >= 0 pour toutes, Origins valides (ids existants). IDs requis: cc, ct, f, e, i, ag, dex, int, fm, soc, m, pb, chance, determination, corruption

## Validations métier

**Compétences (skills)**: Si specs défini (Au choix) → spec doit être choisi, advance >= 0, origins non vide, Si origin='talent' → talent correspondant actif (getTotal()>0), Pas doublons (même id+spec). Exemple erreur: Langue (Au choix) avec spec='' → invalide, choisir langue

**Talents (talents)**: Si specs défini → spec choisi, advance >= 0, advance <= getMax() (si max défini), Si origin='talent' → talent parent actif, Pas doublons (même id+spec sauf rangs multiples). Exemples erreurs: Résistant rang5 mais getMax()=4 (BE=4) → invalide, Béni (Au choix) sans spec → invalide choisir dieu

**Sorts (spells)**: Chaque sort correspond talent magie actif, sort.data.type matche talent.data.addMagic, Si Magie Arcanes: sort.spec matche talent.spec, Pas doublons (même id+spec). Exemple erreur: Sort "Boule de feu" (Feu) mais pas talent Magie Arcanes (Feu) → invalide

**Expérience (xp)**: xp.max >= 0, xp.used >= 0, xp.tmp_used >= 0, xp.used + xp.tmp_used <= xp.max (pas XP négatif), log cohérent: sum(log positifs)=xp.max, sum(log négatifs)=xp.used. Exemple erreur: used=150, max=100 → invalide XP négatif

## Validations dérivées

**Points de Blessures**: PB.getTotal() >= 1 (minimum absolu), Formule cohérente avec espèce

**Encombrement**: total >= 0, qty >= 0 pour chaque trapping, enc >= 0 pour chaque trapping. Avertissement: Si total > limite → personnage encombré (malus)

**Mouvement**: M >= 0, Cohérent avec espèce + talents

## Validations wizard

Étapes wizard: 0=espèce, 1=signe, 2=carrière, 3=carac, 4=talents, 5=skills, 6=sorts, 7=équip, 8=détails, 9=XP, 10=résumé. Chaque étape valide avant passage suivante.

## Règles Warhammer spécifiques

**Pré-requis talents**: Combat Instinctif (I>=30), Maîtrise (skill>=30), Magie Arcanes (talent Magicien)
**Limites**: Rangs talents <= getMax(), caractéristiques dans limites raciales
**Cohérence**: Skills/talents carrière avec origins valides

## Gestion erreurs

**Erreurs bloquantes** (empêchent finalisation): Propriété obligatoire manquante, XP négatif, Doublons invalides, Pré-requis non satisfaits

**Avertissements** (signalent anomalie mais permettent continuation): Encombrement excessif, XP non dépensé, Compétence jamais améliorée

## Exemples validations

**Valide**: mode='guidé', stepIndex=-1, 15 carac, specs choisis, Résistant rang2<=max, xp valide → valid:true

**Invalide**: Langue spec='', Béni spec='', xp used>max → errors

**Avertissement**: Enc>limite → warnings

## Validation continue

**Moments**: Changement étape wizard (partielle), Finalisation wizard (complète), saveAdvance() (XP), save() (globale), À la demande utilisateur

**Feedback**: Messages indiquant Propriété en erreur, Règle violée, Action corrective suggérée

## Voir aussi

- [character-structure.md](./character-structure.md) - Structure complète
- [character-calculations.md](./character-calculations.md) - Calculs à valider
- [character-getters.md](./character-getters.md) - Recherche pour validation
- [database/characteristics.md](../database/characteristics.md) - Limites caractéristiques

# Vérification Cohérence du Personnage

## Contexte

L'écran de résumé effectue une vérification de cohérence globale du personnage avant validation finale. Cette validation garantit que toutes les étapes obligatoires sont complétées et que le personnage est viable selon les règles Warhammer.

## Système de validation

### Contrôle d'étape (stepIndex)

Le bouton "Valider" utilise character.stepIndex :
- stepIndex === number (étape résumé) : Bouton activé
- stepIndex !== number : Bouton désactivé (étapes incomplètes)
- stepIndex === -1 : Bouton caché (création terminée)

### Dépendances d'étapes

**Étapes obligatoires :** Species, Characteristics, Careers, Talents (obligatoires carrière), Skills (obligatoires carrière), Trappings (équipement départ), Detail (nom, âge, taille, etc.), Experience (XP cohérente).

**Étapes optionnelles :** Stars (signe astrologique), Sorts (selon talents magiques).

## Validations implicites

### Caractéristiques

Formule validée : Total = Init espèce + Avances carrière + Modificateurs (signe + talents)

Exemple Nain : CC 30 (init) + 5 (avances) = 35 total

### Compétences

- Base : Toutes présentes avec minimum valeur caractéristique + avances espèce si applicable
- Acquises : Compétences careerLevel.skills présentes avec spécialisation définie si groupée

### Talents

Vérifications :
- Rang minimum 1 (filtre getAdvance() > 0)
- Rang maximum respecté selon type (unique/fixes/dynamiques/illimités)
- Talents obligatoires carrière présents
- Chaînes talents respectées (ex: Flagellant → Frénésie)

### Trappings

Équipement doit inclure :
- Trappings classe (héritage niveau 1)
- Trappings carrière niveau 1 (quantités correctes)
- Trappings niveaux supérieurs si progressé

Encombrement : Total enc ≤ Bonus Force × 10 (recommandation, pas blocage)

### XP

Équations vérifiées :
- Totale = Actuelle + Dépensée
- Totale = XP espèce + XP carrière + bonus aléatoires + bonus signe
- Dépensée = somme coûts acquisitions

Exemple Nain Agitateur : 20 (espèce) + 20 (carrière) + 25 (bonus) = 65 totale, 0 dépensée, 65 actuelle

### Magie

**Si sorts présents :**
- Talent magique correspondant obligatoire (Béni/Magie des Arcanes/Magie du Chaos)
- Domaine spécialisé cohérent avec type sorts
- Dieu sélectionné si sorts Béni

**Si aucun sort :** Onglet Sorts masqué, talents magiques autorisés (préparation future)

## Messages et blocages

### Blocages silencieux (V1)

La V1 ne génère pas de messages explicites. Validation repose sur :
- Désactivation bouton si stepIndex incohérent
- Clonage personnage évite corruption données
- Vérifications implicites via calculs affichés

**Bouton désactivé :** stepIndex !== number ou étapes précédentes incomplètes
**Bouton caché :** stepIndex === -1 (création finalisée)

Aucun message n'explique pourquoi bouton désactivé.

## Validation finale

### Action de validation

Clic "Valider" déclenche :
1. stepIndex changé à -1 (marque terminé)
2. Appel CharGen.defaultAction.validate(oThat, number)
3. Retour menu principal (CharGen.showMenu())

Action IRRÉVERSIBLE : stepIndex = -1 empêche modifications via wizard.

### Distinction sauvegarde

Validation ne sauvegarde PAS automatiquement :
- Bouton "Valider" : Termine wizard, retour menu
- Bouton "Sauvegarder" : Sauvegarde base (séparé, avant ou après validation)

Voir [resume-save.md](./resume-save.md) pour sauvegarde.

## Relations

### Dépendances

- [resume-display.md](./resume-display.md) : Affichage données validées
- [resume-derived.md](./resume-derived.md) : Calculs dérivés vérifiés
- Étapes wizard #086-#139 (toutes)

### Tables impliquées

species (valeurs init), careers/careerLevels (avances obligatoires), characteristics (formules), skills/talents (listes acquises), trappings (équipement), stars (modificateurs).

Voir [species.md](../../database/species.md), [careers.md](../../database/careers.md), [careerLevels.md](../../database/careerLevels.md).

## Règles métier

### Ordre de validation

Validations appliquées dans ordre étapes wizard : Species → Characteristics → Careers → Stars → Talents → Skills → Trappings → Detail → Experience. Incohérence dans étape antérieure bloque validation finale.

### Tolérance

**Tolérés :**
- Encombrement > limite (avertissement visuel possible, pas blocage)
- Détails personnels vides (valeurs par défaut)
- Talents magiques sans sorts (préparation future)

**Bloquants :**
- Absence race ou carrière
- Talents/compétences obligatoires carrière manquants
- XP totale incohérente

## Exemples Warhammer

**Agitateur Humain validé :**
- Étapes : Species (Humain), Characteristics (10 avances), Careers (Agitateur Bronze 1), Detail (nom "Johann")
- Talents : Orateur rang 1, Rompu aux armes rang 1
- Compétences : Athlétisme, Calme, Charme (8 totales niveau 1)
- XP : 40 totale (20+20), 0 dépensée, 40 actuelle
- Bouton "Valider" activé → clic termine wizard

**Répurgateur Nain bloqué :**
- Étapes complètes SAUF Detail (nom manquant)
- stepIndex reste sur étape Detail (6)
- Résumé affiché mais bouton "Valider" désactivé
- Retour nécessaire étape Detail

**Sorcier Elfe toléré :**
- Talent "Magie des Arcanes (Azyr)" rang 1 présent
- Aucun sort Arcanes acquis (liste vide)
- Validation AUTORISÉE (sorts acquis ultérieurement)
- Onglet "Sorts" affiche domaine sans liste sorts

**Guerrier Nain incohérent bloqué :**
- Carrière "Tueur de Trolls" niveau 1 requiert talent "Haine (Peaux-Vertes)"
- Talent manquant dans liste
- stepIndex bloqué sur étape Talents
- Bouton "Valider" désactivé jusqu'à acquisition talent

**Halfling XP incohérent :**
- XP totale affichée : 50 (20 espèce + 30 carrière)
- XP dépensée : 25 (achats caractéristiques)
- XP actuelle : 30 (devrait être 25)
- Incohérence tolérée (calcul interne corrigé automatiquement)
- Validation possible, valeur corrigée affichée après refresh

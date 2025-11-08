# Wizard Talents - Application effets talents automatiques

## Vue d'ensemble

Application automatique effets talents acquis création. Modifie caractéristiques, ajoute compétences/magie, déclenche talents secondaires.

## Types effets

### addCharacteristic

Modification caractéristiques.

**Formules**:
- Points Blessures: +Bonus Endurance × rangs
- Mvt/Chance/Détermination/Corruption: +1 × rangs
- Autres: +5 × rangs

**Exemples**:
- "Affable": addCharacteristic="Sociabilité" → +5 Soc
- "Chanceux": addCharacteristic="Chance" → +1 Chance/rang
- "Âme pure": addCharacteristic="Corruption" → +1/rang

**Voir**: [talents-modification-caracteristiques.md](../../business-rules/talents-modification-caracteristiques.md)

### addSkill

Ajout compétence automatique.

**Formats**:
- Simple: "Calme"
- Spé fixe: "Art (Peinture)"
- Spé choix: "Art (Au choix)" → Héritage spé talent

**Exemples**:
- "Artiste (Peinture)": addSkill="Art (Au choix)" → "Art (Peinture)" créée
- "Linguiste (Bretonnien)": addSkill="Langue (Au choix)" → "Langue (Bretonnien)"

**Voir**: [talents-ajout-skills-magie.md](../../business-rules/talents-ajout-skills-magie.md)

### addMagic

Déblocage domaine magie/sorts.

**Domaines**: "Béni", "Magie mineure", "Magie des Arcanes", "Magie du Chaos", "Invocation"

**Cas spécial Béni**: addMagic="Béni" + spé dieu → Ajout auto toutes bénédictions dieu

**Exemples**:
- "Béni (Sigmar)": addMagic="Béni" → Bénédictions Sigmar ajoutées
- "Magie mineure": addMagic="Magie mineure" → Domaine débloqué

**Voir**: [talents-ajout-skills-magie.md](../../business-rules/talents-ajout-skills-magie.md)

### addTalent

Ajout talent secondaire (chaîne).

**Principe**: Talent A débloque acquisition talent B (pas automatique, ajout liste carrière)

**Exemples**:
- "Flagellant": addTalent="Frénésie" → "Frénésie" ajouté liste talents achetables
- Wizard création: Généralement pas activé (talents secondaires acquis post-création)

**Note**: À création, talents via addTalent rarement obtenus automatiquement

**Voir**: [talents-deblocage-talents.md](../../business-rules/talents-deblocage-talents.md)

## Ordre application

**Séquence wizard création**:
1. Parsing talents 3 sources (espèce, signe, carrière)
2. Classification (auto, choix, aléatoires, spés)
3. Résolution interactions utilisateur
4. **Application effets**: addCharacteristic → addMagic → addSkill → addTalent
5. Recalcul caractéristiques dérivées (PB, Mvt, Bonus)

**Voir**: [application-effets-talents.md](../../business-rules/application-effets-talents.md)

## Application wizard

### Moment déclenchement

**Talents automatiques**: Effets appliqués immédiatement après parsing

**Talents choix**: Effets appliqués après sélection utilisateur

**Talents aléatoires**: Effets appliqués après acceptation tirages

**Talents spécialisations**: Effets appliqués après sélection spé

### Étapes détaillées

1. **Validation talent complet**: Nom + spé (si requise)
2. **Vérification champs effets**: addCharacteristic, addSkill, addMagic, addTalent remplis?
3. **Application séquentielle**:
   - addCharacteristic: Bonus ajouté champ characteristic.talent
   - addMagic: Domaine enregistré, sorts Béni ajoutés si applicable
   - addSkill: Compétence créée, origine="talent", spé héritée
   - addTalent: Talent ajouté liste (généralement pas affichage wizard)
4. **Recalcul dérivées**: Total carac, Bonus, PB, Mvt

### Recalcul caractéristiques

**Formule complète**:
```
Total = base (espèce) + star (signe) + talent + roll (0 création) + advance (0 création) + career (0 création)
```

**Wizard création**:
```
Total = base + star + talent
```

**Bonus**: floor(Total / 10)

**Points Blessures**: Formule PB utilisant End, For, FM (après modifs talents)

**Mouvement**: Basé M (après modifs talents)

## Exemples

**Affable (+5 Soc)**: Sélection "Affable" → addCharacteristic="Sociabilité" → +5 → Total Soc = base 25 + talent 5 = 30 → Bonus 3

**Artiste (Peinture)**: Spé "Peinture" → addSkill="Art (Au choix)" → Héritage spé → Création "Art (Peinture)" origine="talent"

**Béni (Sigmar)**: Sélection "Sigmar" → addMagic="Béni" → Récup dieu Sigmar → Ajout auto bénédictions Sigmar

## Cumul effets

### Rangs multiples même talent

Talent acquis 2× (espèce + carrière) avec rangs multiples.

**Exemple**: "Chanceux" rang 1 (signe) + rang 2 (carrière hypothétique)

**Application**: addCharacteristic appliqué × nb rangs → +1 Chance × 2 = +2 Chance total

**Voir**: [talents-ranks.md](./talents-ranks.md)

### Plusieurs talents même carac

Talents différents modifiant même carac.

**Exemple**: "Affable" (+5 Soc) + autre talent hypothétique (+5 Soc)

**Application**: Bonus s'additionnent → characteristic.talent = 10

## Validation application

### Vérifications post-application

**Cohérence caractéristiques**: characteristic.talent cohérent talents actifs

**Compétences origine talent**: Toutes ont origine="talent", talent source actif

**Sorts domaine actif**: Tous sorts → domaine magie actif

### Tests intégrité

**Idempotence**: Réapplication effets → Résultat identique

**Réversibilité**: Retrait talent → Recalcul sans → État correct

## Relations autres tickets

**Ticket 106** (Display): Affichage talents avant application

**Ticket 107** (Choice): Sélection déclenche application

**Ticket 108** (Random): Acceptation déclenche application

**Ticket 109** (Specialization): Spé nécessaire avant application addSkill héritage

**Ticket 110** (Ranks): Cumul effets rangs multiples

**Ticket 111** (Prerequisites): Effets peuvent débloquer autres talents

## Voir aussi

- [application-effets-talents.md](../../business-rules/application-effets-talents.md) - Logique complète
- [talents-modification-caracteristiques.md](../../business-rules/talents-modification-caracteristiques.md) - addCharacteristic
- [talents-ajout-skills-magie.md](../../business-rules/talents-ajout-skills-magie.md) - addSkill/addMagic
- [talents-deblocage-talents.md](../../business-rules/talents-deblocage-talents.md) - addTalent
- [talents.md](../../database/talents.md) - Champs effets
- [talents-specialization.md](./talents-specialization.md) - Héritage spé
- [talents-ranks.md](./talents-ranks.md) - Cumul rangs

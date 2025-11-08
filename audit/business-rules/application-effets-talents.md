# Talents - Application des Effets

## Vue d'ensemble

Logique centralisée d'application effets talents sur personnage. Méthode `applyTalent()` orchestre application addCharacteristic, addSkill, addMagic, addTalent.

## Ordre d'application

### Séquence

1. **Réinit**: bonus talents caractéristiques → 0
2. **Parcours talents**: itération talents personnage
3. **Vérification**: talent actif (getTotal() > 0)
4. **Application**: selon champs remplis
5. **Nettoyage**: retrait sorts/compétences inactifs
6. **Recalcul**: caractéristiques dérivées

### Priorités

**P1 - addCharacteristic**: calcul et ajout bonus caractéristiques

**P2 - addMagic**: collecte domaines magie, ajout sorts spéciaux (Béni)

**P3 - addSkill**: ajout compétences avec origine "talent"

**P4 - addTalent**: ajout à liste carrière (gestion externe)

**P5 - Nettoyage**: suppression sorts/compétences talents inactifs

## Bonus caractéristiques

### Formules

**Points Blessures**: Bonus Endurance × rangs

**Mouvement/Chance/Détermination/Corruption**: 1 × rangs

**Autres**: 5 × rangs

### Stockage

Bonus dans `characteristic.talent`

Total = base + star + roll + talent + advance + career

### Cumul

Rangs multiples même talent: bonus × nb_rangs

Plusieurs talents même carac: bonus s'additionnent

## Gestion magie

### Béni (spécial)

addMagic = "Béni" + spé renseignée:
1. Récupération dieu
2. Récupération bénédictions
3. Ajout automatique sorts

Autres domaines: enregistrement, sorts manuels

### Validation sorts

Parcours sorts personnage:
- Vérifier domaine actif
- Si inactif: suppression sort
- Retrait auto si talent magie perdu

## Gestion compétences

### Ajout

Via `getSkill()`:
1. Création compétence depuis addSkill
2. Héritage spécialisation
3. Marquage origine "talent"
4. Ajout personnage

### Validation

Parcours compétences:
- Si origine "talent": vérifier talent source actif
- Si inactif: suppression
- Exception: conservée si avances investies

## Effets cumulatifs

**Rangs multiples**: bonus × rangs

**Plusieurs talents même carac**: addition

**Plusieurs domaines magie**: accumulation

## Conflits

**Caractéristiques**: pas de conflit, addition toujours

**Compétences**:
- Même compétence/spé: fusion
- Spés différentes: 2 entrées

**Sorts**:
- Même sort: fusion (1 exemplaire)
- Domaines conflictuels: impossible

## Recalcul

### Déclencheurs

Acquisition/perte/changement talent → `applyTalent()`

### Impact

Recalcul caractéristiques dérivées:
- Points Blessures: f(E, For, FM)
- Mouvement: selon M modifié
- Bonus: depuis totaux

## Cas particuliers

**Conditionnels**: vérif conditions avant application

**Temporaires**: révocables si désactivé

**Passifs vs actifs**: passifs permanents (addX), actifs déclenchés (ailleurs)

## Optimisation

**Appels minimaux**: coûteux, uniquement si modifs

**Cache**: résultats stockés, pas recalcul si inchangés

## Validation

### Post-application

**Caractéristiques**: bonus.talent cohérent talents actifs

**Compétences**: origine "talent" → talent source actif

**Sorts**: tous sorts → domaine actif

### Tests

**Idempotence**: rejeu → résultat identique

**Réversibilité**: retrait puis réajout → état exact

## Exemples application

### Affable (+5 Soc)

1. applyTalent() appelé
2. Affable actif (rang 1)
3. addCharacteristic = "Sociabilité"
4. Bonus = 5 × 1 = 5
5. characteristic["sociabilité"].talent = 5

### Artiste (Art)

1. applyTalent() appelé
2. Artiste actif, spé "Peinture"
3. addSkill = "Art (Au choix)"
4. Création compétence "Art (Peinture)"
5. Origine "talent", ajout personnage

### Béni (Sigmar)

1. applyTalent() appelé
2. Béni actif, spé "Sigmar"
3. addMagic = "Béni"
4. Récup dieu Sigmar
5. Ajout auto toutes bénédictions Sigmar

### Flagellant (Frénésie)

1. applyTalent() appelé
2. Flagellant actif
3. addTalent = "Frénésie"
4. Ajout "Frénésie" liste carrière
5. Pas application auto, acquisition manuelle

## Chaîne complète

1. Joueur acquiert Artiste (Peinture)
2. applyTalent() déclenché
3. Réinit bonus.talent toutes caracs
4. Parcours tous talents:
   - Artiste actif
   - addSkill = "Art (Au choix)"
   - Création "Art (Peinture)"
   - Ajout personnage
5. Nettoyage compétences inactives
6. Recalcul dérivées
7. Fin: personnage a compétence "Art (Peinture)"

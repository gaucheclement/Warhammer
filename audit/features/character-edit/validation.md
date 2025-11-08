# Character Edit - Validation Modifications

## Vue d'ensemble

La validation des modifications assure la cohérence et l'intégrité du personnage lors des éditions. Elle détecte les erreurs, les incohérences, et empêche les modifications invalides selon les règles de Warhammer.

## Types de validation

### Structurelle
Valeurs numériques positives, avances valides, existence dans référentiels.

### Métier
XP disponible, pré-requis talents, limites max, sorts accessibles, encombrement.

### Cohérence
Caractéristiques dérivées, compétences/sorts liés aux talents, origines valides.

## Validation XP

**XP disponible** = xp.max - xp.used

**XP après modifications** = disponible - tmp_used

Si < 0 → Erreur : "XP insuffisant. Disponible : X, Requis : Y". Blocage de validation.

**Mode création** : Validation stricte. **Mode libre** : Validation assouplie ou désactivée.

## Limites de talents

Vérification : talent.getTotal() ≤ talent.getMax()

Si dépassé → Erreur : "Talent X limité à Y rangs"

**Limite dynamique** : "Bonus de X" → récupère bonus de caractéristique X. Ex: Chance limité à Bonus Destin (3 si Destin=32).

## Pré-requis

Talents peuvent nécessiter : caractéristique min, autre talent, compétence min.

Vérification avant acquisition. Si non rempli → "Talent X nécessite : [conditions]" + blocage.

## Erreurs et avertissements

### Critiques (bloquantes)
XP négatif, talent > max, pré-requis manquant, sorts sans talent magique. Empêchent sauvegarde.

### Avertissements (non bloquants)
Encombrement élevé, avances déséquilibrées, carrière incohérente. Informent sans bloquer.

## Cohérence globale

Lors de validation, recalculs automatiques :
- `applyTalent()` : Synchronise talents/sorts/compétences/bonus
- `deleteEmpty()` : Supprime éléments sans avances
- Dérivées : PdB, Corruption, Chance, Détermination

Vérification origins : références valides, éléments "talent" ont source active, pas d'orphelines.

## Affichage

Interface : Erreurs (rouge), Avertissements (orange), Succès (vert).

Indicateurs temps réel : XP restant (vert/rouge), icônes erreur, tooltips explicatifs.

## Blocage sauvegarde

Bouton "Sauvegarder" activé si validation OK, désactivé si erreurs critiques.

Mode debug : Force sauvegarde malgré erreurs.

## Validation chargement

Détecte : corruption données, incompatibilités version, références cassées.

Réparation auto : sorts orphelins supprimés, compétences "talent" sans source retirées, origines nettoyées.

Erreurs majeures : intervention manuelle requise.

## Exemples

### XP insuffisant
État : xp.max=500, used=450, disponible=50. Modifications : CC +5 (50 XP), Commandement +10 (200 XP). tmp_used=250.
Validation : 50 - 250 = -200 → Erreur "XP insuffisant. Disponible : 50, Requis : 250"
Action : Annulation Commandement → tmp_used=50 → OK

### Talent max dépassé
Ajout 4e rang "Chance" alors que Bonus Destin=3. getTotal()=4, getMax()=3 → Erreur "Chance limité à 3 rangs". Blocage.

## Relations avec autres composants

- **[Caractéristiques](./characteristics.md)** : Validation des valeurs et limites
- **[Compétences](./skills.md)** : Validation des avances
- **[Talents](./talents.md)** : Validation max et pré-requis
- **[Sorts](./spells.md)** : Validation de l'accès via talents
- **[Expérience](./xp-history.md)** : Validation de disponibilité XP

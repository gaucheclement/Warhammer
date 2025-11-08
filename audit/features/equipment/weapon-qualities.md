# Equipment - Qualités d'armes

## Vue d'ensemble

Les qualités d'armes (weapon qualities) sont des propriétés spéciales qui modifient le comportement ou l'efficacité d'une arme en combat. Une même arme peut avoir plusieurs qualités.

## Structure des données

### Qualité

**Identifiants:**
- `id` - Identifiant unique
- `label` - Nom de la qualité

**Classification:**
- `type` - Toujours "Atout" ou "Défaut"
- `subType` - Toujours "arme"

**Informations:**
- `desc` - Description des effets de la qualité
- `prefix` - Si défini, la qualité peut avoir une spécialisation
- `book` - Livre source
- `page` - Page de référence

## Exemples de qualités Warhammer

**Accurate (Précise)**
Type: Atout
Effet: +10% aux tests d'attaque avec cette arme

**Blackpowder (Poudre noire)**
Type: Défaut
Effet: Arme à poudre nécessitant rechargement après chaque tir

**Defensive (Défensive)**
Type: Atout
Effet: +1 Avantage si utilisée en défense

**Damaging (Dévastatrice)**
Type: Atout
Effet: +1 aux dégâts après application de l'Endurance et de l'Armure

**Fast (Rapide)**
Type: Atout
Effet: +1 Avantage en attaque

**Hack (Taillante)**
Type: Atout
Effet: Ignore 1 Point d'Armure

**Impact (Impact)**
Type: Atout
Effet: Les dégâts ignorent les Points d'Armure dans certaines situations

**Impale (Empalante)**
Type: Atout
Effet: Cause des blessures critiques supplémentaires sur certains résultats

**Penetrating (Perforante)**
Type: Atout
Effet: Ignore Points d'Armure

**Pummel (Assommante)**
Type: Atout
Effet: Peut assommer au lieu de blesser

**Entangle (Entravante)**
Type: Atout
Effet: Peut entraver l'adversaire

**Slow (Lente)**
Type: Défaut
Effet: -1 Avantage en attaque

**Tiring (Fatigante)**
Type: Défaut
Effet: Cause de la Fatigue à l'utilisateur

**Unreliable (Peu fiable)**
Type: Défaut
Effet: Peut se bloquer ou mal fonctionner

**Wrap (Enveloppante)**
Type: Atout
Effet: Peut contourner les parades

## Qualités avec spécialisation

Certaines qualités peuvent avoir une valeur ou spécification:

**Blast (X)** - Zone d'effet de X mètres
**Dangerous** - Malfonctionnement sur certains résultats
**Range (X)** - Modificateur de portée

## Application en combat

### Lors de l'attaque

Les qualités d'armes s'appliquent automatiquement lors de l'utilisation de l'arme:
- **Accurate** modifie le test d'attaque
- **Fast/Slow** modifie l'Avantage
- **Defensive** s'applique en parade

### Lors des dégâts

Certaines qualités affectent le calcul des dégâts:
- **Damaging** ajoute aux blessures finales
- **Hack/Penetrating** ignorent l'armure
- **Impact** ignore l'armure dans certains cas
- **Impale** peut causer des critiques supplémentaires

### Effets spéciaux

D'autres qualités créent des effets spéciaux:
- **Entangle** peut immobiliser
- **Pummel** permet d'assommer
- **Wrap** contourne les parades
- **Blackpowder** nécessite rechargement

## Relations avec d'autres systèmes

### Avec Weapons
Les armes référencent leurs qualités dans la propriété `qualities` (tableau d'objets).
Voir [weapons.md](./weapons.md)

### Avec Database
Les qualités sont stockées dans la table qualities avec type="Atout" et subType="arme".
Voir [audit/database/qualities.md](../../database/qualities.md)

### Avec Combat
Les effets des qualités s'appliquent lors des tests de combat et du calcul des dégâts.

## Validation

### Règles métier

**Structure:**
- `type` doit être "Atout" ou "Défaut"
- `subType` doit être "arme"
- `desc` doit être défini (description des effets)

**Référencement:**
- Les armes doivent référencer des qualités existantes
- Une qualité avec `prefix` peut avoir une spécialisation

### Vérifications

- Vérifier que les qualités référencées par les armes existent
- Vérifier que type = "Atout" ou "Défaut"
- Vérifier que subType = "arme"
- Alerter si qualité sans description

## Patterns réutilisés

Voir [pattern-validation-references.md](../../patterns/pattern-validation-references.md) pour la validation des références.

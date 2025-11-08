# Talents - Déblocage d'Autres Talents

## Vue d'ensemble

Système de chaînes de talents via champ `addTalent`: certains talents débloquent accès à autres talents. Crée dépendances et progression entre talents.

## Mécanisme addTalent

### Fonctionnement

**Champ addTalent**: contient nom du talent débloqué

**Effet**: ajoute talent cible à la liste des talents de carrière disponibles

**Condition**: personnage doit avoir acquis talent source ET au moins 1 rang actif

**Format**: texte exact du label du talent cible

## Exemples de chaînes

### Flagellant → Frénésie

**Talent source**: Flagellant (max Bonus End)

**addTalent**: "Frénésie"

**Règle métier**:
- Flagellant permet auto-flagellation quotidienne
- Si talent Frénésie possédé, peut entrer en frénésie immédiatement sans test
- Flagellant AJOUTE Frénésie à liste talents carrière (devient acquérable)

**Progression**:
1. Acquérir Flagellant → Frénésie apparaît dans talents carrière
2. Acquérir Frénésie via liste carrière
3. Effet combiné: frénésie instantanée après flagellation

## Règles de déblocage

### Conditions d'accès

**Talent source actif**: au moins 1 rang acquis et actif

**Ajout liste carrière**: talent débloqué ajouté aux talents de la carrière actuelle

**Pas d'acquisition automatique**: déblocage ≠ acquisition gratuite

**Coût XP normal**: talent débloqué s'achète avec XP comme tout talent de carrière

### Moment du déblocage

**À l'acquisition source**: dès que talent source acquis, cible devient disponible

**Permanence**: si talent source perdu/désactivé, talent débloqué reste accessible

**Réversibilité**: généralement irréversible (débloc

age permanent)

## Types de relations

### Prérequis souple

Talent source recommandé mais pas strictement obligatoire pour cible

Déblocage facilite juste accès (ajout liste carrière)

### Synergie narrative

Talents liés thématiquement ou mécaniquement

Exemple: Flagellant (auto-torture) et Frénésie (fureur combat) = cohérence RP

### Progression spécialisée

Chaînes talents créent voies de spécialisation

Débloquer talents avancés via talents de base

## Validation et cohérence

### Vérifications nécessaires

**Existence talent cible**: `addTalent` doit pointer vers talent existant dans talents.json

**Pas de cycles**: éviter A → B → C → A (dépendance circulaire)

**Unicité déblocage**: un talent source peut débloquer 1 seul autre talent

**Cohérence thématique**: vérifier lien logique source-cible

### Cas d'erreur

**Talent inexistant**: addTalent = "TalentInconnu" → erreur validation

**Cycle détecté**: Flagellant → Frénésie → Flagellant → erreur

**addTalent vide invalide**: si rempli, doit contenir nom valide

## Impact gameplay

### Gestion carrières

Talents débloqués s'ajoutent aux talents de carrière courante

Élargit choix disponibles sans changer structure carrière

### Coût XP

**Carrière active**: talent débloqué = talent carrière → coût normal

**Hors carrière**: si changement carrière, talent peut devenir hors-carrière → coût ×2

### Stratégie acquisition

Joueurs peuvent cibler talents sources pour débloquer talents désirés

Crée chemins de progression intentionnels

## Exemples d'utilisation

### Progression martiale

Talent "Maîtrise arme de base" → "Maîtrise arme avancée"

Crée hiérarchie compétences combat

### Progression magique

Talent "Sens magique" → "Résistance magie mineure" → "Résistance magie majeure"

Escalade résistances magiques

### Progression sociale

Talent "Intrigant" → "Manipulateur" → "Maître des intrigues"

Voie spécialisation intrigue

## Différence avec autres mécanismes

### addTalent vs addSkill

**addTalent**: débloque autre talent (ajout liste carrière)

**addSkill**: ajoute compétence au personnage (acquisition directe)

### addTalent vs addMagic

**addTalent**: débloque 1 talent spécifique

**addMagic**: débloque domaine entier de sorts (plusieurs sorts)

### addTalent vs prérequis talents

**addTalent**: débloque accès, pas prérequis strict

**Prérequis** (non géré par addTalent): talent B impossible sans talent A

## Cas limites

**Talent source jamais acquis**: talent cible reste inaccessible (sauf via autre source)

**Talent cible déjà dans carrière**: addTalent redondant mais pas d'erreur

**Désactivation talent source**: talent débloqué reste accessible

**Multiple sources déblocage**: si 2 talents débloquent même cible, OK (déblocages cumulés)

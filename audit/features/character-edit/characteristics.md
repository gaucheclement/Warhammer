# Character Edit - Modification Caractéristiques

## Vue d'ensemble

La modification des caractéristiques permet d'ajuster les valeurs d'un personnage existant après sa création initiale. Chaque caractéristique peut être modifiée en respectant les règles métier et les limites imposées par Warhammer.

## Composants de la caractéristique

### Structure des données

Chaque caractéristique stocke plusieurs valeurs :
- **Base de l'espèce** : Valeur initiale déterminée par la race
- **Jet initial** : Résultat du tirage de création (roll)
- **Bonus de talent** : Modificateur apporté par les talents possédés
- **Bonus d'étoile** : Modificateur selon le signe astrologique
- **Avances permanentes** : Points dépensés en XP (advance)
- **Avances de carrière** : Bonus de progression dans la carrière
- **Avances temporaires** : Points non encore validés (tmpadvance)

### Calculs

**Valeur de base** = espèce + jet + talent + étoile

**Avances totales** = advance + career + tmpadvance

**Valeur finale** = base + avances totales

**Bonus** = floor(valeur finale / 10)

## Édition inline

### Modification directe

L'utilisateur peut modifier directement certaines composantes :
- **Jet (roll)** : Ajustement du tirage initial
- **Avances (advance)** : Modification des points dépensés
- **Avances temporaires (tmpadvance)** : Pour tester avant validation

Les autres valeurs (base espèce, bonus talent, bonus étoile, avances carrière) sont calculées automatiquement.

### Interface d'édition

L'édition se fait via des champs éditables qui affichent la valeur actuelle et permettent la saisie d'une nouvelle valeur. Les modifications sont appliquées immédiatement à l'objet personnage.

## Validation et limites

### Règles de validation

Les modifications doivent respecter :
- **Valeurs positives** : Aucune caractéristique ne peut être négative
- **Limites espèce** : Certaines races ont des plafonds naturels
- **Cohérence des avances** : Les avances ne peuvent pas être négatives

### Recalcul automatique

Lors de la modification d'une caractéristique, le système recalcule :
- Le **bonus** de la caractéristique (valeur / 10)
- Les **valeurs dérivées** qui dépendent de cette caractéristique :
  - Points de Blessures (dépend de Endurance, Force Mentale, parfois Force)
  - Corruption (dépend de Endurance et Force Mentale)
  - Chance (égale à Destin)
  - Détermination (égale à Résilience)

### Impact sur les compétences

Quand une caractéristique change, toutes les compétences liées à cette caractéristique voient leur valeur de base recalculée automatiquement, car :

**Valeur de compétence** = caractéristique associée + avances de compétence

## Historique des modifications

### Structure du log XP

Chaque modification validée est enregistrée dans le journal d'expérience (xp.log) avec :
- **Type** : "Caractéristique"
- **Détail** : Nom de la caractéristique + ancienne valeur => nouvelle valeur
- **Coût** : Points XP dépensés (négatif)

Exemple : `"Caractéristique: Capacité de Combat 35 => 40" : -50`

### Calcul du coût XP

Le coût pour améliorer une caractéristique dépend :
- Du **niveau de départ** et du **niveau d'arrivée**
- De l'appartenance à la **carrière actuelle** (x1) ou non (x2)

La fonction `Helper.getXPCost()` calcule le coût total entre deux valeurs d'avances.

## Validation des modifications temporaires

### Workflow de validation

Les modifications temporaires (tmpadvance) permettent de tester des changements avant de les rendre permanents :

1. L'utilisateur modifie une valeur → stockée dans `tmpadvance`
2. Le système calcule le coût XP total → stocké dans `xp.tmp_used`
3. L'utilisateur valide → méthode `saveAdvance()` :
   - Transfert de `tmpadvance` vers `advance`
   - Enregistrement dans le log XP
   - Mise à jour de `xp.used`
   - Réinitialisation de `tmp_used`

### Suppression des entrées vides

La méthode `deleteEmpty()` nettoie automatiquement les éléments sans avances pour garder le personnage propre.

## Caractéristiques dérivées

### Points de Blessures

Calculés selon la formule de l'espèce :
- Humain : `BF + (2 × BE) + BFM`
- Nain : `BF + (2 × BE) + BFM` (identique)
- Halfling : `(BF + (2 × BE) + BFM) × 2` (double)

Les talents peuvent ajouter un bonus basé sur BE.

### Corruption

`Corruption = Bonus Endurance + Bonus Force Mentale`

### Chance et Détermination

- `Chance = Destin` (valeur totale, pas bonus)
- `Détermination = Résilience` (valeur totale, pas bonus)

### Mouvement

Modifié par certains talents qui ajoutent +1 au mouvement.

## Origines et symboles

### Traçabilité des avances

Chaque caractéristique possède un tableau `origins` qui liste les sources de ses avances (IDs de niveaux de carrière). Cela permet d'afficher le symbole de rang de carrière correspondant dans l'interface.

### Affichage visuel

La méthode `getSymbol()` génère une icône visuelle indiquant le niveau de carrière qui a débloqué cette avance, utile pour rappeler la provenance des améliorations.

## Exemple concret

### Scénario : Amélioration de Capacité de Combat

**État initial**
- Espèce (Humain) : 20
- Jet : 8
- Talent : 0
- Étoile : 0
- Advance : 10
- Career : 5
- Tmpadvance : 0
- **Total : 43** (Bonus : 4)

**Modification**
L'utilisateur décide d'ajouter +5 en avances :
- Tmpadvance passe à 5
- Nouveau total : 48 (Bonus : 4)
- Coût XP calculé : 50 XP (si en carrière)

**Validation**
Après appel à `saveAdvance()` :
- Advance : 15 (10 + 5)
- Tmpadvance : 0
- Log XP : `"Caractéristique: Capacité de Combat 10 => 15" : -50`
- xp.used augmente de 50

## Relations avec autres composants

- **[Talents](../wizard/talents.md)** : Les talents modifient le bonus de talent
- **[Compétences](../wizard/skills.md)** : Les compétences utilisent les caractéristiques comme base
- **[Expérience](../wizard/experience.md)** : Les modifications coûtent de l'XP
- **[Carrière](../wizard/career.md)** : Détermine le coût des améliorations (x1 ou x2)
- **[Espèce](../wizard/species.md)** : Définit la base de départ
- **[Étoile](../wizard/star.md)** : Ajoute des bonus selon le signe

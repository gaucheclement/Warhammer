# Table Spells - Documentation

## Vue d'ensemble

La table Spells centralise tous les sorts et prières utilisables dans Warhammer. Elle couvre cinq catégories : Bénédictions divines (Béni), sorts mineurs (Magie mineure), sorts des huit domaines (Magie des Arcanes), sorts du Chaos (Magie du Chaos), et miracles divins (Invocation).

**Source** : `data/spells.json`
**Références** : [Talents](talents.md), [Domaines Magiques](../business-rules/filtrage-spells-lore.md)

## Structure des données

### Champs principaux

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| index | Integer | Oui | Identifiant unique séquentiel |
| label | String | Oui | Nom du sort ou de la prière |
| type | String | Oui | Catégorie principale |
| subType | String | Variable | Domaine magique ou divinité |
| cn | Mixed | Variable | Numéro d'Incantation (Casting Number) |
| range | String | Oui | Portée du sort |
| target | Mixed | Oui | Nombre ou description des cibles |
| duration | String | Oui | Durée d'effet |
| desc | String | Oui | Description complète avec effets |
| book | String | Oui | Référence du livre source |
| page | Mixed | Oui | Numéro(s) de page |

### Types de sorts

| Type | subType | CN | Exemples |
|------|---------|----|----|
| Béni | Vide | Vide | "Bénédiction de Bataille" (+10 CC), "Bénédiction de Guérison" (+1 PV) |
| Magie mineure | Vide | 0 | "Alerte" (détecte poison), "Choc" (1 État Sonné) |
| Magie des Arcanes | Domaine ou vide | 2-30+ | "Arme aethyrique" (CN 2), "Armure Aethyrique" (CN 2) |
| Magie du Chaos | Dieu ou vide | 4-12+ | "Allure démoniaque" (CN 8), "Aspect sublimé" (CN 4) |
| Invocation | Nom du dieu | Vide | "Encalminé" (Manann), "Générosité de Manann" |

**Béni** : Prières bénies accordées par toutes les divinités, sans test d'incantation.

**Magie mineure** : Sorts universels accessibles à tous les lanceurs, toujours faciles (CN 0).

**Magie des Arcanes** : Sorts des huit domaines de la Magie des Couleurs (Bête, Cieux, Feu, Lumière, Métal, Mort, Ombres, Vie).

**Magie du Chaos** : Sorts corrompus liés aux dieux du Chaos (Nurgle, Slaanesh, Tzeentch, Khorne, Indivisible).

**Invocation** : Miracles spécifiques à chaque divinité (Manann, Sigmar, Ulric, etc.).

## Champs à données variables

### range (Portée)

**Fixes** : "Contact", "Vous", "6 mètres", "12 mètres", etc.
**Dynamiques** : "(Force Mentale) mètres", "(Bonus de Force Mentale) mètres", "(Bonus d'Initiative) kilomètres"

### target (Cibles)

**Numériques** : 1, 2, 3, etc.
**Descriptives** : "Spécial", "Vous", "(Bonus de Force Mentale)", "1 voilier dans la Ligne de vue"

### duration (Durée)

**Fixes** : "Instantanée", "6 rounds", "1 heure", "1 journée"
**Dynamiques** : "(Bonus de Force Mentale) Rounds", "(Bonus de Force Mentale) Rounds +" (+ = extensible)
**Extensibles** : Le symbole "+" indique que chaque +2 DR ajoute la durée de base

### desc (Description)

Contient la description narrative avec effets mécaniques, conditions, modificateurs, tables HTML et références (États, Traits, Compétences).

**Simple** : "Votre cible gagne +10 en Capacité de Combat"
**Complexe** : "Vous canalisez le pouvoir... [table HTML avec résultats aléatoires]"

## Relations avec autres tables

### Talents (prérequis)

Chaque sort nécessite un talent pour être lancé :
- "Béni" → Talent "Béni"
- "Magie mineure" → Talent "Magie Mineure"
- "Magie des Arcanes" → Talent "Magie des Arcanes (Domaine)"
- "Magie du Chaos" → Talent "Magie du Chaos (Dieu)"
- "Invocation" → Talent "Invocation (Dieu)"

**Référence** : [Talents - Déblocage Sorts](talents.md#magie)

### Domaines magiques (Magicks)

Les sorts "Magie des Arcanes" sont organisés par huit domaines (Vents de Magie) :
- Bête (Ghur/Ambre), Cieux (Azyr/Bleu), Feu (Aqshy/Rouge), Lumière (Hysh/Blanc)
- Métal (Chamon/Doré), Mort (Shyish/Pourpre), Ombres (Ulgu/Gris), Vie (Ghyran/Vert)

**Référence** : [Filtrage par Domaine](../business-rules/filtrage-spells-lore.md)

### Divinités (Gods)

**Invocations** : Chaque miracle appartient à un dieu spécifique (Manann, Sigmar, Ulric, Ranald, etc.)
**Bénédictions** : Accessibles à tous les prêtres
**Chaos** : Nurgle, Slaanesh, Tzeentch, Khorne, Indivisible

## Logique métier encodée

### Règles de Casting Number

**CN vide** : Bénédictions et Invocations → système de prières, pas d'incantation magique
**CN = 0** : Magie mineure uniquement → toujours facile à lancer
**CN numérique** : Magie Arcanes et Chaos → difficulté croissante, test d'Incantation requis

### Spécialisations

- **Magie des Arcanes** : spécialisation par domaine obligatoire (définie par le talent du personnage)
- **Magie du Chaos** : peut nécessiter spécialisation par dieu
- **Invocation** : toujours spécialisée par dieu (dans subType)
- **Béni** : pas de spécialisation (universelles)

### Extensibilité des durées

Les durées avec "+" permettent prolongation via Degrés de Réussite :
- Chaque +2 DR ajoute la durée de base
- Exemple : "(Bonus FM) Rounds +" avec Bonus FM 4 et DR +4 → 4 + 4 = 8 rounds total

### Règles de portée dynamique

Les portées avec caractéristiques entre parenthèses sont calculées :
- "(Force Mentale) mètres" → portée = valeur FM du lanceur
- "(Bonus de Force Mentale) mètres" → portée = bonus FM (FM/10)
- "(Bonus d'Initiative) kilomètres" → pour effets à grande échelle (miracles marins, etc.)

## Exemples concrets

### Bénédiction (Béni)
```
label: "Bénédiction de Courage"
type: "Béni"
subType: ""
cn: ""
range: "6 mètres"
target: 1
duration: "6 rounds"
desc: "Votre cible gagne +10 en Force Mentale."
book: "LDB"
page: 221
```

### Sort mineur
```
label: "Choc"
type: "Magie mineure"
subType: ""
cn: 0
range: "Contact"
target: 1
duration: "Instantanée"
desc: "Votre cible reçoit 1 État Sonné"
book: "LDB"
page: 240
```

### Sort arcane (Magie des Arcanes)
```
label: "Arme aethyrique"
type: "Magie des Arcanes"
subType: ""
cn: 2
range: "Vous"
target: "Vous"
duration: "(Bonus de Force Mentale) Rounds +"
desc: "Vous créez une arme de Corps à corps dont les Dégâts sont égaux à votre Bonus de FM..."
book: "LDB"
page: 242
```

### Miracle (Invocation)
```
label: "Encalminé"
type: "Invocation"
subType: "Manann"
cn: ""
range: "(Bonus d'Initiative) kilomètres"
target: "1 voilier dans la Ligne de vue"
duration: "1 heure"
desc: "Vous volez le vent des voiles d'un navire..."
book: "LDB"
page: 222
```

## Tests et Validation

**Contraintes** : index unique séquentiel, label unique par type, type dans liste définie, cn vide/0/nombre selon type, subType vide sauf Invocation (obligatoire), tous champs non vides, références book/page valides

**Intégrité** : Béni/Invocation→CN vide, Magie mineure→CN=0, Arcanes/Chaos→CN numérique, Invocation→subType=dieu existant, Arcanes→subType=domaine existant si renseigné, Extensibilité(+) uniquement avec formules dynamiques

**Erreurs** : "Sort {label} : talent absent", "CN invalide pour {type}", "Domaine/Dieu {subType} inconnu", "Durée + requiert base dynamique"

---

**Navigation** : [Talents](talents.md) | [Domaines Magiques](../business-rules/filtrage-spells-lore.md) | [Index Database](README.md)

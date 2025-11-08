# Talents - Rangs Multiples

## Vue d'ensemble

Système de rangs permettant d'acquérir certains talents plusieurs fois pour effets cumulatifs. Le champ `max` détermine le nombre maximum de rangs possibles selon formules ou valeurs fixes.

## Types de rangs

### Rang unique (max = 1)

Talents ne pouvant être acquis qu'une fois. Effet immédiat et définitif.

**Exemples**:
- **Béni** (max 1): débloque bénédictions d'un dieu
- **Affable** (max 1): +5 permanent Sociabilité
- **Caïd** (max 1): ignore perte statut du talent Criminel

**Utilisation**: talents transformationnels ou uniques (magie, changements permanents)

### Rangs fixes multiples (max = nombre)

Talent acquérable X fois exactement. Effets se cumulent.

**Exemples**:
- **Ambidextre** (max 2):
  - 1 rang: -10 pénalité main secondaire (au lieu -20)
  - 2 rangs: aucune pénalité main secondaire

- **Bénédiction de Tzeentch** (max 1): sort unique Magie des Couleurs

**Règle**: chaque rang améliore ou cumule l'effet du précédent

### Rangs dynamiques (max = formule)

Nombre maximum calculé depuis bonus de caractéristique du personnage.

**Formules courantes**:
- `"Bonus d'Agilité"`: max = Bonus Agi actuel
- `"Bonus de Dextérité"`: max = Bonus Dex actuel
- `"Bonus de Force"`: max = Bonus For actuel
- `"Bonus d'Endurance"`: max = Bonus End actuel
- `"Bonus de Force Mentale"`: max = Bonus FM actuel
- `"Bonus de Sociabilité"`: max = Bonus Soc actuel
- `"Bonus de Capacité de Combat"`: max = Bonus CC actuel
- `"Bonus d'Initiative"`: max = Bonus I actuel

**Exemples**:
- **Acrobaties équestres** (max Bonus Agi): jusqu'à Bonus Agi rangs
- **Artiste** (max Bonus Dex): jusqu'à Bonus Dex rangs
- **Bonnes jambes** (max Bonus For): jusqu'à Bonus For rangs, ajoute +niveau au DR sauts
- **Flagellant** (max Bonus End): jusqu'à Bonus End rangs
- **Affinité avec les animaux** (max Bonus FM): jusqu'à Bonus FM rangs
- **Âme pure** (max Bonus FM): +1 Corruption/rang max Bonus FM fois

**Règle**: bonus caractéristique = Math.floor(valeur_carac / 10). Évolution dynamique si carac augmente.

### Rangs illimités (max = "Aucun")

Talents sans limite d'acquisition théorique.

**Cas d'usage**: talents génériques ou très rares où limite n'a pas de sens

**Attention**: en pratique, limité par coûts XP et progression du personnage

## Acquisition et progression

### Règles d'acquisition

**Séquentielle**: rangs acquis un par un, dans l'ordre (rang 1 avant rang 2)

**Coût XP**: chaque rang coûte 100 XP × niveau_rang
- Rang 1: 100 XP
- Rang 2: 200 XP
- Rang 3: 300 XP

**Multiplicateur carrière**: ×2 si talent hors carrière actuelle

### Cumul des effets

**Additif**: bonus de chaque rang s'ajoutent
- Exemple: Bonnes jambes 3 rangs → +3 DR aux sauts

**Progressif**: chaque rang améliore effet
- Exemple: Ambidextre rang 1 (-10) puis rang 2 (aucune pénalité)

**Seuil**: certains rangs débloquent effets spécifiques
- Exemple: certains talents ont effet spécial au rang X

### Limites et plafonds

**Plafond caractéristique**: si max = formule, recalculé si bonus carac change
- Personnage Agi 35 (Bonus 3): max 3 rangs talent "Bonus Agi"
- Si Agi monte à 42 (Bonus 4): peut acquérir rang 4

**Plafond absolu**: si max = nombre, jamais dépassable

**Impossibilité progression**: si bonus carac baisse, rangs acquis conservés mais nouveaux rangs bloqués

## Vérification et validation

### Validation acquisition

Avant d'acquérir rang N:
1. Vérifier rangs 1 à N-1 déjà possédés
2. Calculer max actuel (si formule: évaluer bonus carac)
3. Vérifier N ≤ max
4. Vérifier XP disponibles

### Cas limites

**Talent max 1 acquis 2 fois**: impossible, erreur validation

**Formule max avec carac inconnue**: "Bonus de Toto" → erreur, carac inexistante

**Max vide ou invalide**: erreur données, devrait être 1, nombre, "Aucun" ou formule valide

**Acquisition rang sans précédents**: bloquer, forcer progression séquentielle

## Exemples par catégorie

### Amélioration capacités combat

- **Battement** (max Bonus CC): manœuvre désarmement, +1 efficacité/rang
- **Assaut féroce** (max Bonus Agi): attaques supplémentaires, +1 utilisation/rang
- **Charge berserk** (max Bonus For): +1 dégât/rang en charge

### Amélioration capacités sociales

- **Attirant** (max Bonus Soc): charme amélioré, +1 situation/rang
- **Baratiner** (max Bonus Soc): +1 État Sonné infligé/rang

### Amélioration capacités physiques

- **Bon marcheur** (max Bonus Agi): ignore pénalités terrains spécifiques
- **Brouet** (max Bonus End): résistance faim améliorée

### Talents artisanaux

- **Artilleur** (max Bonus Dex): +1 DR rechargement/rang
- **Artiste** (max Bonus Dex): compétence Art, +1 spécialisation/rang
- **Bricoleur** (max Bonus Dex): réparation objets, +1 métier/rang

### Talents magiques et spirituels

- **Âme pure** (max Bonus FM): +1 Point Corruption toléré/rang
- **Béni** (max 1): accès bénédictions dieu (rang unique)
- **Bénédiction de Tzeentch** (max 1): 1 sort Magie des Couleurs (rang unique)

## Impact sur gameplay

**Montée en puissance**: talents rangs multiples permettent spécialisation et évolution

**Différenciation personnages**: même talent, nombre rangs différents = capacités différentes

**Investissement long terme**: rangs élevés coûteux mais puissants

**Synergie caractéristiques**: augmenter carac débloque nouveaux rangs talents

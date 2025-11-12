# Validation de Rang de Carrière

## Contexte

Pour progresser dans une carrière (rang N → rang N+1) ou changer de carrière à moindre coût, le personnage doit valider son rang actuel. Ce fichier documente les critères de validation et leur impact.

---

## Critères de validation

**Validation d'un rang N** : Le personnage doit remplir TOUS les critères suivants :

### 1. Caractéristiques
Toutes les caractéristiques de la carrière (cumul rangs 1 à N) à **5×N avances** minimum.

### 2. Talents
Au moins **1 talent** du rang N acquis.

### 3. Compétences
Au moins **8 compétences** de la carrière (cumul rangs 1 à N) à **5×N avances** minimum.

---

## Exemples

### Artisan rang 2 → rang 3

**Éléments carrière** :
- Rang 1 : F, E, Dex (3 carac) + 8 skills + 4 talents
- Rang 2 : Soc (1 carac) + 6 skills + 4 talents
- **Total cumulé** : 4 carac, 14 skills, 8 talents

**Validation rang 2** :
1. 4 carac à **10 avances** (5×2) : F, E, Dex, Soc
2. 1 talent du rang 2 acquis (au moins)
3. 8 skills à **10 avances** (5×2) parmi les 14 disponibles

**Coût validation** :
- 4 carac : 4 × (5×30 XP) = 600 XP
- 8 skills : 8 × (5×15 XP) = 600 XP
- 1 talent rang 2 : 100 XP
- **Total minimum** : 1300 XP

**Passage rang 3** : 100 XP après validation

### Pamphlétaire rang 1 → rang 2

**Éléments carrière** :
- Rang 1 : CT, Int, Soc (3 carac) + 8 skills + 4 talents

**Validation rang 1** :
1. 3 carac à **5 avances** (5×1) : CT, Int, Soc
2. 1 talent rang 1 acquis
3. 8 skills à **5 avances** (5×1)

**Coût validation** :
- 3 carac : 3 × (5×25 XP) = 375 XP
- 8 skills : 8 × (5×10 XP) = 400 XP
- 1 talent rang 1 : 100 XP
- **Total minimum** : 875 XP

**Passage rang 2** : 100 XP après validation

---

## Impact sur progression

### Passage de rang (même carrière)

**Condition** : Rang actuel VALIDÉ (obligatoire)

**Si rang NON validé** : IMPOSSIBLE de passer au rang supérieur (blocage système)

**Coût XP** : Voir [calculs-xp-progression.md](./calculs-xp-progression.md)

### Changement de carrière

**Impact validation** :
- Rang validé : Coût réduit
- Rang NON validé : Coût majoré (+100 XP pénalité)

**Coûts XP** : Voir [calculs-xp-progression.md](./calculs-xp-progression.md)

---

## Vérification système

**Interface** : Affiche état validation rang actuel (Validé / Non validé).

**Détails** : Liste critères avec progression :
- Caractéristiques : 4/4 à 10 avances ✓
- Talents : 2/1 acquis ✓
- Compétences : 10/8 à 10 avances ✓
- **Rang 2 : VALIDÉ**

**Blocage** : Bouton "Passer rang 3" désactivé si rang 2 non validé.

---

## Relations

**Coûts XP** : [calculs-xp-progression.md](./calculs-xp-progression.md) - Formules coûts caractéristiques/skills/talents

**Progression** : [progression-careerlevels.md](./progression-careerlevels.md) - Système 4 rangs Bronze→Silver→Gold

**Accumulation** : [accumulation-avantages-careerlevels.md](./accumulation-avantages-careerlevels.md) - Cumul éléments multi-rangs

**Workflows** :
- [workflow-progression-xp.md](../features/workflows/workflow-progression-xp.md) - Dépense XP post-création
- [workflow-changement-carriere.md](../features/workflows/workflow-changement-carriere.md) - Changement carrière

**Features** :
- [xp-career.md](../features/xp-career.md) - Gestion carrière et progression
- [xp-validation.md](../features/xp-validation.md) - Validation dépenses XP


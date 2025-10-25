---
issue: 24
stream: 2 - Implémenter Random/XP
priority: P0
depends_on: stream-1
duration: 8h
started: 2025-10-25T08:50:00Z
status: in_progress
---

# Stream 2: Implémenter Système Random/XP

## Objectif
Ajouter le système de génération aléatoire avec bonus XP de V1 dans le wizard V2.

## Problème Actuel
V2 n'a **aucun système random/XP**:
- Pas de génération aléatoire pour Species/Career/Characteristics
- 0 XP de bonus disponible (V1 offre jusqu'à +145 XP)
- Expérience étape sans XP à dépenser

## Système V1 à Porter

| Étape | Action | Bonus XP V1 | V2 Actuel |
|-------|--------|-------------|-----------|
| Species | Accepter random | +20 XP | ❌ 0 XP |
| Career | Random 1er choix | +50 XP | ❌ 0 XP |
| Career | Random 2ème choix | +25 XP | ❌ 0 XP |
| Characteristics | Accepter jets | +50 XP | ❌ 0 XP |
| Characteristics | Réassigner | +25 XP | ❌ 0 XP |
| **TOTAL MAX** | | **+145 XP** | **0 XP** |

## Plan d'Implémentation

### Phase 2.1: Modèle de Données (2h)

**Fichier**: `warhammer-v2/src/lib/characterModel.js`

Ajouter au modèle character:

```javascript
// Tracking des choix random (pour bonus XP)
randomState: {
    specie: 0,         // 0=none, 1=accepted(+20), -1=manual
    career: 0,         // 0=none, 1=first(+50), 2=second(+25), -1=manual
    characteristic: 0  // 0=none, 1=accepted(+50), 2=reassigned(+25), -1=manual
},

// Gestion des XP
xp: {
    max: 0,       // Total XP bonus gagnés
    used: 0,      // XP dépensés (advances)
    tmp_used: 0,  // XP temporaires (non validés)
    log: {}       // Historique: { advance_id: cost }
}
```

**Références V1**:
- `Character.html:34-40` - Structure randomState
- `Character.html:828-865` - Gestion XP

**Tâches**:
- [ ] Modifier characterModel.js
- [ ] Ajouter randomState avec valeurs par défaut
- [ ] Ajouter xp avec valeurs par défaut
- [ ] Créer fonctions helpers: `calculateBonusXP()`, `addXPBonus(type, amount)`
- [ ] Tester le modèle

---

### Phase 2.2: Composant RandomButton (2h)

**Fichier**: `warhammer-v2/src/components/common/RandomButton.svelte`

Créer un composant réutilisable pour la génération aléatoire.

**Props**:
```javascript
export let label = "Lancer les dés"  // Texte du bouton
export let xpBonus = 0                // XP si accepté
export let rollFunction = () => {}    // Fonction de roll
export let onAccept = () => {}        // Callback si accepté
export let onManual = () => {}        // Callback si manuel
```

**UI**:
```
┌─────────────────────────────────────┐
│  🎲 Lancer les dés (+20 XP)         │
└─────────────────────────────────────┘
        ↓ (après clic)
┌─────────────────────────────────────┐
│  Résultat: Humain                    │
│                                      │
│  [Accepter +20 XP] [Relancer] [⚙️]  │
└─────────────────────────────────────┘
```

**Animations**:
- Animation de dé qui roule (CSS)
- Affichage progressif du résultat
- Highlight du bonus XP

**Références V1**:
- `StepSpecies.html:38-82` - UI random + bonus
- `StepCareers.html:33-78` - UI random + bonus
- `StepCharacteristics.html:43-95` - UI random + bonus

**Tâches**:
- [ ] Créer RandomButton.svelte
- [ ] Implémenter états: idle, rolling, result
- [ ] Ajouter animation CSS
- [ ] Props et callbacks
- [ ] Affichage bonus XP
- [ ] Tester le composant isolé

---

### Phase 2.3: Integration Species (+20 XP) (1h)

**Fichier**: `warhammer-v2/src/components/wizard/WizardStep1Species.svelte`

**Objectif**: Ajouter génération aléatoire avec +20 XP.

**V1 Logique** (`StepSpecies.html:38-40`):
```javascript
// Roll d100
const roll = Math.floor(Math.random() * 100)

// Table de probabilités
const speciesTable = [
  { max: 90, species: 'humain' },
  { max: 94, species: 'halfling' },
  { max: 98, species: 'nain' },
  { max: 100, species: 'haut-elfe' }
]

// Trouver species selon roll
const selected = speciesTable.find(s => roll <= s.max)
```

**Modifications**:
1. Importer RandomButton
2. Ajouter section random:
   ```svelte
   <RandomButton
     label="Lancer une race aléatoire"
     xpBonus={20}
     rollFunction={rollRandomSpecies}
     onAccept={acceptRandomSpecies}
     onManual={chooseManually}
   />
   ```
3. Implémenter `rollRandomSpecies()` avec d100
4. Si accepté: `character.randomState.specie = 1` et `character.xp.max += 20`
5. Si manuel: `character.randomState.specie = -1`

**Tâches**:
- [ ] Ajouter RandomButton import
- [ ] Créer rollRandomSpecies() avec d100
- [ ] Créer acceptRandomSpecies() (randomState + XP)
- [ ] Créer chooseManually() (randomState)
- [ ] Tester génération aléatoire
- [ ] Vérifier XP bonus ajouté

**Références V1**: `StepSpecies.html:38-82`

---

### Phase 2.4: Integration Career (+50/+25 XP) (2h)

**Fichier**: `warhammer-v2/src/components/wizard/WizardStep2Career.svelte`

**Objectif**: Ajouter génération aléatoire avec +50 XP (1er choix) ou +25 XP (2ème choix).

**V1 Logique** (`StepCareers.html:33-35`):
```javascript
// 1er niveau: Roll dans career class
const class = rollCareerClass()  // Guerrier, Roublard, etc.
// Bonus: +50 XP si accepté

// 2ème niveau: Roll dans careers de la classe
const career = rollCareerFromClass(class)
// Bonus: +25 XP si accepté
```

**Modifications**:
1. Ajouter RandomButton pour chaque niveau de choix
2. Niveau 1 (classe): +50 XP si accepté
3. Niveau 2 (carrière): +25 XP si accepté
4. Tracking: `character.randomState.career = 1` (first/+50) ou `2` (second/+25)

**Tâches**:
- [ ] Ajouter RandomButton pour career class
- [ ] Implémenter rollCareerClass()
- [ ] Ajouter RandomButton pour specific career
- [ ] Implémenter rollSpecificCareer()
- [ ] Gérer randomState.career (1 ou 2)
- [ ] Ajouter XP bonus (+50 ou +25)
- [ ] Tester les deux niveaux

**Références V1**: `StepCareers.html:33-78`

---

### Phase 2.5: Integration Characteristics (+50/+25 XP) (1h)

**Fichier**: `warhammer-v2/src/components/wizard/WizardStep3Characteristics.svelte`

**Objectif**: Ajouter génération aléatoire avec +50 XP (accepté) ou +25 XP (réassigné).

**V1 Logique** (`StepCharacteristics.html:43-45`):
```javascript
// Roll 2d10 pour chaque caractéristique
const characteristics = [
  'CC', 'CT', 'F', 'E', 'I', 'Ag', 'Dex', 'Int', 'FM', 'Soc'
]

characteristics.forEach(char => {
  const roll1 = Math.floor(Math.random() * 10) + 1
  const roll2 = Math.floor(Math.random() * 10) + 1
  character[char] = roll1 + roll2
})

// Option 1: Accepter → +50 XP
// Option 2: Réassigner 3 points → +25 XP
// Option 3: Manuel → 0 XP
```

**Modifications**:
1. Ajouter RandomButton "Lancer les caractéristiques"
2. Roll 2d10 pour chaque caractéristique
3. Proposer:
   - Accepter tel quel (+50 XP)
   - Réassigner 3 points (+25 XP)
   - Choisir manuellement (0 XP)
4. Tracking: `character.randomState.characteristic = 1` (+50) ou `2` (+25) ou `-1` (0)

**Tâches**:
- [ ] Ajouter RandomButton
- [ ] Implémenter rollCharacteristics() (2d10 × 10)
- [ ] Implémenter acceptRolls() (+50 XP, randomState=1)
- [ ] Implémenter reassignPoints() (+25 XP, randomState=2)
- [ ] Implémenter chooseManually() (0 XP, randomState=-1)
- [ ] Tester les 3 options

**Références V1**: `StepCharacteristics.html:43-95`

---

### Phase 2.6: Affichage XP Total (30min)

**Fichier**: `warhammer-v2/src/components/wizard/WizardProgress.svelte`

Ajouter affichage du total XP accumulé:

```svelte
<div class="xp-display">
  <span class="label">XP Bonus:</span>
  <span class="value">{$character.xp.max} XP</span>
</div>
```

**Tâches**:
- [ ] Ajouter section XP dans WizardProgress
- [ ] Afficher character.xp.max
- [ ] Style visuel (badge/pill)
- [ ] Animation quand XP change

---

### Phase 2.7: Experience Step Integration (30min)

**Fichier**: `warhammer-v2/src/components/wizard/WizardStep12Experience.svelte`

Modifier pour afficher et permettre de dépenser les XP bonus.

**Modifications**:
1. Afficher `character.xp.max` disponible
2. Tracker `character.xp.used` dépensés
3. Calculer restant: `character.xp.max - character.xp.used`

**Tâches**:
- [ ] Afficher XP disponible
- [ ] Système de dépense XP
- [ ] Validation (ne pas dépasser max)
- [ ] Log des achats

---

## Critères de Succès

Phase 2.1:
- [ ] Modèle characterModel.js étendu avec randomState et xp
- [ ] Fonctions helpers créées

Phase 2.2:
- [ ] Composant RandomButton créé et réutilisable
- [ ] Animation de dé fonctionnelle
- [ ] Props et callbacks implémentés

Phase 2.3:
- [ ] Species step avec random (+20 XP)
- [ ] Bonus XP ajouté correctement

Phase 2.4:
- [ ] Career step avec random (+50/+25 XP)
- [ ] Deux niveaux de choix fonctionnels

Phase 2.5:
- [ ] Characteristics step avec random (+50/+25 XP)
- [ ] Trois options fonctionnelles

Phase 2.6:
- [ ] XP total affiché dans WizardProgress

Phase 2.7:
- [ ] Experience step peut dépenser XP

**Global**:
- [ ] Jusqu'à +145 XP disponible
- [ ] randomState correctement tracké
- [ ] Tous les tests manuels passent
- [ ] Commits fréquents (un par phase)

## Références V1

**Code clé**:
- `Character.html:34-40` - Structure randomState
- `Character.html:828-865` - Gestion XP
- `StepSpecies.html:38-82` - Random species
- `StepCareers.html:33-78` - Random career
- `StepCharacteristics.html:43-95` - Random characteristics

## Durée Estimée

- Phase 2.1: 2h (modèle)
- Phase 2.2: 2h (RandomButton)
- Phase 2.3: 1h (Species)
- Phase 2.4: 2h (Career)
- Phase 2.5: 1h (Characteristics)
- Phase 2.6: 30min (affichage)
- Phase 2.7: 30min (Experience)

**Total: 8h**

## Next Steps

Après Stream 2, lancer Stream 3 (Optimisation - 4h).

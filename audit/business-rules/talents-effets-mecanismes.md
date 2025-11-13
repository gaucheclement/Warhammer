# Talents - Effets et Mécanismes

## Vue d'ensemble

Système unifié des effets de talents via 4 mécanismes principaux modifiant le personnage : `addCharacteristic` (caractéristiques), `addTalent` (chaînes talents), `addSkill` (compétences), `addMagic` (domaines magie). Combinés avec système rangs multiples et spécialisations.

## addCharacteristic - Modification Caractéristiques

### Fonctionnement et formules
**Champ**: nom exact caractéristique. **Effet**: bonus permanent selon type et rangs. **Permanence**: actif tant que talent possédé.

**Formules**: Points Blessures (+Bonus End/rang), Mouvement/Chance/Détermination/Corruption (+1/rang), Autres CC/CT/F/E/I/Ag/Dex/Int/FM/Soc (+5/rang).

**Exemples**: Affable (Soc +5 max 1), Chanceux (Chance +1 max Bonus Soc), Âme pure (Corruption +1 max Bonus FM), Très fort (For +5 max Bonus For → For 30 base + 3 rangs = For 45).

### Ordre calcul
1. Base espèce, 2. Tirage aléatoire, 3. Bonus talents, 4. Bonus étoile, 5. Augmentations carrière

### Validation
Nom valide (characteristics.json), pas doublons (1 talent = 1 carac), calcul cohérent.

## addTalent - Déblocage Autres Talents

### Fonctionnement
**Champ**: nom talent débloqué. **Condition**: source acquis ≥1 rang. **Effet**: ajoute à liste carrière (pas gratuit, coût XP normal). **Permanence**: reste accessible même si source perdu.

### Exemple
Flagellant → Frénésie: acquisition Flagellant débloque Frénésie dans carrière → acheter Frénésie XP → frénésie instantanée après flagellation.

### Validation
Existence cible (talent existant), pas cycles (A→B→C→A), unicité (1 source = 1 débloqué).

## addSkill - Ajout Compétences

### Fonctionnement
**Champ**: nom compétence. **Format**: "Nom", "Nom (Spé)" ou "Nom (Au choix)". **Effet**: ajout auto gratuit (0 avances, origine "talent"). **Retrait**: si talent perdu (sauf avances investies).

### Formats
Simple ("Emprise sur les animaux"), spé fixe ("Chevaucher (Cheval)"), spé choix ("Art (Au choix)" → joueur choisit parmi specs, spé talent = spé compétence).

### Validation
Nom existe (skills.json), format valide, cohérence spé (si "(Au choix)" → specs rempli).

## addMagic - Accès Domaines Magiques

### Fonctionnement
**Champ**: type magie. **Effet**: accès sorts (couplé specs pour domaine précis). **Acquisition sorts**: achat XP après déblocage. **Oubli**: si talent perdu.

### Domaines
"Béni" (divine, specs: dieux), "Magie mineure" (Bonus FM sorts), "Magie des Arcanes" (couleurs, illimité XP), "Magie du Chaos" (Chaos, selon rang, corruption), "Invocation" (entités, illimité XP).

### Validation
Domaine valide, cohérence specs (si addMagic → specs nécessaire).

## Spécialisations

Système unifié gérant spécialisations talents et compétences. Voir [specialisations-skills-talents.md](./specialisations-skills-talents.md) pour règles complètes de sélection, validation et interaction addSkill.

## Rangs Multiples

### Types max
Unique (max=1: Béni, Affable), fixes (max=nombre: Ambidextre max 2), dynamiques (max=formule: "Bonus d'Agilité/Dextérité/Force/Endurance/FM/Sociabilité" = Math.floor(carac/10)), illimités (max="Aucun").

### Acquisition
**Séquentielle** 1 par 1. **Coût**: 100×niveau_rang (rang 1: 100 XP, rang 2: 200 XP), ×2 si hors carrière.

### Cumul effets
Additif (Bonnes jambes 3 rangs → +3 DR), progressif (Ambidextre rang 1: -10, rang 2: 0), seuil (rangs débloquent effets).

### Plafonds
Dynamique (max=formule recalculé si Bonus change: Agi 35→max 3, Agi 42→max 4), absolu (max=nombre fixe), conservation (Bonus baisse: rangs acquis gardés, nouveaux bloqués).

### Validation
1. Rangs 1 à N-1 possédés, 2. Max actuel calculé, 3. N ≤ max, 4. XP disponibles.

## Patterns techniques

- [pattern-specialisations.md](../patterns/pattern-specialisations.md) - Spécialisations "(Au choix)" vs liste fermée
- [pattern-parsing.md](../patterns/pattern-parsing.md) - Format CSV "A, B, C"
- [pattern-modificateurs-caracteristiques.md](../patterns/pattern-modificateurs-caracteristiques.md) - Formules bonus

## Voir aussi

- [talents.md](../database/talents.md) - Table talents
- [skills.md](../database/skills.md) - Compétences
- [characteristics.md](../database/characteristics.md) - Caractéristiques
- [specialisations-skills-talents.md](./specialisations-skills-talents.md) - Règles spécialisations

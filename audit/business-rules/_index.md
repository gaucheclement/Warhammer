# Index des Règles Métier Transverses

Règles métier complexes impliquant **plusieurs tables** ou **systèmes globaux**.

**Principe**: Si règle concerne UNE seule table → [database/](../database/)
Si comportement technique réutilisable → [patterns/](../patterns/)

---

## Calculs Cross-Table

### Détails Physiques
[calculs-details-physiques.md](./calculs-details-physiques.md)

**Tables**: Species → Details (eyes, hairs, height, weight, age)

Calcul taille, poids, âge selon espèce et dés.

### Expérience et Progression
[calculs-xp-progression.md](./calculs-xp-progression.md)

**Tables**: Character → Skills, Talents, Characteristics

Formules de coût XP, plafonds, historique.

### Encombrement
[calcul-encombrement.md](./calcul-encombrement.md)

**Tables**: Trappings → Character

Calcul poids total, limites Force, pénalités.

---

## Systèmes de Progression

### Compétences - Avances
[skills-avances-progression.md](./skills-avances-progression.md)

**Tables**: Skills, CareerLevels, Character

Système d'avances, coûts XP, plafonds +20/+10.

### Talents - Rangs Multiples
[talents-rangs-multiples.md](./talents-rangs-multiples.md)

**Tables**: Talents, Character

Talents prenables plusieurs fois, coûts par rang.

---

## Interactions Talents

### Ajout Compétences Magiques
[talents-ajout-skills-magie.md](./talents-ajout-skills-magie.md)

**Tables**: Talents → Skills, Spells

Talents déverrouillant compétences (Magie des Arcanes, etc.).

### Déblocage Talents
[talents-deblocage-talents.md](./talents-deblocage-talents.md)

**Tables**: Talents → Talents

Chaînes de prérequis (`addTalent`), détection cycles.

### Modification Caractéristiques
[talents-modification-caracteristiques.md](./talents-modification-caracteristiques.md)

**Tables**: Talents → Characteristics

Talents augmentant caractéristiques (+SL).

### Application Effets
[application-effets-talents.md](./application-effets-talents.md)

**Tables**: Talents → Character (global)

Orchestration application de tous effets talents.

---

## Ce qui N'EST PAS ici

### Dans database/
- Règles spécifiques à UNE table
- Structure des données d'une table
- Relations simples d'une table

### Dans patterns/
- Comportements techniques unitaires (parsing, validation)
- Patterns réutilisables indépendants du métier

---

## Statistiques

**Nombre de règles métier**: 9

**Par catégorie**:
- Calculs: 3
- Progression: 2
- Talents: 4

# Magie - Recherche sorts

## Vue d'ensemble

Recherche et filtrage sorts permet trouver rapidement sorts selon criteres multiples : nom, domaine, CN, disponibilite.

**References** : [display.md](display.md), [database/spells.md](../../database/spells.md)

## Criteres recherche

### Par nom
- Recherche textuelle partielle
- Insensible casse
- Exemples : "Feu" trouve "Boule Feu", "Arme Enflammee", "Mur Flammes"

### Par domaine/lore
- Arcanes : Bete, Cieux, Feu, Lumiere, Metal, Mort, Ombres, Vie
- Divine : Par dieu (Sigmar, Ulric, Manann, etc.)
- Mineurs : Petty Magic
- Autres : Naturelle, Sorcellerie, Chaos

### Par CN
- Plages : CN 0, CN 1-3, CN 4-6, CN 7-9, CN 10+
- Slider : CN min/max
- Divine : Pas CN (filtrer separement)

### Par disponibilite
- **Connus** : Sorts deja appris
- **Disponibles** : Accessibles avec talents actuels
- **Inaccessibles** : Prerequis manquants

### Par carriere
- **Dans carriere** : Cout normal
- **Hors carriere** : Cout double
- **Interdit** : Carriere bloque (Repurgateur, etc.)

## Filtres combinables

### Exemples combinaisons

**Feu + CN 4-6 + Disponibles** :
- "Boule Feu" (CN 5)
- "Lames Ardentes" (CN 6)

**Divine + Sigmar + Non appris** :
- Miracles Sigmar non connus
- Cout XP affiche

**Petty + Connus** :
- Sorts mineurs deja appris

**Tous + CN 0-3** :
- Sorts faciles toutes traditions

## Tri resultats

### Ordres tri
- **Par CN** : Croissant (0 → 10+)
- **Par nom** : Alphabetique
- **Par domaine** : Grouper traditions
- **Par cout** : XP croissant
- **Par disponibilite** : Connus d'abord

### Tri par defaut
CN croissant, puis nom alphabetique

## Affichage resultats

### Liste compacte
```
Boule Feu (Feu, CN 5) - Disponible, 50 XP
Choc (Petty, CN 0) - Connu
Forme Bete (Bete, CN 7) - Inaccessible (autre domaine)
```

### Carte detaillee
```
┌─────────────────────────────────┐
│ Boule Feu [FEU]                 │
│ CN: 5 | Portee: 12m | Cible: 1 │
│ Duree: Instantanee              │
│ Degats zone, +1 En flammes      │
│ Cout: 50 XP (dans carriere)    │
│ [APPRENDRE]                     │
└─────────────────────────────────┘
```

## Recherche avancee

### Par description
- Recherche texte description sort
- Exemples : "degats", "guerison", "protection"

### Par effets
- Etats infliges : "Sonne", "En flammes", "Aveugle"
- Types degats : "feu", "foudre", "magique"

### Par portee
- Contact, Vous, 6m, 12m, (FM) metres

### Par duree
- Instantanee, Rounds, Heures, Permanent

## Suggestions recherche

### Recherches frequentes
- "Sorts faciles" → CN 0-3
- "Sorts combat" → CN 4-7, duree courte
- "Sorts utilitaires" → Petty, duree longue
- "Sorts guerison" → Description "guerison", "Blessures"

### Recherches personnage

**Apprenti debut** : CN 0-3, disponibles, dans carriere
**Magister confirme** : CN 4-8, domaine specifique
**Pretre** : Divine, dieu servi, benedictions + miracles

## Filtres rapides

### Presets
- **Debutant** : CN 0-3, disponibles
- **Expert** : CN 7+, disponibles
- **Economique** : Cout ≤ 50 XP
- **Hors carriere** : Couteux, accessibles
- **Petty** : CN 0, universel s

## Resultats vides

### Messages suggestions
- "Aucun sort disponible domaine Bete (talent manquant)"
- "Aucun sort CN 10+ connu (progression requise)"
- "Recherche '{texte}' aucun resultat"

### Suggestions alternatives
- Afficher sorts proches criteres
- Proposer elargir recherche
- Indiquer prerequis manquants

## Exemples recherches

**Recherche "feu"** :
- "Boule Feu", "Arme Enflammee", "Mur Flammes", "Lames Ardentes"

**Filtres : Feu + CN 4-6 + Disponibles** :
- "Boule Feu" (CN 5), "Lames Ardentes" (CN 6)

**Recherche "guerison" + Divine** :
- "Guerison Miraculeuse", "Benediction Guerison"

**Filtres : Petty + Non appris** :
- Sorts mineurs accessibles pas encore connus

**Recherche description "protection"** :
- "Armure Aethyrique", "Dome Protection", "Bouclier Foi"

## Regles coeur

1. Recherche textuelle nom/description
2. Filtres multiples combinables
3. Tri CN/nom/cout/disponibilite
4. Affichage compact ou detaille
5. Suggestions recherches vides
6. Presets recherches frequentes
7. Distinction connus/disponibles/inaccessibles

## Relations

**Display** → Affichage resultats (display.md)
**Spells** → Base donnees sorts (database/spells.md)
**Domains** → Filtrage domaines (domains.md)
**Learning** → Disponibilite sorts (learning.md)

---

**Navigation** : [display.md](display.md) | [database/spells.md](../../database/spells.md) | [Index Features](../README.md)

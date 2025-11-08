# Wizard Species - Affichage Détails Espèce

## Vue d'ensemble

**Objectif** : Afficher détails et modificateurs espèce pour informer joueur lors création.

**Contexte** : Pendant et après sélection espèce (voir [species-selection.md]).

**Rôle** : Aide décision, confirmation choix, référence.

## Détails descriptifs

### Description narrative

**Source** : `species.desc` (HTML)

**Contenu** : Contexte culturel, apparence, points de vue inter-races, règles spéciales

**Format** : HTML préservant `<i>`, `<b>`, `<BR>`

### Compétences raciales

**Source** : `species.skills` (parsing requis, voir [parsing-skills-talents.md])

**Format** : Liste virgules, spécialisations parenthèses, "(Au choix)" souligné, " ou " évident

**Exemple Nains** : "Calme, Corps à corps (Base), Métier (Au choix), Langue (Khazalid)..."

**Nombre** : 8-10 compétences

### Talents raciaux

**Source** : `species.talents` (parsing requis, voir [parsing-skills-talents.md])

**Format** : Liste virgules, choix " ou " soulignés, "X Talent aléatoire" indiqué

**Exemple Nains** : "Costaud, Déterminé ou Obstiné, Résistance magie, Vision nocturne"

**Nombre** : 4-6 talents

## Modificateurs raciaux

### Caractéristiques de base

**Source** : `characteristics[].rand[species.refChar]` (voir [species-base-characteristics.md])

**Affichage** : Tableau avec mise en évidence

| Carac | Valeur | Mise en évidence |
|-------|--------|------------------|
| 30+ | Élevée | 🟢 Vert |
| 20 | Standard | Neutre |
| ≤10 | Faible | 🔴 Rouge |

**Exemple Nain** : E 30 🟢, FM 40 🟢, Ag 10 🔴, Soc 10 🔴

### Blessures, Mouvement

**Blessures** : Formule selon espèce affichée

**Mouvement** : "{M} (Marche {M×2}, Course {M×4} yards/s)"

**Destin/Résilience** : Valeurs + Extra Points à distribuer

## Talents raciaux spéciaux

**Vision nocturne** : Nains, Elfes, Gnomes (voir 20 yards)

**Résistance magie** : Nains (bonus tests)

**Résistance Chaos** : Halflings (immunité mutations)

**Costaud** : Nains (+5 E)

**Petit** : Halflings, Gnomes (taille réduite)

**Affichage** : Badges/icônes

## Autres attributs

### Taille/Âge

**Source** : `details.rand[species.refDetail]` (voir [calculs-details-physiques.md])

**Affichage** : "Base + Roll" avec range

**Exemples** :
- Humain : 160 + 2d10 cm (160-180), 16 + 2d10 ans (16-36)
- Nain : 137 + 2d10 cm (137-157), 15 + 10d10 ans (25-115)
- Ogre : 250 + 2d10 cm (250-270)

### Yeux/Cheveux

**Source** : Tables eyes/hairs (2d10)

**Affichage** : "Variété selon espèce (tirage lors détails)"

## Exemples affichage

### Humain (Reiklander)
- **Carac** : 20+2d10 partout (équilibré)
- **B** : BF + 2×BE + BFM | **M** : 4
- **Destin** : 2, Résilience : 1, Extra : 3
- **Skills** : Calme, Charme, Commandement...
- **Talents** : Perspicace ou Affable, Destinée, 3 aléatoire
- **Capacités** : Aucune spéciale

### Nain
- **Carac** : E 30 🟢, FM 40 🟢, Ag 10 🔴, Soc 10 🔴
- **B** : BF + 2×BE + BFM | **M** : 3
- **Destin** : 0, Résilience : 2, Extra : 2
- **Skills** : Calme, Métier (Au choix), Langue (Khazalid)...
- **Talents** : Costaud, Vision nocturne, Résistance magie, Déterminé ou Obstiné
- **Capacités** : Vision nocturne (20 yards), Résistance magie

### Haut Elfe
- **Carac** : I 40 🟢🟢, autres 30 🟢
- **B** : BF + 2×BE + BFM | **M** : 5
- **Destin** : 0, Résilience : 0, Extra : 0
- **Skills** : Corps à corps (Escrime), Langue (Eltharin)...
- **Talents** : Vision nocturne, Sang-froid, Perspicace
- **Capacités** : Vision nocturne (20 yards)

### Halfling
- **Carac** : CT 30 🟢, Dex 30 🟢, autres 10-20
- **B** : 2×BE + BFM (pas BF) | **M** : 3
- **Destin** : 0, Résilience : 0, Extra : 0
- **Skills** : Charme, Métier (Cuisinier), Intuition...
- **Talents** : Résistance Chaos, Petit, Chanceux ou Perspicace
- **Capacités** : Résistance Chaos, Taille réduite

### Ogre
- **Carac** : F 35 🟢, E 35 🟢, I 0 🔴
- **B** : (BF + 2×BE + BFM) × 2 | **M** : 4
- **Destin** : 0, Résilience : 0, Extra : 0
- **Talents** : Effrayant, Grande taille
- **Capacités** : Très robuste (B ×2), Lent (I 0)

## Organisation interface

### Sections

1. **Titre + Description** : Nom + narratif HTML
2. **Caractéristiques** : Tableau avec couleurs
3. **Modificateurs** : B, M, Destin, Résilience, Extra
4. **Compétences** : Liste parsée
5. **Talents** : Liste parsée + badges
6. **Détails physiques** : Taille, Âge (ranges)

### Mise en page

**Colonne gauche** : Description, Compétences, Talents

**Colonne droite** : Caractéristiques, Modificateurs, Capacités

**Badges** : Vision nocturne, Résistance magie/Chaos, Petit

## Relations tables

| Table | Champ | Usage |
|-------|-------|-------|
| Species | desc, skills, talents, refChar | Contenu affichage |
| Characteristics | rand[espèce] | Valeurs |
| Details | rand[espèce] | Taille, âge |
| Skills | label, spec | Résolution |
| Talents | label, spec | Résolution |

## Voir aussi

- [species.md](../../database/species.md) - Champs desc, skills, talents
- [species-selection.md](./species-selection.md) - Contexte
- [species-base-characteristics.md](./species-base-characteristics.md) - Caractéristiques
- [parsing-skills-talents.md](../../business-rules/parsing-skills-talents.md) - Parsing
- [calculs-details-physiques.md](../../business-rules/calculs-details-physiques.md) - Taille/Âge

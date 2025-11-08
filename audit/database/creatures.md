# Creatures

## Vue d'ensemble

Profils complets des créatures de Warhammer : races jouables, bêtes, monstres, morts-vivants, démons. Définit caractéristiques, traits, compétences, talents, équipement et sorts. 62 entrées.

## Structure des données

### Champs principaux

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| index | Nombre | Oui | Identifiant unique de la créature |
| label | Texte | Oui | Nom de la créature |
| title | Texte | Non | Sous-titre descriptif (ex: "Bandit humain", "Maître sorcier OR 1") |
| folder | Texte | Oui | Catégorie d'organisation (ex: "Les peuples du Reikland") |
| char | Objet | Oui | Caractéristiques de la créature (M, CC, CT, F, E, I, Ag, Dex, Int, FM, Soc, B) |
| traits | Texte | Non | Liste des traits séparés par virgules |
| optionals | Texte | Non | Traits facultatifs pour variantes |
| skills | Texte | Non | Compétences avec niveaux (ex: "Chevaucher (Cheval) 58") |
| talents | Texte | Non | Talents de la créature |
| trappings | Texte | Non | Équipement et possessions |
| spells | Texte | Non | Sorts connus |
| desc | HTML | Non | Description narrative de la créature |
| book | Texte | Oui | Code du livre source (LDB, MSR, EDO) |
| page | Nombre | Oui | Numéro de page dans le livre |

### Caractéristiques (char)

12 caractéristiques: M (1-8), CC (0-80), CT (0-80), F (5-80), E (10-80), I (5-70), Ag (20-60), Dex (20-40), Int (5-65), FM (15-70), Soc (5-45), B (10-72). Valeur "–" = non applicable (créatures bestiales, fabriquées, etc.).

## Relations avec autres tables

### Relations directes

**traits.json**: Champs `traits` et `optionals` (ex: "Arme +7", "Taille (Grande)", "Vision nocturne")
**skills.json**: Champ `skills` (format: "Nom (Spéc) Niveau, ..." ex: "Corps à corps (Base) 52, Esquive 48")
**talents.json**: Champ `talents` (ex: "Lire/Écrire, Magie des Arcanes (Ghur), Noblesse")
**spells.json**: Champ `spells` (ex: "Alerte, Fléchette, La lance d'Ambre")
**trappings.json**: Champ `trappings` (ex: "Bâton de combat, Grimoire, 1 CO")
**lores.json / magicks.json**: Via "Lanceur de Sorts (Type)" dans traits
**books.json**: Champs `book` et `page`
**gods.json**: Via "Béni (Divinité)" ou "Miracles (Divinité)" dans traits

## Gestion des Traits, Skills et Talents

### Traits de créatures

Trois formats: Simple ("Vision nocturne"), Avec indice ("Arme +7"), Avec paramètre ("Taille (Grande)").
- `traits`: Obligatoires, toujours présents
- `optionals`: Variantes possibles selon contexte

Ex Humain - Traits: "Arme +7, Préjugé (un au choix)" / Optionals: "À distance +8 (50), Lanceur de Sorts"

### Skills et Talents

**Skills**: Format "Nom (Spéc) Niveau, ..." (ex: "Corps à corps (Arme d'hast) 62, Esquive 48")
**Talents**: Liste simple (ex: "Lire/Écrire, Magie des Arcanes (Ghur), Noblesse")

### Différence avec personnages

**Créatures**: Profils prédéfinis complets, caractéristiques fixes. Usage: PNJ, monstres, adversaires, animaux, démons.
**Personnages**: Construction progressive via species + careers.

## Catégories de créatures

7 catégories via `folder`: (1) Les peuples du Reikland (races + PNJ), (2) Les bêtes du Reikland (animaux), (3) Les bêtes monstrueuses (Basilic, Griffon, Manticore), (4) Spectres et horreurs (morts-vivants), (5) Peaux-vertes (Gobelins, Orques), (6) Hommes-bêtes et mutants (Chaos), (7) Démons (Sanguinaires, Démonettes, Furies).

## Logique métier

### Calcul des Blessures

Formule selon Taille (trait): Minuscule=1, Très petite=Bonus E, Petite=2×Bonus E + Bonus FM, Moyenne=Bonus F + 2×Bonus E + Bonus FM, Grande=×2, Énorme=×4, Monstrueuse=×8. Le champ `B` stocke le résultat final.

### Traits modifiant les caractéristiques

Brutal (-1 M, -10 Ag, +10 F, +10 E), Rapide (+1 M, +10 Ag), Grand (+10 F, +10 E, -5 Ag), Intelligent (+20 Int, +10 I), Coriace (+10 E, +10 FM), Élite (+20 CC, +20 CT, +20 FM), Rusé (+10 Soc, +10 Int, +10 I). Appliqués AVANT utilisation.

### Gestion de la magie

Traits magiques: "Lanceur de Sorts (Type)" (sorts arcanes), "Miracles (Divinité)" (miracles divins), "Béni (Divinité)" (bénédictions). Le champ `spells` liste les sorts connus.

## Tests de cohérence

### Tests requis

**Caractéristiques**: Plages valides (M: 1-8, autres: 0-80). Si Soc="–" alors trait Bestial ou Fabriqué. Si trait Lanceur de Sorts alors Int et FM ≠ "–".

**Traits**: Références valides dans traits.json. Format indice correct ("Arme +7"). Cohérence Taille vs Blessures.

**Relations**: Skills/Talents/Sorts/Books doivent exister dans leurs tables respectives.

**Logique**: Bestial → Soc="–". Fabriqué → Int/FM/Soc="–". À distance → CT≠"–". Spells non vide → trait Lanceur de Sorts ou Miracles.

## Validation des données

### Règles par champ

**index**: Entier ≥0, unique | **label**: Texte non vide, max 100 car | **folder**: 1 des 7 catégories
**char**: 12 clés (M, CC, CT, F, E, I, Ag, Dex, Int, FM, Soc, B). Valeurs: nombre (plage autorisée) ou "–"
**traits/optionals**: "Trait1, Trait2..." Pattern: "Nom", "Nom Indice", "Nom (Param)"
**skills**: "Skill1 (Spec1) Niv1, Skill2 Niv2..." Niveaux 0-100
**talents**: "Talent1, Talent2 (Spec2)..." | **trappings**: Texte libre | **spells**: "Sort1, Sort2..."
**desc**: HTML valide (balises: br, b, i, ul, li, table)
**book**: 2-3 lettres maj (LDB, MSR, EDO) | **page**: Entier 1-999

### Messages d'erreur métier

- "Créature {label}: caractéristique {char} hors plage autorisée"
- "Créature {label}: trait {trait} non trouvé dans la base de données"
- "Créature {label}: Soc défini mais créature marquée Bestial"
- "Créature {label}: sorts présents mais pas de trait Lanceur de Sorts"
- "Créature {label}: compétence {skill} non trouvée"
- "Créature {label}: talent {talent} non trouvé"
- "Créature {label}: référence livre {book} invalide"
- "Créature {label}: Points de Blessures incohérents avec la Taille"

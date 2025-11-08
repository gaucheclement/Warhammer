# Table Traits - Documentation

## Vue d'ensemble

Contient 84 traits de créatures Warhammer Fantasy (capacités spéciales, caractéristiques physiques, comportements). Définissent les particularités qui distinguent créatures des PNJ et entre elles.

**Fichier**: `data/traits.json` (75 KB)

## Structure

### Champs clés

| Champ | Type | Description | Exemples |
|-------|------|-------------|----------|
| index | Nombre | ID unique | 0-83 |
| label | Texte | Nom trait | "Arme", "Vol", "Taille" |
| prefix | Texte | Paramètres requis | "(Indice)", "(Cible)", "(Type)" |
| suffix | Texte | Modificateur label | "#" pour Tentacules |
| desc | HTML | Description règles | Texte formaté |
| book | Texte | Référence source | "LDB", "EDO" |
| page | Nombre | Page livre | 338-343, 83-84 |

### Paramètres traits (prefix)

Certains traits requièrent paramètres à l'instanciation:

**Indice**: valeur numérique dégâts/protection ("Arme (7)", "Armure (3)", "Vol (60)")

**Cible**: entité visée par effet ("Animosité (Gobelins)", "Haine (Skavens)")

**Type**: catégorie dégâts/effet ("Immunité (Poison)", "Souffle (Feu)")

**Divers**: info contextuelle ("Béni (Sigmar)", "Lanceur de Sorts (Magie des Arcanes)")

**Multiples**: combinaisons ("Cornes (6) (Aspect démoniaque)", "Souffle (8) (Feu)")

### Cas spéciaux

**Taille**: trait complexe avec 7 catégories (Minuscule → Monstrueuse), modifie combat, mouvement, blessures, psychologie

**Dressé**: liste compétences spécifiques (Divertir, Dompté, Garder, Guerre, Magie, Monture, Rapporter, Revenir, Trait)

**Tentacules**: suffix "#" indique quantité variable (ex: "Tentacules 4 (6)" = 4 tentacules causant 6 dégâts)

**Démoniaque/Éthéré/Mort-vivant**: états ontologiques affectant règles base (nourriture, air, blessures magiques)

## Relations tables

### Directes

**→ Créatures** (via matching): `creatures.json` liste traits par créature. Chaque créature = liste traits + paramètres.

**→ Livres** (book + page): `books.json` pour références sources. LDB (Livre de Base) majoritaire, EDO (Ennemis dans l'Ombre) pour Chaos.

### Implicites

**Traits → Caractéristiques**: modificateurs stats
- "Brutal": -1 M, -10 Ag, +10 F/E
- "Élite": +20 CC/CT/FM
- "Grand": +10 F/E, -5 Ag
- "Rapide": +1 M, +10 Ag
- "Intelligent": +20 Int, +10 I
- "Rusé": +10 Soc/Int/I
- "Coriace": +10 E/FM

**Traits → Compétences**: restrictions/bonus
- "Bestial": défense Esquive seulement
- "Arboricole": bonus Ag DR aux Tests Escalade/Discrétion (forêts)
- "Amphibie": bonus Ag DR Tests Natation

**Traits → Psychologie**: interactions états mentaux
- "Belliqueux": Immunité Psychologique si Avantages > adversaire
- "Frénésie": peut entrer en Frénésie
- "Immunité Psychologique": ignore Peur/Terreur/Animosité

**Traits → Talents**: références croisées
- "Vision nocturne": renvoie au Talent Vision nocturne
- "Béni": créature peut accorder Bénédictions
- "Miracles": créature accomplit Miracles

**Traits → États**: génèrent conditions
- "Constricteur": inflige État Empêtré
- "Toile": inflige État Empêtré avec Force
- "Venin": inflige État Empoisonné
- "Souffle (Feu)": inflige État Enflammé

**Traits → Corruption/Chaos**: liens mutations
- "Corruption": Degré indiqué, voir p.182
- "Corruption mentale": table p.185
- "Mutation": table Corruptions physiques p.184
- "Marque de Tzeentch": 1d10/3 Mutations alternées

## Types SQL

| Champ | Type | Contraintes |
|-------|------|-------------|
| index | INTEGER | PK, NOT NULL |
| label | VARCHAR(100) | NOT NULL, UNIQUE |
| prefix | VARCHAR(100) | - |
| suffix | VARCHAR(10) | - |
| desc | TEXT | NOT NULL |
| book | VARCHAR(20) | NOT NULL |
| page | INTEGER | NOT NULL |

## Exemples

**Combat simple** - Arme (7): créature inflige 7 dégâts (bonus Force inclus) avec arme/griffes/morsure

**Protection** - Armure (3): PA 3 à toutes localisations (peau épaisse/armure naturelle)

**Mobilité** - Vol (60): vole jusqu'à 60m par Mouvement, ignore terrains/obstacles

**Attaque spéciale** - Souffle (10) (Feu): cône 10 dégâts, ignore PA, inflige État Enflammé, portée = Bonus E +20m

**Psychologie** - Peur (2): provoque Peur niveau 2, Tests FM requis

**Capacité magique** - Lanceur de Sorts (Magie des Arcanes): peut lancer sorts domaine indiqué

**Ontologie** - Mort-vivant: pas besoin air/nourriture/eau, affecté par sorts anti-morts-vivants

**Taille complexe** - Taille (Grande): multiplicateur dégâts x2 vs plus petits, +Blessures, provoque Peur, piétinement

## Tests cohérence

### Structure

**Obligatoires**: index, label, desc, book, page renseignés. Index et label uniques.

**prefix validité**:
- Si paramètres: format "(X)" cohérent
- Parenthèses équilibrées
- Termes standards: Indice, Cible, Type, Divers, Degré, Portée, Difficulté, Aspect

**suffix usage**: uniquement pour cas spéciaux quantifiables (Tentacules)

**desc complétude**: règles mécaniques claires, références page si renvoi

### Relations

**Livres**: book existe dans books.json, page > 0

**Créatures**: chaque trait utilisé par ≥1 créature ou réservé PNJ spéciaux

**Cross-refs internes**: desc mentionne autres traits/talents/sorts → vérifier existence
- "Voir Psychologie page 190"
- "Voir Taille pour infos"
- "Talent Vision nocturne page 147"

**Cohérence paramètres**: instances traits dans creatures.json respectent format prefix
- Trait "Arme (Indice)" → créatures ont "Arme (5)", "Arme (7)", jamais "Arme (Gobelins)"
- Trait "Haine (Cible)" → créatures ont "Haine (Nains)", jamais "Haine (5)"

### Logique métier

**Exclusions**: traits incompatibles
- Bestial incompatible Meneur (note explicite trait Meneur)
- Fabriqué = pas Int/FM/Soc
- Stupide nécessite allié non-Stupide sinon pénalité

**Dépendances**: traits nécessitent autres
- Marque de Tzeentch ajoute Mutation
- Dressé modifie Bestial
- Nerveux amplifié par magie/bruits (sauf Dressé Guerre/Magie)

**Effets cumulatifs**: plusieurs traits modifient même stat
- Brutal + Grand = modificateurs F/E/Ag cumulés
- Élite + Intelligent = modificateurs Int cumulés

## Validation

### Règles

| Champ | Contrainte | Erreur |
|-------|------------|--------|
| index | Entier ≥0, unique | "Index {X} doublon/négatif" |
| label | Non vide, unique, ≤100 | "Label vide/doublon" |
| prefix | Format "(X)" si rempli | "Parenthèses déséquilibrées" |
| suffix | 1-2 caractères si rempli | "Suffix invalide: {X}" |
| desc | Non vide, références valides | "Description vide", "Ref page {X} invalide" |
| book | Non vide, existe books.json | "Livre {X} inconnu" |
| page | Entier >0 | "Page invalide: {X}" |

### Messages métier

- "Trait '{label}' jamais utilisé (aucune créature)"
- "Trait '{label}' prefix '(Indice)' mais créatures utilisent valeurs non-numériques"
- "Trait '{label}' desc mentionne trait '{Y}' inexistant"
- "Trait Bestial + Meneur sur même créature (incompatibles)"
- "Trait Fabriqué requiert Blessures = Bonus Force (pas Bonus FM)"
- "Trait Taille catégorie '{X}' invalide (Minuscule → Monstrueuse uniquement)"

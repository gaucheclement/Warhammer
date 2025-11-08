# Table Psychologies - Documentation

## Vue d'ensemble

Contient 7 traits psychologiques Warhammer Fantasy (états mentaux déclenchés en jeu). Représentent réactions émotionnelles/mentales extrêmes: peur, rage, haine, vices. Déclenchent tests, modifient comportement, imposent contraintes tactiques.

**Fichier**: `data/psychologies.json` (4.5 KB)

## Structure

### Champs clés

| Champ | Type | Description | Exemples |
|-------|------|-------------|----------|
| index | Nombre | ID unique | 0-6 |
| label | Texte | Nom trait | "Animosité", "Peur", "Terreur" |
| prefix | Texte | Format spé | "(Cible)", "(Indice)", "" |
| desc | HTML | Règles complètes | Texte formaté détaillé |
| book/page | Texte/Nombre | Référence source | "LDB" p.190, "AU2" p.20 |

### Système prefix

Détermine si spécialisation nécessaire à création/application:
- **"(Cible)"**: nécessite groupe cible ("nordlanders", "elfes", "Sorciers")
- **"(Indice)"**: valeur numérique (difficulté vaincre peur/terreur)
- **""** (vide): pas de spé (Frénésie)

Exemples: Animosité (Hommes-bêtes), Peur (3), Vice (Alcool)

### Catégories traits

**Hostilité sociale** (Animosité, Préjugé): réactions négatives envers groupes
- Test Psychologie au contact
- Pénalités Sociabilité (-10 à -20)
- Insultes/comportement hostile

**Hostilité combative** (Haine, Frénésie): rage combat
- Bonus Dégâts Rounds (+1 DR)
- Actions obligatoires (attaquer ennemi)
- Immunités psychologiques

**Peur/Terreur**: effroi face monstres
- Tests Calme étendus (vaincre DR ≥ Indice)
- Pénalités si échec (-1 DR, États Brisé)
- Restrictions mouvement (incapacité approcher)

**Vices**: dépendances malsaines
- Test Psychologie face à tentation
- Obligation satisfaire (jusqu'à Inconscient)
- Cumul -20/jour abstinence

## Relations tables

### Directes

**→ Caractéristiques**: tests Calme (Peur/Terreur), Force Mentale (Frénésie)
Référence `characteristics.json`: "Calme", "Force Mentale"

**→ États**: Brisé, Sonné, Inconscient, Exténué
Référence `etats.json`: états gagnés comme conséquences

**→ Livres** (book + page): `books.json`
"LDB" = Livre de Base (6 traits), "AU2" = Archives de l'Empire 2 (Vice)

### Implicites

**Créatures → Psychologies**: `creatures.json` assigne traits (Peur 2, Terreur 3, etc.)

**Talents → Psychologies**: certains talents déclenchent/modifient (ex: "Frénésie" talent)

**Traits → Psychologies**: `traits.json` peut référencer (immunités, déclencheurs)

**Cross-refs desc**: descriptions mentionnent caractéristiques, talents, états, domaines magie

## Types SQL

| Champ | Type | Contraintes |
|-------|------|-------------|
| index | INTEGER | PK, NOT NULL |
| label | VARCHAR(50) | NOT NULL, UNIQUE |
| prefix | VARCHAR(20) | - |
| desc | TEXT | NOT NULL |
| book | VARCHAR(20) | NOT NULL |
| page | INTEGER | NOT NULL |

## Exemples

**Animosité (Cible)** - Hostilité groupe: test au contact, -20 Sociabilité si succès, attaque verbale/physique si échec, +1 DR combat

**Peur (Indice)** - Aversion extrême: tests Calme étendus (DR ≥ Indice), -1 DR actions vs source, test pour approcher, État Brisé si source approche

**Frénésie** - Rage combat: test Force Mentale pour entrer, immunité autres psychologies, attaque gratuite/round, +1 Bonus Force, État Exténué à sortie

**Haine (Cible)** - Rage destructrice: +1 DR vs groupe, destruction immédiate, immunité Peur/Intimidation source

**Terreur (Indice)** - Effroi paralysant: test initial, États Brisé = Indice + DR négatifs, puis agit comme Peur (Indice)

**Vice (Cible)** - Dépendance: test face tentation, consommation jusqu'à Inconscient, -20 cumulatif/jour abstinence, -20 Sociabilité témoins

## Tests cohérence

### Structure

**Obligatoires**: index, label, desc, book, page renseignés
**Uniques**: index, label (pas doublons)
**Formats**:
- prefix: "(Cible)", "(Indice)", ou vide
- desc: HTML valide, références cohérentes
- page: nombre >0

### Relations

**Refs externes**:
- Vérifier desc mentionne caractéristiques valides (Calme, Force Mentale)
- Vérifier desc mentionne états valides (Brisé, Sonné, Inconscient, Exténué)
- book existe dans books.json

**Utilisation**:
- Détecter psychologies jamais assignées (creatures.json, traits.json)
- Vérifier cohérence indices (Peur/Terreur: nombres raisonnables 0-10)

**Spécialisations**:
- prefix rempli ⇒ desc mentionne comment utiliser spé
- "(Cible)": desc contient exemples groupes
- "(Indice)": desc explique valeur numérique

## Validation

### Règles

| Champ | Contrainte | Erreur |
|-------|------------|--------|
| index | Entier ≥0, unique | "Index {X} doublon/négatif" |
| label | Non vide, unique, ≤50 | "Label vide/doublon/trop long" |
| prefix | Format valide: "(Cible)", "(Indice)", "" | "Prefix '{X}' invalide" |
| desc | Non vide, HTML cohérent | "Description vide/HTML invalide" |
| book/page | book non vide, page >0 | "Référence livre manquante" |

### Messages métier

- "Psychologie '{label}' prefix nécessite spécialisation mais desc imprécise"
- "Psychologie '{label}' ref livre '{book}' absente books.json"
- "Psychologie '{label}' desc mentionne caractéristique '{X}' absente characteristics.json"
- "Psychologie '{label}' desc mentionne état '{X}' absent etats.json"
- "Psychologie orpheline: '{label}' jamais assignée (creatures, traits)"
- "Indices Peur/Terreur hors plage raisonnable: {X} (attendu 0-10)"

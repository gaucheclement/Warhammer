# Character Model - Structure et initialisation

## Objectif

Structure modèle personnage et initialisation : données stockées, définition espèce/carrière, relations composants.

## Contexte Warhammer

Personnage = espèce + carrière/niveau + caractéristiques + compétences + talents + équipement + sorts + XP.

## Structure principale

### Contrôle

Mode : "guidé" (wizard) ou "libre" (sans contrainte).

Étape : Non démarré, En cours (0-N), Terminé.

### Identité

Espèce : ID + données complètes + compétences raciales + talents raciaux + modificateurs caractéristiques.

Carrière + niveau : ID + données + caractéristiques développables + talents + compétences.

Signe astral : Bonus +3 sur 1-2 caractéristiques.

Divinité : Détectée auto depuis talent Béni/Invocation.

Domaine magique : Détecté auto depuis talents magie.

### Collections

Caractéristiques : 15 (10 principales + 5 dérivées).

Compétences : Espèce + carrière + talents.

Talents : Espèce + carrière + progression.

Sorts : Ajoutés auto selon talents magiques.

Équipement : Objets avec quantités.

Détails : Nom, âge, taille, poids, histoire, etc.

### XP

Budget : XP Max, Historique, XP Utilisée, XP Temporaire.

### État aléatoire

Reproductibilité : Seeds + impositions.

Voir [random-state.md](./random-state.md).

## Initialisation espèce

Choix espèce → extraction données :
- Compétences raciales (parsing texte)
- Talents raciaux
- Caractéristiques base (ex: Humain CC=30, Nain E=40)

Parsing : Voir [../../patterns/pattern-parsing.md](../../patterns/pattern-parsing.md).

## Initialisation carrière

Choix carrière+niveau → extraction données :
- Caractéristiques développables
- Talents niveau (parsing, gestion spécialisations, rangs multiples)
- Compétences niveau (parsing, fusion si existe)

## Historique carrières

Conservation tous niveaux traversés (ex: Soldat|1 → Soldat|2 → Sergent|1).

Avantage : Coût XP réduit si origine carrière actuelle.

## Relations

Dépendances calculées auto :
- Caractéristiques : base espèce + signe + talents
- Compétences : espèce + carrière + talents
- Sorts : talents magiques
- Divinité/Domaine : spécialisations talents

Cohérence :
- Mode guidé → étapes séquentielles
- Espèce → caractéristiques base correspondantes
- Carrière → skills/talents inclus
- Talents magie → sorts auto
- Talents addSkill → compétences auto

## Composition données

### Caractéristique

Données : ID, valeur base espèce, roll 2d10, bonus talents, bonus signe, bonus carrière, avances permanentes, avances temporaires, origines.

Calculs : Base = espèce + roll + talents + signe. Total = base + avances. Bonus = total ÷ 10.

### Compétence

Données : ID, spécialisation, avances (espèce, carrière, permanentes, temporaires), origines.

Calculs : Base = valeur caractéristique liée. Total = base + avances. Bonus = total ÷ 10.

### Talent

Données : ID, spécialisation, avances (permanentes, temporaires), origines.

Calculs : Rang = avances. Maximum selon type. Effets (compétence/talent/sort ajoutés).

### Sort

Données : ID, spécialisation domaine.

Pas avances. Soit acquis soit non.

### Équipement

Données : Label, type, quantité, enc unitaire.

Structure simple.

## Voir aussi

- [../../database/species.md](../../database/species.md)
- [../../database/career-levels.md](../../database/career-levels.md)
- [character-calculations.md](./character-calculations.md)
- [character-validation.md](./character-validation.md)
- [../../patterns/pattern-parsing.md](../../patterns/pattern-parsing.md)

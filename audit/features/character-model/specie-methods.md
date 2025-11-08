# Character Model - Méthodes specie

## Objectif

Documenter les méthodes de gestion de l'espèce dans le modèle Character: sélection, application des caractéristiques de base, talents et compétences raciales.

## Contexte Warhammer

L'espèce (Humain, Nain, Elfe, Halfling...) est le premier choix fondamental d'un personnage. Elle détermine:
- **Caractéristiques de base**: Chaque espèce a des valeurs de départ différentes (ex: Nains forts en Endurance)
- **Talents raciaux**: Talents innés de l'espèce (ex: Vision nocturne pour les Nains)
- **Compétences raciales**: Compétences communes à l'espèce (ex: Langue (Reikspiel) pour les Humains)

Voir [database/species.md](../database/species.md) pour la liste complète.

## Méthodes

### setSpecie(specie)

**Rôle**: Définir l'espèce du personnage et créer la référence enrichie.

**Entrée**:
- specie: Objet espèce depuis la base de données

**Comportement**:
1. Crée un objet wrapper contenant:
   - id: Identifiant de l'espèce
   - data: Référence vers les données complètes
   - getLabel(): Retourne le nom de l'espèce
   - getSkills(): Retourne les compétences raciales formatées pour le personnage

2. Stocke dans this.specie

3. Retourne la référence créée

**Exemple Humain**:
```
Entrée: {id: 'humain', label: 'Humain', skills: ['Athlétisme', 'Langue (Reikspiel)', ...], ...}
Résultat stocké:
{
  id: 'humain',
  data: {...},
  getLabel() → 'Humain',
  getSkills() → [skill objects formatés avec origin='humain']
}
```

**Exemple Nain**:
```
Entrée: {id: 'nain', label: 'Nain', skills: ['Résistance à l'alcool', 'Langue (Khazalid)', ...], ...}
Résultat stocké:
{
  id: 'nain',
  data: {...},
  getLabel() → 'Nain',
  getSkills() → [skill objects formatés avec origin='nain']
}
```

### getSpecie()

**Rôle**: Récupérer l'espèce courante du personnage.

**Retour**:
- Objet specie si défini
- null si pas encore défini

**Usage**: Permet d'accéder aux informations de l'espèce et ses méthodes.

## Application des caractéristiques de base

Les caractéristiques de base ne sont PAS appliquées par setSpecie() directement.
Elles sont récupérées lors de la création des objets characteristic via:

**characteristic.getSpecie()**:
- Retourne la valeur de base pour cette caractéristique selon l'espèce
- Exemple: Pour un Humain, CC base = 30, F base = 20
- Exemple: Pour un Nain, E base = 40, F base = 30
- Cas spéciaux (Points de Blessures, Corruption): calculs dérivés

Voir [characteristics.md](./characteristics.md) pour les détails.

## Application des compétences raciales

### Méthode getSkills() de specie

**Rôle**: Transformer la liste de compétences raciales en objets skill formatés pour le personnage.

**Comportement**:
1. Récupère la liste skills depuis les données de l'espèce
2. Parse chaque compétence (gestion spécialisations, parenthèses)
3. Crée des objets skill avec:
   - id, spec, advance
   - origin = id de l'espèce
4. Trie par ordre alphabétique
5. Retourne le tableau

**Exemple Humain**:
```
skills depuis DB: ['Athlétisme', 'Calme', 'Langage (Reikspiel)', 'Marchandage', ...]
Résultat:
[
  {id: 'athletisme', advance: 0, origins: ['humain']},
  {id: 'calme', advance: 0, origins: ['humain']},
  {id: 'langage', spec: 'Reikspiel', advance: 0, origins: ['humain']},
  {id: 'marchandage', advance: 0, origins: ['humain']},
  ...
]
```

**Parsing des formats**:
- "Athlétisme" → {id: 'athletisme', spec: ''}
- "Langue (Reikspiel)" → {id: 'langue', spec: 'Reikspiel'}
- "Commandement ou Intuition" → deux compétences séparées

Voir [pattern-parsing.md](../../patterns/pattern-parsing.md)

## Application des talents raciaux

Les talents raciaux sont gérés par les données de l'espèce et appliqués lors de la sélection de l'espèce dans le wizard.
Ils sont ajoutés via addTalents() avec origin='specie_id'.

**Exemples**:
- Humain: 3 talents aléatoires (gérés par le wizard)
- Nain: Vision nocturne, Résistance au Chaos, Résolu, Résistance (Magie)
- Elfe: Vision nocturne, Seconde vue, Savoirs (Au choix)
- Halfling: Vision nocturne, Résistance au Chaos, Pied agile, Petit

Voir [database/species.md](../database/species.md) et [talents-methods.md](./talents-methods.md)

## Relation avec le wizard

Dans le mode guidé:
1. **Étape Espèce**: Utilisateur sélectionne une espèce
2. Appel setSpecie(specie)
3. Les caractéristiques de base sont appliquées aux characteristic objects
4. Les compétences raciales sont ajoutées via addSkills(specie.getSkills(), 'specie')
5. Les talents raciaux sont gérés par l'étape talents du wizard

Voir [wizard/species-selection.md](../wizard/species-selection.md)

## Exemples concrets

### Création Humain
```
1. setSpecie(CharGen.allSpecies['humain'])
2. this.specie = {id: 'humain', data: {...}, getLabel(), getSkills()}
3. Caractéristiques: CC=30, CT=30, F=20, E=20, I=20, Ag=20, Dex=20, Int=20, FM=20, Soc=20
4. Compétences raciales: Athlétisme, Calme, Esquive, Intuition, Langage (Bataille),
   Langage (Reikspiel), Marchandage, Ragot
```

### Création Nain
```
1. setSpecie(CharGen.allSpecies['nain'])
2. this.specie = {id: 'nain', data: {...}, getLabel(), getSkills()}
3. Caractéristiques: CC=30, CT=20, F=30, E=40, I=20, Ag=10, Dex=30, Int=20, FM=40, Soc=10
4. Compétences raciales: Résistance à l'alcool, Calme, Endurance, Langage (Khazalid),
   Métier (Au choix), Savoir (Nains, Géologie ou Métallurgie)
5. Talents raciaux: Vision nocturne, Résistance au Chaos, Résolu, Résistance (Magie)
```

### Création Elfe
```
1. setSpecie(CharGen.allSpecies['elfe-sylvain'])
2. this.specie = {id: 'elfe-sylvain', data: {...}, getLabel(), getSkills()}
3. Caractéristiques: CC=30, CT=30, F=20, E=20, I=40, Ag=30, Dex=30, Int=30, FM=30, Soc=20
4. Compétences raciales: Athlétisme, Calme, Divertissement (Chant), Langage (Eltharin),
   Perception, Pistage, Savoir (Au choix), Survie en extérieur
5. Talents raciaux: Vision nocturne, Seconde vue, Savoirs (Au choix)
```

## Validation

Contraintes:
- setSpecie() doit être appelé avant de définir les caractéristiques
- Une fois définie, l'espèce ne devrait pas changer (sauf cas exceptionnel)
- getSpecie() retourne null si pas encore défini

Voir [validation.md](./validation.md)

## Voir aussi

- [database/species.md](../database/species.md) - Liste des espèces
- [characteristics.md](./characteristics.md) - Application des caractéristiques de base
- [skills-methods.md](./skills-methods.md) - Gestion des compétences
- [talents-methods.md](./talents-methods.md) - Gestion des talents
- [wizard/species-selection.md](../wizard/species-selection.md) - Sélection dans le wizard
- [pattern-parsing.md](../../patterns/pattern-parsing.md) - Parsing des compétences

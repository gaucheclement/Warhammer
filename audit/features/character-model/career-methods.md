# Character Model - Méthodes carrière

## Objectif

Documenter les méthodes de gestion du niveau de carrière dans le modèle Character: sélection carrière+niveau, application des avantages, historique.

## Contexte Warhammer

La carrière (Soldat, Éclaireur, Prêtre, Sorcier...) représente la profession du personnage. Chaque carrière a 4 niveaux progressifs.

Un **niveau de carrière** définit:
- **Compétences**: Compétences à acquérir à ce niveau
- **Talents**: Talents à acquérir à ce niveau
- **Caractéristiques**: Quelles caractéristiques peuvent être améliorées
- **Statut**: Position sociale
- **Trappings**: Équipement de départ

Exemple: "Soldat Niveau 1" vs "Vétéran Niveau 4" (même carrière, niveaux différents)

Voir [database/career-levels.md](../database/career-levels.md)

## Méthodes

### setCareerLevel(career)

**Rôle**: Définir la carrière et le niveau du personnage, créer la référence enrichie.

**Entrée**:
- career: Objet careerLevel depuis la base de données (ex: soldat|1)

**Comportement**:
1. Crée un objet wrapper contenant:
   - id: Identifiant carrière|niveau (ex: 'soldat|1')
   - data: Référence vers les données complètes
   - getLabel(): Retourne le nom complet "Carrière Niveau X"
   - getCareer(): Retourne l'objet carrière parent
   - getCharacteristics(): Retourne les caractéristiques améliorables avec origin
   - getTalents(): Retourne les talents de ce niveau avec gestion specs/rangs
   - getSkills(): Retourne les compétences de ce niveau avec origin

2. Stocke dans this.careerLevel

3. Retourne la référence créée

**Exemple Soldat Niveau 1**:
- Entrée: {id: 'soldat|1', label: 'Soldat', careerLevel: 1}
- Résultat: id='soldat|1', getLabel()='Soldat Niveau 1', getCareer()={classe: 'Guerriers'}

### getCareerLevel()

**Rôle**: Récupérer le niveau de carrière courant.

**Retour**:
- Objet careerLevel si défini
- null si pas encore défini

## Application des caractéristiques améliorables

### Méthode getCharacteristics() de careerLevel

**Rôle**: Retourner les caractéristiques que ce niveau de carrière permet d'améliorer.

**Comportement**:
1. Récupère la liste characteristics depuis les données du niveau
2. Pour chaque caractéristique:
   - Recherche l'objet characteristic correspondant dans le personnage
   - Ajoute l'origin = id du niveau de carrière
   - Retourne l'objet characteristic enrichi

3. Retourne le tableau

**Exemple Soldat Niveau 1**:
- Caractéristiques: CC, E, F, FM
- Chacune reçoit origin='soldat|1' dans son tableau origins

**Usage**: Indique quelles caractéristiques peuvent recevoir des avances à coût réduit.

Voir [characteristics.md](./characteristics.md)

## Application des talents de carrière

### Méthode getTalents() de careerLevel

**Rôle**: Retourner les talents de ce niveau de carrière avec gestion des spécialisations et rangs multiples.

**Comportement complexe**:

1. **Récupère talents de base** depuis data.getTalents()

2. **Pour chaque talent**:
   - Recherche si déjà présent avec searchTalent(id, spec, withAdvance=false, origin=careerLevel.id)
   - Si trouvé avec même spec ET même origin: ajoute origin
   - Si non trouvé ET pas de specs OU spec fixe: crée nouveau talent
   - Gère spec vs specs (fixe vs au choix)

3. **Gère talents ajoutés par d'autres talents**:
   - Parcourt tous les talents du personnage
   - Si un talent a addTalent ET getTotal() > 0: ajoute le talent dérivé à la liste

4. Retourne le tableau complet

**Exemple Soldat Niveau 1**:
- Talents DB: Menaçant, Résistant ou Robuste, Vivacité
- Résultat: Chaque talent avec advance=0, origins=['soldat|1']
- "ou" créé deux talents au choix

**Gestion rangs multiples**:
Si "Tireur de précision" présent 2 fois dans la carrière (niveau 1 et 3):
- Niveau 1: {id: 'tireur-de-precision', advance: 1, origins: ['soldat|1']}
- Niveau 3: même objet avec origins: ['soldat|1', 'soldat|3'], advance: 2

Voir [talents-methods.md](./talents-methods.md)

## Application des compétences de carrière

### Méthode getSkills() de careerLevel

**Rôle**: Retourner les compétences de ce niveau avec gestion des spécialisations.

**Comportement**:
1. Récupère skills depuis data.getSkills()
2. Parse chaque compétence (gestion parenthèses, "ou", specs)
3. Crée objets skill avec origin = id du niveau
4. Trie alphabétiquement
5. Retourne le tableau

**Exemple Soldat Niveau 1**:
- Compétences DB: Athlétisme, Commandement, Corps à corps (Base), Esquive, Intimidation
- Résultat: Chaque skill avec advance=0, origins=['soldat|1'], spec parsée si parenthèses

Voir [skills-methods.md](./skills-methods.md) et [pattern-parsing.md](../../patterns/pattern-parsing.md)

## Historique des carrières

Le personnage peut changer de carrière au cours de sa progression (changement de niveau 4 vers niveau 1 d'une nouvelle carrière).

**Traçabilité**: Les origins des skills/talents/characteristics conservent TOUS les niveaux de carrière traversés.

**Exemple progression**:
- Soldat|1: Corps-à-corps origins=['soldat|1']
- Soldat|2: Corps-à-corps origins=['soldat|1', 'soldat|2']
- Sergent|1: Corps-à-corps origins=['soldat|1', 'soldat|2', 'sergent|1']

**Avantage**: Coût XP réduit si skill.hasOrigin(currentCareerLevel.id)

## Relation avec le wizard

Dans le mode guidé:
1. **Étape Carrière**: Utilisateur sélectionne une carrière
2. Filtrage par classe optionnel
3. Appel setCareerLevel(selectedCareerLevel)
4. Les compétences sont ajoutées via addSkills(careerLevel.getSkills())
5. Les talents sont ajoutés via addTalents(careerLevel.getTalents())
6. Les caractéristiques reçoivent les origins

Voir [wizard/career-selection.md](../wizard/career-selection.md)

## Exemples concrets

### Soldat Niveau 1
- Carac: CC, E, F, FM
- Talents: Menaçant, Résistant ou Robuste, Vivacité
- Compétences: Athlétisme, Commandement, Corps à corps (Base), Esquive, Intimidation

### Éclaireur Niveau 2
- Carac: Ag, CC, CT, Dex, I
- Talents: Camouflage rural, Orientation, Pistage, Tir de précision
- Compétences: Athlétisme, Perception, Pistage, Tir (Arc), Survie en extérieur

### Prêtre Niveau 1
- Carac: E, FM, Int, Soc
- Talents: Béni (Au choix), Lire/Écrire, Orateur - Béni donne accès aux bénédictions
- Compétences: Calme, Commandement, Intuition, Lire/Écrire, Prière

## Validation

Contraintes:
- setCareerLevel() doit être appelé après setSpecie()
- careerLevel.id format: 'career-slug|level' où level ∈ [1,2,3,4]
- Une fois définie, la carrière peut changer (progression)
- getCareerLevel() retourne null si pas encore défini

Voir [validation.md](./validation.md)

## Voir aussi

- [database/career-levels.md](../database/career-levels.md) - Liste des niveaux de carrière
- [database/careers.md](../database/careers.md) - Carrières parentes
- [characteristics.md](./characteristics.md) - Caractéristiques améliorables
- [skills-methods.md](./skills-methods.md) - Compétences de carrière
- [talents-methods.md](./talents-methods.md) - Talents de carrière
- [wizard/career-selection.md](../wizard/career-selection.md) - Sélection dans le wizard

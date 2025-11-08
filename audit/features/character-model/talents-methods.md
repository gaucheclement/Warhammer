# Character Model - Méthodes talents

## Objectif

Documenter la gestion des talents: ajout, parsing, fusion sources, rangs multiples, spécialisations.

## Contexte Warhammer

Les talents représentent les capacités spéciales du personnage. Sources:
- **Espèce**: Talents raciaux (Vision nocturne pour Nains/Elfes)
- **Carrière**: Talents de profession
- **Talents dérivés**: Certains talents en ajoutent d'autres (Savoirs → talent Savoir spécifique)

Particularités:
- **Rangs multiples**: Certains talents peuvent être pris plusieurs fois (Résistant, Tireur de précision)
- **Spécialisations**: Certains nécessitent un choix (Béni (Dieu), Résistance (Type))
- **Effets**: Peuvent modifier caractéristiques, ajouter compétences/sorts

Voir [database/talents.md](../database/talents.md)

## Structure d'un talent

Propriétés:
- **id**: Identifiant
- **spec**: Spécialisation fixe (ex: 'Sigmar' pour Béni)
- **specs**: Spécialisations possibles (pour "Au choix")
- **advance**: Rang acquis (0, 1, 2...)
- **tmpadvance**: Rang temporaire
- **roll**: Rang from tirage aléatoire
- **data**: Référence database
- **origins**: Sources

Méthodes:
- **getBase()**: Toujours 0 (talents sans valeur de base)
- **getAdvance()**: advance + roll + tmpadvance
- **getTotal()**: Rang total actuel
- **getMax()**: Rang maximum autorisé
- **getSkill()**: Compétence ajoutée si addSkill
- **getTalent()**: Talent ajouté si addTalent

## Méthodes principales

### addTalents(talents, source)

**Rôle**: Ajouter liste de talents avec source commune.

**Comportement**:
1. Parse chaque talent (parenthèses, "ou", rangs)
2. Pour chaque talent:
   - Recherche existant (id + spec)
   - Si trouvé: incrémente advance ou ajoute origin
   - Sinon: crée et ajoute

3. Retourne tableau mis à jour

**Parsing**:
- "Menaçant" → simple
- "Béni (Sigmar)" → avec spec
- "Résistant ou Robuste" → deux talents au choix
- "Savoirs (Au choix)" → avec specs

### getTalents()

**Rôle**: Retourner tous les talents.

**Retour**: Tableau non trié (ordre d'acquisition)

### searchTalent(id, specs, strict, origin, withAdvance, withTalent)

**Rôle**: Rechercher un talent avec critères complexes.

**Paramètres**: Similaires à searchSkill
- strict: false accepte spec vide ou "Au choix"
- withAdvance: true = seulement avec advance > 0

### createTalent(talent)

**Rôle**: Créer objet talent complet.

**Méthodes ajoutées**: getLabel, getSymbol, getBase, getAdvance, getTotal, getBonus, getMax, getSkill, getTalent, addOrigins, hasOrigin.

### setTalent(talent, index)

**Rôle**: Ajouter ou mettre à jour talent.

**Comportement**:
1. Si index: remplace
2. Si existant: ajoute origins
3. Sinon: crée et ajoute

## Gestion rangs multiples

Certains talents autorisent plusieurs rangs (défini par data.max).

**Exemples**:
- Résistant: max = 'Bonus d'Endurance' (si BE=4, max 4 rangs)
- Tireur de précision: max = 'Bonus d'Agilité'
- Menaçant: max = 1 (un seul rang)
- Maîtrise (Compétence): max = 'Aucun' (illimité)

**Gestion**:
- getTotal() retourne le rang actuel (advance + roll + tmpadvance)
- getMax() retourne la limite (nombre ou calcul depuis characteristic bonus)

**Exemple Résistant avec BE=4**:
- Rang 1: advance=1, origins=['humain']
- Rang 2: advance=2, origins=['humain', 'soldat|2'] (ajouté par progression)
- Max possible: 4 (BE bonus)

## Gestion spécialisations

### Spec fixe

Talent avec spécialisation définie: "Béni (Sigmar)"
- spec = 'Sigmar'
- specs = undefined

### Spec "Au choix"

Talent avec choix ouvert: "Savoirs (Au choix)"
- spec = '' (vide tant que non choisi)
- specs = tableau options
- Nécessite choix utilisateur

**Merge**: Si deux "Savoirs (Au choix)" de sources différentes, créent deux instances séparées (choix distincts).

Voir [pattern-specialisations.md](../../patterns/pattern-specialisations.md)

## Talents dérivés (addTalent)

Certains talents en ajoutent d'autres automatiquement.

**Exemple Savoirs (Histoire)**:
- data.addTalent = 'Lire/Écrire'
- getTalent() → {id: 'lire-ecrire', spec: ''}
- Si Savoirs (Histoire) avec getTotal() > 0: Lire/Écrire automatiquement acquis

**Gestion dans career.getTalents()**:
Parcourt tous les talents du personnage et ajoute les talents dérivés à la liste de carrière si le talent parent est actif.

Voir [apply-talent.md](./apply-talent.md)

## Exemples concrets

**Résistant Humain rang 2**: id='resistant', advance=2, origins=['humain','soldat|2'], getMax()=BE=4, effet: +10 Endurance

**Béni (Sigmar) Prêtre**: id='beni', spec='Sigmar', advance=1, origins=['pretre|1'], effet: accès bénédictions Sigmar

**Vision nocturne Nain**: id='vision-nocturne', advance=1, origins=['nain'], effet: vision dans l'obscurité

**Savoirs (Histoire)**: id='savoirs', spec='Histoire', advance=1, addTalent='lire-ecrire' → ajoute Lire/Écrire automatiquement

**Linguistique**: id='linguistique', advance=1, addSkill='langue' → ajoute compétence Langue (Au choix)

## Validation

Contraintes:
- Si specs défini: spec doit être choisi avant finalisation
- advance >= 0
- advance <= getMax() (si max défini)
- Si origin='talent': le talent parent doit avoir getTotal() > 0

Voir [validation.md](./validation.md)

## Voir aussi

- [database/talents.md](../database/talents.md) - Liste des talents
- [specie-methods.md](./specie-methods.md) - Talents raciaux
- [career-methods.md](./career-methods.md) - Talents de carrière
- [apply-talent.md](./apply-talent.md) - Application effets talents
- [pattern-specialisations.md](../../patterns/pattern-specialisations.md) - Spécialisations

# Character Model - Gestion spells

## Objectif

Documenter la gestion des sorts: ajout, récupération, filtrage par domaine magique.

## Contexte Warhammer

Les sorts (spells) sont acquis par les personnages ayant des talents de magie:
- **Béni (Dieu)**: Bénédictions du dieu (Protection, Fureur, Miracle...)
- **Magie des Arcanes (Domaine)**: Sorts arcaniques (Feu, Ombre, Lumière, Mort, Bêtes, Cieux, Métal, Vie)
- **Magie Mineure**: Petits sorts basiques

Voir [database/spells.md](../database/spells.md)

## Structure d'un spell

Propriétés:
- **id**: Identifiant du sort
- **spec**: Spécialisation (domaine arcanique pour Magie Arcanes)
- **data**: Référence database
- **getLabel()**: Nom du sort + spec si Magie Arcanes

**Note**: Les sorts n'ont PAS de propriétés advance/origins. Ils sont soit acquis soit non.

## Méthodes principales

### setSpell(spell, index)

**Rôle**: Ajouter un sort au personnage.

**Comportement**:
1. Si index fourni: remplace à cette position
2. Si déjà présent (via searchSpell): retourne l'existant
3. Sinon: crée objet spell et l'ajoute

**Usage**: Appelé lors de la sélection de sorts dans le wizard ou par applyTalent() pour Béni.

### getSpells()

**Rôle**: Retourner tous les sorts du personnage.

**Retour**: Tableau de spell objects

### searchSpell(id, spec)

**Rôle**: Rechercher un sort par id et spécialisation optionnelle.

**Paramètres**:
- id: Identifiant du sort
- spec: Domaine (pour Magie Arcanes)

**Retour**: Objet spell ou false

## Gestion par type de magie

### Bénédictions (Béni)

**Acquisition**: Automatique via talent Béni (Dieu)
**Gestion**: applyTalent() ajoute/supprime automatiquement tous les sorts du dieu

**Exemple Béni (Sigmar)**:
- Sorts: Protection de Sigmar, Fureur de Sigmar, Miracle de Sigmar
- Ajoutés automatiquement quand talent actif
- Supprimés automatiquement si talent perdu

### Sorts arcaniques (Magie des Arcanes)

**Acquisition**: Sélection manuelle dans le wizard
**Filtrage**: Par domaine (spec du talent)
**Gestion**: Les sorts persistent tant que le talent de magie est actif

**Exemple Magie des Arcanes (Feu)**:
- Talent: {id: 'magie-des-arcanes', spec: 'Feu', advance: 1}
- Sorts disponibles: Dard de feu, Boule de feu, Mur de flammes...
- Utilisateur choisit N sorts selon niveau/règles
- Spec des sorts = 'Feu'

### Magie Mineure

**Acquisition**: Sélection manuelle
**Gestion**: Sorts simples sans spécialisation

## Filtrage et organisation

### Par type (data.type)

Les sorts sont organisés par type:
- "Bénédictions": Sorts divins
- "Magie des Arcanes": Sorts arcaniques avec domaine
- "Magie Mineure": Petits sorts
- "Nécromancie", "Démonologie": Magies sombres

### Par domaine (spec)

Pour Magie des Arcanes, le spec identifie le domaine:
- Feu, Ombre, Lumière, Mort, Bêtes, Cieux, Métal, Vie

**Filtrage**: getSpells().filter(s => s.spec === domaine)

## Relation avec talents

Les sorts dépendent directement des talents de magie:
- Talent actif (getTotal() > 0): sorts accessibles
- Talent inactif: sorts supprimés par applyTalent()

**Validation**: applyTalent() vérifie que chaque sort correspond à un talent de magie actif avec même type ET spec.

Voir [apply-talent.md](./apply-talent.md)

## Exemples concrets

**Prêtre de Sigmar**:
- Talent: Béni (Sigmar) rang 1
- Sorts: Protection de Sigmar, Fureur de Sigmar, Miracle de Sigmar (tous automatiques)
- data.type = "Bénédictions"

**Sorcier Feu niveau 2**:
- Talent: Magie des Arcanes (Feu) rang 1
- Sorts choisis: Dard de feu, Boule de feu
- Chaque sort a spec='Feu', data.type="Magie des Arcanes"

**Apprenti sorcier multi-domaines**:
- Talents: Magie Arcanes (Feu), Magie Arcanes (Ombre)
- Sorts Feu: Dard de feu (spec='Feu')
- Sorts Ombre: Ténèbres (spec='Ombre')
- Deux domaines distincts

**Perte de talent**:
- Avant: Béni (Sigmar) → 3 bénédictions
- Après perte: applyTalent() supprime les 3 bénédictions
- spells devient []

## Validation

Contraintes:
- Chaque sort doit correspondre à un talent de magie actif
- sort.data.type doit matcher talent.data.addMagic
- Si Magie Arcanes: sort.spec doit matcher talent.spec
- Pas de doublons (même id + spec)

Voir [validation.md](./validation.md)

## Voir aussi

- [database/spells.md](../database/spells.md) - Liste des sorts
- [database/gods.md](../database/gods.md) - Dieux et bénédictions
- [apply-talent.md](./apply-talent.md) - Application automatique sorts
- [talents-methods.md](./talents-methods.md) - Talents de magie

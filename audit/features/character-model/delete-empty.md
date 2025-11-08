# Character Model - Delete empty

## Objectif

Documenter la méthode deleteEmpty() qui nettoie les propriétés vides du personnage pour optimiser le stockage.

## Contexte

Pendant la création/progression, des skills et talents peuvent être ajoutés puis abandonnés (advance retombe à 0).
deleteEmpty() supprime ces éléments vides pour:
- **Optimiser stockage**: Moins de données à sauvegarder
- **Clarifier affichage**: Ne montrer que les éléments acquis
- **Maintenir cohérence**: Supprimer talents inactifs avant applyTalent()

## Méthode deleteEmpty()

**Rôle**: Supprimer les skills et talents avec advance = 0.

**Déclenchement**:
- Avant save()
- Après annulation d'avances temporaires
- Manuellement pour nettoyage

**Comportement**:

### 1. Nettoyage skills

```
Parcourt skills:
  Pour chaque skill:
    Si getAdvance() === 0:
      Supprime du tableau
    Sinon:
      Conserve
```

**Logique**:
- getAdvance() = advance + specie + career + tmpadvance
- Si total = 0: skill jamais utilisée, on supprime

**Exemple**:
```
Avant:
- Athlétisme: advance=5 → conservé
- Langue (Bretonnien): advance=0 → supprimé
- Corps-à-corps (Base): advance=10 → conservé

Après:
- Athlétisme: advance=5
- Corps-à-corps (Base): advance=10
```

### 2. Nettoyage talents

```
Parcourt talents:
  Pour chaque talent:
    Si getAdvance() === 0:
      Supprime du tableau
    Sinon:
      Conserve
```

**Logique**:
- getAdvance() = advance + roll + tmpadvance
- Si total = 0: talent non acquis, on supprime

**Exemple**:
```
Avant:
- Résistant: advance=2 → conservé
- Robuste: advance=0 → supprimé (abandonné)
- Vision nocturne: advance=1 → conservé

Après:
- Résistant: advance=2
- Vision nocturne: advance=1
```

### 3. Réapplication talents

Appelle applyTalent() pour recalculer les effets.

**Raison**: Si un talent avec effets (addSkill, addCharacteristic) a été supprimé, ses effets doivent être retirés.

**Exemple**:
```
Avant deleteEmpty():
- Talent Linguistique: advance=0
- Compétence Langue (Bretonnien): origin='talent'

Après deleteEmpty():
- Linguistique supprimé
- applyTalent() supprime Langue (Bretonnien) car talent parent absent
```

## Ce qui N'est PAS supprimé

**Characteristics**: Jamais supprimées (toujours 15 éléments)
**Spells**: Gérés par applyTalent(), pas deleteEmpty()
**Trappings**: Jamais supprimés automatiquement
**Details**: Jamais supprimés

## Cas particuliers

### Skills/Talents de carrière

Si skill de carrière avec origins=['carrière'] mais advance=0:
- Supprimé par deleteEmpty()
- Normal: signifie jamais utilisé/amélioré
- Pas un problème: sera ré-ajouté si carrière redevient active

**Exemple**:
```
Soldat niveau 1 → Esquive origins=['soldat|1'], advance=0
deleteEmpty() → Esquive supprimé
Sauvegarde → Esquive absent
Rechargement → career.getSkills() ré-ajoute Esquive si besoin
```

### Talents raciaux

Talents d'espèce avec advance=0 ne devraient pas exister (ajoutés avec advance=1 minimum).
Si présents: supprimés normalement.

### Talents avec rangs

Talent avec advance=2 puis réduit à 0:
- Supprimé par deleteEmpty()
- origins conservées dans l'historique (si ré-acquis plus tard)

## Optimisation stockage

**Impact sauvegarde**: Avant 50+ skills (dont 40 avec advance=0), après 8 skills actives uniquement. Gain: ~50% taille JSON.

## Exemples concrets

### Nettoyage après création wizard
```
Fin wizard:
- 15 characteristics (toutes conservées)
- 8 skills avec advance > 0, 40 skills avec advance=0
- 5 talents avec advance > 0, 2 talents avec advance=0

deleteEmpty():
- skills: 40 → 8
- talents: 7 → 5
```

### Annulation avances temporaires
```
Session XP:
- Athlétisme: advance=5, tmpadvance=3
- Corps-à-corps: advance=0, tmpadvance=2

Annulation:
- Athlétisme: tmpadvance=0 → getAdvance()=5 → conservé
- Corps-à-corps: tmpadvance=0 → getAdvance()=0 → supprimé par deleteEmpty()
```

### Perte de talent avec cascade
```
Avant:
- Linguistique: advance=1
- Langue (Bretonnien): origin='talent', advance=5

Perte Linguistique (advance → 0):
- deleteEmpty() supprime Linguistique
- applyTalent() supprime Langue (Bretonnien)
```

## Validation

Après deleteEmpty():
- Tous skills ont getAdvance() > 0
- Tous talents ont getAdvance() > 0
- Effets des talents restants correctement appliqués

Voir [validation.md](./validation.md)

## Voir aussi

- [skills-methods.md](./skills-methods.md) - Gestion skills
- [talents-methods.md](./talents-methods.md) - Gestion talents
- [apply-talent.md](./apply-talent.md) - Application effets talents
- [save-load.md](./save-load.md) - Sauvegarde optimisée

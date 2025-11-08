# Character Model - Application talent

## Objectif

Documenter la méthode applyTalent() qui applique automatiquement les effets des talents actifs sur le personnage.

## Contexte Warhammer

Les talents peuvent avoir des effets automatiques:
- **addCharacteristic**: Modifier une caractéristique (+5 E pour Résistant, +1 M pour Véloce)
- **addSkill**: Ajouter une compétence (Linguistique → Langue Au choix)
- **addMagic**: Donner accès à un domaine de magie (Béni → Bénédictions, Magie Arcane → Sorts)
- **addTalent**: Donner un talent supplémentaire (Savoirs Histoire → Lire/Écrire)

applyTalent() parcourt tous les talents actifs et applique leurs effets.

## Méthode applyTalent()

**Rôle**: Recalculer et appliquer tous les effets des talents actifs.

**Déclenchement**: Appelé automatiquement quand:
- Un talent est ajouté/supprimé
- Un talent change de rang
- Après deleteEmpty()

**Comportement**:

### 1. Réinitialisation modificateurs talents

Parcourt toutes les caractéristiques et met talent = 0.

### 2. Collecte effets magiques

Parcourt tous les talents avec getTotal() > 0:
- Si data.addMagic existe: ajoute {type: addMagic, spec: talent.spec} à la liste
- **Cas spécial Béni**: Si talent "Béni (Dieu)", ajoute toutes les bénédictions de ce dieu via CharGen.allGods[dieu].getSpells()

### 3. Application modificateurs caractéristiques

Pour chaque talent actif avec data.addCharacteristic:
- Récupère la caractéristique cible
- Calcule le bonus selon le type de caractéristique:
  - **Points de Blessures**: BE × rang du talent
  - **Mouvement, Chance, Détermination, Corruption**: +1 × rang
  - **Autres (CC, CT, F, E, I, Ag, Dex, Int, FM, Soc)**: +5 × rang
- Ajoute au characteristic.talent

**Exemples**: Résistant rang 2 → E.talent+10, Robuste rang 1 → PB.talent+BE, Véloce → M.talent+1

### 4. Collecte compétences de talents

Pour chaque talent actif:
- Si getSkill() retourne une compétence: ajoute à la liste talentSkills
- Ces compétences ont origin='talent'

### 5. Nettoyage sorts invalides

Parcourt tous les sorts du personnage:
- Vérifie si le sort correspond à un effet magique actif (même type ET même spec)
- Si non: supprime le sort
- **Raison**: Si talent de magie perdu/désactivé, les sorts associés disparaissent

**Exemple**: Si "Béni (Sigmar)" passe à advance=0, les bénédictions de Sigmar sont supprimées.

### 6. Nettoyage compétences de talents

Parcourt toutes les compétences:
- Si origin contient 'talent':
  - Vérifie si correspond à une compétence de talent actif
  - Si non: supprime la compétence

**Exemple**: Si "Linguistique" perdu, la compétence Langue (Au choix) ajoutée est supprimée.

## Types d'effets

### addCharacteristic

Modifie une caractéristique existante.

**Valeurs selon caractéristique**:
- Points de Blessures: +BE par rang
- Mouvement, Chance, Détermination, Corruption: +1 par rang
- CC, CT, F, E, I, Ag, Dex, Int, FM, Soc: +5 par rang

**Talents concernés**:
- Résistant: +5 Endurance par rang
- Robuste: +BE Points de Blessures par rang
- Véloce: +1 Mouvement
- Dur à cuire: +BE Points de Blessures

### addSkill

Ajoute une compétence automatiquement.

**Comportement**:
- Crée une skill avec origin='talent'
- La compétence hérite du spec du talent si applicable
- searchSkill() trouve la compétence existante ou la crée

**Talents concernés**:
- Linguistique: +Langue (Au choix)
- Savoirs (Type): +Savoir (Type) correspondant
- Étiquette (Contexte): +Étiquette spécifique

**Exemple**: Linguistique → Langue (Au choix) avec origin='talent'

### addMagic

Donne accès à un domaine de magie (sorts).

**Types magiques**:
- **Béni**: Bénédictions d'un dieu spécifique
- **Magie des Arcanes**: Sorts d'un domaine arcanique (Feu, Ombre, Lumière...)
- **Channeling Arcane**: Domaine arcanique de base
- **Magie Mineure**: Petits sorts

**Gestion sorts**:
- Les sorts ne sont PAS automatiquement ajoutés (sauf Béni)
- Ils sont sélectionnés dans le wizard ou manuellement
- applyTalent() vérifie seulement que les sorts existants correspondent aux talents actifs

**Cas spécial Béni**:
Si talent Béni (Dieu) actif: ajoute automatiquement TOUTES les bénédictions de ce dieu.

**Exemple**: Béni (Sigmar) → toutes bénédictions Sigmar ajoutées automatiquement

### addTalent

Donne un talent supplémentaire automatiquement.

**Comportement**:
- talent.getTalent() retourne le talent à ajouter
- Le talent dérivé a origin='talent'
- Géré principalement dans career.getTalents()

**Talents concernés**:
- Savoirs (Histoire): +Lire/Écrire
- Savoirs (Droit): +Lire/Écrire
- Magie des Arcanes: +Channeling Arcane (même domaine)

**Exemple**: Savoirs (Histoire) → Lire/Écrire avec origin='talent' acquis

## Chaînes de talents

Les talents dérivés peuvent eux-mêmes avoir des effets.

**Exemple cascade**:
1. Acquisition: Savoirs (Histoire) rang 1
2. addTalent → Lire/Écrire automatique
3. Lire/Écrire peut avoir son propre effet (aucun dans ce cas)

**Gestion**: applyTalent() applique les effets dans l'ordre, permettant la cascade.

## Exemples concrets

**Résistant rang 2**: E.talent=10, E passe de 30 à 40
**Béni (Sigmar)**: Ajoute bénédictions Protection/Fureur/Miracle de Sigmar
**Linguistique**: Ajoute Langue (Au choix) origin='talent', nécessite choix utilisateur
**Robuste+Véloce (BE=3)**: PB.talent=3, M.talent=1
**Perte Linguistique**: Supprime Langue origin='talent'

## Validation

Contraintes vérifiées par applyTalent():
- Tous les sorts correspondent à un talent de magie actif
- Toutes les compétences origin='talent' correspondent à un talent actif avec addSkill
- characteristic.talent reflète la somme des talents actifs

Voir [validation.md](./validation.md)

## Voir aussi

- [talents-methods.md](./talents-methods.md) - Gestion des talents
- [characteristics.md](./characteristics.md) - Modificateurs caractéristiques
- [skills-methods.md](./skills-methods.md) - Compétences ajoutées
- [spells.md](./spells.md) - Sorts et magie
- [database/talents.md](../database/talents.md) - Talents et leurs effets

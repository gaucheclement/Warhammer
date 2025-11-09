# Character Model - Mutations et persistance

## Objectif

Documenter les méthodes d'ajout, modification, suppression, sauvegarde et chargement du personnage.

## Méthodes d'ajout

### addSkills(skills, source)

Ajoute liste de compétences avec source commune ('specie', 'career|level', 'talent'):
1. Parse chaque skill (parenthèses, "ou", "Au choix")
2. Pour chaque parsée: Si trouvée (id+spec) → ajoute origin, Sinon → crée et ajoute
3. Retourne tableau mis à jour

Parsing: "Athlétisme" → simple, "Langue (X)" → avec spec, "Métier (Au choix)" → avec specs, "X ou Y" → deux skills. Voir [pattern-parsing.md](../../patterns/pattern-parsing.md)

### addTalents(talents, source)

Ajoute liste de talents avec source commune:
1. Parse chaque talent (parenthèses, "ou", rangs)
2. Pour chaque: Si trouvé (id+spec) → incrémente advance ou ajoute origin, Sinon → crée et ajoute
3. Retourne tableau

Parsing: "Menaçant" → simple, "Béni (Sigmar)" → avec spec, "Résistant ou Robuste" → deux au choix, "Savoirs (Au choix)" → avec specs

**Rangs multiples**: Résistant présent 2× dans carrière (niveau 1 et 3) → origins multiples ['soldat|1', 'soldat|3'], advance=2

### addTrappings(trappings)

Ajoute liste d'équipements:
1. Pour chaque: Si présent (même label) → augmente qty, Sinon → ajoute au tableau
2. Retourne tableau

Appelé lors: Sélection équipement départ carrière, Ajout manuel, Achat/récompense

Exemples: Flèches qty=20 + addTrappings(['Flèche']) → qty=21, Rations qty=7 × enc=0.1 = encombrement 0.7

## Nettoyage

### deleteEmpty()

Supprime skills et talents avec advance=0 pour optimiser stockage:

**Comportement**:
1. Parcourt skills: Si getAdvance()===0 → supprime, sinon → conserve
2. Parcourt talents: Si getAdvance()===0 → supprime, sinon → conserve
3. Appelle applyTalent() pour recalculer effets

**Déclenchement**: Avant save(), Après annulation avances temporaires, Manuellement pour nettoyage

**Ce qui n'est PAS supprimé**: Characteristics (toujours 15), Spells (gérés par applyTalent), Trappings, Details

**Exemple**: Fin wizard 8 skills avec advance>0 + 40 avec advance=0 → deleteEmpty() conserve 8 uniquement, gain ~50% taille JSON

## Gestion XP

### setXPMax(xp)

Définit budget XP total: this.xp.max = xp. Appelé lors création (XP départ) ou gains.

### addXP(id, value, uniqueId)

Ajoute transaction XP (gain ou dépense):
- Si uniqueId ET log[id] existe: retourne false (déjà ajouté)
- Si value>0: xp.max += value (gain)
- Si value<0: xp.used -= value (dépense, used augmente)
- Ajoute à log avec clé unique si besoin

Exemples: addXP('Quête',100,true) → max+=100, addXP('Athlétisme 0→5',-25,false) → used+=25

### spendXP(amount, category)

Dépense temporaire avant validation: this.xp.tmp_used += amount

Utilisé pendant session amélioration, avant saveAdvance().

### saveAdvance()

Valide avances temporaires et consomme XP:
1. Parcourt skills/characteristics/talents avec tmpadvance>0
2. Calcule coût: Helper.getXPCost(elem, from, to) × (de carrière ? 1 : 2)
3. Ajoute transaction: addXP(description, -coût)
4. Transfère: elem.advance += elem.tmpadvance, elem.tmpadvance = 0
5. Décrémente tmp_used
6. Si tmp_used restant: addXP('Modification', -tmp_used)
7. Nettoyage: deleteEmpty()
8. Sauvegarde: CharGen.saveCharacter(this)

Workflow avances temporaires: Augmente tmpadvance+tmp_used → Teste → Valide saveAdvance() (advance+=tmpadvance, tmpadvance=0) OU Annule (tmpadvance=0, tmp_used=0, XP récupéré)

## Sauvegarde et chargement

### save(step)

Prépare personnage pour sérialisation:
1. Nettoyage: deleteEmpty()
2. Clonage: clone()
3. Suppression data: specie.data, star.data, careerLevel.data, characteristics[i].data, skills[i].data, talents[i].data, spells[i].data
4. Gestion stepIndex: Si step fourni ET stepIndex!==-1 → clone.stepIndex += step
5. Retour: clone allégé pour JSON.stringify()

Raison suppression data: Rechargées depuis DB au load(), économise espace. Résultat: Objet allégé sans data, contient id/roll/advance/origins uniquement.

### load(data)

Restaure personnage depuis données sauvegardées:
1. Propriétés simples: stepIndex, mode, trappings, details, xp, randomState
2. Rechargement specie: CharGen.allSpecies[data.specie.id] → setSpecie(specie)
3. Rechargement careerLevel: CharGen.allCareersLevels[data.careerLevel.id] → setCareerLevel(careerLevel)
4. Rechargement characteristics: Pour chaque → Clone CharGen.allCharacteristics[el.id] → setCharacteristic(elem, index) → Merge valeurs (roll, advance, origins) via Helper.merge()
5. Rechargement skills: Pour chaque → Clone CharGen.allSkills[el.id] → Restaure specs/spec → setSkill(elem, index) → Merge valeurs
6. Rechargement talents: Pour chaque → Clone CharGen.allTalents[el.id] → Restaure specs/spec → setTalent(elem, index) → Merge valeurs
7. Rechargement spells: Pour chaque → CharGen.allSpells[el.id] → setSpell(spell, index) → Merge valeurs
8. Retour: this (personnage restauré)

### clone()

Crée copie complète:
1. Helper.clone(this) - copie profonde
2. refresh(clone) - recrée méthodes

Utilisé par save() et pour dupliquer personnage.

### refresh(clone)

Re-crée toutes méthodes (perdues lors clonage):
1. Si specie: setSpecie(specie.data)
2. Si star: setStar(star.data)
3. Si careerLevel: setCareerLevel(careerLevel.data)
4. Pour chaque characteristic: setCharacteristic(el, index)
5. Pour chaque skill: setSkill(el, index)
6. Pour chaque talent: setTalent(el, index)

Raison: Méthodes (getLabel, getTotal) sont fonctions, pas sérialisables, il faut les recréer.

## Gestion erreurs

**Cas d'erreur possibles**: ID inexistant DB (CharGen.allX[id] → undefined), Data corrompue (JSON invalide), Version incompatible (structure changée)

**Recommandations**: Valider IDs avant accès, Gérer undefined gracieusement, Versionner format sauvegarde

## Exemples concrets

**Sauvegarde Humain Soldat**: Avant save() specie={id, data, getLabel}, après specie={id}. Avant characteristics[0]={id, roll:8, data, getTotal}, après {id, roll:8, advance:5, origins}

**Chargement localStorage**: data = JSON.parse(localStorage.getItem('character_123')) → character.load(data) → specie rechargé avec data depuis CharGen.allSpecies['humain'], Méthodes recréées getLabel()/getSkills(), characteristics avec data depuis CharGen.allCharacteristics, Valeurs (roll, advance) restaurées

**Progression wizard avec save**: Étape 3 terminée → save(1) stepIndex passe 3→4 → Sauvegarde localStorage → Revient plus tard → load(data) reprend stepIndex=4

**Nettoyage après création**: Fin wizard 15 characteristics (conservées), 48 skills (40→8 après delete), 7 talents (2→5 après delete)

**Perte talent avec cascade**: Avant Linguistique advance=1 + Langue(Bretonnien) origin='talent' advance=5, Perte Linguistique advance→0 → deleteEmpty() supprime Linguistique → applyTalent() supprime Langue(Bretonnien)

## Validation

Contraintes load(): Tous IDs doivent exister CharGen.allX, stepIndex valide (-1 ou 0-N), Structure data conforme

Après deleteEmpty(): Tous skills ont getAdvance()>0, Tous talents ont getAdvance()>0, Effets talents restants appliqués

Voir [character-validation.md](./character-validation.md)

## Voir aussi

- [character-structure.md](./character-structure.md) - Structure complète
- [character-calculations.md](./character-calculations.md) - Calculs XP
- [character-getters.md](./character-getters.md) - Méthodes recherche
- [pattern-parsing.md](../../patterns/pattern-parsing.md) - Parsing skills/talents

# Character Sheet - Mise à Jour Temps Réel

## Contexte

La feuille de personnage se met à jour automatiquement lors des modifications dans le wizard ou mode édition post-création.

**Objectif** : Affichage temps réel des valeurs sans rechargement manuel pour expérience utilisateur fluide.

**Mécanisme** : Recalcul et rafraîchissement automatique à chaque modification.

## Principe Général

### Mode Wizard (Création)

**Contexte** : Pendant parcours des steps (Species, Careers, Characteristics, etc.)

**Comportement** :
- Chaque step modifie character model
- StepResume affiche snapshot character.clone() au chargement
- Modifications dans steps ne mettent PAS à jour StepResume en temps réel
- Retour au StepResume → Recharge character.clone() → Affiche nouvelles valeurs

**Limitation V1** : Pas de live update entre steps et resume (recharge au retour)

### Mode Post-Création (StepResume)

**Contexte** : Après validation wizard, dépense XP supplémentaires dans onglet Expérience

**Comportement** :
- character = CharGen.character.clone() au chargement step
- Modifications tmpadvance (avances temporaires) sur clone
- Recalculs automatiques à chaque modification
- Affichage mis à jour immédiatement
- Validation → Convertit tmpadvance en advance permanent + refresh character principal

**Mécanisme** : Clone local modifié, recalculs automatiques, synchronisation à validation

## Recalculs Automatiques

### applyTalent()

**Déclencheur** : Chaque modification talents (ajout/suppression/changement rang)

**Actions** :
1. **Reset modificateurs** : characteristic[].talent = 0
2. **Parcours talents actifs** (getTotal() > 0) :
   - addMagic → Ajoute/retire sorts automatiquement
   - addCharacteristic → Applique modificateurs (+5, +1, ou +BE selon type)
   - addSkill → Ajoute compétences talents
3. **Nettoyage sorts** : Retire sorts dont talent source absent
4. **Nettoyage skills** : Retire skills origin='talent' si talent absent

**Impact** : Caractéristiques, sorts, compétences recalculés

### Calculs Dérivés

**Déclencheurs** : Modification caractéristiques ou talents

**Attributs recalculés** :

**Points de Blessures** :
- Formule : (BE × 2) + BFM (+ BF si espèce, × 2 si Ogre)
- Talents modificateurs : Endurci (+BE), Dur à cuire (+1/rang), Très fort (+BF)
- Recalcul auto à chaque changement E/FM/F ou talent

**Mouvement** :
- Base : characteristic Mouvement (espèce + talents)
- Dérivés : Marche (Mvt × 2), Course (Mvt × 4)
- Recalcul auto si talent modificateur (+1 Mvt)

**Destin/Chance** :
- Destin : characteristic (espèce + signe + talents)
- Chance : Copie valeur Destin (formule)
- Recalcul auto si talent Chanceux (+1/rang)

**Résilience/Détermination** :
- Similaire Destin/Chance
- Recalcul auto si talent modificateur

**Corruption** :
- Formule : BE + BFM (seuil tolérance)
- Recalcul auto si E ou FM modifiés

### Compétences

**Valeur Base** : characteristic.getTotal() (lien dynamique)

**Modifications caractéristique** → Recalcul auto compétences liées

**Exemple** : Augmentation Ag 35→40 → Athlétisme (Ag) recalculé automatiquement 40+5=45

**Avances** : Modifications tmpadvance → getTotal() recalculé immédiatement

### Talents

**Rangs** : Modifications tmpadvance → getTotal() recalculé

**Max dynamique** : Si max = formule (ex: "Bonus d'Agilité") → Recalcul si caractéristique modifiée

**Exemple** : Chanceux max BA → Ag 35 (BA 3) → max 3, puis Ag 40 (BA 4) → max 4 (recalcul auto)

## Réactivité Interface

### Temps Réel

**Modifications StepResume** (post-création) :
- Boutons +/- XP → Modification tmpadvance immédiate
- Tableaux caractéristiques/compétences/talents rafraîchis instantanément
- Encombrement total recalculé (si modification trappings)
- Pas de délai, pas de bouton "Recalculer"

**Performances** :
- Recalculs légers (JavaScript pur, pas d'appels serveur)
- Fluide même avec 50+ compétences, 20+ talents

### Validation et Sauvegarde

**Validation** : character.stepIndex = -1 → Clone sauvegardé vers CharGen.character principal

**Sauvegarde XP** : character.saveAdvance() → Convertit tmpadvance en advance permanent + Log XP + Refresh

**Mécanisme** :
1. tmpadvance → advance (permanent)
2. XP dépensés loggés (xp.log)
3. character.refresh() → Réapplique tous talents/calculs
4. CharGen.saveCharacter() → Persistance

## Limitations V1

**Cross-Steps** : Changements steps ne mettent PAS à jour Resume ouvert (clone chargé au début) → Retour menu pour voir changements

**Pas de Watchers** : Pas Object.defineProperty/Observers/Events → Recalculs manuels (applyTalent, refresh) → Simple mais redondant

## Déclencheurs Recalculs

**Wizard Steps** : setTalent() → applyTalent() | Tirage 2d10 → roll modifié | setSkill() direct

**StepResume** : Bouton +carac → tmpadvance++ → compétences recalculées | Bouton +talent → applyTalent() cascade

## Rafraîchissement

**V1 Méthode** : Pas binding DOM (pas framework) | Getters retournent valeurs à jour | Helper.generateList() affichage initial

**Popups** : Helper.showPopin() calcule contenu dynamique au clic (valeurs temps réel)

## Exemples Concrets

**Scénario 1 - Ag++ dans Resume** : Ag 35→40 (BA 3→4) → Athlétisme base recalculée 40, Chanceux max recalculé BA 4

**Scénario 2 - Talent Intelligent** : +Intelligent → applyTalent() → Int.talent+5 → Int.getTotal()+5 → Compétences Int recalculées

**Scénario 3 - Magie Ghur** : +Magie Arcanes (Ghur) → applyTalent() → addMagic détecté → Tous sorts Ghur ajoutés spells[]

## Relations

### Dépendances Features

- **character-model/characteristics.md** : Getters getBase(), getTotal(), getBonus()
- **character-model/skills.md** : Lien dynamique vers characteristic.getTotal()
- **character-model/talents.md** : applyTalent() logique centrale
- **business-rules/application-effets-talents.md** : Séquence recalculs
- **wizard/resume-derived.md** : Formules attributs dérivés

## Règles Métier

**Ordre applyTalent()** : Reset talent=0 → Parcours actifs → addCharacteristic → addMagic → addSkill → Nettoyage orphelins (carac avant skills)

**Validation** : Pas automatique V1 (XP/max talent non vérifiés lors recalculs) → StepResume.validateAction vérifie stepIndex avant validation finale

## Voir Aussi

- **character-model/characteristics.md** : Système calculs base/avances/total
- **business-rules/application-effets-talents.md** : Logique applyTalent complète
- **wizard/experience-validation.md** : Validation budget XP
- **wizard/resume-validation.md** : Validation finale avant sauvegarde

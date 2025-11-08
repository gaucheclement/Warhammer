# Talents - Spécialisations

## Patterns techniques utilisés

- [pattern-specialisations.md](../patterns/pattern-specialisations.md) - Système de spécialisations, "(Au choix)" vs liste fermée
- [pattern-parsing.md](../patterns/pattern-parsing.md) - Format "A, B, C"

## Vue d'ensemble

Certains talents nécessitent une **spécialisation** pour personnaliser leur effet. Champs `specName` (type) et `specs` (liste) définissent spécialisations disponibles.

## Structure

### Champs
**specName** : Type de spécialisation ("Art", "Terrain", "Savoir divin").

**specs** : Liste valeurs selon [pattern-parsing.md](../patterns/pattern-parsing.md).

### Types de talents

**Sans spécialisation** (`specs` vide) : Talent générique.
- Exemple : "Ambidextre"

**Avec spécialisation obligatoire** (`specs` rempli) : Choix à l'acquisition.
- Exemple : "Artiste" → spé Art obligatoire

**Avec spécialisation libre** (`specs` contient "Au choix") : Voir [pattern-specialisations.md](../patterns/pattern-specialisations.md).
- Exemple : "Art (Au choix)" permet création nouvelle spé

## Catégories principales

### Domaines artistiques
**Talent** : Artiste (max Bonus Dex)
**specName** : "Art"
**specs** : "Calligraphie, Cartographie, Écriture, Gravure, Icones, Mosaïque, Peinture, Sculpture, Tatouage, Tissage"
**Effet** : Ajoute compétence Art avec spé choisie

### Types de terrain
**Talent** : Bon marcheur (max Bonus Agi)
**specName** : "Terrain"
**specs** : "Littoral, Déserts, Marécages, Rocailleux, Toundra, Régions boisées"
**Effet** : Ignore pénalités mouvement terrain choisi

### Savoirs divins
**Talent** : Béni (max 1)
**specName** : "Savoir divin"
**specs** : "Manann, Morr, Myrmidia, Ranald, Rhya, Shallya, Sigmar, Taal, Ulric, Verena"
**Effet** : Débloque bénédictions dieu choisi

### Domaines magie
**Talents** : Magie des Arcanes, Invocation
**specName** : Variable selon type magie
**specs** : Noms domaines ou couleurs
**Effet** : Débloque sorts du domaine

## Règles sélection

### Moment et définitivité
**À l'acquisition** : Spé choisie quand talent acheté.

**Définitive** : Spé non modifiable une fois choisie.

**Exception** : Même talent acquérable plusieurs fois avec spés différentes.

### Acquisition multiple
**Même talent, spés différentes** : Possible si rangs multiples.
- Exemple : "Artiste (Peinture)" rang 1, "Artiste (Sculpture)" rang 2

**Contrainte** : Chaque talent+spé compte séparément.

**Limite** : Respecter max global talent.

### Validation
**Liste fermée** (sans "Au choix") : Spé DOIT être dans liste.

**Liste ouverte** (avec "Au choix") : Choix liste OU création nouvelle.

**Spé vide** : Blocage si `specs` rempli mais spé non fournie.

## Interaction compétences

### addSkill avec spécialisation
Format `addSkill` : "Compétence (Spécialisation)"

**Processus** :
1. Talent acquis → ajout compétence
2. Si compétence nécessite spé : reprendre `specs` talent
3. Spé talent devient spé compétence

**Exemple** : "Artiste (Peinture)" → ajoute "Art (Peinture)"

### Cohérence
**Héritage** : Spé talent transmise à compétence ajoutée.

**Unicité** : talent+spé détermine compétence+spé ajoutée.

## Exemples complets

### Artiste (Art)
1. Talent "Artiste" acquis
2. Choix "Peinture" dans specs
3. Compétence "Art (Peinture)" ajoutée
4. Bonus Dex 3 → max 3 rangs possibles

### Bon marcheur (Terrain)
1. Talent acquis
2. Choix "Marécages"
3. Ignore pénalités mouvement marécages
4. Rangs multiples : différents terrains par rang

### Béni (Savoir divin)
1. Talent acquis (max 1)
2. Choix "Sigmar"
3. Débloque bénédictions Sigmar
4. Spé définitive (pas changement dieu)

## Cas limites

**Spé invalide** : Rejet si hors liste fermée.
- "Artiste (Cuisine)" → erreur si Cuisine absent specs Art

**Spé manquante** : Blocage acquisition si `specs` rempli mais spé vide.

**specs sans specName** : Erreur validation données.

**Doublons** : "A, A, B" → erreur, dédoublonner.

## Impact gameplay

**Personnalisation** : 2 joueurs même talent = effets différents selon spés.

**Choix stratégiques** : Spé influence utilité talent.

**Engagement** : Spé définitive = décision long terme.

**Synergie** : Spés cohérentes avec concept personnage.

## Références croisées

- [talents.md](../database/talents.md) - Table talents
- [skills.md](../database/skills.md) - Compétences ajoutées par talents
- [talents-rangs-multiples.md](./talents-rangs-multiples.md) - Acquisition multiple

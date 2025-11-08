# Wizard Career - Application avantages niveau 1

## Vue d'ensemble

Lors de la sélection d'une carrière, le système applique automatiquement tous les avantages du niveau 1 au personnage : avances de caractéristiques, compétences, talents et équipement. Cette application est immédiate et ne nécessite aucune confirmation du joueur.

**Objectif métier** : Garantir que le personnage reçoit exactement les avantages définis pour son niveau 1 de carrière, conformément aux règles Warhammer.

## Avantages appliqués

### 1. Avances de caractéristiques

**Quantité** : Exactement 3 caractéristiques au niveau 1.

**Valeur** : +5 points par caractéristique listée.

**Format source** : Chaîne CSV "Nom1, Nom2, Nom3" dans `careerLevels.characteristics`.

**Parsing** : Séparation virgules, résolution noms vers table `characteristics`.

**Exemples** :
- Agitateur N1 : "Capacité de Tir, Intelligence, Sociabilité" → +5 CT, +5 Int, +5 Soc
- Artisan N1 : "Capacité de Combat, Agilité, Force" → +5 CC, +5 Ag, +5 F
- Soldat N1 : "Capacité de Combat, Capacité de Tir, Force" → +5 CC, +5 CT, +5 F

**Cumul** : Ces +5 s'ajoutent aux bonus raciaux. Nain Artisan = +5 F (espèce) + +5 F (carrière) = +10 F total.

**Application** : Valeurs ajoutées à `character.characteristics[nom].advance`.

### 2. Skills (Compétences)

**Quantité** : 8-10 skills au niveau 1.

**Types** : Simples, avec spécialisation fixe, avec choix spécialisation "(Au choix)", avec choix exclusif "ou".

**Parsing** : Voir [parsing-skills-talents.md](../../business-rules/parsing-skills-talents.md).

**Application** : Parsing → Résolution noms → Détection choix → Ajout +5 avance → Cumul si déjà possédée.

### 3. Talents

**Quantité** : Exactement 4 talents au niveau 1.

**Types** : Fixes, avec choix exclusif "ou", avec spécialisation "(Au choix)".

**Application** : Parsing → Résolution → Détection choix → Ajout → **Application effets** (modificateurs, ajout skills/magie).

**Effets** : Voir [application-effets-talents.md](../../business-rules/application-effets-talents.md).

### 4. Trappings (Équipement)

**Sources doubles** : Classe sociale + Niveau 1.

**Parsing** : Séparation virgules, extraction quantités "(3)", "(1d10)", ou implicite (1).

**Application** : Ajout équipements classe + niveau 1 → Calcul encombrement total.

## Ordre d'application

### Séquence stricte

**Phase 1 - Sélection** :
1. Joueur clique carrière
2. Système exécute `setCareerLevel(niveau1)`
3. Objet `careerLevel` chargé en mémoire

**Phase 2 - Application caractéristiques** :
1. Parsing `careerLevel.characteristics`
2. Résolution noms → Objets Characteristic
3. Ajout +5 à `character.characteristics[nom].advance`

**Phase 3 - Application skills** :
1. Parsing `careerLevel.skills`
2. Résolution noms + spécialisations
3. Détection choix ("ou", "(Au choix)")
4. Ajout skills avec +5 avance initiale

**Phase 4 - Application talents** :
1. Parsing `careerLevel.talents`
2. Résolution noms
3. Détection choix
4. Ajout talents
5. **Application effets talents** (peut modifier caractéristiques, ajouter skills)

**Phase 5 - Application trappings** :
1. Parsing `classes.trappings` (classe sociale)
2. Parsing `careerLevel.trappings` (niveau 1)
3. Résolution noms → Objets Trapping
4. Ajout équipements
5. Calcul encombrement

**Ordre important** : Talents appliqués APRÈS caractéristiques mais AVANT finalisation, car certains talents modifient caractéristiques (ex: Affable +5 Soc).

## Gestion des choix

### Choix exclusifs ("ou")

Détection " ou " → Options présentées → Joueur choisit UNE option → Application.

### Spécialisations "(Au choix)"

Détection "(Au choix)" → Récupération liste specs → Présentation → Joueur sélectionne → Application avec spécialisation.

## Cumul avec avantages raciaux

**Caractéristiques** : Avances cumulatives (Nain Artisan : +5 F espèce + +5 F carrière = +10 F).

**Skills** : Avances cumulatives si déjà possédée, sinon ajout +5.

**Talents** : Si déjà possédé, vérifier rangs multiples (unique → ignoré, multiples → rang++).

## Validation et cohérence

### Vérifications obligatoires

**Parsing réussi** : Toutes chaînes parsables sans erreur.

**Références valides** : Tous noms résolus vers tables existantes.

**Quantités correctes** :
- Caractéristiques : Exactement 3
- Skills : 8-10
- Talents : Exactement 4

**Messages erreur** :
- "Erreur parsing skills : Nom skill 'XXX' introuvable."
- "Erreur talents : Quantité incorrecte (attendu 4, reçu X)."

### Cohérence données

**Test 1** : Tous skills listés existent dans table `skills`.

**Test 2** : Tous talents listés existent dans table `talents`.

**Test 3** : Toutes caractéristiques listées existent dans table `characteristics`.

**Test 4** : Tous trappings listés existent dans table `trappings`.

## Exemples complets

### Nain Artisan niveau 1

**Caractéristiques** : +5 CC, +5 Ag, +5 F (+ bonus raciaux).

**Skills** : Calme, Résistance, Marchandage, Métier (Au choix - joueur choisit), Corps à corps (Base), Évaluation, Perception.

**Talents** : Ambidextre, Travailleur, Robuste, Métier supérieur (requiert Métier choisi).

**Trappings** : Classe Citadins (Cape, Vêtements, Dague, Bourse) + Niveau 1 (Outils métier, Tablier).

### Humain Soldat niveau 1

**Caractéristiques** : +5 CC, +5 CT, +5 F.

**Skills** : Athlétisme, Calme, Corps à corps (Base), Intimidation, Résistance à l'alcool, Résistance, Commandement.

**Talents** : Armure lourde, Combat de rue, Désarmement, Maîtrise (Arme de base).

**Trappings** : Classe Guerriers (Vêtements, Arme simple, Dague, Bourse) + Niveau 1 (Armure légère, Bouclier).

## Références croisées

- [careerLevels.md](../../database/careerLevels.md) - Structure niveaux
- [parsing-skills-talents.md](../../business-rules/parsing-skills-talents.md) - Parsing chaînes
- [application-effets-talents.md](../../business-rules/application-effets-talents.md) - Effets talents
- [accumulation-avantages-careerlevels.md](../../business-rules/accumulation-avantages-careerlevels.md) - Cumul niveaux
- [career-level-initial.md](./career-level-initial.md) - Sélection niveau 1
